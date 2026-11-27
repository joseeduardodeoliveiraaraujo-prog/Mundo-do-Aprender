// Uso: node cdpquest.mjs <saida> <largura> <lugar1,lugar2,...> [mapa-inicial]
// Joga missões inteiras com um "jogador automático" e registra o que acontece.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { setTimeout as wait } from 'node:timers/promises';

const [outDir, widthArg = '1280', placesArg = '', startMap = 'house', seedArg = ''] = process.argv.slice(2);
const width = Number(widthArg);
mkdirSync(outDir, { recursive: true });
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${process.cwd()}/${outDir}/profile-${port}`,
  '--no-first-run', '--use-angle=swiftshader', `--window-size=${width},900`, 'about:blank',
], { stdio: 'ignore' });
let target;
for (let i = 0; i < 50 && !target; i++) {
  await wait(200);
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch {}
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

// Um passo do jogador automático, rodado dentro da página.
const STEP = `(() => {
  window.__tried ??= {};
  const dialog = document.querySelector('.quest-dialog');
  const hud = document.querySelector('.quest-hud');
  if (dialog && !dialog.hidden) {
    const line = dialog.querySelector('.quest-dialog__text').textContent;
    const options = [...dialog.querySelectorAll('.quest-option')];
    if (options.length) {
      const key = line + '|' + options.map((o) => o.textContent).join(',');
      const tried = window.__tried[key] ?? 0;
      window.__tried[key] = tried + 1;
      const pick = options[tried % options.length];
      pick.click();
      return 'escolhe "' + pick.textContent.trim() + '" ← ' + line.slice(0, 80);
    }
    dialog.querySelector('.quest-dialog__actions button')?.click();
    return 'continua ← ' + dialog.querySelector('.quest-dialog__name').textContent + ': ' + line.slice(0, 90);
  }
  if (hud && !hud.hidden) {
    const buttons = [...hud.querySelectorAll('.quest-hud__button')];
    const carrying = hud.querySelector('.quest-hud__carrying').textContent;
    const button = buttons.find((b) => carrying.startsWith('Carregando') ? b.textContent.startsWith('Levar') : true);
    if (!button) return 'hud sem botão: ' + hud.textContent.slice(0, 100);
    button.click();
    return 'anda: ' + button.textContent.trim() + ' | ' + hud.querySelector('.quest-hud__goal').textContent.slice(0, 60);
  }
  return 'FIM';
})()`;

for (const place of placesArg.split(',').filter(Boolean)) {
  if (place.startsWith('@')) { // trocar de mapa por uma porta
    await evalJs(`(() => { document.querySelector('.world__places').open = true; [...document.querySelectorAll('.world__places-list button')].find((b) => b.textContent.includes(${JSON.stringify(place.slice(1))}))?.click(); })()`);
    for (let i = 0; i < 40; i++) { await wait(500); if ((await text('.world__near')) !== null && (await text('h1')) !== (await text('h1'))) break; }
    await wait(9000);
    logs.push(`== porta ${place.slice(1)} → ${await text('h1')}`);
    continue;
  }
  logs.push(`== ${place}`);
  const before = await text('.world__stars');
  await evalJs(`(() => { document.querySelector('.world__places').open = true; [...document.querySelectorAll('.world__places-list button')].find((b) => b.textContent === 'Ir até: ' + ${JSON.stringify(place)})?.click(); })()`);
  for (let i = 0; i < 40 && !String(await text('.world__near')).includes(place); i++) await wait(500);
  await evalJs(`document.querySelector('.world__actions .button')?.click(); true`);
  await wait(1500);
  let steps = 0; let shotTaken = false;
  for (; steps < 60; steps++) {
    const result = await evalJs(STEP);
    if (result === 'FIM') break;
    logs.push('   ' + result);
    if (!shotTaken && (result.startsWith('anda') || result.startsWith('escolhe'))) { await shot(`q-${place.replace(/\W/g, '')}-${width}`); shotTaken = true; }
    await wait(result.startsWith("anda") ? 5000 : 400);
  }
  logs.push(`   estrelas: ${before} → ${await text('.world__stars')} | Noa: ${await text('.companion .companion__speech')}`);
}
writeFileSync(`${outDir}/log.txt`, logs.join('\n'));
console.log(logs.join('\n'));
ws.close(); chrome.kill(); process.exit(0);
