// Uso: node cdpclose.mjs <saida> <largura> <lugar> <mapa> <progresso-json> <ações separadas por ;>
// ações: btn:Rótulo · tap:x,y · drag:x,y>x,y · rub:x,y · shot:nome · wait:ms (coordenadas do jogo, 192x128)
// Joga missões inteiras com um "jogador automático" e registra o que acontece.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { setTimeout as wait } from 'node:timers/promises';

const [outDir, widthArg = '1280', place = '', startMap = 'house', seedArg = '', script = ''] = process.argv.slice(2);
const width = Number(widthArg);
mkdirSync(outDir, { recursive: true });
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${process.cwd()}/${outDir}/profile-${port}`,
  '--no-first-run', '--use-angle=swiftshader', `--window-size=${width},900`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'inherit'] });
let target;
for (let i = 0; i < 150 && !target; i++) {
  await wait(200);
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch (e) { if (i % 20 === 0) console.log("aguardando", e.cause?.code ?? e.message); }
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map(); const logs = [];
ws.addEventListener('message', ({ data }) => {
  const msg = JSON.parse(data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  if (msg.method === 'Runtime.consoleAPICalled') logs.push(`console.${msg.params.type}: ${msg.params.args.map((a) => a.value ?? a.description).join(' ')}`);
  if (msg.method === 'Runtime.exceptionThrown') logs.push(`EXCEPTION: ${msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text}`);
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
await send('Page.navigate', { url: 'http://127.0.0.1:8123/' });
await wait(1200);
const start = startMap === 'neighborhood' ? { map: 'neighborhood', x: 17, y: 11, facing: 'down' } : startMap === 'school' ? { map: 'school', x: 8, y: 7, facing: 'up' } : { map: 'house', x: 6, y: 5, facing: 'down' };
await evalJs(`localStorage.setItem('mundo-do-aprender:world', ${JSON.stringify(JSON.stringify(start))}); true`);
if (seedArg) {
  const seed = JSON.parse(seedArg);
  const progress = Object.fromEntries(Object.entries(seed).map(([m, ids]) => [m, { completed: ids, lastActivityId: null, updatedAt: new Date().toISOString() }]));
  await evalJs(`localStorage.setItem('mundo-do-aprender:progress', ${JSON.stringify(JSON.stringify(progress))}); true`);
}
await send('Page.navigate', { url: 'http://127.0.0.1:8123/#/jogo' });
await wait(3500);
const text = (sel) => evalJs(`document.querySelector(${JSON.stringify(sel)})?.textContent?.trim()`);
const shot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(`${outDir}/${name}.png`, Buffer.from(s.result.data, 'base64')); };


const log = (line) => { logs.push(line); console.log(line); };
const hudState = () => evalJs(`(() => { const h = document.querySelector('.quest-hud'); return h.hidden ? 'hud oculto' : h.querySelector('.quest-hud__note')?.textContent + ' | feitos: ' + h.querySelectorAll('.is-done').length; })()`);
const clickHud = (label) => evalJs(`(() => { const b = [...document.querySelectorAll('.quest-hud__button')].find((x) => x.textContent.trim() === ${JSON.stringify(label)}); b?.click(); return Boolean(b); })()`);
const dialogLine = () => evalJs(`(() => { const d = document.querySelector('.quest-dialog'); return d.hidden ? null : d.querySelector('.quest-dialog__text').textContent; })()`);
const continueDialog = () => evalJs(`document.querySelector('.quest-dialog__actions button')?.click(); true`);
const rect = async () => JSON.parse(await evalJs(`JSON.stringify(document.querySelector('.world__closeup canvas').getBoundingClientRect())`));
const SIZE = Number(process.env.SCENE_W ?? 192); const toPage = (r, x, y) => ({ x: r.left + x * r.width / SIZE, y: r.top + y * r.height / (SIZE * 2 / 3) });
const mouse = (type, p) => send('Input.dispatchMouseEvent', { type, x: p.x, y: p.y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 });
const drag = async (from, to) => {
  const r = await rect(); const a = toPage(r, ...from); const b = toPage(r, ...to);
  await mouse('mouseMoved', a); await mouse('mousePressed', a);
  for (let i = 1; i <= 10; i++) { await mouse('mouseMoved', { x: a.x + (b.x - a.x) * i / 10, y: a.y + (b.y - a.y) * i / 10 }); await wait(30); }
  await mouse('mouseReleased', b);
};


const tap = async (x, y) => { const r = await rect(); const p = toPage(r, x, y); await mouse('mouseMoved', p); await mouse('mousePressed', p); await mouse('mouseReleased', p); };
const rub = async (x, y) => { const r = await rect(); const c = toPage(r, x, y); await mouse('mouseMoved', c); await mouse('mousePressed', c);
  for (let i = 0; i < 9; i++) { await mouse('mouseMoved', { x: c.x + (i % 2 ? -1 : 1) * r.width * 12 / 192, y: c.y }); await wait(120); }
  await mouse('mouseReleased', c); };
await evalJs(`(() => { document.querySelector('.world__places').open = true; [...document.querySelectorAll('.world__places-list button')].find((b) => b.textContent === 'Ir até: ' + ${JSON.stringify(place)})?.click(); })()`);
for (let i = 0; i < 30 && !String(await text('.world__near')).includes(place); i++) await wait(500);
await evalJs(`document.querySelector('.world__actions .button')?.click(); true`);
await wait(800);
log('fala: ' + await dialogLine());
await continueDialog();
await wait(2500);
for (const step of script.split(';').filter(Boolean)) {
  const [kind, arg] = [step.slice(0, step.indexOf(':')), step.slice(step.indexOf(':') + 1)];
  if (kind === 'shot') { await shot(arg); continue; }
  if (kind === 'wait') { await wait(Number(arg)); continue; }
  if (kind === 'btn') log(`${step}: ${await clickHud(arg)}`);
  if (kind === 'stop') { await evalJs(`document.querySelector('.quest-hud__stop').click(); true`); await wait(800); log('parou: cena oculta=' + await evalJs(`document.querySelector('.world__closeup').hidden`) + ' hud oculto=' + await evalJs(`document.querySelector('.quest-hud').hidden`) + ' | Noa: ' + await text('.companion .companion__speech')); continue; }
  if (kind === 'tap') { log(step); await tap(...arg.split(',').map(Number)); }
  if (kind === 'rub') { log(step); await rub(...arg.split(',').map(Number)); }
  if (kind === 'drag') { log(step); const [a, b] = arg.split('>').map((p) => p.split(',').map(Number)); await drag(a, b); }
  await wait(1800);
  log('  → ' + await hudState());
}
log('fala final: ' + await dialogLine());
await shot('final');
await continueDialog(); await wait(800);
log('cena fechada: ' + await evalJs(`document.querySelector('.world__closeup').hidden`) + ' | ' + await text('.world__stars') + ' | Noa: ' + await text('.companion .companion__speech'));
const errors = logs.filter((l) => /EXCEPTION|console.error|console.warn/.test(l)); if (errors.length) console.log(errors.join('\n'));
writeFileSync(`${outDir}/log.txt`, logs.join('\n'));
ws.close(); chrome.kill(); process.exit(0);
