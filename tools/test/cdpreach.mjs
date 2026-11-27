// Uso: node cdpreach.mjs <saida> <mapa> <x> <y>
// Confere que o Noa consegue chegar a todos os lugares de um mapa pelo botão "Ir até".
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { setTimeout as wait } from 'node:timers/promises';

const [outDir, map, x, y] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${process.cwd()}/${outDir}/p-${port}`, '--no-first-run', '--use-angle=swiftshader', '--window-size=1280,900', 'about:blank'], { stdio: 'ignore' });
let target; for (let i = 0; i < 150 && !target; i++) { await wait(200); try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map(); const errors = [];
ws.addEventListener('message', ({ data }) => { const m = JSON.parse(data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description); });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true })).result?.result?.value;
await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://127.0.0.1:8123/' }); await wait(800);
await ev(`localStorage.clear(); localStorage.setItem('mundo-do-aprender:world', ${JSON.stringify(JSON.stringify({ map, x: Number(x), y: Number(y), facing: 'down' }))}); true`);
await send('Page.navigate', { url: 'http://127.0.0.1:8123/#/jogo' }); await wait(500); await send('Page.reload', {}); await wait(3500);
const labels = await ev(`[...document.querySelectorAll('.world__places-list button')].map((b) => b.textContent).filter((t) => t.startsWith('Ir até: ')).map((t) => t.slice(8))`);
const failed = [];
for (const label of labels) {
  await ev(`(() => { document.querySelector('.world__places').open = true; [...document.querySelectorAll('.world__places-list button')].find((b) => b.textContent === 'Ir até: ' + ${JSON.stringify(label)})?.click(); })()`);
  let ok = false;
  // chegou = "Perto de você" mostra o lugar, ou Noa disse a fala dele (lugares colados a outro, como a janela)
  for (let i = 0; i < 75 && !ok; i++) {
    await wait(400);
    ok = await ev(`(() => { const near = document.querySelector('.world__near').textContent; return near.endsWith(${JSON.stringify(label)}); })()`);
  }
  if (!ok) failed.push(`${label} (perto: ${String(await ev(`document.querySelector('.world__near').textContent`)).replace('Perto de você: ', '')}; Noa disse: ${await ev(`document.querySelector('.companion__speech').textContent`)})`);
  // fecha a fala que o lugar abriu (missão não começa: só chegar)
  await ev(`document.querySelector('.quest-dialog__actions button')?.click(); true`);
}
console.log(`${map}: ${labels.length - failed.length}/${labels.length} lugares alcançados${failed.length ? ' | não alcançados: ' + failed.join(', ') : ''}${errors.length ? ' | erros: ' + errors.join(' | ') : ''}`);
ws.close(); chrome.kill(); process.exit(0);
