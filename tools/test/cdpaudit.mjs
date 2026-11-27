import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { setTimeout as wait } from 'node:timers/promises';
const [outDir, widthArg, worldJson, settingsJson = '', name = 'shot', route = '#/jogo'] = process.argv.slice(2);
const width = Number(widthArg); mkdirSync(outDir, { recursive: true });
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${process.cwd()}/${outDir}/p-${port}`, '--no-first-run', '--use-angle=swiftshader', `--window-size=${width},900`, 'about:blank'], { stdio: 'ignore' });
let target; for (let i = 0; i < 150 && !target; i++) { await wait(200); try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', ({ data }) => { const m = JSON.parse(data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
await send('Page.navigate', { url: 'http://127.0.0.1:8123/' }); await wait(1000);
await ev(`localStorage.clear(); localStorage.setItem('mundo-do-aprender:world', ${JSON.stringify(worldJson)}); ${settingsJson ? `localStorage.setItem('mundo-do-aprender:settings', ${JSON.stringify(settingsJson)});` : ''} true`);
await send('Page.navigate', { url: 'http://127.0.0.1:8123/' + route }); await wait(500);
await send('Page.reload', {}); await wait(4500); // recarrega: as preferências só são aplicadas ao abrir a página
const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); writeFileSync(`${outDir}/${name}.png`, Buffer.from(s.result.data, 'base64'));
console.log(name, await ev(`document.documentElement.scrollWidth + 'x' + document.documentElement.scrollHeight + ' (viewport ${width})'`));
ws.close(); chrome.kill(); process.exit(0);
