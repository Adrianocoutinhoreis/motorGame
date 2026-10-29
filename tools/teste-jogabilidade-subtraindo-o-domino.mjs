#!/usr/bin/env node
/**
 * teste-jogabilidade-subtraindo-o-domino.mjs — o Subtraindo o Dominó jogado com GESTO REAL.
 *
 * `testes.mjs` prova a lógica do motor; `verificar-independencia.mjs` e
 * `teste-entrega-avulsa.mjs` provam a entrega. Este arquivo prova o que só o
 * navegador prova: que o dedo faz alguma coisa, e que a mensagem do AVA chega ao
 * pai de dentro de um <iframe>. Mesma estrutura de `teste-jogabilidade-pratinho-cdu.mjs`.
 *
 * ## A regra deste arquivo: nada é chamado por dentro
 *
 * Só ponteiro, via `Input.dispatchMouseEvent` / `Input.dispatchTouchEvent`, nas
 * coordenadas de tela de verdade. A cena só é LIDA, para conferir o resultado do
 * gesto, e o ritmo é acelerado (`regras.rolarMs`, `acertoMs`, `pausaRodadaMs`) —
 * nunca a entrada. A única exceção é o item 12, que PLANTA uma falha de propósito
 * para provar o `Watchdog`.
 *
 * ## O que ele cobre
 *
 *   0. as REGRAS PURAS (`src/regras.js`) em Node: as 21 pedras, o total sorteado
 *      sempre com pedra na mesa, a mesa sem pedras encostadas;
 *   1. menu → níveis → partida, só com toques;
 *   2. os DADOS: o toque rola, o total é a soma das faces, a pergunta o mostra;
 *   3. MARCAR: PRONTO sem pedra não conta, tocar marca, tocar de novo desmarca, uma
 *      pedra por vez;
 *   4. o ERRO: PRONTO errado conta, a rodada deixa de ser limpa e a ESTRELA vai para o COMPUTADOR;
 *      a pedra que a criança achou é dela de qualquer jeito;
 *   5. a RODADA LIMPA (a estrela é da CRIANÇA) e a VEZ DO COMPUTADOR, que joga os próprios dados e
 *      leva a própria pedra em TODA rodada, em todos os níveis — também numa partida perfeita;
 *   6. a PAUSA abre e fecha, a AJUDA abre e devolve a partida intacta;
 *   7. os 3 NÍVEIS: Fácil (10 pedras, ajuda no 2º erro, nomes), Médio (21 pedras,
 *      ajuda no 3º), Difícil (algarismos, 5 rodadas, sem ajuda);
 *   8. TOQUE (touch) num celular EM PÉ, com o conteúdo girado;
 *   9. o AVA dentro de um IFRAME: vitória, derrota e o Difícil registram, replay gera
 *      um novo registro, ficar parado no resultado não duplica, e os números batem
 *      com o que foi jogado;
 *  10. nenhum erro de JavaScript e nenhum disparo do `Watchdog` em partida normal;
 *  11. TROCAR DE ABA e voltar (simulado pelo `visibilitychange` que o motor escuta);
 *  12. o `Watchdog` RESGATA uma cadeia cortada: a parada dos dados é quebrada uma
 *      vez, de propósito, e o jogo não pode ficar preso.
 *
 * As lacunas de narração são esperadas e separadas do resto: o motor as declara no
 * console (aviso), e a narração do tutorial e a do "dez" ao "doze" ainda não foram gravadas.
 *
 * ## Uso
 *
 * Com `node tools/serve.mjs 8099` rodando em outro terminal:
 *     node tools/teste-jogabilidade-subtraindo-o-domino.mjs
 *
 * As capturas vão para `.capturas/subtraindo-o-domino/`.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORTA = Number(process.argv[2]) || 8099;
const PORTA_CDP = 9371;
const SAIDA = path.join(RAIZ, '.capturas', 'subtraindo-o-domino');
const JOGO_URL = `http://127.0.0.1:${PORTA}/Games/numerandus/subtraindo-o-domino/`;
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

let passaram = 0; let falharam = 0; const problemas = [];
const checar = (nome, cond, det = '') => {
  if (cond) { passaram++; console.log(`  ok   ${nome}`); }
  else { falharam++; problemas.push(`${nome} — ${det}`); console.log(`  FALHOU  ${nome}\n          ${det}`); }
};

// ---------------------------------------------------------------- 0. regras puras
console.log('\n0. As regras puras (src/regras.js), em Node');
{
  const R = await import(pathToFileURL(path.join(RAIZ, 'Games/numerandus/subtraindo-o-domino/src/regras.js')).href);
  const todas = R.criarPecas(6);
  const facil = R.criarPecas(4);
  checar('o dominó sem as pedras de 0 tem 21 pedras (faces 1 a 6)', todas.length === 21, `n=${todas.length}`);
  checar('o Fácil tem 10 pedras (faces 1 a 4)', facil.length === 10, `n=${facil.length}`);
  const porTotal = Array.from({ length: 11 }, (_, i) => todas.filter((p) => p.soma === i + 2).length);
  checar('pedras por total (2 a 12): 1 1 2 2 3 3 3 2 2 1 1', porTotal.join(' ') === '1 1 2 2 3 3 3 2 2 1 1', porTotal.join(' '));
  checar('todo total de 2 a 12 tem pelo menos uma pedra', porTotal.every((n) => n >= 1));
  checar('6+3 e 5+4 estão entre as que somam 9 (o exemplo do vídeo)', R.pecasQueSomam(todas, 9).map((p) => `${p.a}${p.b}`).sort().join() === '36,45');

  // 30 000 jogadas de dados, com subconjuntos aleatórios de pedras livres: o total SEMPRE tem pedra.
  let sempreComPedra = true; let nulos = 0; const freq = new Array(13).fill(0);
  for (let i = 0; i < 30000; i++) {
    const pecas = todas.map((p) => ({ ...p, livre: Math.random() < 0.35 }));
    const r = R.sortearDados(pecas);
    if (!r) { nulos++; if (pecas.some((p) => p.livre)) sempreComPedra = false; continue; }
    if (r.d1 < 1 || r.d1 > 6 || r.d2 < 1 || r.d2 > 6 || r.d1 + r.d2 !== r.total) sempreComPedra = false;
    if (!R.pecasQueSomam(pecas, r.total).length) sempreComPedra = false;
  }
  checar('30 000 jogadas: os dados são válidos e o total sempre tem uma pedra livre', sempreComPedra, `nulos=${nulos}`);
  for (let i = 0; i < 36000; i++) freq[R.sortearDados(todas).total]++;
  checar('com a mesa cheia o 7 é o total mais comum (cerca de 1 em 6)', freq[7] > 5400 && freq[7] < 6600 && freq[7] === Math.max(...freq), `7: ${freq[7]}`);

  // A mesa: células distintas, dentro da grade, e nenhuma pedra encosta noutra.
  let mesaOk = true; let menorFolga = Infinity;
  for (let i = 0; i < 3000; i++) {
    const n = i % 2 ? 21 : 10;
    const pos = R.posicionarMesa(n);
    const caixas = pos.map((p) => {
      const cx = p.col * 144 + 72 + p.dx; const cy = p.linha * 80 + 40 + p.dy;
      // a pedra girada até 1,5° cabe numa caixa de (128 cos + 64 sin) × (64 cos + 128 sin)
      const rad = Math.abs(p.giro) * Math.PI / 180;
      const w = 128 * Math.cos(rad) + 64 * Math.sin(rad); const h = 64 * Math.cos(rad) + 128 * Math.sin(rad);
      return { x0: cx - w / 2, x1: cx + w / 2, y0: cy - h / 2, y1: cy + h / 2 };
    });
    const cel = new Set(pos.map((p) => p.linha * 6 + p.col));
    if (cel.size !== n || pos.some((p) => p.col < 0 || p.col > 5 || p.linha < 0 || p.linha > 3)) mesaOk = false;
    for (let a = 0; a < caixas.length; a++) for (let b = a + 1; b < caixas.length; b++) {
      const dx = Math.max(caixas[a].x0 - caixas[b].x1, caixas[b].x0 - caixas[a].x1);
      const dy = Math.max(caixas[a].y0 - caixas[b].y1, caixas[b].y0 - caixas[a].y1);
      menorFolga = Math.min(menorFolga, Math.max(dx, dy));
    }
  }
  checar('3 000 mesas: células distintas na grade de 6 × 4', mesaOk);
  checar(`nenhuma pedra encosta noutra (menor folga entre as caixas ${menorFolga.toFixed(1)} px)`, menorFolga >= 8, `folga=${menorFolga}`);
  checar('quem vence: mais pedras vence, e o empate leva à rodada decisiva',
    R.quemVence(2, 1) === 'v' && R.quemVence(1, 2) === 'c' && R.quemVence(1, 1) === 'empate');

  // Rodadas extras: os dados do computador são honestos e, a partir da 3ª extra, caem num total ESGOTADO se houver.
  let semOk = true; let comEsgotado = 0;
  for (let i = 0; i < 10000; i++) {
    const pecas = todas.map((p) => ({ ...p, livre: Math.random() < 0.5 }));
    const r = R.sortearDadosSemPedra(pecas);
    const esgotados = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((t) => !R.pecasQueSomam(pecas, t).length);
    if (!esgotados.length) { if (r !== null) semOk = false; continue; }
    comEsgotado++;
    if (!r || R.pecasQueSomam(pecas, r.total).length || r.d1 + r.d2 !== r.total || r.d1 < 1 || r.d1 > 6 || r.d2 < 1 || r.d2 > 6) semOk = false;
  }
  checar(`10 000 mesas: os dados "sem pedra" caem sempre num total esgotado e somam (${comEsgotado} mesas tinham algum)`, semOk && comEsgotado > 1000, `ok=${semOk} n=${comEsgotado}`);
  const quase = todas.map((p) => ({ ...p, livre: p.soma !== 12 })); // só o 12 está esgotado
  const terceira = Array.from({ length: 500 }, () => R.sortearDadosExtra(quase, 3));
  const segunda = Array.from({ length: 3000 }, () => R.sortearDadosExtra(quase, 2));
  checar('a partir da 3ª extra o computador cai SEMPRE no total esgotado (o 12)', terceira.every((r) => r.total === 12 && r.d1 === 6 && r.d2 === 6));
  checar('na 1ª e na 2ª extra os dados dele são honestos (nem sempre o esgotado; o 7 é o mais comum)', (() => {
    const f = new Array(13).fill(0); segunda.forEach((r) => f[r.total]++);
    return f[12] < segunda.length * 0.1 && f[7] === Math.max(...f);
  })());
  checar('sem nenhum total esgotado, até a 5ª extra os dados dele são válidos e honestos', Array.from({ length: 500 }, () => R.sortearDadosExtra(todas, 5))
    .every((r) => r.d1 >= 1 && r.d1 <= 6 && r.d2 >= 1 && r.d2 <= 6 && r.d1 + r.d2 === r.total));

  // O defeito achado em 28/10/2026: no Fácil (pedras de 1 a 4, totais de 2 a 8) o computador rolava 2d6 puros e
  // 28% caíam em totais que NEM EXISTEM (9 a 12), então ficava sem pedra já na 1ª extra.
  let facilOk = true; let protegidaOk = true; let azarOk = true;
  for (let i = 0; i < 4000; i++) {
    const pecas = facil.map((p) => ({ ...p, livre: Math.random() < 0.3 }));
    const livres = pecas.filter((p) => p.livre).length;
    const h = R.sortearDadosExtra(pecas, 2);
    if (h.total < 2 || h.total > 8 || h.d1 + h.d2 !== h.total) facilOk = false;
    const p1 = R.sortearDadosExtra(pecas, 1);
    if (livres === 0) { if (p1 !== null) protegidaOk = false; } else if (!p1 || !R.pecasQueSomam(pecas, p1.total).length) protegidaOk = false;
    const azar = R.sortearDadosExtra(pecas, 3);
    if (azar.total < 2 || azar.total > 8 || R.pecasQueSomam(pecas, azar.total).length) { if (R.sortearDadosSemPedra(pecas)) azarOk = false; }
  }
  checar('Fácil, extra 2: os dados honestos do computador só caem em totais que existem no nível (2 a 8)', facilOk);
  checar('extra 1: os dados do computador são PROTEGIDOS (sempre com pedra; com a mesa vazia, null)', protegidaOk);
  checar('extra 3 no Fácil: o "azar" cai num total que existe no nível e já acabou (nunca num 9 a 12)', azarOk);
  checar('o "sem pedra" nunca devolve um total inexistente: no Fácil só com a mesa vazia de um total de 2 a 8', (() => {
    const r = R.sortearDadosSemPedra(facil.map((p) => ({ ...p, livre: p.soma === 5 || p.soma === 6 })));
    return r !== null && r.total >= 2 && r.total <= 8 && r.total !== 5 && r.total !== 6;
  })());

}

const navegador = NAVEGADORES.find((c) => existsSync(c));
if (!navegador) { console.error('nenhum Chrome/Edge encontrado'); process.exit(2); }
mkdirSync(SAIDA, { recursive: true });
const perfil = path.join(os.tmpdir(), `dominio-${Date.now()}`);
const chrome = spawn(navegador, [
  '--headless=new', `--remote-debugging-port=${PORTA_CDP}`, `--user-data-dir=${perfil}`,
  '--no-first-run', '--disable-gpu', '--mute-audio', '--window-size=1280,860',
  '--autoplay-policy=no-user-gesture-required',
], { stdio: 'ignore' });

const erros = [];
const avisos = [];
try {
  let v = null;
  for (let i = 0; i < 60 && !v; i++) {
    try { v = await (await fetch(`http://127.0.0.1:${PORTA_CDP}/json/version`)).json(); }
    catch { await esperar(250); }
  }
  if (!v) throw new Error('o navegador não abriu a porta de depuração');
  const cdp = await new CDP(v.webSocketDebuggerUrl).conectar();
  const { targetId } = await cdp.enviar('Target.createTarget', { url: 'about:blank' });
  const s = (await cdp.enviar('Target.attachToTarget', { targetId, flatten: true })).sessionId;
  await cdp.enviar('Runtime.enable', {}, s);
  await cdp.enviar('Log.enable', {}, s);
  await cdp.enviar('Page.enable', {}, s);
  cdp.ao((m) => {
    if (m.method === 'Runtime.consoleAPICalled') {
      const txt = (m.params.args ?? []).map((a) => a.value ?? a.description ?? '').join(' ');
      if (m.params.type === 'error') erros.push(`console.error: ${txt.slice(0, 200)}`);
      else if (m.params.type === 'warning') avisos.push(txt.slice(0, 200));
    }
    if (m.method === 'Log.entryAdded' && ['error'].includes(m.params.entry.level)) {
      erros.push(`log ${m.params.entry.level}: ${m.params.entry.text} ${m.params.entry.url ?? ''}`.slice(0, 220));
    }
    if (m.method === 'Runtime.exceptionThrown') erros.push(`EXCECAO: ${m.params.exceptionDetails.text} ${m.params.exceptionDetails.exception?.description ?? ''}`.slice(0, 240));
  });

  // ------------------------------------------------- ambiente: página ou iframe
  // `W` é a janela onde o jogo roda; `OFF` é onde ela fica na tela (0,0 se for a página).
  let W = 'window';
  let OFF = '({x:0,y:0})';
  const aval = async (expr) => {
    const r = await cdp.enviar('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, s);
    if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.text} ${r.exceptionDetails.exception?.description ?? ''}`.slice(0, 300));
    return r.result.value;
  };
  const jg = (corpo) => aval(`(() => { const j = ${W}.jogo; const c = j.cena; ${corpo} })()`);
  const captura = async (nome) => {
    const r = await cdp.enviar('Page.captureScreenshot', { format: 'png' }, s);
    writeFileSync(path.join(SAIDA, `${nome}.png`), Buffer.from(r.data, 'base64'));
  };
  const esperarAte = async (corpo, ms = 15000, passo = 100) => {
    const fim = Date.now() + ms;
    while (Date.now() < fim) {
      const ok = await jg(`return !!(${corpo});`).catch(() => false);
      if (ok) return true;
      await esperar(passo);
    }
    return false;
  };

  const AJUDANTES = `
    window.__achar = (raiz, pred) => { let r = null;
      const v = (n) => { if (r) return; if (pred(n)) { r = n; return; } for (const f of (n.filhos || [])) v(f); };
      v(raiz); return r; };
    window.__achar_todos = (raiz, pred) => { const r = [];
      const v = (n) => { if (pred(n)) r.push(n); for (const f of (n.filhos || [])) v(f); };
      v(raiz); return r; };
    true;`;
  const instalar = () => aval(`${W}.eval(${JSON.stringify(AJUDANTES)})`);

  // Converte uma coordenada LÓGICA em px de tela, desfazendo o giro do celular em pé.
  const paraTela = (lx, ly) => aval(`(() => {
    const st = ${W}.jogo.stage; const r = st.canvas.getBoundingClientRect(); const off = ${OFF};
    const cx = ${lx} * st.escala + st.deslocX; const cy = ${ly} * st.escala + st.deslocY;
    let x; let y;
    if (st.giro === 90) { x = r.width - cy; y = cx; }
    else if (st.giro === -90) { x = cy; y = r.height - cx; }
    else { x = cx; y = cy; }
    return { x: Math.round(off.x + r.left + x), y: Math.round(off.y + r.top + y) };
  })()`);
  const mouse = (type, c, extra = {}) => cdp.enviar('Input.dispatchMouseEvent', {
    type, x: c.x, y: c.y, button: 'left', clickCount: 1, pointerType: 'mouse', ...extra,
  }, s);
  let modoToque = false;
  const tocarTela = async (c) => {
    if (modoToque) {
      await cdp.enviar('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: c.x, y: c.y }] }, s);
      await esperar(60);
      await cdp.enviar('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }, s);
    } else {
      await mouse('mousePressed', c, { buttons: 1 });
      await esperar(50);
      await mouse('mouseReleased', c, { buttons: 0 });
    }
    await esperar(90);
  };
  const tocarLogico = async (lx, ly) => tocarTela(await paraTela(lx, ly));

  // O ponto lógico (mundo) do CENTRO de um nó achado por expressão — o pixel que o dedo encontraria.
  // O iframe do host pode recarregar depois de o jogo subir (o `ava-teste.html` define um `src` próprio) e levar
  // os ajudantes junto: reinstala antes de cada busca, em vez de apostar na ordem dos eventos.
  const garantir = () => aval(`typeof ${W}.__achar === 'function' || ${W}.eval(${JSON.stringify(AJUDANTES)})`);
  const centroDe = async (busca) => { await garantir(); return jg(`
    const no = (${busca});
    if (!no) return null;
    const p = no.localParaGlobal((no.largura ?? 0) / 2, (no.altura ?? 0) / 2);
    return { x: p.x, y: p.y, habilitado: no.habilitado !== false, visivel: no.visivelMundo !== false };`); };
  const tocarNo = async (busca) => {
    const c = await centroDe(busca);
    if (!c) return false;
    await tocarLogico(c.x, c.y);
    return true;
  };
  const BTN = (re) => `${W}.__achar(c, (n) => typeof n.rotulo === 'string' && ${re}.test(n.rotulo) && n.visivelMundo)`;
  const ICONE = (nome) => `${W}.__achar(c, (n) => n.icone === '${nome}' && n.visivelMundo)`;

  // Os nós da cena que o teste toca. Pedras: a certa (soma o total) ou uma errada, ainda na mesa.
  const PRONTO = 'c.botaoPronto';
  const CERTA = 'c.pecas.find((p) => p.livre && p.soma === c.total).no';
  const ERRADA = 'c.pecas.find((p) => p.livre && p.soma !== c.total).no';
  const estado = () => jg(`return {
    cena: c.constructor.name, fase: c.fase, rodada: c.rodada, total: c.total,
    errosRodada: c.errosRodada, errosPronto: c.errosPronto, falha: c.falhaNaRodada,
    escolhida: c.escolhida ? c.escolhida.a + '-' + c.escolhida.b : null,
    v: c.levadas ? c.levadas.v.length : -1, c: c.levadas ? c.levadas.c.length : -1,
    decisiva: !!c.decisiva, pausada: !!c.pausada,
    prontoHabilitado: c.botaoPronto ? c.botaoPronto.habilitado : null, prontoVisivel: c.botaoPronto ? c.botaoPronto.visible : null,
  };`);
  const RAPIDO = `c.regras.rolarMs = 120; c.regras.acertoMs = 120; c.regras.pausaRodadaMs = 150; c.regras.cpuEsperaMs = 100; c.regras.cpuPensaMs = 100; c.regras.revelaMs = 200;`;
  const abrirNivel = async (id) => {
    await aval(`${W}.jogo.irPara('jogando', { nivel: ${W}.jogo.config.niveis[${id - 1}] })`);
    await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
    await instalar();
    await jg(RAPIDO);
  };
  /** Joga os dados da rodada atual com um toque e espera a pergunta. */
  const jogarDados = async () => {
    await esperarAte(`c.fase === 'dados'`, 10000);
    await tocarNo('c.dado1');
    return esperarAte(`c.fase === 'escolher'`, 6000);
  };
  /**
   * Uma partida inteira só com gestos. `errosPorRodada[i]` = quantos PRONTOs errados na rodada i+1 (se o
   * número chega ao limite do nível, a vez da criança passa e a rodada segue sem a pedra dela). Se as
   * pedras empatam depois das rodadas combinadas, joga a RODADA DECISIVA (sem erros) até o resultado.
   */
  const partida = async (errosPorRodada) => {
    const total = await jg(`return c.totalRodadas;`);
    let feitos = 0;
    for (let r = 1; r <= total + 12; r++) {
      if (await jg(`return c.constructor.name === 'ResultScreen';`)) break;
      if (!(await esperarAte(`c.rodada === ${r} && c.fase === 'dados'`, 10000))) return { feitos, ok: false, em: `rodada ${r} não começou` };
      if (!(await jogarDados())) return { feitos, ok: false, em: `dados da rodada ${r}` };
      for (let k = 0; k < (errosPorRodada[r - 1] ?? 0); k++) {
        await tocarNo(ERRADA);
        await tocarNo(PRONTO);
        feitos++;
        if (!(await esperarAte(`c.errosRodada === ${k + 1} && (c.fase === 'escolher' || c.fase === 'passando')`, 4000))) return { feitos, ok: false, em: `erro ${k + 1} da rodada ${r}` };
      }
      if (!(await jg(`return c.fase === 'passando';`))) {
        await tocarNo(CERTA);
        await tocarNo(PRONTO);
      }
      await esperarAte(`c.constructor.name === 'ResultScreen' || (c.rodada === ${r + 1} && c.fase === 'dados')`, 20000);
    }
    return { feitos, ok: await esperarAte(`c.constructor.name === 'ResultScreen'`, 8000) };
  };

  const SO_IFRAME = process.argv.includes('--so-iframe');
  let ok = false;
  let e;
  const sessaoDaPagina = async () => {
  // --------------------------------------------------------- 1. abrir e navegar
  console.log('\n1. O jogo abre e chega à partida só com toques');
  await cdp.enviar('Page.navigate', { url: JOGO_URL }, s);
  ok = false;
  for (let i = 0; i < 80 && !ok; i++) {
    ok = await aval('!!(window.jogo && window.jogo.cena && window.jogo.rodando)').catch(() => false);
    if (!ok) await esperar(250);
  }
  checar('a página carregou e o motor subiu', ok);
  await instalar();
  await esperar(1500);
  await captura('01-menu');
  checar('começa no menu', (await estado()).cena === 'MenuScreen');
  checar('toque em JOGAR (menu) leva à escolha de nível', await tocarNo(BTN('/^jogar$/i')) && await esperarAte(`c.constructor.name === 'LevelSelectScreen'`, 5000));
  await instalar();
  await captura('02-niveis');
  const cards = await jg(`return ${W}.__achar_todos(c, (n) => n.nivel && n.nivel.id).map((n) => n.nivel.id);`);
  checar('os 3 cartões de nível aparecem', cards.join() === '1,2,3', JSON.stringify(cards));
  checar('toque no cartão MÉDIO abre a partida',
    await tocarNo(`${W}.__achar(c, (n) => n.nivel && n.nivel.id === 2)`) && await esperarAte(`c.constructor.name === 'GameScene'`, 6000));
  await instalar();
  await jg(RAPIDO);
  e = await estado();
  const ini = await jg(`return { nivel: c.nivel.id, pecas: c.pecas.length, rodadas: c.totalRodadas, d1: c.dado1.face, d2: c.dado2.face,
    pergunta: c.pergunta.total, marcadores: c.trilha.estados.length, tema: c.config.tema, nomes: c.bandejas.v.nomes };`);
  checar('o Médio começa na fase dos dados, com 21 pedras e 3 rodadas', e.fase === 'dados' && ini.nivel === 2 && ini.pecas === 21 && ini.rodadas === 3 && ini.marcadores === 3, JSON.stringify({ e, ini }));
  checar('antes de jogar: dados com "?", sem pergunta e sem PRONTO', ini.d1 === 0 && ini.d2 === 0 && ini.pergunta === null && e.prontoVisivel === false, JSON.stringify({ ini, e }));
  checar('o tema da partida é o feltro', ini.tema === 'feltro', ini.tema);
  checar('o Médio não escreve os nomes (só o Fácil)', ini.nomes === false);
  await captura('03-partida-dados');

  // ------------------------------------------------------------- 2. os dados
  console.log('\n2. Os dados: o toque rola, o total é a soma, a pergunta o mostra');
  await jg(`c.regras.rolarMs = 1500;`);
  await tocarNo('c.dado2');
  e = await estado();
  checar('toque num dado rola os dois (fase "rolando")', e.fase === 'rolando', JSON.stringify(e));
  checar('rolando, um toque a mais no dado NÃO rola de novo nem estraga nada', await (async () => { await tocarNo('c.dado1'); return (await estado()).fase === 'rolando'; })());
  checar('os dados param e a pergunta aparece', await esperarAte(`c.fase === 'escolher'`, 5000));
  await jg(`c.regras.rolarMs = 120;`);
  const dd = await jg(`return { d1: c.dado1.face, d2: c.dado2.face, total: c.total, pergunta: c.pergunta.total, temPedra: c.pecas.some((p) => p.livre && p.soma === c.total) };`);
  checar('o total é a soma das duas faces', dd.d1 >= 1 && dd.d1 <= 6 && dd.d2 >= 1 && dd.d2 <= 6 && dd.total === dd.d1 + dd.d2, JSON.stringify(dd));
  checar('a pergunta mostra o total e há pedra que o some', dd.pergunta === dd.total && dd.temPedra, JSON.stringify(dd));
  e = await estado();
  checar('o PRONTO aparece, mas desligado (nenhuma pedra marcada)', e.prontoVisivel === true && e.prontoHabilitado === false, JSON.stringify(e));
  await captura('04-partida-pergunta');

  // ------------------------------------------------------------ 3. marcar
  console.log('\n3. Marcar: PRONTO sem pedra não conta; tocar marca; tocar de novo desmarca; uma por vez');
  await tocarNo(PRONTO);
  e = await estado();
  checar('PRONTO sem pedra marcada não faz nada (nenhum erro contado)', e.errosPronto === 0 && e.fase === 'escolher', JSON.stringify(e));
  await tocarNo(ERRADA);
  e = await estado();
  checar('toque numa pedra a marca e liga o PRONTO', e.escolhida != null && e.prontoHabilitado === true, JSON.stringify(e));
  await esperar(300);
  const marcada = await jg(`return c.escolhida.no.efeitos.marcada;`);
  checar('a pedra marcada ganha o contorno dourado', marcada > 0.95, `marcada=${marcada}`);
  await captura('05-pedra-marcada');
  await tocarNo(`c.escolhida.no`);
  e = await estado();
  checar('tocar de novo na mesma pedra a desmarca e desliga o PRONTO', e.escolhida === null && e.prontoHabilitado === false, JSON.stringify(e));
  await tocarNo(ERRADA);
  const primeira = (await estado()).escolhida;
  await tocarNo(`c.pecas.find((p) => p.livre && p.soma !== c.total && (p.a + '-' + p.b) !== '${primeira}').no`);
  e = await estado();
  const marcadas = await jg(`return c.pecas.filter((p) => p.no.efeitos.marcada > 0.5 || (p === c.escolhida)).length;`);
  await esperar(300);
  const marcadasDepois = await jg(`return c.pecas.filter((p) => p.no.efeitos.marcada > 0.5).length;`);
  checar('só uma pedra fica marcada por vez', e.escolhida !== primeira && marcadasDepois === 1, JSON.stringify({ e, marcadas, marcadasDepois }));

  // -------------------------------------------------------------- 4. o erro
  console.log('\n4. O erro: PRONTO errado conta, a rodada deixa de ser limpa e a ESTRELA vai para o COMPUTADOR');
  await tocarNo(PRONTO);
  e = await estado();
  const efe = await jg(`return { sinal: c.pecas.filter((p) => p.no.sinal === 'erro').length };`);
  checar('PRONTO errado conta 1 erro e a rodada deixa de ser limpa', e.errosPronto === 1 && e.errosRodada === 1 && e.falha === true, JSON.stringify(e));
  checar('depois do erro a pedra é desmarcada, o PRONTO desliga e a fase continua "escolher"', e.escolhida === null && e.prontoHabilitado === false && e.fase === 'escolher', JSON.stringify(e));
  checar('o ✕ aparece sobre a pedra errada', efe.sinal === 1, JSON.stringify(efe));
  await captura('06-erro');
  // A vez do computador é rápida no ritmo acelerado e o print do navegador demora: alarga a janela só aqui.
  await jg(`c.regras.cpuPensaMs = 900; c.regras.cpuEsperaMs = 2500;`);
  await tocarNo(CERTA);
  await tocarNo(PRONTO);
  e = await estado();
  checar('a pedra certa, depois de um erro, entra em "levando"', e.fase === 'levando', JSON.stringify(e));
  await captura('07-acertou-com-erro');

  console.log('\n5. A vez do computador: ele joga os próprios dados e leva a própria pedra, em TODA rodada');
  checar('depois da pedra da criança é a VEZ DO COMPUTADOR (fase "cpu")', await esperarAte(`c.fase === 'cpu'`, 6000));
  const cpu0 = await jg(`return { quem: c.pergunta.quem, pronto: c.botaoPronto.visible, v: c.levadas.v.length, c: c.levadas.c.length };`);
  checar('a pedra da criança já está na bandeja DELA, e na vez do computador o PRONTO some', cpu0.v === 1 && cpu0.pronto === false && cpu0.quem === 'c', JSON.stringify(cpu0));
  checar('o computador marca uma pedra', await esperarAte(`c.cpuEtapa === 'marcou'`, 6000));
  const cpu = await jg(`return { total: c.pergunta.total, dados: c.dado1.face + c.dado2.face, soma: c.cpuPeca.soma, anel: c.cpuPeca.no.efeitos.cpu,
    livre: c.cpuPeca.livre, registrado: c.totaisComputador.length };`);
  checar('o total dele é a soma dos dados dele e a pedra que ele marcou soma esse total (ele não erra)', cpu.total === cpu.dados && cpu.soma === cpu.total && cpu.livre === true && cpu.registrado === 1, JSON.stringify(cpu));
  await esperar(300);
  checar('a pedra do computador ganha o anel AZUL (o dourado é da criança)', (await jg(`return c.cpuPeca.no.efeitos.cpu;`)) > 0.95);
  await captura('07b-vez-do-computador');
  await jg(`c.regras.cpuPensaMs = 100; c.regras.cpuEsperaMs = 100;`);
  checar('a rodada fecha e a próxima começa', await esperarAte(`c.rodada === 2 && c.fase === 'dados'`, 15000));
  e = await estado();
  checar('as DUAS bandejas levaram uma pedra (a da criança e a do computador)', e.v === 1 && e.c === 1, JSON.stringify(e));
  checar('errar e depois acertar NÃO tira a pedra da criança: 1 × 1, empatadas', e.v === 1 && e.c === 1, JSON.stringify(e));
  const voo = await jg(`const pv = c.levadas.v[0]; const pc = c.levadas.c[0]; const bv = c.bandejas.v; const bc = c.bandejas.c;
    return { vx: pv.no.x - (bv.x + 24 + 48), vy: pv.no.y - (bv.y + 78 + 24), cx: pc.no.x - (bc.x + 24 + 48), cy: pc.no.y - (bc.y + 78 + 24),
      escalaV: pv.no.scaleX, escalaC: pc.no.scaleX, vagaV: c.mesa.vagas[pv.vaga].vazia, vagaC: c.mesa.vagas[pc.vaga].vazia, mar: c.trilha.estados.join() };`);
  checar('cada pedra pousou na 1ª vaga da própria bandeja, a 75% de escala',
    Math.abs(voo.vx) < 2 && Math.abs(voo.vy) < 2 && Math.abs(voo.cx) < 2 && Math.abs(voo.cy) < 2 && Math.abs(voo.escalaV - 0.75) < 0.01 && Math.abs(voo.escalaC - 0.75) < 0.01, JSON.stringify(voo));
  checar('os dois lugares ficaram vazios na mesa (contorno apagado) e o marcador do alto é neutro (sem dono)', voo.vagaV === true && voo.vagaC === true && voo.mar.startsWith('feita,'), JSON.stringify(voo));
  await captura('08-bandejas');

  // ----------------------------------------------------- 5b. a rodada limpa
  console.log('\n5b. A rodada limpa: o computador joga do mesmo jeito, e as pedras seguem empatadas');
  checar('a 2ª rodada: toque nos dados', await jogarDados());
  await jg(`c.regras.cpuEsperaMs = 2000;`);
  await tocarNo(CERTA);
  await tocarNo(PRONTO);
  await captura('09-acertou-limpo');
  checar('o computador joga mesmo depois de uma rodada perfeita', await esperarAte(`c.fase === 'cpu'`, 8000));
  await jg(`c.regras.cpuEsperaMs = 100;`);
  checar('a rodada 3 começa', await esperarAte(`c.rodada === 3 && c.fase === 'dados'`, 15000));
  e = await estado();
  checar('as duas bandejas têm 2 pedras (os dois jogaram as 2 rodadas)', e.v === 2 && e.c === 2, JSON.stringify(e));
  checar('os marcadores do alto: 2 rodadas feitas e a 3ª vazia', (await jg(`return c.trilha.estados.join();`)) === 'feita,feita,vazia');
  checar('o PRONTO volta a sumir até os dados rolarem', e.prontoVisivel === false, JSON.stringify(e));
  const tc = await jg(`return { cpu: c.totaisComputador.length, crianca: c.totais.length };`);
  checar('o computador rolou os dados dele nas 2 rodadas (2 totais dele e 2 da criança)', tc.cpu === 2 && tc.crianca === 2, JSON.stringify(tc));

  // ------------------------------------------------------ 6. pausa e ajuda
  console.log('\n6. A pausa abre e fecha; a ajuda abre e devolve a partida intacta');
  await jogarDados();
  await tocarNo(CERTA);
  const antes = await estado();
  checar('toque no botão de pausa abre a pausa', await tocarNo(ICONE('pausa')) && (await estado()).pausada === true);
  await captura('10-pausa');
  checar('toque em CONTINUAR devolve a partida', await tocarNo(BTN('/^continuar$/i')) && (await estado()).pausada === false);
  e = await estado();
  checar('a partida está intacta depois da pausa (rodada, total, pedra marcada)', e.rodada === antes.rodada && e.total === antes.total && e.escolhida === antes.escolhida && e.fase === 'escolher', JSON.stringify({ antes, e }));
  checar('toque no botão de ajuda abre o tutorial por cima', await tocarNo(ICONE('tutorial')) && (await estado()).pausada === true);
  await esperar(500);
  await captura('11-ajuda-passo1');
  let avancou = 0;
  for (let i = 0; i < 2; i++) {
    const prox = `${W}.__achar(c.ajuda, (n) => n.icone === 'setaDireita' && n.visivelMundo && n.habilitado !== false)`;
    if (await tocarNo(prox)) { avancou++; await esperar(500); }
  }
  await captura('12-ajuda-passo3');
  checar('as setas avançam os passos da ajuda (3 passos)', avancou === 2, `avancou=${avancou}`);
  checar('toque em VOLTAR AO JOGO fecha a ajuda', await tocarNo(`${W}.__achar(c.ajuda, (n) => typeof n.rotulo === 'string' && /voltar ao jogo/i.test(n.rotulo) && n.visivelMundo)`) && await esperarAte(`!c.pausada`, 4000));
  e = await estado();
  checar('depois da ajuda a partida está intacta (mesma rodada, total e pedra marcada)', e.rodada === antes.rodada && e.total === antes.total && e.escolhida === antes.escolhida && e.fase === 'escolher', JSON.stringify({ antes, e }));
  await tocarNo(PRONTO);
  checar('3 × 3 em pedras: empatou, então vem uma RODADA EXTRA (a 4ª, com a estrela dourada no alto)', await esperarAte(`c.rodada === 4 && c.fase === 'dados' && c.decisiva`, 15000)
    && (await jg(`return c.trilha.estados.join();`)) === 'feita,feita,feita,decisiva');
  await captura('13a-rodada-extra');
  await esperar(600);
  const ex = await jg(`return { vagas: [c.bandejas.v.vagas, c.bandejas.c.vagas], passo: c.bandejas.v.passo, quem: c.pergunta.quem, fase: c.fase };`);
  checar('a extra abre uma vaga em cada bandeja, é a vez da criança', ex.vagas.join() === '4,4' && ex.passo === 108 && ex.quem === 'v', JSON.stringify(ex));
  await tocarNo('c.dado1');
  await esperarAte(`c.fase === 'escolher'`, 6000);
  checar('com os dados da criança na mesa NADA do computador aparece antes da vez dele: sem prévia, sem lançamento compartilhado', (await jg(`return c.selo === undefined && c.totaisComputador.length === 3 && c.pergunta.quem === 'v' && c.pergunta.total === c.total;`)));
  await esperar(500);
  await captura('13a2-extra-vez-da-crianca');
  // Prepara o azar do computador: esgota todas as pedras de OUTRO total e manda os dados dele caírem nele.
  const forcaExtra = await jg(`const T = c.total; const X = [...new Set(c.pecas.filter((p) => p.livre).map((p) => p.soma))].find((s) => s !== T);
    c.pecas.filter((p) => p.livre && p.soma === X).forEach((p) => { p.livre = false; p.no.visible = false; c.mesa.vagas[p.vaga].vazia = true; });
    const d1 = Math.max(1, Math.min(6, X - 1)); c.cpuForcado = { d1, d2: X - d1, total: X };
    return { T, X, livresDeX: c.pecas.filter((p) => p.livre && p.soma === X).length };`);
  checar('(preparo) o total que o computador vai rolar é diferente do da criança e já está esgotado', forcaExtra.X !== forcaExtra.T && forcaExtra.livresDeX === 0, JSON.stringify(forcaExtra));
  await jg(`c.regras.cpuEsperaMs = 1800; c.regras.cpuPensaMs = 500;`);
  await tocarNo(CERTA);
  await tocarNo(PRONTO);
  checar('na extra a criança joga primeiro e leva a pedra (4 × 3)', await esperarAte(`c.levadas.v.length === 4`, 6000));
  checar('depois joga o computador, com os PRÓPRIOS dados (outro total), cai num total esgotado e fica SEM pedra: a vaga dele vira ✕',
    await esperarAte(`c.cpuEtapa === 'sem'`, 8000)
    && (await jg(`return c.bandejas.c.perdidas[3] === true && c.pergunta.total === ${forcaExtra.X} && c.pergunta.total !== ${forcaExtra.T} && c.levadas.c.length === 3;`)));
  await captura('13b-computador-sem-pedra');
  await jg(`c.regras.cpuEsperaMs = 100; c.regras.cpuPensaMs = 100;`);
  checar('a partida termina na extra: vitória por 4 pedras × 3 e vai ao resultado', await esperarAte(`c.constructor.name === 'ResultScreen'`, 15000));
  await esperar(800);
  await captura('13-resultado-vitoria');

  // ----------------------------------------------------------- 7. os níveis
  console.log('\n7. Os três níveis');
  await abrirNivel(1);
  let n = await jg(`return { pecas: c.pecas.length, maxFace: Math.max(...c.pecas.map((p) => p.b)), rodadas: c.totalRodadas, nomes: c.bandejas.v.nomes, alg: c.nivel.alg, ajuda: c.nivel.ajuda };`);
  checar('Fácil: 10 pedras de faces 1 a 4, 3 rodadas, nomes escritos', n.pecas === 10 && n.maxFace === 4 && n.rodadas === 3 && n.nomes === true && n.alg === false, JSON.stringify(n));
  await esperar(300);
  await captura('14-facil-dados');
  await jogarDados();
  checar('Fácil: nada do computador aparece antes da vez dele', (await jg(`return c.selo === undefined && c.totaisComputador.length === 0 && c.pergunta.quem === 'v';`)));
  await tocarNo(ERRADA); await tocarNo(PRONTO);
  await esperarAte(`c.errosRodada === 1 && c.fase === 'escolher'`, 4000);
  await esperar(1500);
  let ajudaAcesa = await jg(`return c.pecas.filter((p) => p.no.efeitos.dica > 0.5).length;`);
  checar('Fácil: no 1º erro NENHUMA pedra acende', ajudaAcesa === 0, `acesas=${ajudaAcesa}`);
  checar('errar NÃO muda o marcador do alto (ele não tem dono; quem decide são as pedras)', (await jg(`return c.trilha.estados[0];`)) === 'vazia');
  await tocarNo(ERRADA); await tocarNo(PRONTO);
  await esperarAte(`c.errosRodada === 2 && c.fase === 'escolher'`, 4000);
  await esperar(800);
  ajudaAcesa = await jg(`return c.pecas.filter((p) => p.livre && p.soma === c.total && p.no.efeitos.dica > 0.95).length;`);
  const acesaErrada = await jg(`return c.pecas.filter((p) => p.no.efeitos.dica > 0.05 && p.soma !== c.total).length;`);
  checar('Fácil: no 2º erro uma pedra CERTA acende (e nenhuma errada)', ajudaAcesa === 1 && acesaErrada === 0, `certa=${ajudaAcesa} errada=${acesaErrada}`);
  await captura('15-facil-ajuda');

  console.log('\n5c. A vez que passa: conta revelada, vaga vazia, pedra na mesa');
  await tocarNo(ERRADA); await tocarNo(PRONTO);
  await esperarAte(`c.errosRodada === 3 && c.fase === 'escolher'`, 4000);
  checar('Fácil: no 3º erro a vez AINDA não passa (o limite é o 4º)', (await estado()).fase === 'escolher');
  await jg(`c.regras.revelaMs = 2500;`);
  await tocarNo(ERRADA); await tocarNo(PRONTO);
  checar('Fácil: no 4º erro a vez da criança PASSA', await esperarAte(`c.fase === 'passando'`, 4000));
  checar('a conta é revelada', await esperarAte(`c.passouEtapa === 'revela'`, 6000));
  await esperar(600);
  const rev = await jg(`const certa = c.certaRevelada; window.__certaRevelada = certa;
    return { soma: certa.soma, total: c.total, conta: certa.no.efeitos.conta, dica: certa.no.efeitos.dica,
      outras: c.pecas.filter((q) => q.livre && q !== certa).every((q) => q.no.efeitos.apagada > 0.9) };`);
  checar('a pedra revelada soma o total, mostra a conta e acende; as outras escurecem', rev.soma === rev.total && rev.conta > 0.95 && rev.dica > 0.95 && rev.outras === true, JSON.stringify(rev));
  await captura('15b-vez-passou');
  checar('a rodada segue para o computador e fecha', await esperarAte(`c.rodada === 2 && c.fase === 'dados'`, 20000));
  await jg(`c.regras.revelaMs = 200;`);
  e = await estado();
  const perdeu = await jg(`return { vagaVazia: c.bandejas.v.perdidas[0] === true, vezes: c.vezesPerdidas, criancaLevou: c.levadas.v.includes(window.__certaRevelada),
    pedras: { v: c.levadas.v.length, c: c.levadas.c.length }, marcador: c.trilha.estados[0], conta: window.__certaRevelada.no.efeitos.conta };`);
  checar('a vaga da criança na bandeja ficou VAZIA (✕) e a vez perdida foi contada', perdeu.vagaVazia === true && perdeu.vezes === 1, JSON.stringify(perdeu));
  checar('a criança NÃO levou a pedra e a conta sumiu', perdeu.criancaLevou === false && perdeu.conta < 0.05, JSON.stringify(perdeu));
  checar('o computador jogou normalmente depois (1 pedra dele, 0 da criança) e a rodada está feita', perdeu.pedras.v === 0 && perdeu.pedras.c === 1 && perdeu.marcador === 'feita', JSON.stringify({ perdeu, e }));
  await captura('15c-depois-da-vez-passada');
  await esperar(800);
  ajudaAcesa = await jg(`return c.pecas.filter((p) => p.no.efeitos.dica > 0.01 || p.no.efeitos.apagada > 0.01).length;`);
  checar('Fácil: na rodada seguinte a ajuda e o escurecimento saem', ajudaAcesa === 0, `acesas=${ajudaAcesa}`);

  await abrirNivel(2);
  await jogarDados();
  for (let k = 1; k <= 2; k++) {
    await tocarNo(ERRADA); await tocarNo(PRONTO);
    await esperarAte(`c.errosRodada === ${k} && c.fase === 'escolher'`, 4000);
    await esperar(700);
    const acesas = await jg(`return c.pecas.filter((p) => p.no.efeitos.dica > 0.01 || p.no.efeitos.apagada > 0.01).length;`);
    checar(`Médio: no ${k}º erro NENHUMA pedra acende nem escurece (a dica é só do Fácil)`, acesas === 0, `acesas=${acesas}`);
  }
  await tocarNo(ERRADA); await tocarNo(PRONTO);
  checar('Médio: no 3º erro a vez da criança PASSA', await esperarAte(`c.fase === 'passando'`, 4000));
  await esperarAte(`c.rodada === 2 && c.fase === 'dados'`, 20000);

  console.log('\n5d. Sem prévia: no Médio e no Difícil o total do computador só aparece na vez dele');
  await abrirNivel(2);
  await jogarDados();
  await esperar(500);
  const previa = await jg(`return { selo: c.selo, totais: c.totaisComputador.length, quem: c.pergunta.quem, perg: c.pergunta.total, total: c.total,
    forcado: c.cpuForcado };`);
  checar('Médio: com os dados da criança na mesa não há selo nem total do computador (a pergunta é só da criança)',
    previa.selo === undefined && previa.totais === 0 && previa.quem === 'v' && previa.perg === previa.total && previa.forcado === null, JSON.stringify(previa));
  await captura('15d-sem-previa-medio');
  await jg(`c.regras.cpuEsperaMs = 1500; c.regras.cpuPensaMs = 500;`);
  await tocarNo(CERTA);
  await tocarNo(PRONTO);
  checar('só na vez dele aparece o total do computador, na pergunta, com o selo azul', await esperarAte(`c.cpuEtapa === 'marcou'`, 8000)
    && (await jg(`return c.pergunta.quem === 'c' && c.pergunta.total === c.totaisComputador[0] && c.totaisComputador.length === 1;`)));
  await captura('15e-vez-do-computador-medio');
  await jg(`c.regras.cpuEsperaMs = 100; c.regras.cpuPensaMs = 100;`);

  await abrirNivel(3);
  n = await jg(`return { pecas: c.pecas.length, rodadas: c.totalRodadas, alg: c.pecas[0].no.alg, ajuda: c.nivel.ajuda, marcadores: c.trilha.estados.length };`);
  checar('Difícil: 21 pedras com algarismos, 5 rodadas, sem ajuda', n.pecas === 21 && n.rodadas === 5 && n.alg === true && n.ajuda === 0 && n.marcadores === 5, JSON.stringify(n));
  await esperar(300);
  await captura('16-dificil-dados');
  // O computador joga em TODA rodada do Difícil, também quando a criança não erra nada.
  for (let r = 1; r <= 2; r++) {
    await jogarDados();
    await tocarNo(CERTA); await tocarNo(PRONTO);
    const jogou = await esperarAte(`c.fase === 'cpu'`, 6000);
    await esperarAte(`c.rodada === ${r + 1} && c.fase === 'dados'`, 15000);
    e = await estado();
    checar(`Difícil, rodada ${r} perfeita: o computador JOGOU e levou a pedra dele (${e.c} na bandeja dele)`, jogou && e.v === r && e.c === r, JSON.stringify(e));
  }
  await captura('16b-dificil-computador');
  await jogarDados();
  await captura('17-dificil-pergunta');
  await tocarNo(ERRADA); await tocarNo(PRONTO);
  await esperarAte(`c.errosRodada === 1 && c.fase === 'escolher'`, 4000);
  await esperar(900);
  const acesasDificil = await jg(`return c.pecas.filter((p) => p.no.efeitos.dica > 0.01).length;`);
  checar('Difícil: no 1º erro nenhuma pedra acende (sem ajuda)', acesasDificil === 0, `acesas=${acesasDificil}`);
  await jg(`c.regras.revelaMs = 2500;`);
  await tocarNo(ERRADA); await tocarNo(PRONTO);
  checar('Difícil: no 2º erro a vez PASSA (sem ajuda antes)', await esperarAte(`c.fase === 'passando'`, 4000));
  checar('Difícil: a conta é revelada na pedra', await esperarAte(`c.passouEtapa === 'revela'`, 6000));
  await esperar(600);
  const revD = await jg(`const certa = c.certaRevelada; return { conta: certa.no.efeitos.conta, soma: certa.soma, total: c.total, alg: certa.no.alg };`);
  checar('Difícil: a pedra revelada (com algarismos) soma o total e mostra a conta', revD.conta > 0.95 && revD.soma === revD.total && revD.alg === true, JSON.stringify(revD));
  await captura('17b-dificil-passou');
  checar('Difícil: depois da vez perdida o computador joga e a rodada seguinte começa', await esperarAte(`c.rodada === 4 && c.fase === 'dados'`, 20000));
  await jg(`c.regras.revelaMs = 200;`);
  e = await estado();
  checar('Difícil: a criança tem 2 pedras e 1 vaga vazia (✕); o computador, 3', e.v === 2 && e.c === 3 && (await jg(`return c.bandejas.v.perdidas[2] === true && c.vezesPerdidas === 1;`)), JSON.stringify(e));

  // -------------------------------------- 8. toque num celular em pé
  console.log('\n8. Toque (touch) num celular EM PÉ, com o conteúdo girado');
  await cdp.enviar('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, s);
  await cdp.enviar('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }, s);
  await cdp.enviar('Page.navigate', { url: JOGO_URL }, s);
  ok = false;
  for (let i = 0; i < 80 && !ok; i++) {
    ok = await aval('!!(window.jogo && window.jogo.cena && window.jogo.rodando)').catch(() => false);
    if (!ok) await esperar(250);
  }
  await instalar();
  await esperar(1200);
  modoToque = true;
  const giro = await aval(`window.jogo.stage.giro`);
  checar('em pé, o motor gira o conteúdo', giro === 90 || giro === -90, `giro=${giro}`);
  await captura('18-celular-menu');
  checar('toque em JOGAR leva aos níveis', await tocarNo(BTN('/^jogar$/i')) && await esperarAte(`c.constructor.name === 'LevelSelectScreen'`, 5000));
  await instalar();
  checar('toque no cartão MÉDIO abre a partida',
    await tocarNo(`${W}.__achar(c, (n) => n.nivel && n.nivel.id === 2)`) && await esperarAte(`c.constructor.name === 'GameScene'`, 6000));
  await instalar();
  await jg(RAPIDO);
  checar('toque num dado rola e traz a pergunta (celular em pé)', await jogarDados());
  await tocarNo(ERRADA);
  e = await estado();
  checar('toque numa pedra a marca (celular em pé)', e.escolhida != null && e.prontoHabilitado === true, JSON.stringify(e));
  await tocarNo(CERTA);
  await tocarNo(PRONTO);
  checar('toque em PRONTO confere a pedra (celular em pé)', await esperarAte(`c.fase === 'levando' || c.rodada === 2`, 4000));
  await captura('19-celular-partida');
  modoToque = false;
  await cdp.enviar('Emulation.setTouchEmulationEnabled', { enabled: false }, s);
  await cdp.enviar('Emulation.clearDeviceMetricsOverride', {}, s);

  };
  if (!SO_IFRAME) await sessaoDaPagina();

  // ----------------------------------------------- 9. o AVA dentro do iframe
  console.log('\n9. AVA: a mensagem cruza o <iframe>; replay; sem duplicata');
  await cdp.enviar('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false }, s);
  await cdp.enviar('Page.navigate', { url: `http://127.0.0.1:${PORTA}/tools/ava-teste.html` }, s);
  await esperar(2500);
  await aval(`document.getElementById('quadro').src = '${JOGO_URL}'; true;`);
  W = `document.getElementById('quadro').contentWindow`;
  OFF = `(() => { const r = document.getElementById('quadro').getBoundingClientRect(); return { x: r.left, y: r.top }; })()`;
  ok = false;
  for (let i = 0; i < 80 && !ok; i++) {
    ok = await aval(`!!(${W}.jogo && ${W}.jogo.cena && ${W}.jogo.rodando)`).catch(() => false);
    if (!ok) await esperar(250);
  }
  checar('o jogo carregou dentro do iframe', ok);
  await aval(`window.__recebidas = []; window.addEventListener('message', (e) => { let d = e.data; if (typeof d === 'string') { try { d = JSON.parse(d); } catch { return; } } if (d && d.type === 'JOGO_CONCLUIDO') window.__recebidas.push(d); }); true;`);
  await instalar();
  await esperar(1200);
  await captura('20-iframe-menu');

  const abrirFacil = async () => {
    await tocarNo(BTN('/^jogar$/i'));
    await esperarAte(`c.constructor.name === 'LevelSelectScreen'`, 5000);
    await instalar();
    await tocarNo(`${W}.__achar(c, (n) => n.nivel && n.nivel.id === 1)`);
    await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
    await instalar();
    await jg(RAPIDO);
  };
  const recebidas = () => aval(`window.__recebidas`);

  await abrirFacil();
  const p1 = await partida([0, 0, 0]);
  checar('1ª partida (Fácil, sem erros) chegou ao resultado', p1.ok, JSON.stringify(p1));
  await esperar(900);
  await captura('21-iframe-vitoria');
  let m = await recebidas();
  checar('a vitória chegou ao pai: exatamente 1 mensagem', m.length === 1, `n=${m.length}`);
  const m1 = m[0] ?? {};
  checar('1ª mensagem: jogo, nivel 1, total 3, vitoria, acertos 3, erros 0',
    m1.jogo === 'subtraindo-o-domino' && m1.nivel === 1 && m1.totalPerguntas === 3 && m1.vitoria === true && m1.acertos === 3 && m1.erros === 0, JSON.stringify(m1));
  checar('os extras dizem como foi (vitória em rodada extra: 3 limpas, 1 ou mais extras, a criança com 3 + extras pedras)',
    m1.desfecho === 'vitoria' && m1.rodadasLimpas === 3 && m1.rodadasExtras >= 1 && m1.pedrasCrianca === 3 + m1.rodadasExtras
      && m1.pedrasComputador >= 2 + m1.rodadasExtras && m1.pedrasComputador <= 3 + m1.rodadasExtras, JSON.stringify(m1));
  checar('cada um jogou os PRÓPRIOS dados em toda rodada, extras incluídas (3 + extras totais de cada um)',
    m1.totais?.length === 3 + m1.rodadasExtras && m1.totaisComputador?.length === 3 + m1.rodadasExtras, JSON.stringify({ c: m1.totaisComputador, v: m1.totais }));
  await esperar(4000);
  m = await recebidas();
  checar('ficar parado no resultado NÃO duplica o registro', m.length === 1, `n=${m.length}`);

  // Replay pelo botão JOGAR DE NOVO — e dessa vez perde de propósito: 4 erros na 1ª rodada (o limite do Fácil)
  // fazem a vez da criança passar, e ela fica com 2 pedras contra 3 do computador.
  checar('toque em JOGAR DE NOVO volta à partida', await tocarNo(BTN('/jogar de novo/i')) && await esperarAte(`c.constructor.name === 'GameScene'`, 6000));
  await instalar();
  await jg(RAPIDO);
  const p2 = await partida([4, 0, 0]);
  checar('2ª partida (a vez passou na 1ª rodada) chegou ao resultado', p2.ok, JSON.stringify(p2));
  await esperar(900);
  await captura('22-iframe-derrota');
  m = await recebidas();
  checar('o replay gera um novo registro: exatamente 2 mensagens', m.length === 2, `n=${m.length}`);
  const m2 = m[1] ?? {};
  checar('2ª mensagem é DERROTA: vitoria false, acertos 2 (as pedras dela), erros 4, total 3',
    m2.vitoria === false && m2.acertos === 2 && m2.erros === 4 && m2.totalPerguntas === 3, JSON.stringify(m2));
  checar('os erros batem com o que foi jogado (4 PRONTOs errados)', p2.feitos === 4 && m2.erros === p2.feitos && m2.errosPronto === 4, JSON.stringify({ feitos: p2.feitos, m2 }));
  checar('a derrota diz: derrota, 2 × 3 pedras, 1 rodada com falha, 1 vez perdida, sem decisiva',
    m2.desfecho === 'derrota' && m2.pedrasCrianca === 2 && m2.pedrasComputador === 3 && m2.rodadasComFalha === 1 && m2.vezesPerdidas === 1 && m2.rodadasExtras === 0, JSON.stringify(m2));
  checar('a tela de derrota é a da série', await jg(`return c.constructor.name === 'ResultScreen';`));

  // O Difícil (5 rodadas), partida limpa: nota 5.
  await jg(`c.irPara('jogando', { nivel: j.config.niveis[2] }); return true;`);
  await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
  await instalar();
  await jg(RAPIDO);
  const p3 = await partida([0, 0, 0, 0, 0]);
  checar('3ª partida (Difícil, 5 rodadas, sem erros) chegou ao resultado', p3.ok, JSON.stringify(p3));
  await esperar(900);
  await captura('23-iframe-dificil');
  m = await recebidas();
  const m3 = m[2] ?? {};
  checar('3ª mensagem: nivel 3, total 5, vitoria, acertos 5, erros 0',
    m.length === 3 && m3.nivel === 3 && m3.totalPerguntas === 5 && m3.vitoria === true && m3.acertos === 5 && m3.erros === 0, JSON.stringify(m3));
  // O Difícil tem as extras aleatórias: o computador jogou todas as rodadas (5, mais as extras) e a criança venceu.
  checar('Difícil: o computador jogou todas as rodadas (5, mais a decisiva se houve) e a criança venceu com mais pedras',
    m3.totaisComputador?.length === 5 + m3.rodadasExtras && m3.pedrasCrianca === 5 + m3.rodadasExtras && m3.pedrasComputador < m3.pedrasCrianca, JSON.stringify(m3));

  const validas = await aval(`document.querySelectorAll('#registro .msg.valida').length`);
  const invalidas = await aval(`document.querySelectorAll('#registro .msg.invalida').length`);
  checar('o host do AVA valida as três mensagens contra o contrato', validas === 3 && invalidas === 0, `válidas=${validas} inválidas=${invalidas}`);
  await esperar(3000);
  m = await recebidas();
  checar('parado no resultado também NÃO duplica', m.length === 3, `n=${m.length}`);

  // iframe PEQUENO: o jogo não pode cortar nem deformar.
  await aval(`(() => { const f = document.getElementById('moldura'); f.style.width = '420px'; f.style.height = '260px'; })()`);
  await esperar(900);
  await captura('24-iframe-pequeno');
  const escalaPequena = await aval(`${W}.jogo.stage.escala`);
  checar('num iframe pequeno o jogo se reduz sem deformar (escala única)', escalaPequena > 0 && escalaPequena < 0.7, `escala=${escalaPequena}`);

  // Os quatro tamanhos do host (Celular, Pequeno, Médio, Grande): o canvas cabe na moldura.
  for (const tam of ['400x700', '640x480', '760x500', '1280x720']) {
    await aval(`document.querySelector('[data-tam="${tam}"]').click(); true;`);
    await esperar(900);
    const medida = await aval(`(() => { const f = document.getElementById('quadro'); const r = f.getBoundingClientRect();
      const st = ${W}.jogo.stage; const cv = st.canvas.getBoundingClientRect();
      return { moldura: [Math.round(r.width), Math.round(r.height)], canvas: [Math.round(cv.width), Math.round(cv.height)], escala: st.escala, giro: st.giro }; })()`);
    const [mw, mh] = medida.moldura; const [cw, ch] = medida.canvas;
    checar(`iframe ${tam}: o jogo cabe na moldura (${cw}×${ch} em ${mw}×${mh})`, cw <= mw + 1 && ch <= mh + 1 && medida.escala > 0, JSON.stringify(medida));
    await captura(`25-iframe-${tam}`);
  }
  await aval(`document.querySelector('[data-tam="760x500"]').click(); true;`);
  await esperar(600);

  // --------------------------------------------------------- 10. o console
  console.log('\n10. O console da sessão inteira');
  const reais = erros.filter((x) => !/favicon|net::ERR_ABORTED/i.test(x));
  checar('nenhum erro de JavaScript nem requisição quebrada', reais.length === 0, reais.slice(0, 5).join(' | '));
  const guarda = avisos.filter((x) => /watchdog|cão de guarda|travad|resgat/i.test(x));
  checar('o Watchdog não disparou em nenhuma partida normal', guarda.length === 0, guarda.slice(0, 3).join(' | '));
  const GRAVADAS = ['numero2', 'numero3', 'numero4', 'numero5', 'numero6', 'numero7', 'numero8', 'numero9', 'suaVez', 'muitoBem', 'tenteDeNovo'];
  const registrados = await jg(`return ${JSON.stringify(GRAVADAS)}.map((id) => [id, j.audio.temSom(id)]);`);
  const faltam = registrados.filter(([, tem]) => !tem).map(([id]) => id);
  checar('as 11 falas já declaradas (numero2–9, suaVez, muitoBem, tenteDeNovo) estão registradas no motor', faltam.length === 0, `faltam: ${faltam.join(', ')}`);
  const semGravadas = avisos.filter((x) => /"(numero[2-9]|suaVez|muitoBem|tenteDeNovo)"/.test(x));
  checar('as falas declaradas não geram aviso de áudio ausente', semGravadas.length === 0, semGravadas.slice(0, 3).join(' | '));
  const ausentes = [...new Set(avisos.filter((x) => /áudio|audio|narra|falta/i.test(x)).map((x) => x.replace(/\s+/g, ' ').slice(0, 90)))];
  console.log(`  avisos de narração ainda não gravada (esperados): ${ausentes.length}`);
  for (const a of ausentes.slice(0, 6)) console.log(`    · ${a}`);

  // -------------------------------------------- 11. trocar de aba e voltar
  console.log('\n11. Trocar de aba e voltar');
  await aval(`(() => { const f = document.getElementById('moldura'); f.style.width = ''; f.style.height = ''; })()`);
  await esperar(700);
  await aval(`${W}.jogo.irPara('jogando', { nivel: ${W}.jogo.config.niveis[1] })`);
  await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
  await instalar();
  await jg(RAPIDO);
  await jogarDados();
  await tocarNo(ERRADA);
  const antesAba = await estado();
  const ocultar = (oculto) => aval(`(() => { const w = ${W};
    Object.defineProperty(w.document, 'hidden', { configurable: true, get: () => ${oculto} });
    w.document.dispatchEvent(new w.Event('visibilitychange')); return w.jogo.rodando; })()`);
  checar('com a aba oculta, o laço do jogo para', (await ocultar(true)) === false);
  await esperar(1500);
  checar('ao voltar para a aba, o laço retoma', (await ocultar(false)) === true);
  e = await estado();
  checar('a rodada, o total e a pedra marcada sobrevivem à troca de aba',
    e.rodada === antesAba.rodada && e.total === antesAba.total && e.escolhida === antesAba.escolhida && e.fase === 'escolher', JSON.stringify({ antesAba, e }));
  await tocarNo(CERTA);
  e = await estado();
  checar('depois de voltar, o jogo continua respondendo ao toque', e.escolhida != null && e.escolhida !== antesAba.escolhida, JSON.stringify(e));

  // ------------------------------------------- 12. o Watchdog resgata a partida
  console.log('\n12. Watchdog: uma cadeia cortada no meio é resgatada');
  await aval(`${W}.jogo.irPara('jogando', { nivel: ${W}.jogo.config.niveis[0] })`);
  await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
  await instalar();
  await jg(RAPIDO);
  // Quebra UMA vez a parada dos dados: o `Tween.chamar` engole a exceção e a rodada fica sem ninguém
  // para continuá-la — exatamente o travamento que o cão de guarda vigia.
  await jg(`let vezes = 0; const o = c._dadosParam.bind(c);
    c._dadosParam = () => { if (vezes++ === 0) throw new Error('falha simulada no teste'); return o(); }; return true;`);
  const errosAntes = erros.length;
  await esperarAte(`c.fase === 'dados'`, 6000);
  await tocarNo('c.dado1');
  const preso = await esperarAte(`c.fase === 'rolando' && c.dado1.rolando`, 3000);
  checar('os dados rolaram até o ponto onde a falha foi plantada', preso);
  const resgatou = await esperarAte(`c.fase === 'escolher'`, 40000);
  checar('o jogo NÃO fica preso: o Watchdog leva à pergunta', resgatou);
  const novos = erros.slice(errosAntes);
  checar('o resgate ficou registrado como erro no console (Watchdog)', novos.some((x) => /Watchdog/.test(x)), JSON.stringify(novos));
  checar('o console só tem a falha simulada e o resgate', novos.every((x) => /Watchdog|Tween.chamar|falha simulada/.test(x)), JSON.stringify(novos));
  await tocarNo(CERTA);
  await tocarNo(PRONTO);
  checar('depois do resgate, a rodada fecha normalmente', await esperarAte(`c.rodada === 2 && c.fase === 'dados'`, 20000));

  console.log('\n12b. Watchdog: a VEZ DO COMPUTADOR cortada no meio também é resgatada');
  await jg(`let vezes = 0; const o = c._cpuDadosParam.bind(c);
    c._cpuDadosParam = () => { if (vezes++ === 0) throw new Error('falha simulada na vez do computador'); return o(); }; return true;`);
  const errosAntes2 = erros.length;
  await jogarDados();
  await tocarNo(CERTA);
  await tocarNo(PRONTO);
  checar('o computador começou a jogar e a falha foi plantada', await esperarAte(`c.fase === 'cpu' && c.cpuEtapa === 'dados'`, 6000));
  checar('o jogo NÃO fica preso: o Watchdog leva a vez do computador até o fim da rodada', await esperarAte(`c.rodada === 3 && c.fase === 'dados'`, 40000));
  const novos2 = erros.slice(errosAntes2);
  checar('o resgate da vez do computador ficou registrado (Watchdog) e o computador levou a pedra dele', novos2.some((x) => /Watchdog/.test(x)) && (await estado()).c === 2, JSON.stringify(novos2));
} catch (err) {
  falharam++;
  problemas.push(`o teste quebrou: ${err.stack ?? err}`);
  console.error(err);
} finally {
  try { chrome.kill(); } catch { /* já fechado */ }
  await esperar(400);
  await rm(perfil, { recursive: true, force: true }).catch(() => {});
}

console.log(`\n${'='.repeat(56)}\n${passaram} passaram, ${falharam} falharam`);
if (falharam) {
  console.log('\nO que falhou:');
  for (const p of problemas) console.log(`  · ${p}`);
  process.exit(1);
}
console.log('Capturas em .capturas/subtraindo-o-domino/');
