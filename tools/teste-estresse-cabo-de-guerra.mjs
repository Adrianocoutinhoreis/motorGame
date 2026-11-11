/**
 * teste-estresse-cabo-de-guerra.mjs — o que o teste de jogabilidade não cobre, no Cabo de Guerra.
 *
 *   A. TELAS: o jogo em 6 tamanhos de janela (desktop, notebook, tablet deitado e em pé, celular em pé
 *      e deitado): abre, a partida e a carta cabem, nenhum erro, e o MENOR alvo de toque, medido em
 *      pixels de tela, aparece no relatório (a regra é 44 px; o projeto pede 64 px lógicos).
 *   B. MARATONA: 4 partidas inteiras em cada nível (12), só com gestos, a criança acertando 90%, 60% e
 *      30% das cartas; o computador conferido ora bem, ora mal. Em cada uma: terminou, o número que
 *      chega ao AVA bate com o jogado, nenhuma carta repetiu, nenhum erro de JavaScript e o Watchdog
 *      não disparou.
 *   C. TOQUES EM RAJADA: 8 toques seguidos no dado, 6 na resposta e 5 no CONTINUAR contam UMA jogada só.
 *   D. TROCA DE ABA: o dado rolando, a aba perde o foco por 3 s e volta; a partida segue.
 *
 * Só usa ponteiro (Input.dispatchMouseEvent). Precisa de `node tools/serve.mjs 8099` rodando.
 *   node tools/teste-estresse-cabo-de-guerra.mjs [porta]
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORTA = Number(process.argv[2]) || 8099;
const PORTA_CDP = 9375;
const SAIDA = path.join(RAIZ, '.capturas', 'cabo-de-guerra-estresse');
const JOGO_URL = `http://127.0.0.1:${PORTA}/Games/numerandus/cabo-de-guerra/`;
const NAVEGADORES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

class CDP {
  constructor(url) { this.url = url; this.id = 1; this.pend = new Map(); this.ouvintes = []; }
  async conectar() {
    this.ws = new WebSocket(this.url);
    await new Promise((ok, erro) => {
      this.ws.addEventListener('open', ok, { once: true });
      this.ws.addEventListener('error', erro, { once: true });
    });
    this.ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.pend.has(m.id)) {
        const { ok, erro } = this.pend.get(m.id);
        this.pend.delete(m.id);
        if (m.error) erro(new Error(m.error.message)); else ok(m.result);
      } else for (const fn of this.ouvintes) fn(m);
    });
    return this;
  }
  enviar(metodo, params = {}, s) {
    const id = this.id++;
    const p = { id, method: metodo, params };
    if (s) p.sessionId = s;
    return new Promise((ok, erro) => {
      this.pend.set(id, { ok, erro });
      this.ws.send(JSON.stringify(p));
      setTimeout(() => { if (this.pend.has(id)) { this.pend.delete(id); erro(new Error('timeout ' + metodo)); } }, 30000);
    });
  }
  ao(fn) { this.ouvintes.push(fn); }
}

let passaram = 0; let falharam = 0; const problemas = []; const notas = [];
const checar = (nome, cond, det = '') => {
  if (cond) { passaram++; console.log(`  ok   ${nome}`); }
  else { falharam++; problemas.push(`${nome} — ${det}`); console.log(`  FALHOU  ${nome}\n          ${det}`); }
};
const nota = (txt) => { notas.push(txt); console.log(`  nota ${txt}`); };

const navegador = NAVEGADORES.find((c) => existsSync(c));
if (!navegador) { console.error('nenhum Chrome/Edge encontrado'); process.exit(2); }
mkdirSync(SAIDA, { recursive: true });
const perfil = path.join(os.tmpdir(), `cdg-estresse-${Date.now()}`);
const chrome = spawn(navegador, [
  '--headless=new', `--remote-debugging-port=${PORTA_CDP}`, `--user-data-dir=${perfil}`,
  '--no-first-run', '--disable-gpu', '--mute-audio', '--window-size=1280,860',
  '--autoplay-policy=no-user-gesture-required',
], { stdio: 'ignore' });

const erros = []; const avisos = [];
try {
  let v = null;
  for (let i = 0; i < 60 && !v; i++) {
    try { v = await (await fetch(`http://127.0.0.1:${PORTA_CDP}/json/version`)).json(); } catch { await esperar(250); }
  }
  if (!v) throw new Error('o navegador não abriu a porta de depuração');
  const cdp = await new CDP(v.webSocketDebuggerUrl).conectar();
  const { targetId } = await cdp.enviar('Target.createTarget', { url: 'about:blank' });
  const s = (await cdp.enviar('Target.attachToTarget', { targetId, flatten: true })).sessionId;
  await cdp.enviar('Runtime.enable', {}, s);
  await cdp.enviar('Log.enable', {}, s);
  await cdp.enviar('Page.enable', {}, s);
  cdp.ao((m) => {
    if (m.sessionId && m.sessionId !== s) return;
    if (m.method === 'Runtime.consoleAPICalled') {
      const txt = (m.params.args ?? []).map((a) => a.value ?? a.description ?? '').join(' ');
      if (m.params.type === 'error') erros.push(`console.error: ${txt.slice(0, 200)}`);
      else if (m.params.type === 'warning') avisos.push(txt.slice(0, 200));
    }
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') erros.push(`log: ${m.params.entry.text} ${m.params.entry.url ?? ''}`.slice(0, 220));
    if (m.method === 'Runtime.exceptionThrown') erros.push(`EXCECAO: ${m.params.exceptionDetails.text} ${m.params.exceptionDetails.exception?.description ?? ''}`.slice(0, 240));
  });

  const aval = async (expr) => {
    const r = await cdp.enviar('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, s);
    if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.text} ${r.exceptionDetails.exception?.description ?? ''}`.slice(0, 300));
    return r.result.value;
  };
  const jg = (corpo) => aval(`(() => { const j = window.jogo; const c = j.cena; ${corpo} })()`);
  const captura = async (nome) => {
    const r = await cdp.enviar('Page.captureScreenshot', { format: 'png' }, s);
    writeFileSync(path.join(SAIDA, `${nome}.png`), Buffer.from(r.data, 'base64'));
  };
  const esperarAte = async (corpo, ms = 15000, passo = 80) => {
    const fim = Date.now() + ms;
    while (Date.now() < fim) {
      if (await jg(`return !!(${corpo});`).catch(() => false)) return true;
      await esperar(passo);
    }
    return false;
  };
  const garantir = () => aval(`typeof window.__achar === 'function' || window.eval(${JSON.stringify(`
    window.__achar = (raiz, pred) => { let r = null;
      const v = (n) => { if (r) return; if (pred(n)) { r = n; return; } for (const f of (n.filhos || [])) v(f); };
      v(raiz); return r; }; true;`)})`);
  const paraTela = (lx, ly) => aval(`(() => {
    const st = window.jogo.stage; const r = st.canvas.getBoundingClientRect();
    const cx = ${lx} * st.escala + st.deslocX; const cy = ${ly} * st.escala + st.deslocY;
    let x; let y;
    if (st.giro === 90) { x = r.width - cy; y = cx; } else if (st.giro === -90) { x = cy; y = r.height - cx; } else { x = cx; y = cy; }
    return { x: Math.round(r.left + x), y: Math.round(r.top + y) };
  })()`);
  const mouse = (type, c, extra = {}) => cdp.enviar('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1, pointerType: 'mouse', ...extra }, s);
  const tocarLogico = async (lx, ly, pausa = 90) => {
    const c = await paraTela(lx, ly);
    await mouse('mousePressed', c, { buttons: 1 });
    await esperar(40);
    await mouse('mouseReleased', c, { buttons: 0 });
    if (pausa) await esperar(pausa);
  };
  const centro = async (busca) => {
    await garantir();
    return jg(`const no = (${busca}); if (!no) return null;
      const p = no.localParaGlobal((no.largura ?? 0) / 2, (no.altura ?? 0) / 2); return { x: p.x, y: p.y };`);
  };
  const tocarNo = async (busca, pausa) => {
    const c = await centro(busca);
    if (!c) return false;
    await tocarLogico(c.x, c.y, pausa);
    return true;
  };
  const BTN = (re) => `window.__achar(c, (n) => typeof n.rotulo === 'string' && ${re}.test(n.rotulo) && n.visivelMundo)`;
  const OPCAO_CERTA = 'c.painel.botoes.find((b) => b.opcao && b.opcao.valor === c.vez.carta.certa)';
  const OPCAO_ERRADA = "c.painel.botoes.find((b) => b.opcao && b.opcao.valor !== c.vez.carta.certa && b.estilo === 'opcao')";
  const CONFERIR = (certo) => `c.painel.botoes.find((b) => b.estilo === '${certo ? 'sim' : 'nao'}')`;
  const CONTINUAR = "c.painel.botoes.find((b) => b.rotulo === 'CONTINUAR')";
  const RAPIDO = 'c.regras.rolarMs = 100; c.regras.passoMs = 60; c.regras.cpuEsperaMs = 80; c.regras.falaMaxMs = 0;';

  /** O sorteio de quem começa, forçado a favor da criança (os roteiros daqui supõem que ela começa). */
  const passarSorteio = async () => {
    await jg('c.sorteioDeTeste = { crianca: 6, computador: 1 }; c.regras.rolarMs = 100; return 1;');
    await tocarNo('c.botaoDado');
    return esperarAte("c.fase === 'dado' && c.vez.quem === 'crianca'", 8000);
  };
  const abrirPartida = async (id) => {
    await cdp.enviar('Page.navigate', { url: JOGO_URL }, s);
    await esperar(1500);
    if (!(await esperarAte("c && c.constructor.name === 'MenuScreen'", 15000))) return false;
    await esperar(700);
    await tocarNo(BTN('/^jogar$/i'));
    if (!(await esperarAte("c.constructor.name === 'LevelSelectScreen'", 5000))) return false;
    await esperar(900); // os cartões de nível entram em fila (80 ms cada + 360 ms): o 3º só aceita toque depois disso
    await tocarNo(`window.__achar(c, (n) => n.nivel && n.nivel.id === ${id})`);
    if (!(await esperarAte("c.constructor.name === 'GameScene'", 6000))) return false;
    return passarSorteio();
  };

  // =========================================================== A. TELAS
  console.log('\nA. O jogo em 6 tamanhos de janela');
  const TAMANHOS = [
    ['desktop 1920×1080', 1920, 1080, false], ['notebook 1366×768', 1366, 768, false],
    ['tablet deitado 1024×768', 1024, 768, true], ['tablet em pé 768×1024', 768, 1024, true],
    ['celular em pé 390×844', 390, 844, true], ['celular deitado 844×390', 844, 390, true],
  ];
  const menores = [];
  for (const [nome, w, h, mobile] of TAMANHOS) {
    const antes = erros.length;
    await cdp.enviar('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile }, s);
    const ok = await abrirPartida(1);
    if (!ok) { checar(`${nome}: abre até a partida`, false); continue; }
    await jg(RAPIDO + ' return 1;');
    await jg('c.dadoDeTeste = 4; return 1;');
    await tocarNo('c.botaoDado');
    const carta = await esperarAte("c.fase === 'carta' && c.painel.alpha >= 1", 8000);
    await esperar(300);
    await captura(`A-${w}x${h}`);
    const m = await jg(`const st = j.stage; const r = st.canvas.getBoundingClientRect();
      const alvos = { 'JOGAR O DADO': c.botaoDado, 'resposta': c.painel.botoes[0], 'pausa': window.__achar(c, (n) => n.icone === 'pausa') };
      const px = {}; for (const [k, n] of Object.entries(alvos)) if (n) px[k] = Math.round(Math.min(n.largura, n.altura) * st.escala);
      return { escala: +st.escala.toFixed(3), giro: st.giro, cabe: r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1,
               rolagem: document.documentElement.scrollWidth > innerWidth + 1, px };`).catch(() => null);
    checar(`${nome}: a carta abre, o canvas cabe na janela e não há rolagem lateral`,
      carta && m && m.cabe && !m.rolagem, JSON.stringify(m));
    checar(`${nome}: nenhum erro de JavaScript`, erros.length === antes, erros.slice(antes, antes + 3).join(' | '));
    if (m) {
      const menor = Math.min(...Object.values(m.px));
      menores.push([nome, menor, m.px]);
      if (menor < 44) nota(`${nome}: alvo de toque menor que 44 px de tela (${JSON.stringify(m.px)}; escala ${m.escala}${m.giro ? `, girado ${m.giro}°` : ''})`);
    }
  }
  await cdp.enviar('Emulation.setDeviceMetricsOverride', { width: 1280, height: 860, deviceScaleFactor: 1, mobile: false }, s);
  console.log(`  menor alvo por tamanho: ${menores.map(([n, p]) => `${n.split(' ')[0]} ${n.split(' ').slice(-1)} → ${p}px`).join(' · ')}`);

  // =========================================================== B. MARATONA
  console.log('\nB. Maratona: 12 partidas inteiras, só com gestos');
  const vezCrianca = async (pCerto) => {
    if (!(await esperarAte("c.constructor.name === 'ResultScreen' || (c.fase === 'dado' && c.vez.quem === 'crianca')", 20000))) return 'a vez dela não começou';
    if (await jg("return c.constructor.name === 'ResultScreen';")) return 'fim';
    const certo = Math.random() < pCerto;
    await tocarNo('c.botaoDado');
    if (!(await esperarAte("c.constructor.name === 'ResultScreen' || (c.fase === 'carta' && c.painel.alpha >= 1)", 12000))) return 'a carta dela não abriu';
    if (await jg("return c.constructor.name === 'ResultScreen';")) return 'fim';
    await tocarNo(certo ? OPCAO_CERTA : OPCAO_ERRADA);
    if (!(await esperarAte("c.fase === 'retorno'", 5000))) return 'a resposta não deu retorno';
    await tocarNo(CONTINUAR);
    return certo ? 'certo' : 'errado';
  };
  const vezComputador = async () => {
    if (!(await esperarAte("c.fase === 'conferir' && c.painel.alpha >= 1", 20000))) return 'ele não respondeu';
    const certo = await jg('return c.vez.resposta.certo;');
    const confereBem = Math.random() < 0.7;
    await tocarNo(CONFERIR(confereBem ? certo : !certo));
    if (!(await esperarAte("c.fase === 'retorno'", 5000))) return 'a conferência não deu retorno';
    await tocarNo(CONTINUAR);
    return 'ok';
  };
  const partida = async (pCerto) => {
    let errou = 0; let falha = null;
    for (const fim = Date.now() + 240000; Date.now() < fim;) {
      if (await esperarAte("c.constructor.name === 'ResultScreen'", 40)) return { ok: true, errou };
      const st = await jg("return c.constructor.name === 'GameScene' ? { quem: c.vez.quem, fase: c.fase } : null;");
      if (st?.quem === 'crianca' && st.fase === 'dado') {
        const r = await vezCrianca(pCerto);
        if (r === 'errado') errou++;
        else if (r !== 'certo' && r !== 'fim') { falha = r; break; }
      } else if (st?.fase === 'conferir') {
        const r = await vezComputador();
        if (r !== 'ok') { falha = r; break; }
      } else await esperar(50);
    }
    return { ok: !falha && await esperarAte("c.constructor.name === 'ResultScreen'", 4000), errou, falha };
  };
  const PASSOS = { 1: 7, 2: 8, 3: 9 };
  const resumo = [];
  const antesMaratona = erros.length;
  const avisosAntes = avisos.length;
  const SO = process.argv[3] ? process.argv[3].split(',').map(Number) : [1, 2, 3];
  for (const nivel of SO) {
    const pCerto = { 1: 0.9, 2: 0.6, 3: 0.3 }[nivel];
    for (let k = 1; k <= 4; k++) {
      const t0 = Date.now();
      if (!(await abrirPartida(nivel))) { checar(`nível ${nivel}, partida ${k}: abriu`, false, JSON.stringify(await jg("return { cena: c.constructor.name, carta: (() => { const n = window.__achar ? window.__achar(c, (x) => x.nivel && x.nivel.id === " + nivel + ") : null; return n ? { x: n.x, y: n.y, l: n.largura, a: n.altura } : null; })() };").catch((e) => String(e)))); continue; }
      await jg(`${RAPIDO}
        window.__fim = null; const ir = c.irPara.bind(c);
        c.irPara = (n, d) => { window.__fim = { res: d?.resultado ?? null, usadas: c.usadas.slice(), respondidas: c.stats.respondidas, pos: c.pos }; return ir(n, d); }; return 1;`);
      const r = await partida(pCerto);
      const f = await aval('window.__fim');
      const res = f?.res ?? {};
      const ex = res.extras ?? {};
      const meta = PASSOS[nivel];
      const coerente = r.ok && f && res.totalPerguntas === meta && res.nivel === nivel && typeof res.vitoria === 'boolean'
        && res.erros === r.errou && res.acertos >= 0 && res.acertos <= meta
        && (res.vitoria ? res.acertos === Math.max(0, meta - res.erros) : res.acertos === ex.casasPuxadas)
        && new Set(f.usadas).size === f.usadas.length && ex.cartasRespondidas === f.respondidas;
      checar(`nível ${nivel}, partida ${k} (acerta ${Math.round(pCerto * 100)}%): terminou e a nota bate`,
        coerente, JSON.stringify({ r, res: { v: res.vitoria, a: res.acertos, e: res.erros, t: res.totalPerguntas, casas: ex.casasPuxadas, cartas: ex.cartasRespondidas }, usadas: f?.usadas?.length, respondidas: f?.respondidas }));
      resumo.push({ nivel, vitoria: res.vitoria, cartas: ex.cartasRespondidas, erros: res.erros, seg: Math.round((Date.now() - t0) / 1000) });
    }
  }
  const guarda = avisos.slice(avisosAntes).filter((x) => /watchdog|cão de guarda|travad|resgat/i.test(x));
  checar('maratona: nenhum erro de JavaScript', erros.length === antesMaratona, erros.slice(antesMaratona, antesMaratona + 3).join(' | '));
  checar('maratona: o Watchdog não disparou', guarda.length === 0, guarda.slice(0, 3).join(' | '));
  const venceu = resumo.filter((x) => x.vitoria).length;
  nota(`maratona: ${venceu} vitórias e ${resumo.length - venceu} derrotas em ${resumo.length} partidas; cartas por partida ${resumo.map((x) => x.cartas).join(',')}`);

  // =========================================================== C. RAJADA
  console.log('\nC. Toques em rajada contam uma jogada só');
  if (await abrirPartida(1)) {
    await jg(RAPIDO + ' c.dadoDeTeste = 3; return 1;');
    for (let i = 0; i < 8; i++) await tocarNo('c.botaoDado', 15);
    checar('8 toques seguidos no dado: rola uma vez e abre UMA carta',
      await esperarAte("c.fase === 'carta' && c.painel.alpha >= 1", 8000) && await jg('return c.stats.respondidas === 0 && c.painel.botoes.length === 3 && c.vez.dado === 3;'));
    for (let i = 0; i < 6; i++) await tocarNo(OPCAO_CERTA, 15);
    await esperarAte("c.fase === 'retorno'", 4000);
    checar('6 toques seguidos na resposta: conta UMA carta, certa',
      await jg('return c.stats.respondidas === 1 && c.stats.certas === 1 && c.placar.erros === 0;'));
    for (let i = 0; i < 5; i++) await tocarNo(CONTINUAR, 15);
    await esperarAte("c.vez.quem === 'computador'", 8000);
    await esperar(300);
    checar('5 toques seguidos no CONTINUAR: a ficha anda UMA vez (7 − 3 = posição 4) e a vez passa',
      await jg("return c.pos === 4 && c.vez.quem === 'computador';"), JSON.stringify(await jg('return { pos: c.pos, quem: c.vez.quem, fase: c.fase };')));
    // Toques no dado fora da vez da criança (a vez do computador) não fazem nada.
    for (let i = 0; i < 4; i++) await tocarNo('c.botaoDado', 15);
    checar('toques no dado durante a vez do computador não rolam nada da criança',
      await jg("return c.vez.quem === 'computador' && c.stats.respondidas === 1;"));
  } else checar('rajada: abriu a partida', false);

  // =========================================================== D. TROCA DE ABA
  console.log('\nD. Troca de aba com o dado rolando');
  if (await abrirPartida(1)) {
    await jg(RAPIDO + ' c.regras.rolarMs = 1200; c.dadoDeTeste = 5; return 1;');
    await tocarNo('c.botaoDado');
    const outra = (await cdp.enviar('Target.createTarget', { url: 'about:blank' })).targetId;
    await cdp.enviar('Target.activateTarget', { targetId: outra });
    await esperar(3000);
    const oculta = await aval('document.visibilityState').catch(() => 'indisponível');
    await cdp.enviar('Target.activateTarget', { targetId });
    await esperar(500);
    checar(`o dado rolando atravessa uma troca de aba (visibilidade na outra aba: ${oculta}) e a carta abre`,
      await esperarAte("c.fase === 'carta' && c.painel.alpha >= 1 && c.dado.face === 5", 10000));
    await tocarNo(OPCAO_CERTA);
    checar('depois de voltar, a resposta ainda funciona', await esperarAte("c.fase === 'retorno'", 4000));
    await cdp.enviar('Target.closeTarget', { targetId: outra }).catch(() => {});
    if (oculta === 'visible') nota('o Chrome headless não tornou a aba oculta de verdade: a troca de aba só foi simulada de forma parcial');
  } else checar('troca de aba: abriu a partida', false);

  // =========================================================== E. CONTAS EM DESTAQUE
  console.log('\nE. Cartas que são só uma conta: capturas da pergunta e do retorno');
  if (await abrirPartida(3)) {
    await jg(RAPIDO + ' return 1;');
    const conta = async (grupo, cfg, nome, errar) => {
      await jg(`c.nivel = { ...c.nivel, cartas: { ${grupo}: ${JSON.stringify(cfg)} } }; c.dadoDeTeste = 2; return 1;`);
      if (!(await esperarAte("c.fase === 'dado' && c.vez.quem === 'crianca'", 20000))) return false;
      await tocarNo('c.botaoDado');
      if (!(await esperarAte("c.fase === 'carta' && c.painel.alpha >= 1", 8000))) return false;
      await esperar(300);
      await captura(`E-${nome}-pergunta`);
      await tocarNo(errar ? OPCAO_ERRADA : OPCAO_CERTA);
      if (!(await esperarAte("c.fase === 'retorno'", 4000))) return false;
      await esperar(500);
      await captura(`E-${nome}-retorno`);
      await tocarNo(CONTINUAR);
      return true;
    };
    checar('multiplicação 3 × 6: pergunta e retorno (errando) capturados',
      await conta('multiplicacao', { a: [3], b: [6, 6] }, 'multiplicacao', true));
    // o computador joga entre uma e outra: confere
    for (const fim = Date.now() + 25000; Date.now() < fim;) {
      if (await jg("return c.fase === 'dado' && c.vez.quem === 'crianca';")) break;
      if (await jg("return c.fase === 'conferir' && c.painel.alpha >= 1;")) {
        await tocarNo(CONFERIR(true));
        await esperarAte("c.fase === 'retorno'", 4000);
        await tocarNo(CONTINUAR);
      }
      await esperar(120);
    }
    checar('adição repetida 9 + 9 + 9 + 9 + 9 + 9: pergunta e retorno capturados',
      await conta('adicaoRepetida', { n: [9, 9], k: [6, 6] }, 'adicao', false));
  } else checar('contas em destaque: abriu a partida', false);

  checar('fim: nenhum erro de JavaScript em todo o teste', erros.length === 0, erros.slice(0, 4).join(' | '));
} catch (e) {
  falharam++;
  problemas.push(`o teste quebrou: ${e.stack ?? e}`);
  console.log(`\n  FALHOU  o teste quebrou: ${e.stack ?? e}`);
} finally {
  chrome.kill();
  await esperar(500);
  await rm(perfil, { recursive: true, force: true }).catch(() => {});
}

console.log('\n========================================================');
console.log(`${passaram} passaram, ${falharam} falharam`);
if (notas.length) { console.log('Observações:'); for (const n of notas) console.log(`  · ${n}`); }
if (problemas.length) { console.log('O que falhou:'); for (const p of problemas) console.log(`  · ${p}`); }
console.log(`Capturas em ${path.relative(RAIZ, SAIDA)}/`);
process.exit(falharam ? 1 : 0);
