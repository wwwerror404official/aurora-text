# Privacy and data handling

Aurora Text runs locally. It has no service account, API key, analytics, telemetry, network request or updater. All CSS and image resources are bundled; SVG images are embedded as data URLs.

The plugin reads the active editor's current document to locate the selected text, recognize Aurora wrappers, and reject an edit if the document changed while the picker was open. A captured document is held in memory by that picker. Previewing does not save or transmit it. Applying or removing a style writes only the captured range through the Obsidian Editor API.

Settings saved by `saveData` include the last preset ID, picker mode, hover animation preference, pulse color and interface language. Selected text and document content are not settings. Aurora does not enumerate the vault, create external files, run shell commands or load external scripts.

Errors may be logged to the local developer console. Do not post private note contents when reporting a bug. The offline demo likewise sends nothing; it operates on text you enter into that page.

These statements describe the included source. Automated pattern checks are useful regression guards, not a security certification or a substitute for reviewing code changes.
