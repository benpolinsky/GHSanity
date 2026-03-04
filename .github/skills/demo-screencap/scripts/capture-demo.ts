import { chromium, Browser, Page } from "playwright";
import fs from "fs";
import path from "path";

/**
 * Minimal Playwright capture script.
 * Edit the `runDemo` steps to perform your flow.
 */
async function runDemo(page: Page) {
    // GH Sanity demo flow per requested pacing
    await page.goto("http://localhost:7878", { waitUntil: "domcontentloaded", timeout: 15000 });
    page.setDefaultTimeout(5000);

    // Wait for notifications, then pause 2s
    await page.waitForSelector("text=notifications", { timeout: 6000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Open Settings, pause 2s, close
    await page.getByLabel("Settings").click().catch(() => {});
    await page.waitForSelector("[data-testid='settings-pane']", { timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(2000);
    await page.getByLabel("Close settings").click().catch(() => {});

    // Open search (palette), wait for input to appear, pause 1s
    const openPalette = async () => {
        await page.keyboard.press("Meta+K");
        await page.evaluate(() => {
            const evt = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
            document.dispatchEvent(evt);
        });
    };

    await openPalette();
    const paletteInput = await page.waitForSelector("input[placeholder^='Search notifications']", {
        timeout: 8000,
        state: "visible",
    });
    await paletteInput.click();
    await page.waitForTimeout(1000);

    // Enter term, wait 2s, then close search
    await paletteInput.fill("adapter");
    await page.waitForTimeout(2000);
    await page.keyboard.press("Escape");
}

async function main() {
    const outDir = path.resolve(process.cwd(), "captures");
    fs.mkdirSync(outDir, { recursive: true });
    const videoPath = path.join(outDir, `demo-${Date.now()}.webm`);

    const browser: Browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1366, height: 768 },
        screen: { width: 1366, height: 768 },
        recordVideo: { dir: outDir, size: { width: 1366, height: 768 } },
    });

    const page = await context.newPage();
    await runDemo(page);

    const video = await page.video()?.path();
    await browser.close();

    if (video) {
        fs.renameSync(video, videoPath);
        console.log(`Saved video: ${videoPath}`);
        console.log(`To GIF: ffmpeg -y -i ${path.basename(videoPath)} -vf "fps=12,scale=960:-1:flags=lanczos" demo.gif`);
    } else {
        console.error("No video was captured");
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
