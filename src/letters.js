/* Per-letter DOM exists only in rendered views and previews, never in the note. */
const AuroraLetters = (() => {
  const cache = new WeakMap();
  function graphemes(text) {
    return typeof Intl.Segmenter === "function"
      ? [
          ...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(
            text,
          ),
        ].map((x) => x.segment)
      : Array.from(text);
  }
  function random(seed) {
    let x = seed >>> 0 || 1;
    return () => {
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      return (x >>> 0) / 4294967296;
    };
  }
  function plan(text, seed, chaos = false) {
    const rng = random(seed);
    return graphemes(text).map((char) => {
      const kind = Math.floor(rng() * 8);
      return {
        char,
        kind,
        animated: chaos || kind === 7,
        x:
          kind === 0
            ? 0.9
            : kind === 1
              ? 1.12
              : kind === 2
                ? 1.38
                : kind === 3
                  ? 0.7
                  : kind === 4
                    ? -1
                    : 1,
        y:
          kind === 0
            ? 1.34
            : kind === 1
              ? 0.65
              : kind === 2
                ? 0.92
                : kind === 3
                  ? 1.14
                  : 1,
        angle: kind === 5 ? 180 : kind === 6 ? (rng() - 0.5) * 25 : 0,
        duration: 5 + rng() * 6,
        delay: -(rng() * 7),
        otherX: (rng() < 0.25 ? -1 : 1) * (0.8 + rng() * 0.45),
        otherY: 0.65 + rng() * 0.7,
      };
    });
  }
  function restore(el) {
    const saved = cache.get(el);
    if (!saved) return;
    el.textContent = saved.text;
    el.removeAttribute("data-atx-enhanced");
    cache.delete(el);
  }
  function enhance(el, style, mods = {}) {
    if (!["pulse", "sick"].includes(style.id)) return;
    const saved = cache.get(el),
      text =
        saved && el.getAttribute("data-atx-enhanced")
          ? saved.text
          : el.textContent;
    restore(el);
    el.textContent = text;
    const chars = graphemes(text);
    if (chars.length > 180) return;
    const doc = el.ownerDocument;
    const entries = plan(
      text,
      AuroraTextCore.seed(mods.seed) || 1977,
      !!mods.chaos,
    );
    const cycle = (chars.length * 0.075 + 2.5).toFixed(3) + "s";
    el.style.setProperty("--atx-pulse-color", AuroraTextCore.color(mods.color));
    el.style.setProperty("--atx-pulse-cycle", cycle);
    el.replaceChildren();
    let word = null,
      index = 0;
    for (const item of entries) {
      if (/\s/.test(item.char)) {
        el.appendChild(doc.createTextNode(item.char));
        word = null;
        continue;
      }
      if (!word) {
        word = doc.createElement("span");
        word.className = "atx-letter-word";
        el.appendChild(word);
      }
      const letter = doc.createElement("span");
      letter.className = "atx-letter";
      letter.textContent = item.char;
      if (style.id === "pulse") {
        const outline = doc.createElement("span");
        outline.className = "atx-pulse-outline";
        outline.textContent = item.char;
        outline.setAttribute("aria-hidden", "true");
        outline.style.setProperty(
          "--atx-letter-delay",
          (index * 0.075).toFixed(3) + "s",
        );
        letter.appendChild(outline);
      } else {
        letter.style.setProperty("--as-x", String(item.x));
        letter.style.setProperty("--as-y", String(item.y));
        letter.style.setProperty("--as-angle", item.angle + "deg");
        letter.style.setProperty("--as-other-x", String(item.otherX));
        letter.style.setProperty("--as-other-y", String(item.otherY));
        letter.style.setProperty(
          "--as-duration",
          item.duration.toFixed(2) + "s",
        );
        letter.style.setProperty("--as-delay", item.delay.toFixed(2) + "s");
        if (item.animated) letter.className += " atx-letter-morph";
      }
      word.appendChild(letter);
      index++;
    }
    el.setAttribute("data-atx-enhanced", style.id);
    cache.set(el, { text });
  }
  function reading(el) {
    const id = el.classList.contains("AtxPulse")
      ? "pulse"
      : el.classList.contains("AtxSick")
        ? "sick"
        : null;
    if (!id) return;
    const classes = AuroraTextCore.identify(el.className);
    enhance(el, AuroraTextCore.byId(id), {
      ...classes?.mods,
      color: el.getAttribute("data-aurora-color"),
      seed: el.getAttribute("data-aurora-seed"),
    });
  }
  function paint(el, style, mods, text) {
    restore(el);
    el.className = AuroraTextCore.classNames(style, mods);
    el.textContent = text;
    enhance(el, style, mods);
  }
  return { graphemes, plan, enhance, restore, reading, paint };
})();
