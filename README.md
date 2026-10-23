# Aurora Text

Give selected words animated backgrounds, flowing colors inside letters, or per-letter distortions. Preview your own text before applying a preset, using a compact context menu or a full palette.

**1.5.0 — public beta, desktop only.** Not yet listed in the Obsidian Community directory. Real Obsidian compatibility and visual checks are still pending; see [QA](docs/QA.md).

## What you get

- 42 presets, including 9 elaborate “Peak” editions.
- Compact picker with wheel scrolling, search and hover previews.
- Full palette with filters, modifiers and a preview of the selected words.
- Configurable outline Pulse and seeded “Sick?” letter distortions.
- English and Russian interfaces: automatic browser locale detection, or an explicit language setting.
- Bundled CSS and original SVG wing artwork; no downloads at runtime.

Open [docs/demo.html](docs/demo.html) locally in your browser for an interactive palette demo. GitHub displays its source: download the repository ZIP and open the extracted file. The demo uses the same palette and styles as the plugin, but does not test Obsidian integration.

## Install the beta

1. Download **main.js**, **manifest.json**, and **styles.css** from this repository's release assets. GitHub's automatically generated source archive is not the installed plugin folder.
2. Close Obsidian. Create `<your-vault>/.obsidian/plugins/aurora-text/` and copy the three files there. If you use a custom configuration folder, replace `.obsidian` accordingly.
3. Open Obsidian, allow Community plugins if necessary, and enable **Aurora Text** in Settings → Community plugins.
4. Try it in a disposable note first. The public beta declares Obsidian **1.14.5 or newer** as a conservative baseline; this is not a claim of completed testing on that version.

Upgrading an older Aurora Text build: preserve your existing `data.json`, replace only those three files, then reload the plugin. IDs and existing CSS class names are preserved. Do not run a second copy of the old plugin or duplicate CSS snippets at the same time.

## Use it

1. Select plain words or a short phrase in a note.
2. Right-click → **Aurora · Text styles**.
3. In compact mode, hover to preview and click a row to apply. The wheel scrolls the list. **Full palette…** opens the larger picker.
4. In the full palette, choose a preset and modifiers, then click **Apply**. Hovering and canceling do not change the note.

Change the picker mode or interface language in Settings → Aurora Text. Both commands are also available in Obsidian's command palette. New menus reflect a language change immediately; reload the plugin to update the registered command names.

Place the cursor inside existing Aurora text to change or remove its style. Undo uses Obsidian's normal editor undo. If the note changes while the picker is open, Aurora aborts the edit rather than applying to an outdated selection.

Aurora writes a small HTML span to Markdown, for example:

```html
<span class="WhiteGold">Your words</span>
<span class="AtxPulse" data-aurora-color="#e8b65d">A pulse of light</span>
<span class="AtxSick" data-aurora-seed="1234">Sick?</span>
```

Per-letter DOM is derived only for rendered views and previews, never saved into your note. Disabling the plugin leaves the spans in the source; other Markdown apps may show unstyled text or raw HTML. Use **Remove Aurora style** while the plugin is enabled to unwrap a phrase.

## Collections

General effects include White Gold, Tenderness, Speed, Borealis, Liquid Silver, Rose Quartz, Deep Ocean, Star Silk, Ember Ink, Hologram, Mosslight, Collapse, Rainbow, TON 618, Pulse and Sick?.

Character-inspired presets form a thematic collection: Celestia, Twilight, Luna, Fluttershy, Rainbow Dash, Sunset Shimmer, Rarity, Pinkie Pie, Applejack, Discord, Flurry Heart, Sombra, Nightmare Moon, Daybreaker and Midnight Sparkle. Tw has its own blue and silver presets. Peak editions add more elaborate details. The names are inspiration labels; this project is not affiliated with or endorsed by the owners of those characters. The bundled wing drawings are original SVG assets, not extracted character artwork.

## Limits and performance

- One selection at a time. Intended for plain words, not arbitrary Markdown, nested HTML, tables or full documents. Basic guards reject code, properties, links and overlapping wrappers; they are not a complete Markdown parser.
- **Pulse and Sick? get full per-letter effects in Reading view and the picker.** There is no CodeMirror extension for those effects in Live Preview. Source mode displays HTML; rendering in Live Preview depends on Obsidian.
- Per-letter effects fall back to plain text above 180 grapheme clusters. Long palette samples are truncated for display; applying preserves the full selected text.
- CSS animation work depends on the number of visible styled phrases, font, theme and hardware. There is no per-frame JavaScript animation loop. Still modifiers and reduced-motion rules are included; test reduced motion with your OS and theme.
- The compact submenu uses runtime-checked, undocumented Obsidian menu features. If unavailable it falls back to opening the full palette. That fallback also needs real-app verification.
- Winged styles reserve horizontal space but can still clip inside a narrow table, callout or theme container. Readability and font/theme combinations need visual testing.
- Desktop only in this beta; mobile, Publish and PDF export are not claimed as supported.

## Privacy

No network requests, analytics, accounts, API keys, remote fonts, telemetry or automatic self-updates. Aurora reads the active editor content to capture a selection and check that the document has not changed. It writes only the chosen editor range after an explicit apply/remove action. Settings use Obsidian's plugin data storage. See [privacy details](docs/PRIVACY.md).

## Build and checks

Requires Node.js 22+ and npm. Runtime code has no npm dependencies; Prettier is a pinned development dependency.

```sh
npm ci --ignore-scripts
npm run check
```

`npm run build` concatenates the readable modules in `src/`, copies CSS to `styles.css`, checks JavaScript syntax and generates the offline demo. Commit the generated `main.js`, `styles.css` and `docs/demo.html` with their sources. Do not edit generated files directly. `npm run format` formats source and documentation; rebuild afterward.

Tests exercise a simulated editor/DOM/API, locale changes, metadata and generated-file parity. They do not launch Obsidian or measure frame rate. GitHub Actions repeats these checks and verifies that a rebuild does not change committed generated files.

## Feedback and contribution

Open a GitHub issue with the preset, steps, expected result, Obsidian version, operating system, theme, font and editing mode. Use a minimal sample rather than sharing private notes. For appearance bugs, a screenshot of that sample helps. See [the manual test checklist](docs/QA.md).

Development used AI assistance. This does not establish correctness; reported behavior is limited to the checks described above. Directory review and real-app testing remain separate steps.

## License

MIT — see [LICENSE](LICENSE). Copyright 2026 Errora. MIT permits reuse, modification and redistribution subject to its notice requirements. Character names do not imply ownership of the underlying characters or brands.
