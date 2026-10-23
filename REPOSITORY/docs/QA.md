# Public beta verification

## Status

This package was prepared on 2026-10-23. Node syntax, simulated editor/DOM tests, metadata, English/Russian labels and reproducible generated files were checked during preparation. See `npm run check` for the executable checks. No Electron/Obsidian session or successful rendered-browser visual test was available during preparation. No FPS, battery or memory benchmark was performed.

`minAppVersion` is conservatively set to 1.14.5, the current stable version reported by the official desktop release feed during preparation. The official submission guidance recommends current stable when a precise minimum is unknown. This is an initial baseline, not evidence that 1.14.5 was tested. Test that baseline before directory submission; do not claim earlier compatibility without checking it.

## Manual checks still needed

Use a disposable vault or test note. Record OS, Obsidian version, theme, font and results. Leave boxes unchecked until a person actually completes them.

- [ ] Install the three release assets on desktop Obsidian 1.14.5 or newer and confirm the plugin loads without console errors.
- [ ] Switch English/Russian, close and reopen each picker, and reload the plugin to check command labels.
- [ ] Select ordinary words, preview in both pickers, cancel, apply, undo and remove a style. Confirm unrelated text is unchanged.
- [ ] Change the note while a picker is open. Applying must abort without editing the new content.
- [ ] Scroll the compact list with the wheel. Move the pointer up and down: it must not scroll on its own. Check search and Escape.
- [ ] Try keyboard navigation, visible focus, Enter/Space on a style and the full palette command.
- [ ] Check a narrow window and the fallback palette if compact menu support is unavailable. The implementation checks `setSubmenu`, `titleEl` and `dom` at runtime; these are undocumented APIs and may change.
- [ ] Inspect all 42 presets in dark and light themes. In particular, test wing placement beside a single character, a short word and a phrase at several font sizes.
- [ ] Check wing styles near both sides of a line and in a narrow callout/table. Confirm the wings do not cover glyphs. Record any container clipping.
- [ ] Check Pulse with several colors in Reading view: one ordered outline wave. Check Sick? seed persistence after reopening and the Chaos toggle.
- [ ] Confirm Pulse/Sick? full effects are limited to Reading view and the picker, and communicate that Live Preview limitation.
- [ ] Try combining accents, Cyrillic, emoji and a selection longer than 180 graphemes. The latter must avoid per-letter DOM.
- [ ] Test Still and OS reduced-motion settings. Compare idle use and a page with many animated phrases; record hardware and observations.
- [ ] Disable/re-enable the plugin with a picker open. Check listener cleanup, unchanged source and restoration of derived letter nodes.
- [ ] Confirm no network traffic initiated by the plugin in Developer Tools. Do not confuse unrelated Obsidian/plugin traffic with Aurora.

## Before the Community directory

Complete the checks above, resolve bugs, add a real screenshot or short recording to the README, run the directory's review/preview checks, and check that `aurora-text` is still an available plugin ID. The package does not claim catalog approval. Follow the current official submission guide rather than an older community-list pull request tutorial.

If a release has already been published, ship fixes as a new version and matching tag/assets instead of silently changing the code attached to an existing tag.

Official references:

- https://docs.obsidian.md/plugins/releasing/submit-plugin
- https://docs.obsidian.md/community-directory/submission-requirements-for-plugins
- https://docs.obsidian.md/community-directory/developer-policies
- https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/desktop-releases.json
