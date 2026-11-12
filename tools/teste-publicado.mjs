/**
 * teste-publicado.mjs — confere um jogo JÁ PUBLICADO (GitHub Pages, ou qualquer URL), de fora.
 *
 *   node tools/teste-publicado.mjs [urlDoJogo]
 *   (padrão: https://adrianocoutinhoreis.github.io/motorGame/Games/numerandus/cabo-de-guerra/)
 *
 * O que só dá para pegar publicado: o servidor do Pages distingue MAIÚSCULAS de minúsculas (o Windows
 * não), então um `error.MP3` chamado de `error.mp3` funciona aqui e some lá; e o que está no ar pode ser
 * de outro commit. Confere:
 *   1. todo arquivo que o `config.js` declara (áudio) e os que o jogo importa responde 200 e não vem vazio;
 *   2. nenhuma requisição falha nem sai do domínio (fonte, imagem ou som da internet);
 *   3. a página abre no menu, sem erro de JavaScript;
 *   4. uma partida de verdade, só com toques: menu → níveis → sorteio → dado → carta → resposta → continuar;
 *   5. a versão no ar tem o sorteio de quem começa (confere o código publicado contra o local).
 */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const URL_JOGO = (process.argv[2] ?? 'https://adrianocoutinhoreis.github.io/motorGame/Games/numerandus/cabo-de-guerra/').replace(/\/?$/, '/');
const ORIGEM = new URL(URL_JOGO).origin;
const PORTA_CDP = 9378;
const NAVEGADORES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
];
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
let passaram = 0; let falharam = 0; const problemas = [];
const checar = (nome, cond, det = '') => {
  if (cond) { passaram++; console.log(`  ok   ${nome}`); }
  else { falharam++; problemas.push(`${nome} — ${det}`); console.log(`  FALHOU  ${nome}\n          ${det}`); }
};

class CDP {
  constructor(url) { this.url = url; this.id = 1; this.pend = new Map(); this.ouvintes = []; }
  async conectar() {
    this.ws = new WebSocket(this.url);
    await new Promise((ok, erro) => { this.ws.addEventListener('open', ok, { once: true }); this.ws.addEventListener('error', erro, { once: true }); });
    this.ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.pend.has(m.id)) { const { ok, erro } = this.pend.get(m.id); this.pend.delete(m.id); if (m.error) erro(new Error(m.error.message)); else ok(m.result); }
      else for (const fn of this.ouvintes) fn(m);
    });
    return this;
  }
  enviar(metodo, params = {}, s) {
    const id = this.id++; const p = { id, method: metodo, params }; if (s) p.sessionId = s;
    return new Promise((ok, erro) => {
      this.pend.set(id, { ok, erro }); this.ws.send(JSON.stringify(p));
      setTimeout(() => { if (this.pend.has(id)) { this.pend.delete(id); erro(new Error('timeout ' + metodo)); } }, 60000);
    });
  }
  ao(fn) { this.ouvintes.push(fn); }
}

console.log(`\nJogo publicado: ${URL_JOGO}`);
const navegador = NAVEGADORES.find((c) => existsSync(c));
if (!navegador) { console.error('nenhum Chrome/Edge encontrado'); process.exit(2); }
const perfil = path.join(os.tmpdir(), `cdg-publicado-${Date.now()}`);
const chrome = spawn(navegador, [
  '--headless=new', `--remote-debugging-port=${PORTA_CDP}`, `--user-data-dir=${perfil}`,
  '--no-first-run', '--disable-gpu', '--mute-audio', '--window-size=1280,860', '--autoplay-policy=no-user-gesture-required',
], { stdio: 'ignore' });

const erros = []; const falhas = []; const foraDoDominio = []; const respostas = new Map();
try {
  let v = null;
  for (let i = 0; i < 60 && !v; i++) { try { v = await (await fetch(`http://127.0.0.1:${PORTA_CDP}/json/version`)).json(); } catch { await esperar(250); } }
  if (!v) throw new Error('o navegador não abriu a porta de depuração');
  const cdp = await new CDP(v.webSocketDebuggerUrl).conectar();
  const { targetId } = await cdp.enviar('Target.createTarget', { url: 'about:blank' });
  const s = (await cdp.enviar('Target.attachToTarget', { targetId, flatten: true })).sessionId;
  for (const d of ['Runtime', 'Log', 'Page', 'Network']) await cdp.enviar(`${d}.enable`, {}, s);
  await cdp.enviar('Network.setCacheDisabled', { cacheDisabled: true }, s);
  cdp.ao((m) => {
    if (m.sessionId && m.sessionId !== s) return;
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') erros.push(`console.error: ${(m.params.args ?? []).map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 200)}`);
    if (m.method === 'Runtime.exceptionThrown') erros.push(`EXCECAO: ${m.params.exceptionDetails.text} ${m.params.exceptionDetails.exception?.description ?? ''}`.slice(0, 240));
    if (m.method === 'Network.requestWillBeSent') {
      const u = m.params.request.url;
      if (!u.startsWith('data:') && !u.startsWith('blob:') && !u.startsWith('about:') && new URL(u).origin !== ORIGEM) foraDoDominio.push(u);
    }
    if (m.method === 'Network.responseReceived') respostas.set(m.params.response.url, m.params.response.status);
    if (m.method === 'Network.loadingFailed' && !m.params.canceled) falhas.push(`${m.params.errorText} ${m.params.requestId}`);
  });
  const aval = async (expr) => {
    const r = await cdp.enviar('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, s);
    if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.text} ${r.exceptionDetails.exception?.description ?? ''}`.slice(0, 300));
    return r.result.value;
  };
  const jg = (corpo) => aval(`(() => { const j = window.jogo; const c = j.cena; ${corpo} })()`);
  const esperarAte = async (corpo, ms = 15000) => {
    const fim = Date.now() + ms;
    while (Date.now() < fim) { if (await jg(`return !!(${corpo});`).catch(() => false)) return true; await esperar(100); }
    return false;
  };
  const garantir = () => aval(`typeof window.__achar === 'function' || window.eval(${JSON.stringify(`
    window.__achar = (raiz, pred) => { let r = null; const v = (n) => { if (r) return; if (pred(n)) { r = n; return; } for (const f of (n.filhos || [])) v(f); }; v(raiz); return r; }; true;`)})`);
  const paraTela = (lx, ly) => aval(`(() => { const st = window.jogo.stage; const r = st.canvas.getBoundingClientRect();
    const cx = ${lx} * st.escala + st.deslocX; const cy = ${ly} * st.escala + st.deslocY; let x; let y;
    if (st.giro === 90) { x = r.width - cy; y = cx; } else if (st.giro === -90) { x = cy; y = r.height - cx; } else { x = cx; y = cy; }
    return { x: Math.round(r.left + x), y: Math.round(r.top + y) }; })()`);
  const mouse = (type, c, extra = {}) => cdp.enviar('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1, pointerType: 'mouse', ...extra }, s);
  const tocarNo = async (busca) => {
    await garantir();
    const c = await jg(`const no = (${busca}); if (!no) return null; const p = no.localParaGlobal((no.largura ?? 0) / 2, (no.altura ?? 0) / 2); return { x: p.x, y: p.y };`);
    if (!c) return false;
    const t = await paraTela(c.x, c.y);
    await mouse('mousePressed', t, { buttons: 1 }); await esperar(40); await mouse('mouseReleased', t, { buttons: 0 }); await esperar(120);
    return true;
  };
  const BTN = (re) => `window.__achar(c, (n) => typeof n.rotulo === 'string' && ${re}.test(n.rotulo) && n.visivelMundo)`;

  // ------------------------------------------------ 1. os arquivos, com a caixa exata
  console.log('\n1. Os arquivos que o jogo declara, pedidos ao servidor publicado');
  await cdp.enviar('Page.navigate', { url: URL_JOGO }, s);
  let noMenu = false;
  for (let i = 0; i < 80 && !noMenu; i++) { noMenu = await aval("!!(window.jogo && window.jogo.cena && window.jogo.cena.constructor.name === 'MenuScreen')").catch(() => false); if (!noMenu) await esperar(250); }
  checar('a página abre e chega ao MENU', noMenu, JSON.stringify([...respostas].filter(([, st]) => st >= 400)));
  const arquivos = await aval(`(async () => {
    const cm = await import('./src/config.js');
    const cfg = cm.default ?? cm.config ?? Object.values(cm)[0];
    const lista = (cfg.assets ?? []).map((a) => a.src);
    const rel = [];
    for (const src of lista) {
      const u = new URL(src, location.href).href;
      try { const r = await fetch(u, { cache: 'no-store' }); const b = await r.arrayBuffer(); rel.push({ src, status: r.status, bytes: b.byteLength }); }
      catch (e) { rel.push({ src, status: 0, bytes: 0, erro: String(e) }); }
    }
    return rel;
  })()`);
  const ruins = arquivos.filter((a) => a.status !== 200 || a.bytes < 200);
  checar(`${arquivos.length} arquivos de áudio declarados: todos respondem 200 e têm conteúdo`, ruins.length === 0, JSON.stringify(ruins.slice(0, 5)));
  const locais = ['src/main.js', 'src/config.js', 'src/regras.js', 'src/desenho.js', 'src/scenes/GameScene.js', 'engine/index.js', 'engine/ui/Background.js'];
  const rel2 = await aval(`(async () => { const out = []; for (const p of ${JSON.stringify(locais)}) { const r = await fetch(new URL(p, location.href).href, { cache: 'no-store' }); out.push({ p, status: r.status, txt: await r.text() }); } return out; })()`);
  checar('os módulos do jogo e do motor respondem 200', rel2.every((x) => x.status === 200), JSON.stringify(rel2.filter((x) => x.status !== 200).map((x) => x.p)));

  // ------------------------------------------------ 5. a versão no ar é a do repositório
  const igual = (p) => {
    const noAr = rel2.find((x) => x.p === p)?.txt ?? '';
    const local = readFileSync(path.join(RAIZ, 'Games/numerandus/cabo-de-guerra', p), 'utf8');
    return noAr.replace(/\r\n/g, '\n') === local.replace(/\r\n/g, '\n');
  };
  const desatualizados = locais.filter((p) => !igual(p));
  checar('o código no ar é IGUAL ao do repositório local (GameScene, regras, config, desenho, motor)', desatualizados.length === 0, `diferem: ${desatualizados.join(', ')} (falta dar push ou o Pages ainda está publicando)`);

  // ------------------------------------------------ 4. uma partida de verdade
  console.log('\n2. Uma partida de verdade, só com toques, no site publicado');
  await tocarNo(BTN('/^jogar$/i'));
  checar('JOGAR leva à escolha de nível', await esperarAte("c.constructor.name === 'LevelSelectScreen'", 6000));
  await esperar(900);
  await tocarNo("window.__achar(c, (n) => n.nivel && n.nivel.id === 1)");
  checar('o cartão FÁCIL abre a partida, que começa pelo SORTEIO', await esperarAte("c.constructor.name === 'GameScene' && c.fase === 'sorteio'", 8000));
  await jg("c.sorteioDeTeste = { crianca: 6, computador: 1 }; c.regras.rolarMs = 200; return 1;");
  await tocarNo('c.botaoDado');
  checar('o sorteio roda e a criança começa (6 × 1)', await esperarAte("c.fase === 'dado' && c.vez.quem === 'crianca'", 10000));
  await tocarNo('c.botaoDado');
  checar('o dado rola e a carta abre', await esperarAte("c.fase === 'carta' && c.painel.alpha >= 1", 10000));
  await tocarNo('c.painel.botoes.find((b) => b.opcao && b.opcao.valor === c.vez.carta.certa)');
  checar('a resposta certa mostra o retorno', await esperarAte("c.fase === 'retorno'", 5000));
  await tocarNo("c.painel.botoes.find((b) => b.rotulo === 'CONTINUAR')");
  checar('CONTINUAR: a ficha anda e a vez passa ao computador', await esperarAte("c.vez.quem === 'computador' && c.pos < 7", 12000));

  // ------------------------------------------------ 2/3. rede e erros
  console.log('\n3. Rede e erros');
  const maus = [...respostas].filter(([, st]) => st >= 400);
  checar('nenhuma requisição respondeu com erro (404, 403…)', maus.length === 0, JSON.stringify(maus.slice(0, 5)));
  checar('nenhuma requisição falhou', falhas.length === 0, falhas.slice(0, 4).join(' | '));
  checar('nada sai do domínio (fonte, imagem ou som da internet)', foraDoDominio.length === 0, foraDoDominio.slice(0, 4).join(' | '));
  checar('nenhum erro de JavaScript', erros.length === 0, erros.slice(0, 4).join(' | '));
} catch (e) {
  falharam++; problemas.push(`o teste quebrou: ${e.stack ?? e}`);
  console.log(`\n  FALHOU  o teste quebrou: ${e.stack ?? e}`);
} finally {
  chrome.kill(); await esperar(500); await rm(perfil, { recursive: true, force: true }).catch(() => {});
}
console.log('\n========================================================');
console.log(`${passaram} passaram, ${falharam} falharam`);
if (problemas.length) { console.log('O que falhou:'); for (const p of problemas) console.log(`  · ${p}`); }
process.exit(falharam ? 1 : 0);
