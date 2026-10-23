const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  vm = require("node:vm"),
  path = require("node:path");
class El {
  constructor(tag, doc) {
    this.tag = tag;
    this.ownerDocument = doc;
    this.children = [];
    this.events = new Map();
    this.dataset = {};
    this.attrs = {};
    this.className = "";
    this.value = "";
    this.textContent = "";
    this.parent = null;
    this.style = {
      values: {},
      setProperty: (k, v) => {
        this.style.values[k] = v;
      },
    };
    this.classList = {
      add: (c) => {
        this.className += " " + c;
      },
      contains: (c) => this.className.split(/\s+/).includes(c),
    };
  }
  appendChild(e) {
    e.parent = this;
    this.children.push(e);
    return e;
  }
  get textContent() {
    return (
      (this._text || "") + this.children.map((c) => c.textContent).join("")
    );
  }
  set textContent(v) {
    this._text = String(v);
    if (this.children) {
      for (const child of this.children) child.parent = null;
      this.children = [];
    }
  }
  replaceChildren(...children) {
    this._text = "";
    for (const child of this.children) child.parent = null;
    this.children = [];
    for (const child of children) this.appendChild(child);
  }
  empty() {
    this.replaceChildren();
  }
  remove() {
    if (this.parent)
      this.parent.children = this.parent.children.filter((e) => e !== this);
    this.parent = null;
  }
  setAttribute(k, v) {
    this.attrs[k] = v;
  }
  addEventListener(k, fn, opts) {
    this.listenerOptions = this.listenerOptions || new Map();
    this.listenerOptions.set(k, opts);
    if (!this.events.has(k)) this.events.set(k, new Set());
    this.events.get(k).add(fn);
  }
  removeEventListener(k, fn) {
    this.events.get(k)?.delete(fn);
  }
  emit(k, e = {}) {
    e.stopPropagation = () => {
      e.stopped = true;
    };
    e.preventDefault = () => {
      e.prevented = true;
    };
    for (const fn of [...(this.events.get(k) || [])]) fn(e);
    return e;
  }
  focus() {
    this.ownerDocument.activeElement = this;
  }
  getAttribute(k) {
    return this.attrs[k];
  }
  removeAttribute(k) {
    delete this.attrs[k];
  }
  matches(selector) {
    return selector.split(",").some((part) => {
      part = part.trim();
      const bits = part.split(".");
      return (
        (!bits[0] || bits[0] === this.tag) &&
        bits.slice(1).every((c) => this.className.split(/\s+/).includes(c))
      );
    });
  }
  querySelectorAll(selector) {
    return this.children
      .flatMap((n) => nodes(n))
      .filter((n) => n.matches(selector));
  }
  closest(selector) {
    let n = this;
    while (n) {
      if (n.matches(selector)) return n;
      n = n.parent;
    }
    return null;
  }
}
class Doc {
  constructor() {
    this.body = new El("body", this);
  }
  createElement(tag) {
    return new El(tag, this);
  }
  createTextNode(value) {
    const e = new El("#text", this);
    e.textContent = value;
    return e;
  }
}
function nodes(el) {
  return [el, ...el.children.flatMap(nodes)];
}
function mockEditor(text, a, b) {
  return {
    value: text,
    a,
    b,
    writes: 0,
    getValue() {
      return this.value;
    },
    getCursor(which) {
      return this.offsetToPos(which === "from" ? this.a : this.b);
    },
    getSelection() {
      return this.value.slice(this.a, this.b);
    },
    posToOffset(p) {
      const lines = this.value.split("\n");
      return (
        lines.slice(0, p.line).reduce((n, s) => n + s.length + 1, 0) + p.ch
      );
    },
    offsetToPos(i) {
      const x = this.value.slice(0, i).split("\n");
      return { line: x.length - 1, ch: x[x.length - 1].length };
    },
    listSelections() {
      return [{}];
    },
    replaceRange(s, from, to) {
      const a = this.posToOffset(from),
        b = this.posToOffset(to);
      this.value = this.value.slice(0, a) + s + this.value.slice(b);
      this.writes++;
    },
    setSelection(from, to) {
      this.a = this.posToOffset(from);
      this.b = this.posToOffset(to);
    },
    focus() {
      this.focused = true;
    },
  };
}
const doc = new Doc(),
  notices = [];
class Plugin {
  constructor(app) {
    this.app = app;
    this.commands = [];
    this.reg = [];
  }
  async loadData() {
    return this.persisted || {};
  }
  registerMarkdownPostProcessor(fn) {
    this.processor = fn;
  }
  addSettingTab(tab) {
    this.tab = tab;
  }
  async saveData(v) {
    this.data = v;
  }
  registerEvent(r) {
    this.reg.push(r);
  }
  addCommand(c) {
    this.commands.push(c);
  }
}
class MarkdownRenderChild {
  constructor(el) {
    this.containerEl = el;
  }
}
class PluginSettingTab {
  constructor(app, plugin) {
    this.app = app;
    this.containerEl = doc.createElement("section");
  }
}
class Setting {
  constructor(c) {
    this.container = c;
  }
  setName() {
    return this;
  }
  setDesc() {
    return this;
  }
  addDropdown(fn) {
    const d = {
      addOption() {
        return this;
      },
      setValue() {
        return this;
      },
      onChange(fn) {
        this.fn = fn;
        return this;
      },
    };
    fn(d);
    return this;
  }
  addToggle(fn) {
    const t = {
      setValue() {
        return this;
      },
      onChange(fn) {
        this.fn = fn;
        return this;
      },
    };
    fn(t);
    return this;
  }
}
class Modal {
  constructor(app) {
    this.app = app;
    this.modalEl = doc.createElement("div");
    this.contentEl = doc.createElement("div");
    this.modalEl.appendChild(this.contentEl);
  }
  open() {
    doc.body.appendChild(this.modalEl);
    this.onOpen();
  }
  close() {
    this.onClose();
    this.modalEl.remove();
  }
}
const sandbox = {
  navigator: { language: "ru-RU" },
  document: doc,
  console,
  module: { exports: {} },
  require: (n) => {
    assert.equal(n, "obsidian");
    return {
      Plugin,
      Modal,
      PluginSettingTab,
      Setting,
      MarkdownRenderChild,
      Notice: class {
        constructor(s) {
          notices.push(s);
        }
      },
    };
  },
};
vm.createContext(sandbox);
vm.runInContext(
  fs.readFileSync(path.join(__dirname, "../main.js"), "utf8") +
    '\nAuroraI18n.setLanguage("ru");this.C=AuroraTextCore;this.UI=AuroraTextUI;this.L=AuroraLetters;',
  sandbox,
);
const C = sandbox.C,
  UI = sandbox.UI,
  L = sandbox.L;
let count = 0;
const test = (name, fn) => {
  fn();
  count++;
  console.log("PASS", name);
};
test("42 styles, unique IDs and class sets", () => {
  assert.equal(C.styles.length, 42);
  assert.equal(new Set(C.styles.map((s) => s.id)).size, 42);
  assert.equal(new Set(C.styles.map((s) => s.classes.join(" "))).size, 42);
});
test("All styles produce valid known classes and round trip Unicode", () => {
  for (const style of C.styles) {
    const plain = 'Флатти & Tw < 3 "♡"';
    const t = C.target(plain, 0, plain.length);
    const html = C.build(t, style, { name: true });
    const parsed = C.target(html, 0, html.length);
    assert.equal(parsed.plain, plain);
    assert.equal(parsed.style.id, style.id);
  }
});
test("Entity escaping is reversible without HTML execution", () => {
  const plain = '&amp;lt; &lt; &#39; < & "';
  const html = C.build(C.target(plain, 0, plain.length), C.byId("tw"));
  assert(!html.includes("<img"));
  assert.equal(C.target(html, 0, html.length).plain, plain);
});
test("Cursor inside styled text expands to its owning wrapper", () => {
  const html = 'До <span class="Tw name">Боевой Tw</span> после';
  const at = html.indexOf("Боевой") + 2;
  const t = C.target(html, at, at);
  assert(t.existing);
  assert.equal(t.plain, "Боевой Tw");
  assert.equal(t.original, '<span class="Tw name">Боевой Tw</span>');
});
test("Existing CSS alias TOB618 is recognized", () =>
  assert.equal(
    C.target('<span class="TOB618">Космос</span>', 21, 21).style.id,
    "ton618",
  ));
test("Changing style replaces, never nests, the wrapper", () => {
  const html = '<span class="Luna">Луна</span>';
  const t = C.target(html, 0, html.length);
  const updated = C.build(t, C.byId("nightmare"));
  assert.equal(updated, '<span class="Trio NightmareMoon">Луна</span>');
  assert.equal((updated.match(/<span/g) || []).length, 1);
});
test("Multiline selections preserve line breaks and blank lines", () => {
  const text = "Первая\n\nВторая";
  const html = C.build(C.target(text, 0, text.length), C.byId("tw"));
  assert.equal(
    html,
    '<span class="Tw">Первая</span>\n\n<span class="Tw">Вторая</span>',
  );
});
test("Only supported modifiers reach markup", () => {
  assert.equal(
    C.classNames(C.byId("nightmare"), {
      slow: true,
      quiet: true,
      plain: true,
      short: true,
    }),
    "Trio NightmareMoon slow",
  );
  assert.equal(
    C.classNames(C.byId("tw-awakened"), {
      short: true,
      quiet: true,
      slow: true,
    }),
    "TwAwakened quiet short",
  );
});
test("Empty selection, partial wrapper and foreign HTML are protected", () => {
  assert.throws(() => C.target("abc", 1, 1));
  const h = '<span class="Luna">Луна</span>';
  assert.throws(() => C.target(h, 2, h.length - 2));
  assert.throws(() => C.target('<span class="foreign">word</span>', 22, 24));
  assert.throws(() => C.target("<img src=x>", 0, 11));
});
test("Fenced code, inline code, properties and links are protected", () => {
  for (const [s, a, b] of [
    ["```js\nhello\n```", 6, 11],
    ["`hello`", 1, 6],
    ["---\nname: text\n---\nbody", 10, 14],
    ["[[Tw]]", 0, 6],
  ])
    assert.throws(() => C.target(s, a, b));
});
test("Applying affects only frozen selected range", () => {
  const ed = mockEditor("До Tw после", 3, 5);
  const t = C.target(ed.value, 3, 5);
  C.replace(ed, t, C.build(t, C.byId("tw")));
  assert.equal(ed.value, 'До <span class="Tw">Tw</span> после');
  assert.equal(ed.writes, 1);
});
test("Changed document aborts without touching text", () => {
  const ed = mockEditor("Tw", 0, 2);
  const t = C.target(ed.value, 0, 2);
  ed.value = "новый Tw";
  assert.throws(() => C.replace(ed, t, "replacement"));
  assert.equal(ed.writes, 0);
});
test("Palette creates 42 samples, hover previews exact selected words without edits", () => {
  const holder = doc.createElement("div");
  let applied = 0;
  const ui = UI.create(holder, {
    text: "Наш выбранный текст",
    onApply: () => applied++,
  });
  const cards = nodes(ui.root).filter((e) => e.className === "atx-card");
  assert.equal(cards.length, 42);
  assert.equal(applied, 0);
  cards[19].emit("pointerenter");
  const hero = nodes(ui.root).find((e) => e.className === "atx-hero");
  assert(
    nodes(hero).some(
      (e) =>
        e.className === "Trio MidnightSparkle" &&
        e.textContent === "Наш выбранный текст",
    ),
  );
  const button = nodes(ui.root).find(
    (e) => e.className === "atx-button atx-primary",
  );
  button.emit("click");
  assert.equal(applied, 1);
  const listeners = nodes(ui.root);
  ui.destroy();
  assert(
    listeners.every((e) => [...e.events.values()].every((s) => s.size === 0)),
  );
});
(async () => {
  const events = new Map(),
    app = {
      workspace: {
        on: (event, callback) => {
          events.set(event, callback);
          return { event, callback };
        },
      },
    };
  const P = sandbox.module.exports,
    p = new P(app);
  await p.onload();
  test("Plugin registers editor menu and two commands", () => {
    assert(events.has("editor-menu"));
    assert.equal(p.commands.length, 2);
    assert.equal(p.reg.length, 1);
  });
  test("Context menu contains Aurora entry with palette icon", () => {
    const item = {
      setTitle(v) {
        this.title = v;
        return this;
      },
      setIcon(v) {
        this.icon = v;
        return this;
      },
      onClick(fn) {
        this.fn = fn;
        return this;
      },
    };
    events.get("editor-menu")(
      {
        addSeparator() {},
        addItem(fn) {
          fn(item);
        },
      },
      mockEditor("Tw", 0, 2),
    );
    assert.equal(item.title, "Aurora · Стили текста");
    assert.equal(item.icon, "palette");
  });
  test("Cancel leaves document byte-identical; modal closes cleanly", () => {
    const e = mockEditor("Tw", 0, 2);
    p.openPicker(e);
    const m = [...p.modals][0];
    assert(m);
    m.close();
    assert.equal(e.value, "Tw");
    assert.equal(e.writes, 0);
    assert.equal(p.modals.size, 0);
  });
  test("Applying picker commits once, restores editor focus, replaces old style", () => {
    const e = mockEditor('<span class="Luna">Луна</span>', 19, 19);
    p.openPicker(e);
    const m = [...p.modals][0];
    m.commit(C.byId("nightmare"), { name: true });
    assert.equal(e.value, '<span class="Trio NightmareMoon name">Луна</span>');
    assert.equal(e.writes, 1);
    assert(e.focused);
    assert.equal(p.modals.size, 0);
    m.commit(C.byId("tw"));
    assert.equal(e.writes, 1);
  });
  test("Remove restores original source characters", () => {
    const e = mockEditor('<span class="Tw">A &amp; B</span>', 19, 19);
    p.openPicker(e);
    [...p.modals][0].commit(null);
    assert.equal(e.value, "A & B");
  });

  test("Settings page exposes the mode switch without opening a modal", () => {
    assert(p.tab);
    p.tab.display();
    assert.equal(p.modals.size, 0);
  });
  function menuMock() {
    return {
      items: [],
      addSeparator() {},
      addItem(fn) {
        const row = doc.createElement("div"),
          title = doc.createElement("span");
        row.appendChild(title);
        const item = {
          dom: row,
          titleEl: title,
          setTitle(v) {
            this.title = v;
            return this;
          },
          setIcon() {
            return this;
          },
          onClick(fn) {
            this.click = fn;
            return this;
          },
          setSubmenu() {
            this.sub = menuMock();
            return this.sub;
          },
        };
        fn(item);
        this.items.push(item);
      },
      hide() {
        this.hidden = true;
      },
    };
  }
  test("Native submenu hosts ONE bounded scrolling container with 42 styles", () => {
    const e = mockEditor("Наш текст", 0, 9),
      m = menuMock();
    events.get("editor-menu")(m, e);
    assert.equal(p.modals.size, 0);
    assert.equal(m.items[0].sub.items.length, 1);
    const compact = p.compact;
    assert(compact);
    assert.equal(compact.rows.length, 42);
    const row = compact.rows[20],
      sample = row.sample;
    assert.equal(sample.className, "WhiteGold still");
    assert.equal(sample.textContent, "Наш текст");
    row.button.emit("pointerenter");
    assert.equal(sample.className, "WhiteGold");
    row.button.emit("pointerleave");
    assert.equal(sample.className, "WhiteGold still");
    assert.equal(e.writes, 0);
    row.button.emit("click");
    assert.equal(e.value, '<span class="WhiteGold">Наш текст</span>');
    assert.equal(e.writes, 1);
    assert(m.hidden);
  });
  test("Palette mode keeps original dialog; changing mode takes immediate effect", () => {
    p.settings.menuMode = "palette";
    const e = mockEditor("Tw", 0, 2),
      m = menuMock();
    events.get("editor-menu")(m, e);
    assert(!m.items[0].sub);
    m.items[0].click();
    assert.equal(p.modals.size, 1);
    [...p.modals][0].close();
    p.settings.menuMode = "submenu";
    const m2 = menuMock();
    events.get("editor-menu")(m2, e);
    assert(m2.items[0].sub);
  });
  test("Disabling menu animation leaves samples still on hover", () => {
    p.settings.animateMenu = false;
    const e = mockEditor("Tw", 0, 2),
      m = menuMock();
    events.get("editor-menu")(m, e);
    const row = p.compact.rows[22];
    row.button.emit("pointerenter");
    assert.equal(row.sample.className, "Speed still");
    p.settings.animateMenu = true;
  });
  test("Submenu uses frozen selection and rejects changed document", () => {
    const e = mockEditor("Tw", 0, 2),
      m = menuMock();
    events.get("editor-menu")(m, e);
    e.value = "Other Tw";
    p.compact.rows[0].button.emit("click");
    assert.equal(e.value, "Other Tw");
    assert.equal(e.writes, 0);
  });

  test("Pointer movement and hover never change internal scroll position", () => {
    const e = mockEditor("Tw", 0, 2),
      m = menuMock();
    events.get("editor-menu")(m, e);
    const c = p.compact;
    c.list.scrollTop = 180;
    for (let n = 0; n < 40; n++) {
      const a = c.root.emit("pointermove"),
        b = c.root.emit("mousemove");
      assert(a.stopped && b.stopped);
      c.rows[n % c.rows.length].button.emit("pointerenter");
      c.rows[n % c.rows.length].button.emit("pointerleave");
      assert.equal(c.list.scrollTop, 180);
    }
    assert.equal(e.writes, 0);
  });
  test("Wheel is passive, keeps browser default scrolling, stops native menu bubbling", () => {
    const c = p.compact;
    const event = c.root.emit("wheel", { deltaY: 120 });
    assert(event.stopped);
    assert(!event.prevented);
    assert.equal(c.root.listenerOptions.get("wheel").passive, true);
  });
  test("Search filters styles without moving document or applying effects", () => {
    const c = p.compact,
      search = nodes(c.root).find(
        (el) => el.className === "atx-compact-search",
      );
    search.value = "Северное";
    search.emit("input");
    const visible = c.rows.filter((r) => !r.button.hidden);
    assert.equal(visible.length, 1);
    assert.equal(visible[0].style.id, "borealis");
    assert.equal(c.list.scrollTop, 0);
  });
  test("Compact pointer and click events stay inside custom controls", () => {
    const c = p.compact;
    for (const name of ["click", "mousedown", "mouseup", "pointerdown"])
      assert(c.root.emit(name).stopped);
  });
  test("Compact cleanup removes every attached listener", () => {
    const c = p.compact;
    const all = nodes(c.root);
    c.destroy();
    for (const el of all)
      assert([...el.events.values()].every((set) => set.size === 0));
    p.compact = null;
  });

  test("Peak collection has nine distinct editions with correct ink classification", () => {
    const peak = C.styles.filter((s) => s.group === "Пиковые");
    assert.equal(peak.length, 9);
    assert.equal(peak.filter((s) => s.ink).length, 4);
    for (const s of peak) {
      assert(s.classes.includes("Peak"));
      assert(C.optionsFor(s).includes("slow"));
      assert.equal(C.optionsFor(s).includes("plain"), !s.ink);
    }
    assert(C.optionsFor(C.byId("peak-tw")).includes("short"));
  });
  test("Peak wrappers preserve name/still/slow and can replace legacy styles", () => {
    for (const style of C.styles.filter((s) => s.group === "Пиковые")) {
      const raw = '<span class="Tw name">Tw &amp; Флатти</span>';
      const target = C.target(raw, 0, raw.length);
      const result = C.build(target, style, {
        name: true,
        still: true,
        slow: true,
      });
      const t = C.target(result, 0, result.length);
      assert.equal(t.plain, "Tw & Флатти");
      assert.equal(t.style.id, style.id);
      assert(t.mods.name && t.mods.still && t.mods.slow);
    }
  });
  test("Peak palette filter exposes exactly nine editions", () => {
    const holder = doc.createElement("div");
    const ui = UI.create(holder, { text: "Пиковая форма", onApply() {} });
    const tab = nodes(ui.root).find(
      (e) => e.className === "atx-tab" && e.textContent === "Пиковые",
    );
    assert(tab);
    tab.emit("click");
    assert.equal(
      nodes(ui.root).filter((e) => e.className === "atx-card").length,
      9,
    );
    ui.destroy();
  });

  test("Pulse colour persists in a compact source wrapper and is sanitized", () => {
    const t = C.target("Пульс", 0, 5);
    const html = C.build(t, C.byId("pulse"), { color: "#F0A1BC" });
    assert.equal(
      html,
      '<span class="AtxPulse" data-aurora-color="#f0a1bc">Пульс</span>',
    );
    assert.equal(C.target(html, 0, html.length).mods.color, "#f0a1bc");
    assert.equal(C.color("red;display:none"), "#d7abff");
    assert(
      !C.wrappers('<span class="AtxPulse" onclick="bad()">x</span>').length,
    );
  });
  test("Sick seed and chaos persist without per-letter markup in the file", () => {
    const t = C.target("Больной?", 0, 8);
    const html = C.build(t, C.byId("sick"), { seed: 4294, chaos: true });
    assert.equal(
      html,
      '<span class="AtxSick chaos" data-aurora-seed="4294">Больной?</span>',
    );
    const parsed = C.target(html, 0, html.length);
    assert.equal(parsed.mods.seed, 4294);
    assert(parsed.mods.chaos);
    assert.equal((html.match(/<span/g) || []).length, 1);
  });
  test("Grapheme splitting preserves combining marks and multi-codepoint emoji", () => {
    assert.equal(L.graphemes("е\u0301👩‍🚀A").length, 3);
  });
  test("Letter traits are deterministic per seed, vary between seeds, and have mixed modes", () => {
    const text = "Больной? Каждая буква имеет свой характер";
    const a = L.plan(text, 1234),
      b = L.plan(text, 1234),
      c = L.plan(text, 5321);
    assert.equal(JSON.stringify(a), JSON.stringify(b));
    assert.notEqual(JSON.stringify(a), JSON.stringify(c));
    assert(new Set(a.map((x) => x.kind)).size >= 6);
    assert(a.some((x) => x.x < 0));
    assert(a.some((x) => x.angle === 180));
    assert(a.some((x) => x.animated));
  });
  test("Pulse creates one hidden outline per letter with strictly increasing delays", () => {
    const el = doc.createElement("span");
    L.paint(el, C.byId("pulse"), { color: "#ffaa00" }, "А БВ");
    const outline = nodes(el).filter(
      (n) => n.className === "atx-pulse-outline",
    );
    assert.equal(outline.length, 3);
    assert(outline.every((n) => n.attrs["aria-hidden"] === "true"));
    const ds = outline.map((n) =>
      parseFloat(n.style.values["--atx-letter-delay"]),
    );
    assert(ds[0] < ds[1] && ds[1] < ds[2]);
    assert.equal(el.style.values["--atx-pulse-color"], "#ffaa00");
    L.restore(el);
    assert.equal(el.textContent, "А БВ");
    assert.equal(el.children.length, 0);
  });
  test("Painting between styles removes derived letter nodes and preserves new text", () => {
    const el = doc.createElement("span");
    L.paint(el, C.byId("sick"), { seed: 5 }, "ABC");
    assert(el.children.length);
    L.paint(el, C.byId("celestia"), {}, "Новый текст");
    assert.equal(el.children.length, 0);
    assert.equal(el.textContent, "Новый текст");
    assert(!el.getAttribute("data-atx-enhanced"));
  });
  test("Long selections use safe plain fallback instead of unbounded letter DOM", () => {
    const el = doc.createElement("span"),
      text = "a".repeat(181);
    L.paint(el, C.byId("pulse"), {}, text);
    assert.equal(el.children.length, 0);
    assert.equal(el.textContent, text);
  });
  test("Reading postprocessor decorates DOM only and restores via render-child cleanup", () => {
    const root = doc.createElement("div"),
      el = doc.createElement("span");
    el.className = "AtxPulse";
    el.textContent = "Текст";
    el.setAttribute("data-aurora-color", "#12abcd");
    root.appendChild(el);
    const children = [];
    p.processor(root, { addChild: (c) => children.push(c) });
    assert.equal(children.length, 1);
    assert.equal(el.getAttribute("data-atx-enhanced"), "pulse");
    assert.equal(el.style.values["--atx-pulse-color"], "#12abcd");
    p.processor(root, { addChild: (c) => children.push(c) });
    assert.equal(children.length, 1);
    children[0].onunload();
    assert.equal(el.textContent, "Текст");
    assert.equal(el.children.length, 0);
  });
  test("Pulse picker exposes colour control and applies exactly the preview colour", () => {
    const holder = doc.createElement("div");
    let applied;
    const ui = UI.create(holder, {
      text: "Цвет",
      initial: "pulse",
      onApply: (style, mods) => (applied = mods),
    });
    const color = nodes(ui.root).find(
      (n) => n.tag === "input" && n.type === "color",
    );
    assert(color);
    color.value = "#aabbcc";
    color.emit("input");
    nodes(ui.root)
      .find((n) => n.className === "atx-button atx-primary")
      .emit("click");
    assert.equal(applied.color, "#aabbcc");
    ui.destroy();
  });
  test("Compact colour control updates pulse row and preserves chosen colour on apply", () => {
    const e = mockEditor("Текст", 0, 5),
      m = menuMock();
    events.get("editor-menu")(m, e);
    const c = p.compact,
      input = nodes(c.root).find(
        (n) => n.tag === "input" && n.type === "color",
      );
    input.value = "#ab1222";
    input.emit("input");
    c.rows.find((r) => r.style.id === "pulse").button.emit("click");
    assert(e.value.includes('data-aurora-color="#ab1222"'));
  });

  test("Removing an unstyled selection gives an actionable notice", () => {
    const e = mockEditor("plain", 0, 5);
    p.commands.find((c) => c.id === "remove-style").editorCallback(e);
    assert.equal(notices.at(-1), "Поставь курсор внутри оформленного текста.");
    assert.equal(e.writes, 0);
  });
  test("Stale document error explains how to recover", () => {
    const e = mockEditor("text", 0, 4);
    const target = C.target(e.value, 0, 4);
    e.value = "changed";
    assert.throws(
      () => C.replace(e, target, "replacement"),
      /Заметка изменилась/,
    );
    assert.equal(e.writes, 0);
  });
  test("Menu without submenu APIs opens full palette", () => {
    const e = mockEditor("text", 0, 4);
    let row;
    events.get("editor-menu")(
      {
        addSeparator() {},
        addItem(fn) {
          row = {
            setTitle() {
              return this;
            },
            setIcon() {
              return this;
            },
            onClick(fn) {
              this.click = fn;
              return this;
            },
          };
          fn(row);
        },
      },
      e,
    );
    row.click();
    assert.equal(p.modals.size, 1);
    [...p.modals][0].close();
    assert.equal(e.writes, 0);
  });
  test("Submenu without accessible DOM retains clickable palette fallback", () => {
    const e = mockEditor("text", 0, 4);
    let row;
    p.fillSubmenu(
      {
        addItem(fn) {
          row = {
            setTitle() {
              return this;
            },
            onClick(fn) {
              this.click = fn;
              return this;
            },
          };
          fn(row);
        },
      },
      e,
      C.target(e.value, 0, 4),
    );
    assert.equal(p.compact, null);
    row.click();
    assert.equal(p.modals.size, 1);
    [...p.modals][0].close();
    assert.equal(e.writes, 0);
  });
  test("English and Russian palettes show localized names and filter groups", () => {
    vm.runInContext('AuroraI18n.setLanguage("en")', sandbox);
    const holder = doc.createElement("div");
    const ui = UI.create(holder, { text: "Words", onApply() {} });
    const tab = nodes(ui.root).find(
      (n) => n.className === "atx-tab" && n.textContent === "Peak",
    );
    assert(tab);
    tab.emit("click");
    assert.equal(
      nodes(ui.root).filter((n) => n.className === "atx-card").length,
      9,
    );
    assert(
      nodes(ui.root).some((n) => n.textContent === "Dress your words in light"),
    );
    ui.destroy();
    vm.runInContext('AuroraI18n.setLanguage("ru")', sandbox);
  });
  test("Plugin unload closes preview with no note mutation", () => {
    const e = mockEditor("text", 0, 4);
    p.openPicker(e);
    p.onunload();
    assert.equal(p.modals.size, 0);
    assert.equal(e.value, "text");
    assert.equal(e.writes, 0);
  });
  console.log(
    count +
      " checks passed; simulated editor/DOM/API, no Electron visual validation.",
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
