"use strict";
const AuroraTextCore = (() => {
  const styles = [
    ["celestia", "Celestia", "Солнечное сияние", "Плашки", ["Celestia"]],
    ["twilight", "Twilight", "Фиолетовая магия", "Плашки", ["Twilight"]],
    ["collapse", "Collapse", "Схлопывание света", "Плашки", ["Collapse"]],
    ["ton618", "TON 618", "Тёмное ядро и огненный диск", "Плашки", ["TON618"]],
    ["rainbow", "Rainbow", "Радужный перелив", "Плашки", ["Rainbow"]],
    ["fluttershy", "Fluttershy", "Розовые лепестки", "Плашки", ["Fluttershy"]],
    ["luna", "Luna", "Ночная дымка и звёзды", "Плашки", ["Luna"]],
    ["sunset", "Sunset Shimmer", "Закат и искры", "Плашки", ["SunsetShimmer"]],
    ["rarity", "Rarity", "Перламутровые грани", "Плашки", ["Rarity"]],
    [
      "rainbowdash",
      "Rainbow Dash",
      "Радужный след и молния",
      "Плашки",
      ["RainbowDash"],
    ],
    ["pinkie", "Pinkie Pie", "Розовый праздник", "Плашки", ["PinkiePie"]],
    ["applejack", "Applejack", "Медовый свет", "Плашки", ["Applejack"]],
    ["discord", "Discord", "Непослушная геометрия", "Плашки", ["Discord"]],
    ["tw", "Tw", "Сине-серебряная энергия", "Плашки", ["Tw"]],
    [
      "flurry",
      "Flurry Heart",
      "Розово-голубые кристаллы",
      "Плашки",
      ["FlurryHeart"],
    ],
    ["sombra", "Sombra", "Обсидиан и изумруд", "Плашки", ["Sombra"]],
    [
      "tw-awakened",
      "Tw · Боевая форма",
      "Корона и длинные пряди",
      "Боевая форма",
      ["TwAwakened"],
    ],
    [
      "nightmare",
      "Nightmare Moon",
      "Лунный поток внутри букв",
      "Внутри букв",
      ["Trio", "NightmareMoon"],
    ],
    [
      "daybreaker",
      "Daybreaker",
      "Пламя внутри букв",
      "Внутри букв",
      ["Trio", "Daybreaker"],
    ],
    [
      "midnight",
      "Midnight Sparkle",
      "Магические дуги внутри букв",
      "Внутри букв",
      ["Trio", "MidnightSparkle"],
    ],
    [
      "whitegold",
      "Белое золото",
      "Белые буквы, золотые края и тонкие нити",
      "Внутри букв",
      ["WhiteGold"],
    ],
    [
      "tenderness",
      "Нежность",
      "Ещё мягче: кремово-розовый свет и лепестки",
      "Плашки",
      ["Tenderness"],
    ],
    [
      "speed",
      "Скорость",
      "Радужный след и короткая мелкая дрожь",
      "Плашки",
      ["Speed"],
    ],
    [
      "borealis",
      "Северное сияние",
      "Зелёно-лиловые световые ленты",
      "Плашки",
      ["AtxBorealis"],
    ],
    [
      "mercury",
      "Жидкое серебро",
      "Металлический перелив внутри букв",
      "Внутри букв",
      ["AtxMercury"],
    ],
    [
      "rosequartz",
      "Розовый кварц",
      "Мягкий розовый кристалл с гранями",
      "Плашки",
      ["AtxRoseQuartz"],
    ],
    [
      "deepocean",
      "Глубина",
      "Холодное течение и светящийся планктон",
      "Плашки",
      ["AtxDeepOcean"],
    ],
    [
      "starsilk",
      "Звёздный шёлк",
      "Плавные небесные нити внутри букв",
      "Внутри букв",
      ["AtxStarSilk"],
    ],
    [
      "emberink",
      "Тлеющие чернила",
      "Медные чернила и золотые прожилки",
      "Внутри букв",
      ["AtxEmberInk"],
    ],
    [
      "hologram",
      "Голограмма",
      "Бирюзовая проекция с мягким сканированием",
      "Плашки",
      ["AtxHologram"],
    ],
    [
      "mosslight",
      "Лесной свет",
      "Мох, тёплая зелень и маленькие светлячки",
      "Плашки",
      ["AtxMosslight"],
    ],
    [
      "peak-tw",
      "Tw · Суверен",
      "ПИК · броня, корона и серебряные потоки",
      "Пиковые",
      ["Peak", "TwSovereign"],
    ],
    [
      "peak-celestia",
      "Celestia · Зенит",
      "ПИК · солнечная печать и золотое оперение",
      "Пиковые",
      ["Peak", "CelestiaZenith"],
    ],
    [
      "peak-luna",
      "Luna · Астрал",
      "ПИК · карта созвездий и лунная орбита",
      "Пиковые",
      ["Peak", "LunaAstral"],
    ],
    [
      "peak-fluttershy",
      "Fluttershy · Эдем",
      "ПИК · ботаническая лента и маленькая бабочка",
      "Пиковые",
      ["Peak", "FluttershyEden"],
    ],
    [
      "peak-ton",
      "TON 618 · Горизонт событий",
      "ПИК · тёмная апертура и янтарные орбиты",
      "Пиковые",
      ["Peak", "TONEventHorizon"],
    ],
    [
      "peak-nightmare",
      "Nightmare Moon · Затмение",
      "ПИК · серебристый свет и звёзды внутри букв",
      "Пиковые",
      ["Peak", "NightmareEclipse"],
    ],
    [
      "peak-daybreaker",
      "Daybreaker · Сверхновая",
      "ПИК · огненные кольца и прожилки внутри букв",
      "Пиковые",
      ["Peak", "DaybreakerNova"],
    ],
    [
      "peak-midnight",
      "Midnight Sparkle · Разлом",
      "ПИК · кристаллические трещины и магические дуги внутри букв",
      "Пиковые",
      ["Peak", "MidnightRift"],
    ],
    [
      "pulse",
      "Пульсация",
      "Одна волна слева направо по контурам букв, свой цвет",
      "Буквенные",
      ["AtxPulse"],
    ],
    [
      "sick",
      "Больной?",
      "Каждая буква со своим искажением и характером",
      "Буквенные",
      ["AtxSick"],
    ],
    [
      "peak-flutter-wings",
      "Флаттершай · Крылья нежности",
      "ПИК · розовый перелив внутри букв и жёлтые перьевые крылья",
      "Пиковые",
      ["Peak", "FluttershyWings"],
    ],
  ].map(([id, name, desc, group, classes]) => ({
    id,
    get name() {
      return atxTranslate(name);
    },
    get desc() {
      return atxTranslate(desc);
    },
    group,
    classes,
    ink:
      group === "Внутри букв" ||
      [
        "peak-nightmare",
        "peak-daybreaker",
        "peak-midnight",
        "peak-flutter-wings",
      ].includes(id),
  }));
  const byId = (id) => styles.find((s) => s.id === id) || styles[0];
  const escape = (s) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  function decode(s) {
    return s.replace(/&(amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);/gi, (m, k) => {
      const known = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
      if (known[k.toLowerCase()]) return known[k.toLowerCase()];
      const n = k.toLowerCase().startsWith("#x")
        ? parseInt(k.slice(2), 16)
        : parseInt(k.slice(1), 10);
      return Number.isInteger(n) &&
        n > 0 &&
        n <= 0x10ffff &&
        !(n >= 0xd800 && n <= 0xdfff)
        ? String.fromCodePoint(n)
        : m;
    });
  }
  const modifiers = [
    "name",
    "still",
    "plain",
    "slow",
    "quiet",
    "short",
    "chaos",
  ];
  function optionsFor(style) {
    return [
      "name",
      "still",
      ...(style.group === "Плашки" || (style.group === "Пиковые" && !style.ink)
        ? ["plain"]
        : []),
      ...(style.ink || style.group === "Пиковые" ? ["slow"] : []),
      ...(["tw-awakened", "peak-tw"].includes(style.id)
        ? ["quiet", "short"]
        : []),
      ...(style.id === "sick" ? ["chaos"] : []),
    ];
  }
  function classNames(style, mods = {}) {
    return [...style.classes, ...optionsFor(style).filter((k) => mods[k])].join(
      " ",
    );
  }
  function identify(classes) {
    const list = classes.trim().split(/\s+/);
    if (
      list.some(
        (c) =>
          !modifiers.includes(c) &&
          !styles.some((s) => s.classes.includes(c)) &&
          c !== "TOB618",
      )
    )
      return null;
    const canonical = list.map((c) => (c === "TOB618" ? "TON618" : c));
    const matches = styles.filter((s) =>
      s.classes.every((c) => canonical.includes(c)),
    );
    if (matches.length !== 1) return null;
    const style = matches[0];
    if (
      canonical.some(
        (c) => !style.classes.includes(c) && !modifiers.includes(c),
      )
    )
      return null;
    return {
      style,
      mods: Object.fromEntries(
        modifiers.map((k) => [k, canonical.includes(k)]),
      ),
    };
  }
  const color = (value) =>
    /^#[0-9a-f]{6}$/i.test(value || "") ? value.toLowerCase() : "#d7abff";
  const seed = (value) =>
    /^\d{1,10}$/.test(String(value ?? "")) &&
    Number(value) > 0 &&
    Number(value) <= 4294967295
      ? Number(value)
      : 0;
  const newSeed = () => {
    const a = new Uint32Array(1);
    if (globalThis.crypto?.getRandomValues) {
      globalThis.crypto.getRandomValues(a);
      return a[0] || 1;
    }
    return Math.floor(Math.random() * 4294967294) + 1;
  };
  function wrappers(full) {
    const out = [];
    const re =
      /<span\s+class=(?:"([^"]+)"|'([^']+)')((?:\s+data-aurora-(?:color|seed)=(?:"[^"]*"|'[^']*'))*)\s*>([^<>\r\n]*)<\/span>/g;
    let m;
    while ((m = re.exec(full))) {
      const found = identify(m[1] || m[2]);
      if (!found) continue;
      const attrs = m[3],
        cm = attrs.match(/data-aurora-color=["']([^"']+)["']/),
        sm = attrs.match(/data-aurora-seed=["']([^"']+)["']/);
      if (found.style.id === "pulse") found.mods.color = color(cm?.[1]);
      if (found.style.id === "sick") found.mods.seed = seed(sm?.[1]) || 1977;
      const opening = m[0].indexOf(">") + 1;
      out.push({
        ...found,
        start: m.index,
        end: re.lastIndex,
        innerStart: m.index + opening,
        innerEnd: re.lastIndex - 7,
        raw: m[0],
        plain: decode(m[4]),
      });
    }
    return out;
  }
  function guarded(full, start, end) {
    const prefix = full.slice(0, start);
    let fence = null;
    for (const line of prefix.split("\n")) {
      const m = line.match(/^\s{0,3}(`{3,}|~{3,})/);
      if (!m) continue;
      if (!fence) fence = m[1];
      else if (m[1][0] === fence[0] && m[1].length >= fence.length)
        fence = null;
    }
    if (fence) return atxTranslate("Выделение находится в блоке кода.");
    if (full.startsWith("---\n")) {
      const close = full.indexOf("\n---", 4);
      if (close < 0 || start < close + 4)
        return atxTranslate("В свойствах заметки стили текста не применяются.");
    }
    const lineStart = full.lastIndexOf("\n", start - 1) + 1;
    const before = full.slice(lineStart, start);
    if ((before.match(/`/g) || []).length % 2)
      return atxTranslate("Выделение находится внутри кода.");
    const selected = full.slice(start, end);
    if (/[`]|\[\[|\]\]|!\[|\]\(|^\s*#{1,6}\s|^\s*[-*+]\s/m.test(selected))
      return atxTranslate(
        "Выдели сами слова без Markdown-разметки, ссылок и кода.",
      );
    return null;
  }
  function target(full, start, end) {
    if (start > end) [start, end] = [end, start];
    if (start < 0 || end > full.length)
      throw Error(atxTranslate("Некорректный диапазон выделения."));
    const own = wrappers(full);
    const exact = own.find(
      (w) =>
        (start === w.start && end === w.end) ||
        (start >= w.innerStart && end <= w.innerEnd),
    );
    if (exact) {
      const error = guarded(full, exact.start, exact.end);
      if (error) throw Error(error);
      return { ...exact, full, original: exact.raw, existing: true };
    }
    if (start === end)
      throw Error(
        atxTranslate(
          "Сначала выдели слова в заметке. В готовом стиле достаточно поставить курсор внутрь текста.",
        ),
      );
    if (own.some((w) => start < w.end && end > w.start))
      throw Error(
        atxTranslate(
          "Выделение пересекает готовый стиль. Выдели его целиком или поставь курсор внутри.",
        ),
      );
    const error = guarded(full, start, end);
    if (error) throw Error(error);
    const original = full.slice(start, end);
    if (!original.trim()) throw Error(atxTranslate("Выдели непустой текст."));
    if (/<\/?[a-z][^>]*>/i.test(original))
      throw Error(atxTranslate("Выдели текст без HTML-тегов."));
    // Protect foreign HTML containers and avoid nesting inside manually authored spans.
    const prefix = full.slice(0, start);
    if (
      (prefix.match(/<span\b/gi) || []).length >
      (prefix.match(/<\/span>/gi) || []).length
    )
      throw Error(
        atxTranslate(
          "Текст находится внутри другого span. Сначала выйди из него.",
        ),
      );
    return {
      start,
      end,
      full,
      original,
      plain: original,
      existing: false,
      style: null,
      mods: {},
    };
  }
  function build(t, style, mods = {}) {
    const cls = classNames(style, mods);
    let attrs = "";
    if (style.id === "pulse")
      attrs = ` data-aurora-color="${color(mods.color || t.mods?.color)}"`;
    if (style.id === "sick")
      attrs = ` data-aurora-seed="${seed(mods.seed || t.mods?.seed) || newSeed()}"`;
    return t.plain
      .split(/(\r?\n)/)
      .map((line) =>
        /^\r?\n$/.test(line) || !line.trim()
          ? line
          : `<span class="${cls}"${attrs}>${escape(line)}</span>`,
      )
      .join("");
  }
  function replace(editor, t, replacement) {
    if (editor.getValue() !== t.full)
      throw Error(
        atxTranslate(
          "Заметка изменилась, пока открыта палитра. Выдели текст заново.",
        ),
      );
    const from = editor.offsetToPos(t.start),
      to = editor.offsetToPos(t.end);
    editor.replaceRange(replacement, from, to, "+aurora-text");
    editor.setSelection(from, editor.offsetToPos(t.start + replacement.length));
  }
  return {
    styles,
    byId,
    escape,
    decode,
    optionsFor,
    classNames,
    identify,
    wrappers,
    target,
    build,
    replace,
    color,
    seed,
    newSeed,
  };
})();
