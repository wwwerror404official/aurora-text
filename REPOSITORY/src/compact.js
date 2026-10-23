/* A single native submenu item hosts a bounded, ordinary scroll container.
   Individual style rows are DOM buttons, not Obsidian MenuItems: pointer
   movement cannot trigger the native menu's row-following scroll behaviour. */
const AuroraCompact = (() => {
  function create(
    container,
    {
      text,
      mods = {},
      animate = true,
      defaultColor,
      onApply,
      onPalette,
      onRemove,
    },
  ) {
    const C = AuroraTextCore,
      doc = container.ownerDocument;
    mods = { color: C.color(defaultColor), seed: C.newSeed(), ...mods };
    const root = doc.createElement("div");
    root.className = "atx-compact";
    container.appendChild(root);
    const offs = [];
    const make = (tag, cls, text, parent = root) => {
      const el = doc.createElement(tag);
      el.className = cls;
      if (text !== undefined) el.textContent = text;
      parent.appendChild(el);
      return el;
    };
    const listen = (el, type, fn, opts) => {
      el.addEventListener(type, fn, opts);
      offs.push(() => el.removeEventListener(type, fn, opts));
    };
    const head = make("div", "atx-compact-head");
    make(
      "div",
      "atx-compact-title",
      atxTranslate("Aurora · Стили текста"),
      head,
    );
    const search = make("input", "atx-compact-search", undefined, head);
    search.type = "search";
    search.placeholder = atxTranslate("Найти стиль…");
    search.setAttribute("aria-label", atxTranslate("Поиск стиля"));
    const colorLabel = make(
      "label",
      "atx-compact-color",
      atxTranslate("Цвет пульса "),
      head,
    );
    const colorInput = make("input", "atx-color", undefined, colorLabel);
    colorInput.type = "color";
    colorInput.value = C.color(mods.color);
    listen(colorInput, "input", () => {
      mods.color = C.color(colorInput.value);
      for (const row of rows)
        if (row.style.id === "pulse")
          AuroraLetters.paint(
            row.sample,
            row.style,
            { ...mods, still: true },
            row.text,
          );
    });
    const list = make("div", "atx-compact-scroll");
    list.setAttribute("role", "group");
    list.setAttribute(
      "aria-label",
      atxTranslate("Стили — прокрутка колёсиком"),
    );
    const empty = make(
      "div",
      "atx-compact-empty",
      atxTranslate("Ничего не найдено"),
      list,
    );
    empty.hidden = true;
    let rows = [];
    for (const style of C.styles) {
      const button = make("button", "atx-compact-row", undefined, list);
      button.type = "button";
      button.setAttribute("aria-label", style.name + " — " + style.desc);
      make("span", "atx-compact-name", style.name, button);
      const pad = make("span", "atx-compact-pad", undefined, button);
      const sample = make("span", "", undefined, pad);
      const sampleText = text.length > 42 ? text.slice(0, 39) + "…" : text;
      AuroraLetters.paint(sample, style, { ...mods, still: true }, sampleText);
      sample.setAttribute("aria-hidden", "true");
      listen(button, "click", (e) => {
        e.stopPropagation();
        onApply(style, { ...mods });
      });
      if (animate && !mods.still) {
        listen(button, "pointerenter", () => {
          AuroraLetters.paint(sample, style, mods, sampleText);
        });
        listen(button, "pointerleave", () => {
          AuroraLetters.paint(
            sample,
            style,
            { ...mods, still: true },
            sampleText,
          );
        });
        listen(button, "blur", () => {
          AuroraLetters.paint(
            sample,
            style,
            { ...mods, still: true },
            sampleText,
          );
        });
      }
      rows.push({ button, style, sample, text: sampleText });
    }
    const foot = make("div", "atx-compact-foot");
    const big = make(
      "button",
      "atx-compact-action",
      atxTranslate("Большая палитра…"),
      foot,
    );
    big.type = "button";
    listen(big, "click", (e) => {
      e.stopPropagation();
      onPalette();
    });
    if (onRemove) {
      const remove = make(
        "button",
        "atx-compact-action",
        atxTranslate("Снять оформление"),
        foot,
      );
      remove.type = "button";
      listen(remove, "click", (e) => {
        e.stopPropagation();
        onRemove();
      });
    }
    listen(search, "input", () => {
      const query = search.value.trim().toLocaleLowerCase();
      let visible = 0;
      for (const row of rows) {
        row.button.hidden =
          !`${row.style.name} ${row.style.desc} ${row.style.group}`
            .toLocaleLowerCase()
            .includes(query);
        if (!row.button.hidden) visible++;
        AuroraLetters.paint(
          row.sample,
          row.style,
          { ...mods, still: true },
          row.text,
        );
      }
      empty.hidden = visible > 0;
      list.scrollTop = 0;
    });
    // Neither handler changes scrollTop. Wheel default action stays intact.
    const stop = (e) => e.stopPropagation();
    for (const type of ["click", "mousedown", "mouseup", "pointerdown"])
      listen(root, type, stop);
    listen(root, "pointermove", stop);
    listen(root, "mousemove", stop);
    listen(root, "wheel", stop, { passive: true });
    listen(root, "keydown", (e) => {
      if (e.key !== "Escape") e.stopPropagation();
    });
    return {
      root,
      list,
      rows,
      destroy() {
        for (const off of offs) off();
        root.remove();
        rows = [];
      },
    };
  }
  return { create };
})();
