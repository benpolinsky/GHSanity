# Demo Screencap Skill

Quick reference for using the demo-screencap skill to script Playwright captures and produce GIFs for any web app. The bundled script is pre-filled with a GH Sanity flow (localhost:7878); adjust `runDemo` for other targets.

## How to use
- Edit `scripts/capture-demo.ts` `runDemo()` steps to match the flow.
- Run: `pnpm exec playwright install --with-deps chromium` (first time), then `pnpm tsx .github/skills/demo-screencap/scripts/capture-demo.ts`.
- Convert to GIF: `ffmpeg -y -i demo.webm -vf "fps=12,scale=960:-1:flags=lanczos" demo.gif`.

## Example prompts
- "Capture a GIF showing: load the dashboard, open the command palette, search 'reports', toggle filters off, and open the first result."
- "Record clearing app cache: open settings, click clear cache, then run a search for 'bug' with drafts off."
- "Show filter toggle: run a search with filters on, flip to ignore filters, and highlight the result count change in the status bar."
- "Walk through an error state: trigger an action that shows a toast, then resolve it and show the success state."