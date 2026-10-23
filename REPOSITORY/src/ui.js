const AuroraTextUI = (() => {
  function create(
    container,
    {
      text,
      initial = "celestia",
      mods = {},
      onApply,
      onRemove,
      onCancel,
      defaultColor,
    },
  ) {
    const C = AuroraTextCore,
      doc = container.ownerDocument;
    const root = doc.createElement("div");
    root.className = "atx-panel";
    container.appendChild(root);
    const listeners = [];
    const events = (el, name, fn) => {
      el.addEventListener(name, fn);
      listeners.push(() => el.removeEventListener(name, fn));
    };
    const make = (tag, cls, value, parent = root) => {
      const el = doc.createElement(tag);
      if (cls) el.className = cls;
      if (value !== undefined) el.textContent = value;
      parent.appendChild(el);
      return el;
    };
    let active = C.byId(initial),
      group = "Все",
      query = "",
      state = { color: C.color(defaultColor), seed: C.newSeed(), ...mods };
    const shownText = text.length > 160 ? text.slice(0, 157) + "…" : text;
    const mainText = text.length > 1200 ? text.slice(0, 1197) + "…" : text;
    make("div", "atx-eyebrow", "AURORA / TEXT STUDIO");
    make("h2", "atx-title", atxTranslate("Одежда для твоих слов"));
    make(
      "p",
      "atx-lead",
      atxTranslate(
        "Наведи или выбери стиль. Предпросмотр показывает твой текст; заметка изменится только после «Применить».",
      ),
    );
    const hero = make("div", "atx-hero"),
      badge = make("div", "atx-badge", "", hero),
      sample = make("span", "", "", hero),
      caption = make("p", "atx-caption", "", hero);
    const controls = make("div", "atx-controls");
    const search = make("input", "atx-search", "", controls);
    search.type = "search";
    search.placeholder = atxTranslate("Найти: Luna, Tw, внутри букв…");
    search.setAttribute("aria-label", atxTranslate("Найти стиль"));
    const tabs = make("div", "atx-tabs", undefined, controls);
    tabs.setAttribute("role", "group");
    tabs.setAttribute("aria-label", atxTranslate("Группы стилей"));
    const tabButtons = [];
    for (const name of [
      "Все",
      "Пиковые",
      "Плашки",
      "Внутри букв",
      "Боевая форма",
      "Буквенные",
    ]) {
      const b = make("button", "atx-tab", atxTranslate(name), tabs);
      b.type = "button";
      b.setAttribute("aria-pressed", name === group ? "true" : "false");
      tabButtons.push([b, name]);
      events(b, "click", () => {
        group = name;
        for (const [button, label] of tabButtons)
          button.setAttribute("aria-pressed", String(label === group));
        renderGrid();
      });
    }
    const flags = make("div", "atx-flags");
    const grid = make("div", "atx-grid");
    const empty = make(
      "p",
      "atx-empty",
      atxTranslate("Ничего не найдено. Попробуй другое имя."),
    );
    const warning = make(
      "p",
      "atx-note",
      atxTranslate(
        "Совет: выделяй слова и короткие фразы без Markdown-разметки. Вид тегов в редакторе зависит от режима Obsidian.",
      ),
    );
    const footer = make("div", "atx-footer");
    const left = make("div", "atx-footer-left", undefined, footer);
    const cancel = make("button", "atx-button", atxTranslate("Отмена"), left);
    cancel.type = "button";
    events(cancel, "click", () => onCancel?.());
    if (onRemove) {
      const remove = make(
        "button",
        "atx-button atx-remove",
        atxTranslate("Снять оформление"),
        left,
      );
      remove.type = "button";
      events(remove, "click", () => onRemove());
    }
    const apply = make(
      "button",
      "atx-button atx-primary",
      atxTranslate("Применить"),
      footer,
    );
    apply.type = "button";
    events(apply, "click", () => onApply(active, { ...state }));
    const names = {
      name: atxTranslate("Выразительное имя"),
      still: atxTranslate("Без движения"),
      plain: atxTranslate("Компактная плашка"),
      slow: atxTranslate("Медленнее"),
      quiet: atxTranslate("Прозрачные пряди"),
      short: atxTranslate("Короткие пряди"),
      chaos: atxTranslate("Хаотично менять буквы"),
    };
    let gridOff = [],
      flagsOff = [];
    function activePreview() {
      badge.textContent = active.name + " / " + atxTranslate(active.group);
      AuroraLetters.paint(sample, active, state, mainText);
      caption.textContent = active.desc;
      apply.textContent = atxTranslate("Применить · ") + active.name;
      for (const button of grid.children)
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.styleId === active.id),
        );
    }
    function renderFlags() {
      for (const off of flagsOff) off();
      flagsOff = [];
      flags.replaceChildren();
      if (active.id === "pulse") {
        const label = make(
          "label",
          "atx-flag",
          atxTranslate("Цвет пульса "),
          flags,
        );
        const colorInput = make("input", "atx-color", undefined, label);
        colorInput.type = "color";
        colorInput.value = C.color(state.color);
        const colorChange = () => {
          state.color = C.color(colorInput.value);
          activePreview();
        };
        colorInput.addEventListener("input", colorChange);
        flagsOff.push(() =>
          colorInput.removeEventListener("input", colorChange),
        );
      }
      if (active.id === "sick") {
        const reroll = make(
          "button",
          "atx-tab",
          atxTranslate("Новый характер букв"),
          flags,
        );
        reroll.type = "button";
        const roll = () => {
          state.seed = C.newSeed();
          activePreview();
        };
        reroll.addEventListener("click", roll);
        flagsOff.push(() => reroll.removeEventListener("click", roll));
      }
      for (const key of C.optionsFor(active)) {
        const label = make("label", "atx-flag", undefined, flags);
        const checkbox = make("input", "", undefined, label);
        checkbox.type = "checkbox";
        checkbox.checked = !!state[key];
        make("span", "", names[key], label);
        const change = () => {
          state[key] = checkbox.checked;
          activePreview();
        };
        checkbox.addEventListener("change", change);
        flagsOff.push(() => checkbox.removeEventListener("change", change));
      }
    }
    function select(style) {
      active = style;
      activePreview();
      renderFlags();
    }
    function renderGrid() {
      for (const off of gridOff) off();
      gridOff = [];
      grid.replaceChildren();
      const list = C.styles.filter(
        (s) =>
          (group === "Все" ||
            group === s.group ||
            (group === "Внутри букв" && s.ink) ||
            (group === "Плашки" && s.group === "Пиковые" && !s.ink)) &&
          `${s.name} ${s.desc} ${s.group}`.toLocaleLowerCase().includes(query),
      );
      empty.hidden = list.length > 0;
      for (const style of list) {
        const b = make("button", "atx-card", undefined, grid);
        b.type = "button";
        b.dataset.styleId = style.id;
        b.setAttribute("aria-pressed", String(style.id === active.id));
        b.setAttribute("aria-label", style.name + " — " + style.desc);
        make("span", "atx-card-name", style.name, b);
        const pad = make("span", "atx-card-pad", undefined, b);
        const mini = make("span", "", undefined, pad);
        AuroraLetters.paint(mini, style, { ...state, still: true }, shownText);
        make("span", "atx-card-desc", style.desc, b);
        const enter = () => {
          select(style);
          AuroraLetters.paint(
            mini,
            style,
            { ...state, still: !!state.still },
            shownText,
          );
        };
        const leave = () => {
          AuroraLetters.paint(
            mini,
            style,
            { ...state, still: true },
            shownText,
          );
        };
        for (const [event, fn] of [
          ["pointerenter", enter],
          ["pointerleave", leave],
          ["focus", () => select(style)],
          ["blur", leave],
          ["click", () => select(style)],
        ]) {
          b.addEventListener(event, fn);
          gridOff.push(() => b.removeEventListener(event, fn));
        }
      }
    }
    events(search, "input", () => {
      query = search.value.trim().toLocaleLowerCase();
      renderGrid();
    });
    activePreview();
    renderFlags();
    renderGrid();
    return {
      root,
      focus: () => search.focus(),
      destroy() {
        for (const off of [...listeners, ...gridOff, ...flagsOff]) off();
        root.remove();
      },
    };
  }
  return { create };
})();
