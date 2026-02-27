name: demo-screencap
description: "Generate Playwright scripts from a user prompt to capture web app demos as WebM and convert to GIF; use when asked to produce or script a UI screencap."
---

# Demo Screencap Skill

Use this skill when asked to produce a demo screencap/GIF of a web app or to write a Playwright script that records a flow.

## Workflow (do this each time)

1) Clarify the scenario
- Extract target URL, steps to show, feature names, credentials/token hints, viewport, desired duration, and output size (GIF dimensions/fps).
- If anything is missing, propose defaults: URL http://localhost:3000, viewport 1366x768, GIF 960px width @12fps, duration under 20s.

2) Plan the path
- List the exact UI steps: load app, navigate key menus, run searches or actions the user cares about, toggle settings, show state changes, and any clicks to external links as needed.
- Include deliberate waits after navigation or state changes; prefer `waitForSelector` over raw timeouts when reliable. Use short `waitForTimeout` (300-800ms) only for micro pauses.

3) Draft the Playwright script
- Start from scripts/capture-demo.ts and edit `runDemo` for the requested flow; keep headless=true and recordVideo enabled.
- Keep selectors resilient: text selectors for stable labels, `getByRole` where possible; avoid brittle nth-child.
- Keep the script under ~60 lines in `runDemo` for readability; comment rare/complex waits.
- Ensure the recording directory exists (captures/) and print the ffmpeg command to turn the .webm into a GIF.

4) Convert to GIF
- After running the script (`pnpm exec playwright install --with-deps chromium` if browsers missing), run ffmpeg:
  - `ffmpeg -y -i demo.webm -vf "fps=12,scale=960:-1:flags=lanczos" demo.gif`
- If playback is too fast/slow, adjust fps; if large, reduce scale or fps.

5) Hand off
- Provide the exact run command (e.g., `pnpm tsx .github/skills/demo-screencap/scripts/capture-demo.ts`).
- Mention output path and the ffmpeg conversion command.
- If credentials are needed, instruct to set env vars (e.g., NEXT_GH_TOKEN) and avoid hardcoding secrets.

## Bundled Resource
- scripts/capture-demo.ts — Minimal Playwright capture template with recording enabled; edit `runDemo` to match the requested flow.

## Notes
- Keep ASCII only; no non-ASCII in scripts.
- Prefer short, deterministic flows; avoid long waits and flakiness. Reload only if necessary.
- If Playwright is unavailable, describe manual steps to capture with screen recorders as fallback.
