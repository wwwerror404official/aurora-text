const {
  Plugin,
  Modal,
  Notice,
  PluginSettingTab,
  Setting,
  MarkdownRenderChild,
} = require("obsidian");
class AuroraTextPlugin extends Plugin {
  async onload() {
    this.disposed = false;
    this.modals = new Set();
    this.settings = {
      last: "celestia",
      menuMode: "submenu",
      animateMenu: true,
      pulseColor: "#d7abff",
      language: "auto",
    };
    this.saveQueue = Promise.resolve();
    try {
      const d = await this.loadData();
      if (AuroraTextCore.styles.some((s) => s.id === d?.last))
        this.settings.last = d.last;
      if (["submenu", "palette"].includes(d?.menuMode))
        this.settings.menuMode = d.menuMode;
      if (typeof d?.animateMenu === "boolean")
        this.settings.animateMenu = d.animateMenu;
      if (["auto", "en", "ru"].includes(d?.language))
        this.settings.language = d.language;
      if (d?.pulseColor)
        this.settings.pulseColor = AuroraTextCore.color(d.pulseColor);
    } catch (e) {
      console.error("Aurora Text: settings", e);
    }
    if (this.disposed) return;
    AuroraI18n.setLanguage(this.settings.language);
    this.readingCleanups = new Set();
    this.registerMarkdownPostProcessor((el, ctx) => {
      if (this.disposed) return;
      const selector = "span.AtxPulse,span.AtxSick";
      const spans = [...(el.querySelectorAll?.(selector) || [])];
      if (el.matches?.(selector)) spans.unshift(el);
      for (const span of spans) {
        if (
          span.getAttribute("data-atx-enhanced") ||
          span.closest?.("pre, code") ||
          span.children.length
        )
          continue;
        AuroraLetters.reading(span);
        if (!span.getAttribute("data-atx-enhanced")) continue;
        const cleanup = () => {
          AuroraLetters.restore(span);
          this.readingCleanups.delete(cleanup);
        };
        this.readingCleanups.add(cleanup);
        const child = new MarkdownRenderChild(span);
        child.onunload = cleanup;
        ctx.addChild(child);
      }
    });
    this.addSettingTab(new AuroraTextSettings(this.app, this));
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor) => {
        this.compact?.destroy();
        this.compact = null;
        this.lastMenu = menu;
        let captured = null;
        try {
          captured = this.capture(editor);
        } catch {}
        menu.addSeparator();
        menu.addItem((item) => {
          item
            .setTitle(atxTranslate("Aurora · Стили текста"))
            .setIcon("palette");
          if (
            this.settings.menuMode === "submenu" &&
            typeof item.setSubmenu === "function" &&
            captured
          ) {
            const sub = item.setSubmenu();
            this.fillSubmenu(sub, editor, captured);
          } else item.onClick(() => this.openPicker(editor, captured));
        });
      }),
    );
    this.addCommand({
      id: "style-selection",
      name: atxTranslate("Оформить выделенный текст · большая палитра"),
      editorCallback: (editor) => this.openPicker(editor),
    });
    this.addCommand({
      id: "remove-style",
      name: atxTranslate("Снять оформление Aurora"),
      editorCallback: (editor) => {
        try {
          const t = this.capture(editor);
          if (!t.existing) {
            new Notice(
              atxTranslate("Поставь курсор внутри оформленного текста."),
            );
            return;
          }
          this.applyDirect(editor, t, null);
        } catch (e) {
          new Notice(e.message);
        }
      },
    });
  }
  capture(editor) {
    if (editor.listSelections && editor.listSelections().length !== 1)
      throw Error(atxTranslate("Пока поддерживается одно выделение за раз."));
    return AuroraTextCore.target(
      editor.getValue(),
      editor.posToOffset(editor.getCursor("from")),
      editor.posToOffset(editor.getCursor("to")),
    );
  }
  fillSubmenu(menu, editor, target) {
    this.compact?.destroy();
    this.compact = null;
    menu.addItem((item) => {
      item
        .setTitle(atxTranslate("Aurora · Выбрать стиль"))
        .onClick(() => this.openPicker(editor, target));
      const title =
        item.titleEl || item.dom?.querySelector?.(".menu-item-title");
      if (!title || typeof title.replaceChildren !== "function") return;
      title.replaceChildren();
      const shell = item.dom || title;
      shell.classList.add("atx-compact-shell");
      const hide = () => {
        menu.hide?.();
        this.lastMenu?.hide?.();
      };
      this.compact = AuroraCompact.create(title, {
        text: target.plain,
        mods: target.mods,
        animate: this.settings.animateMenu,
        defaultColor: this.settings.pulseColor,
        onApply: (style, mods) => {
          hide();
          this.applyDirect(editor, target, style, mods);
        },
        onPalette: () => {
          hide();
          this.openPicker(editor, target);
        },
        onRemove: target.existing
          ? () => {
              hide();
              this.applyDirect(editor, target, null);
            }
          : undefined,
      });
    });
  }
  applyDirect(editor, target, style, mods = {}) {
    if (this.disposed) return;
    try {
      const replacement = style
        ? AuroraTextCore.build(target, style, mods)
        : target.plain;
      AuroraTextCore.replace(editor, target, replacement);
      if (style) this.remember(style.id, mods);
      editor.focus();
    } catch (e) {
      new Notice(e.message);
    }
  }
  openPicker(editor, captured = null) {
    if (this.disposed) return;
    try {
      const t = captured || this.capture(editor);
      for (const modal of [...this.modals]) modal.close();
      const modal = new AuroraPicker(this, editor, t);
      this.modals.add(modal);
      modal.open();
    } catch (e) {
      new Notice(e.message);
    }
  }
  saveSettings() {
    const data = { ...this.settings };
    this.saveQueue = this.saveQueue
      .then(() => this.saveData(data))
      .catch((e) => console.error("Aurora Text: save failed", e));
    return this.saveQueue;
  }
  remember(id, mods = {}) {
    this.settings.last = id;
    if (id === "pulse")
      this.settings.pulseColor = AuroraTextCore.color(mods.color);
    return this.saveSettings();
  }
  onunload() {
    this.disposed = true;
    for (const cleanup of [...(this.readingCleanups || [])]) cleanup();
    this.lastMenu?.hide?.();
    this.lastMenu = null;
    this.compact?.destroy();
    this.compact = null;
    for (const modal of [...this.modals]) modal.close();
    this.modals.clear();
  }
}
class AuroraTextSettings extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const c = this.containerEl,
      p = this.plugin;
    c.empty();
    const title = c.ownerDocument.createElement("h2");
    title.textContent = "Aurora Text";
    c.appendChild(title);
    new Setting(c)
      .setName(atxTranslate("Язык интерфейса"))
      .setDesc(
        atxTranslate(
          "Изменение языка действует для новых меню. Команды обновятся после перезапуска плагина.",
        ),
      )
      .addDropdown((d) =>
        d
          .addOption("auto", atxTranslate("Автоматически"))
          .addOption("en", "English")
          .addOption("ru", "Русский")
          .setValue(p.settings.language)
          .onChange((v) => {
            p.settings.language = v;
            AuroraI18n.setLanguage(v);
            p.saveSettings();
            this.display();
          }),
      );
    new Setting(c)
      .setName(atxTranslate("Выбор стиля по правой кнопке"))
      .setDesc(
        atxTranslate(
          "Изменение действует сразу, без перезапуска. В подменю стиль применяется щелчком по строке.",
        ),
      )
      .addDropdown((d) =>
        d
          .addOption("submenu", atxTranslate("Компактный столбец справа"))
          .addOption(
            "palette",
            atxTranslate("Большая палитра с предпросмотром"),
          )
          .setValue(p.settings.menuMode)
          .onChange((v) => {
            p.settings.menuMode = v;
            p.saveSettings();
          }),
      );
    new Setting(c)
      .setName(atxTranslate("Анимация при наведении в подменю"))
      .setDesc(
        atxTranslate(
          "Движется только образец под мышью, остальные неподвижны.",
        ),
      )
      .addToggle((t) =>
        t.setValue(p.settings.animateMenu).onChange((v) => {
          p.settings.animateMenu = v;
          p.saveSettings();
        }),
      );
    const note = c.ownerDocument.createElement("p");
    note.textContent = atxTranslate(
      "42 стиля, в том числе 9 пиковых. Список листается колёсиком, а не движением мыши. Большая палитра остаётся доступна внизу подменю и через Ctrl+P. В узком окне Obsidian может раскрыть подменю влево, чтобы оно поместилось.",
    );
    c.appendChild(note);
  }
}
class AuroraPicker extends Modal {
  constructor(plugin, editor, target) {
    super(plugin.app);
    this.plugin = plugin;
    this.editor = editor;
    this.target = target;
    this.done = false;
  }
  onOpen() {
    this.modalEl.classList.add("atx-modal");
    this.contentEl.empty();
    this.ui = AuroraTextUI.create(this.contentEl, {
      text: this.target.plain,
      initial: this.target.style?.id || this.plugin.settings.last,
      mods: this.target.mods,
      defaultColor: this.plugin.settings.pulseColor,
      onCancel: () => this.close(),
      onRemove: this.target.existing ? () => this.commit(null) : undefined,
      onApply: (style, mods) => this.commit(style, mods),
    });
  }
  commit(style, mods = {}) {
    if (this.done) return;
    try {
      const replacement = style
        ? AuroraTextCore.build(this.target, style, mods)
        : this.target.plain;
      AuroraTextCore.replace(this.editor, this.target, replacement);
      this.done = true;
      if (style) this.plugin.remember(style.id, mods);
      this.close();
      this.editor.focus();
    } catch (e) {
      new Notice(e.message);
      this.close();
    }
  }
  onClose() {
    this.ui?.destroy();
    this.ui = null;
    this.contentEl.empty();
    this.plugin.modals.delete(this);
  }
}
module.exports = AuroraTextPlugin;
