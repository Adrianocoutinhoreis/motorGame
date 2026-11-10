/**
 * teste-profundo-cabo-de-guerra.mjs — a bateria de PRÉ-LANÇAMENTO do Cabo de Guerra.
 *
 * Complementa `teste-jogabilidade-` (o fluxo) e `teste-estresse-` (telas, rajadas, maratona):
 *
 *   P. REGRAS, em Node: centenas de milhares de cartas conferidas por um solucionador INDEPENDENTE
 *      (lê a pergunta escrita e refaz a conta), colisão de chaves, e uma simulação de partidas
 *      inteiras com as funções reais (quanto dura, quem ganha, se alguma não termina).
 *   C. CONTRASTE (WCAG), em Node: os pares texto/fundo da partida e da carta.
 *   T. TEXTO NA CARTA, no navegador: nenhuma pergunta, resposta ou conta estoura a carta.
 *   M. MACACO: toques aleatórios por todas as telas, sem erro de JavaScript nem travar.
 *   R. REPETIÇÃO: 15 partidas seguidas reiniciando; a memória e os tweens ativos não crescem.
 *   Z. REDIMENSIONAR: a janela muda de tamanho no meio da carta e o jogo continua certo.
 *   F. FLUIDEZ: quadros por segundo na tela parada e com a ficha andando.
 *
 * Precisa de `node tools/serve.mjs 8099` rodando.   node tools/teste-profundo-cabo-de-guerra.mjs [porta]
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORTA = Number(process.argv[2]) || 8099;
const PORTA_CDP = 9376;
const SAIDA = path.join(RAIZ, '.capturas', 'cabo-de-guerra-profundo');
const BASE = `http://127.0.0.1:${PORTA}/Games/numerandus/cabo-de-guerra`;
const NAVEGADORES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
];
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
// Só algumas partes: `node tools/teste-profundo-cabo-de-guerra.mjs 8099 RM` roda só R e M (letras: P C T W M R Z F).
const SO = (process.argv[3] ?? '').toUpperCase();
const QUERO = (l) => !SO || SO.includes(l);

let passaram = 0; let falharam = 0; const problemas = []; const notas = [];
const checar = (nome, cond, det = '') => {
  if (cond) { passaram++; console.log(`  ok   ${nome}`); }
  else { falharam++; problemas.push(`${nome} — ${det}`); console.log(`  FALHOU  ${nome}\n          ${det}`); }
};
const nota = (t) => { notas.push(t); console.log(`  nota ${t}`); };

// =====================================================================================
// P. REGRAS
// =====================================================================================
console.log('\nP. Regras: cartas conferidas por um solucionador independente e partidas simuladas');
if (QUERO('P')) {
  const R = await import(pathToFileURL(path.join(RAIZ, 'Games/numerandus/cabo-de-guerra/src/regras.js')).href);
  const cm = await import(pathToFileURL(path.join(RAIZ, 'Games/numerandus/cabo-de-guerra/src/config.js')).href);
  const cfg = cm.default ?? cm.config ?? Object.values(cm)[0];
  const num = (s) => (s.match(/\d+/g) ?? []).map(Number);

  /** Refaz a conta a partir do TEXTO da pergunta. Devolve o valor esperado (ou texto) ou `undefined` se não sabe. */
  const resolver = (c) => {
    const p = c.pergunta; const n = num(p);
    switch (c.grupo) {
      case 'multiplicacao': return n[0] * n[1];
      case 'antecessor': return n[0] - 1;
      case 'sucessor': return n[0] + 1;
      case 'dobro': return 2 * n[0];
      case 'triplo': return 3 * n[0];
      case 'metade': return n[0] / 2;
      case 'adicaoRepetida': return n.reduce((a, b) => a + b, 0);
      case 'soma': return n[0] + n[1];
      case 'garrafas': return n[0] * n[1];
      case 'sequencia': {
        const t = n.slice(0, 4); const d = t[1] - t[0];
        if (!(t[2] - t[1] === d && t[3] - t[2] === d)) return NaN;
        return t[3] + d;
      }
      case 'unidade': return c.tipo === 'capacidade' ? 'LITROS' : 'QUILOGRAMAS';
      default: return undefined;
    }
  };

  const falhas = []; const porChave = new Map(); const grupos = {}; let total = 0;
  for (const nivel of cfg.niveis) {
    for (let i = 0; i < 40000; i++) {
      const { carta: c } = R.sortearCarta(nivel.cartas, []);
      total++;
      grupos[c.grupo] = (grupos[c.grupo] ?? 0) + 1;
      const vs = c.opcoes.map((o) => o.valor);
      const esperado = resolver(c);
      const erro = (m) => { if (falhas.length < 8) falhas.push(`${m}: ${JSON.stringify(c)}`); };
      if (esperado === undefined || esperado !== c.certa) erro(`certa ${c.certa} ≠ refeita ${esperado}`);
      if (vs.length !== 3 || new Set(vs).size !== 3) erro('opções repetidas ou fora de 3');
      if (!vs.includes(c.certa)) erro('a certa não está nas opções');
      if (typeof c.certa === 'number' && (!Number.isInteger(c.certa) || vs.some((v) => !Number.isInteger(v) || v < 1))) erro('opção não inteira ou < 1');
      if (!c.conta.includes(String(c.certa)) && c.grupo !== 'unidade') erro('a conta mostrada não contém o resultado');
      if (c.pergunta !== c.pergunta.toUpperCase()) erro('pergunta fora de CAIXA ALTA');
      if (c.conta !== c.conta.toUpperCase()) erro('conta fora de CAIXA ALTA');
      if (c.grupo === 'unidade' && !c.conta.includes(c.certa)) erro('a conta da unidade não cita a unidade certa');
      // chave ⇔ pergunta: a mesma chave nunca pode vir com outra pergunta (senão "nenhuma repete" falha).
      const k = `${c.grupo}|${c.chave}`;
      if (porChave.has(k) && porChave.get(k) !== c.pergunta) erro(`a chave ${k} serve a duas perguntas`);
      porChave.set(k, c.pergunta);
    }
  }
  checar(`${total} cartas dos 3 níveis: a certa confere com a conta refeita a partir do texto, 3 opções distintas, inteiras e positivas`,
    falhas.length === 0, falhas.slice(0, 3).join('\n          '));
  const perguntasPorChave = new Map();
  for (const [k, p] of porChave) { if (perguntasPorChave.has(p)) perguntasPorChave.get(p).push(k); else perguntasPorChave.set(p, [k]); }
  const chavesDuplas = [...perguntasPorChave.values()].filter((l) => l.length > 1);
  checar('a mesma pergunta nunca tem duas chaves (senão ela repetiria na mesma partida)', chavesDuplas.length === 0, JSON.stringify(chavesDuplas.slice(0, 3)));
  nota(`distribuição dos grupos nos 120 000 sorteios: ${Object.entries(grupos).map(([g, v]) => `${g} ${(100 * v / total).toFixed(0)}%`).join(', ')}`);

  // As respostas erradas têm de ser plausíveis: nunca igual à certa; a "confusão" típica aparece bem mais do que o acaso.
  let conf = 0; let tot = 0;
  for (let i = 0; i < 20000; i++) {
    const a = R.gerarCarta('antecessor', [20, 90]); const n = Number(a.pergunta.match(/\d+/)[0]);
    tot++; if (a.opcoes.some((o) => o.valor === n + 1)) conf++;
  }
  checar(`antecessor: o sucessor (a confusão do vídeo) aparece entre as erradas em ${(100 * conf / tot).toFixed(0)}% das cartas (esperado 100%)`, conf === tot);

  // ---- partidas inteiras, com as funções reais
  const jogar = (passos, nivelCartas, pCrianca, pCpu = 0.75) => {
    let pos = passos; let vez = 'crianca'; let cartasCrianca = 0; let erros = 0; let jogadas = 0; let usadas = [];
    while (R.vencedorDaPartida(pos, passos) === null) {
      if (++jogadas > 600) return { travou: true };
      const dado = R.rolarDado();
      const s = R.sortearCarta(nivelCartas, usadas); usadas = s.usadas;
      const certo = vez === 'crianca' ? Math.random() < pCrianca : R.respostaDoComputador(s.carta, 1 - pCpu).certo;
      if (vez === 'crianca') { cartasCrianca++; if (!certo) erros++; }
      if (certo) pos = R.alvoDaPuxada(pos, vez, dado, passos);
      vez = vez === 'crianca' ? 'computador' : 'crianca';
    }
    const venceu = R.vencedorDaPartida(pos, passos) === 'crianca';
    return { venceu, cartasCrianca, erros, jogadas, nota: R.notaDaPartida({ vitoria: venceu, meta: passos, erros, progresso: Math.max(0, passos - pos) }) };
  };
  const linhas = [];
  let semTravar = true; let notaFora = false; let maiorPartida = 0;
  for (const nivel of cfg.niveis) {
    for (const p of [0.5, 0.75, 1]) {
      const N = 20000; let v = 0; let cs = []; let nt = 0;
      for (let i = 0; i < N; i++) {
        const r = jogar(nivel.passos, nivel.cartas, p);
        if (r.travou) { semTravar = false; continue; }
        v += r.venceu; cs.push(r.cartasCrianca); nt += r.nota;
        if (r.nota < 0 || r.nota > nivel.meta) notaFora = true;
        maiorPartida = Math.max(maiorPartida, r.cartasCrianca);
      }
      cs.sort((a, b) => a - b);
      linhas.push(`${nivel.nome} ${nivel.passos} passos, criança acerta ${Math.round(p * 100)}%: vence ${(100 * v / N).toFixed(0)}%, ${(cs.reduce((a, b) => a + b, 0) / N).toFixed(1)} cartas (p90 ${cs[Math.floor(N * 0.9)]}, máx ${cs[cs.length - 1]}), nota média ${(nt / N).toFixed(1)}/${nivel.meta}`);
    }
  }
  checar('180 000 partidas simuladas: todas terminam (nenhuma passa de 600 jogadas) e a nota fica entre 0 e a meta', semTravar && !notaFora);
  for (const l of linhas) nota(l);
  nota(`a partida mais longa da simulação: ${maiorPartida} cartas para a criança`);
}

// =====================================================================================
// C. CONTRASTE
// =====================================================================================
console.log('\nC. Contraste (WCAG 2.1) dos pares texto / fundo');
if (QUERO('C')) {
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const mistura = (fg, a, bg) => fg.map((c, i) => c * a + bg[i] * (1 - a));
  const razao = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const lerp = (a, b, t) => a.map((c, i) => c + (b[i] - c) * t);
  // o gramado do tema 'cabo' (Background.js): degradê vertical a partir do horizonte (y 262), com faixas brancas a 6%.
  const gramado = (y, faixa) => {
    const t = Math.min(1, Math.max(0, (y - 262) / (720 - 262)));
    const c = t < 0.45 ? lerp(hex('#4FB880'), hex('#2F9769'), t / 0.45) : lerp(hex('#2F9769'), hex('#1E7452'), (t - 0.45) / 0.55);
    return faixa ? mistura([255, 255, 255], 0.06, c) : c;
  };
  const BRANCO = [255, 255, 255];
  // [nome, cor do texto, alfa, fundo (o PIOR dos casos), tamanho px, negrito]
  const pares = [
    ['"FALTAM N" (branco, 28 px) sobre o gramado', BRANCO, 1, gramado(493, true), 28, true],
    ['nome da ponta inativa "VOCÊ / COMPUTADOR" (branco, 24 px)', BRANCO, 1, gramado(463, true), 24, true],
    ['"FALTAM N" do lado inativo (branco, 28 px)', BRANCO, 1, gramado(493, true), 28, true],
    ['"SUA VEZ" na barra de ação (30 px)', hex('#E7EBF2'), 1, mistura([255, 255, 255], 0.07, gramado(638, true)), 30, true],
    ['etiqueta da vez: branco sobre o vermelho da criança', BRANCO, 1, hex('#D8322F'), 22, true],
    ['etiqueta da vez: branco sobre a madeira escura do computador', BRANCO, 1, hex('#7A5626'), 22, true],
    ['botão JOGAR O DADO: branco sobre o azul', BRANCO, 1, hex('#2A57C2'), 32, true],
    ['carta: pergunta (tinta sobre o papel creme)', hex('#17203A'), 1, hex('#FFF7E8'), 36, true],
    ['carta: tipo da carta (marrom sobre o creme, 24 px)', hex('#7A5A22'), 1, hex('#FFF7E8'), 24, true],
    ['carta: "?" azul da conta (80 px)', hex('#2563EB'), 1, hex('#FFF7E8'), 80, true],
    ['carta: sinais da conta (marrom, 80 px)', hex('#7A5A22'), 1, hex('#FFF7E8'), 80, true],
    ['carta: "ACERTOU!" (verde escuro sobre o creme, 30 px)', hex('#126B3C'), 1, hex('#FFF7E8'), 30, true],
    ['carta: título de erro (laranja escuro sobre o creme, 30 px)', hex('#9A3412'), 1, hex('#FFF7E8'), 30, true],
    ['carta: resposta recusada (cinza sobre o fundo apagado)', [107, 114, 128], 1, mistura(hex('#FFFFFF'), 0.55, mistura(hex('#FFF7E8'), 0.5, [0, 0, 0])), 46, true],
    ['carta: "CONTINUAR" (escuro sobre o verde do botão)', hex('#052E16'), 1, hex('#22C55E'), 32, true],
    ['MOTOR · menu: "JOGAR" branco sobre o verde do botão (64 px)', BRANCO, 1, hex('#22C55E'), 64, true],
    ['MOTOR · menu: "COMO JOGAR" branco sobre o laranja (48 px)', BRANCO, 1, hex('#F59E0B'), 48, true],
  ];
  let reprovados = 0;
  for (const [nome, fg, a, bg, px, negrito] of pares) {
    const cor = mistura(fg, a, bg);
    const r = razao(cor, bg);
    const grande = px >= 24 || (negrito && px >= 18.66);
    const alvo = grande ? 3 : 4.5;
    const ok = r >= alvo;
    if (!ok) reprovados++;
    const linha = `${nome}: ${r.toFixed(2)}:1 (precisa de ${alvo}:1${grande ? ', texto grande' : ''})`;
    if (ok) console.log(`  ok   ${linha}`);
    else { notas.push(`CONTRASTE ABAIXO DO AA — ${linha}`); console.log(`  ABAIXO  ${linha}`); }
  }
  nota(`${pares.length - reprovados} de ${pares.length} pares passam no AA; os que ficaram abaixo estão marcados com ABAIXO acima`);
}

// =====================================================================================
// navegador
// =====================================================================================
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

const navegador = NAVEGADORES.find((c) => existsSync(c));
if (!navegador) { console.error('nenhum Chrome/Edge encontrado'); process.exit(2); }
mkdirSync(SAIDA, { recursive: true });
const perfil = path.join(os.tmpdir(), `cdg-profundo-${Date.now()}`);
const chrome = spawn(navegador, [
  '--headless=new', `--remote-debugging-port=${PORTA_CDP}`, `--user-data-dir=${perfil}`,
  '--no-first-run', '--disable-gpu', '--mute-audio', '--window-size=1280,860',
  '--autoplay-policy=no-user-gesture-required', '--js-flags=--expose-gc',
], { stdio: 'ignore' });

const erros = []; const avisos = [];
try {
  let v = null;
  for (let i = 0; i < 60 && !v; i++) { try { v = await (await fetch(`http://127.0.0.1:${PORTA_CDP}/json/version`)).json(); } catch { await esperar(250); } }
  if (!v) throw new Error('o navegador não abriu a porta de depuração');
  const cdp = await new CDP(v.webSocketDebuggerUrl).conectar();
  const { targetId } = await cdp.enviar('Target.createTarget', { url: 'about:blank' });
  const s = (await cdp.enviar('Target.attachToTarget', { targetId, flatten: true })).sessionId;
  await cdp.enviar('Runtime.enable', {}, s); await cdp.enviar('Log.enable', {}, s); await cdp.enviar('Page.enable', {}, s);
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
  const captura = async (nome) => { const r = await cdp.enviar('Page.captureScreenshot', { format: 'png' }, s); writeFileSync(path.join(SAIDA, `${nome}.png`), Buffer.from(r.data, 'base64')); };
  const esperarAte = async (corpo, ms = 15000, passo = 80) => {
    const fim = Date.now() + ms;
    while (Date.now() < fim) { if (await jg(`return !!(${corpo});`).catch(() => false)) return true; await esperar(passo); }
    return false;
  };
  const garantir = () => aval(`typeof window.__achar === 'function' || window.eval(${JSON.stringify(`
    window.__achar = (raiz, pred) => { let r = null; const v = (n) => { if (r) return; if (pred(n)) { r = n; return; } for (const f of (n.filhos || [])) v(f); }; v(raiz); return r; }; true;`)})`);
  const paraTela = (lx, ly) => aval(`(() => { const st = window.jogo.stage; const r = st.canvas.getBoundingClientRect();
    const cx = ${lx} * st.escala + st.deslocX; const cy = ${ly} * st.escala + st.deslocY; let x; let y;
    if (st.giro === 90) { x = r.width - cy; y = cx; } else if (st.giro === -90) { x = cy; y = r.height - cx; } else { x = cx; y = cy; }
    return { x: Math.round(r.left + x), y: Math.round(r.top + y) }; })()`);
  const mouse = (type, c, extra = {}) => cdp.enviar('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1, pointerType: 'mouse', ...extra }, s);
  const tocarLogico = async (lx, ly, pausa = 90) => { const c = await paraTela(lx, ly); await mouse('mousePressed', c, { buttons: 1 }); await esperar(30); await mouse('mouseReleased', c, { buttons: 0 }); if (pausa) await esperar(pausa); };
  const centro = async (busca) => { await garantir(); return jg(`const no = (${busca}); if (!no) return null; const p = no.localParaGlobal((no.largura ?? 0) / 2, (no.altura ?? 0) / 2); return { x: p.x, y: p.y };`); };
  const tocarNo = async (busca, pausa) => { const c = await centro(busca); if (!c) return false; await tocarLogico(c.x, c.y, pausa); return true; };
  const BTN = (re) => `window.__achar(c, (n) => typeof n.rotulo === 'string' && ${re}.test(n.rotulo) && n.visivelMundo)`;
  const OPCAO_CERTA = 'c.painel.botoes.find((b) => b.opcao && b.opcao.valor === c.vez.carta.certa)';
  const CONFERIR = (certo) => `c.painel.botoes.find((b) => b.estilo === '${certo ? 'sim' : 'nao'}')`;
  const CONTINUAR = "c.painel.botoes.find((b) => b.rotulo === 'CONTINUAR')";
  const RAPIDO = 'c.regras.rolarMs = 100; c.regras.passoMs = 60; c.regras.cpuEsperaMs = 80; c.regras.falaMaxMs = 0;';
  const abrirPartida = async (id) => {
    await cdp.enviar('Page.navigate', { url: `${BASE}/` }, s);
    await esperar(1500);
    if (!(await esperarAte("c && c.constructor.name === 'MenuScreen'", 15000))) return false;
    await esperar(700);
    await tocarNo(BTN('/^jogar$/i'));
    if (!(await esperarAte("c.constructor.name === 'LevelSelectScreen'", 5000))) return false;
    await esperar(900);
    await tocarNo(`window.__achar(c, (n) => n.nivel && n.nivel.id === ${id})`);
    return esperarAte("c.constructor.name === 'GameScene'", 6000);
  };

  // =================================================================== T. TEXTO NA CARTA
  console.log('\nT. Texto na carta: nada estoura (medido no navegador, com a mesma fonte da cena)');
  await cdp.enviar('Page.navigate', { url: `${BASE}/` }, s);
  await esperar(1500);
  await esperarAte("c && c.constructor.name === 'MenuScreen'", 15000);
  if (QUERO('T')) {
  const T = await aval(`(async () => {
    const R = await import('/Games/numerandus/cabo-de-guerra/src/regras.js');
    const D = await import('/Games/numerandus/cabo-de-guerra/src/desenho.js');
    const cm = await import('/Games/numerandus/cabo-de-guerra/src/config.js');
    const cfg = cm.default ?? cm.config ?? Object.values(cm)[0];
    const ctx = document.createElement('canvas').getContext('2d');
    const F = D.FONTE;
    const largura = (peso, px, t) => { ctx.font = peso + ' ' + px + 'px ' + F; return ctx.measureText(t).width; };
    const linhas = (peso, px, t, w) => { ctx.font = peso + ' ' + px + 'px ' + F; return D.quebrarLinhas(ctx, t, w).length; };
    const soConta = (t) => !/\\p{L}/u.test(t);
    const pior = { perguntaLinhas: [0, ''], tituloLinhas: [0, ''], detalheLinhas: [0, ''], opcaoPx: [99, ''], subLarg: [0, ''], contaPx: [99, ''], diz: [0, ''], opcoesTexto: [0, ''] };
    const maior = (k, v, t) => { if (v > pior[k][0]) pior[k] = [v, t]; };
    const menor = (k, v, t) => { if (v < pior[k][0]) pior[k] = [v, t]; };
    const vistas = new Set();
    for (const nivel of cfg.niveis) {
      for (let i = 0; i < 6000; i++) {
        const c = R.sortearCarta(nivel.cartas, []).carta;
        if (vistas.has(c.chave)) continue; vistas.add(c.chave);
        if (soConta(c.pergunta)) {
          // a conta em destaque (desenharConta): fonte até 80 px, encolhe para caber em 780 px
          const partes = c.pergunta.split(' ');
          const med = (px) => partes.reduce((a, p) => a + largura(800, px, p), 0) + px * 0.3 * (partes.length - 1);
          const px = Math.min(80, Math.floor(80 * 780 / Math.max(1, med(80))));
          menor('contaPx', px, c.pergunta);
        } else maior('perguntaLinhas', linhas(800, 36, c.pergunta, 780), c.pergunta);
        // o que o retorno mostra
        if (soConta(c.conta)) {
          const partes = c.conta.split(' ');
          const med = (px) => partes.reduce((a, p) => a + largura(800, px, p), 0) + px * 0.3 * (partes.length - 1);
          menor('contaPx', Math.min(50, Math.floor(50 * 940 / Math.max(1, med(50)))) * 1.6, 'retorno ' + c.conta);
        } else maior('tituloLinhas', linhas(800, 30, c.conta, 940), c.conta);
        for (const f of ['A FICHA VEM 9 CASAS PARA VOCÊ!', 'A FICHA VAI 9 CASAS PARA O COMPUTADOR.', 'A FICHA FICA PARADA.']) maior('detalheLinhas', linhas(700, 24, f, 940), f);
        for (const o of c.opcoes) {
          const w = largura(800, 46, o.texto);
          menor('opcaoPx', Math.min(46, Math.floor(46 * 246 / Math.max(1, w))), o.texto);
          if (o.sub) maior('subLarg', largura(700, 24, o.sub), o.sub);
          maior('opcoesTexto', o.texto.length, o.texto);
        }
        // "O COMPUTADOR DIZ: <resposta>" numa linha só
        const op = c.opcoes[0]; const tx = op.sub ? op.texto + ' ' + op.sub : op.texto;
        maior('diz', largura(800, 30, 'O COMPUTADOR DIZ:') + 18 + largura(800, 40, tx) + 36, tx);
      }
    }
    return { cartasDiferentes: vistas.size, pior };
  })()`);
  console.log(`  (${T.cartasDiferentes} cartas diferentes medidas)`);
  const P = T.pior;
  checar(`pergunta com texto: no máximo 2 linhas em 780 px (pior: ${P.perguntaLinhas[0]} linhas)`, P.perguntaLinhas[0] <= 2, P.perguntaLinhas[1]);
  checar(`conta no retorno (texto): 1 linha em 940 px (pior: ${P.tituloLinhas[0]})`, P.tituloLinhas[0] <= 1, P.tituloLinhas[1]);
  checar(`frases do retorno: 1 linha em 940 px (pior: ${P.detalheLinhas[0]})`, P.detalheLinhas[0] <= 1, P.detalheLinhas[1]);
  checar(`resposta de texto: a fonte encolhe no máximo até ${P.opcaoPx[0]} px (mínimo aceito 26 px) — "${P.opcaoPx[1]}"`, P.opcaoPx[0] >= 26, P.opcaoPx[1]);
  checar(`unidade embaixo da resposta cabe no botão de 270 px (pior ${Math.round(P.subLarg[0])} px)`, P.subLarg[0] <= 246, P.subLarg[1]);
  checar(`conta em destaque: a fonte nunca cai abaixo de 40 px (pior ${P.contaPx[0]} — "${P.contaPx[1]}")`, P.contaPx[0] >= 40, P.contaPx[1]);
  checar(`"O COMPUTADOR DIZ: …" numa linha só (pior ${Math.round(P.diz[0])} px de 940)`, P.diz[0] <= 940, P.diz[1]);
  }

  // =================================================================== W. avisos de console numa partida
  console.log('\nW. Uma partida inteira: avisos e erros no console');
  const antesW = avisos.length; const errosW = erros.length;
  if (!QUERO('W')) { /* pulado */ } else if (await abrirPartida(1)) {
    await jg(RAPIDO + ' return 1;');
    for (const fim = Date.now() + 120000; Date.now() < fim;) {
      if (await esperarAte("c.constructor.name === 'ResultScreen'", 40)) break;
      const st = await jg("return c.constructor.name === 'GameScene' ? { quem: c.vez.quem, fase: c.fase } : null;");
      if (st?.quem === 'crianca' && st.fase === 'dado') {
        await tocarNo('c.botaoDado');
        if (await esperarAte("c.fase === 'carta' && c.painel.alpha >= 1", 8000)) { await tocarNo(OPCAO_CERTA); await esperarAte("c.fase === 'retorno'", 4000); await tocarNo(CONTINUAR); }
      } else if (st?.fase === 'conferir') {
        await tocarNo(CONFERIR(await jg('return c.vez.resposta.certo;'))); await esperarAte("c.fase === 'retorno'", 4000); await tocarNo(CONTINUAR);
      } else await esperar(50);
    }
    const novos = avisos.slice(antesW);
    const unicos = [...new Set(novos.map((x) => x.replace(/\d+/g, 'N').slice(0, 70)))];
    checar('a partida terminou sem erro de JavaScript', erros.length === errosW, erros.slice(errosW, errosW + 3).join(' | '));
    nota(`avisos de console na partida: ${novos.length} no total, ${unicos.length} tipos (falas ainda sem gravação)`);
    checar('o console não é inundado (até 400 avisos numa partida)', novos.length <= 400, `${novos.length}`);
  } else checar('W: abriu a partida', false);

  // =================================================================== M. MACACO
  console.log('\nM. Macaco: toques aleatórios por todas as telas');
  if (QUERO('M')) {
    const antes = erros.length;
    await cdp.enviar('Page.navigate', { url: `${BASE}/` }, s);
    await esperar(1500);
    await esperarAte("c && c.constructor.name === 'MenuScreen'", 15000);
    const vistas = new Set();
    let n = 0;
    const alvos = [[640, 360], [640, 560], [1180, 60], [1090, 60], [1000, 60], [60, 60], [640, 400], [200, 400], [1000, 400]];
    for (const fim = Date.now() + 90000; Date.now() < fim && n < 700; n++) {
      const sorteio = Math.random();
      const [x, y] = sorteio < 0.35 ? alvos[Math.floor(Math.random() * alvos.length)] : [Math.random() * 1280, Math.random() * 720];
      await jg('return 1;').catch(() => {});
      await tocarLogico(x + (Math.random() - 0.5) * 30, y + (Math.random() - 0.5) * 30, 20 + Math.random() * 90);
      const cena = await jg('return c.constructor.name + (c.fase ? ":" + c.fase : "");').catch(() => 'erro');
      vistas.add(cena.split(':')[0]);
      if (n % 60 === 0 && cena.startsWith('ResultScreen')) await tocarNo(BTN('/menu/i')).catch(() => {});
    }
    checar(`${n} toques aleatórios: nenhum erro de JavaScript`, erros.length === antes, erros.slice(antes, antes + 3).join(' | '));
    nota(`telas visitadas pelo macaco: ${[...vistas].join(', ')}`);
    // depois do caos, o jogo ainda joga uma carta
    const ok = await abrirPartida(1);
    await jg(RAPIDO + ' return 1;').catch(() => {});
    let jogou = false;
    if (ok) { await tocarNo('c.botaoDado'); jogou = await esperarAte("c.fase === 'carta' && c.painel.alpha >= 1", 8000); if (jogou) { await tocarNo(OPCAO_CERTA); jogou = await esperarAte("c.fase === 'retorno'", 4000); } }
    checar('depois do macaco, o jogo ainda abre uma partida e responde uma carta', ok && jogou);
  }

  // =================================================================== R. REPETIÇÃO
  console.log('\nR. Repetição: 15 partidas seguidas reiniciando (vazamento de memória / tweens)');
  if (QUERO('R')) {
    const antes = erros.length;
    const medir = () => aval(`(async () => { if (window.gc) window.gc(); await new Promise((r) => setTimeout(r, 300)); if (window.gc) window.gc();
      const { Tween } = await import('/Games/numerandus/cabo-de-guerra/engine/core/Tween.js');
      const conta = (n) => 1 + (n.filhos || []).reduce((a, f) => a + conta(f), 0);
      return { heap: Math.round(performance.memory.usedJSHeapSize / 1024), tweens: Tween.quantidadeAtiva, nos: conta(window.jogo.cena) }; })()`);
    const ok0 = await abrirPartida(2);
    await jg(RAPIDO + ' return 1;');
    const m0 = ok0 ? await medir() : null;
    let ultimo = m0;
    const serie = [];
    for (let i = 1; i <= 15 && ok0; i++) {
      // joga uma carta e reinicia pela pausa (o caminho que a criança usa)
      await tocarNo('c.botaoDado');
      if (await esperarAte("c.fase === 'carta' && c.painel.alpha >= 1", 8000)) { await tocarNo(OPCAO_CERTA); await esperarAte("c.fase === 'retorno'", 4000); }
      await tocarNo(`window.__achar(c, (n) => n.icone === 'pausa' && n.visivelMundo)`);
      await esperar(300);
      await tocarNo(BTN('/come.ar de novo/i'));
      await esperar(600);
      if (!(await esperarAte("c.constructor.name === 'GameScene' && c.fase === 'dado'", 6000))) { checar(`reinício ${i}: voltou ao dado`, false); break; }
      await jg(RAPIDO + ' return 1;');
      ultimo = await medir(); serie.push(ultimo);
    }
    if (m0 && serie.length) {
      const heapIni = serie[0].heap; const heapFim = serie[serie.length - 1].heap;
      nota(`heap após cada reinício (KB): ${serie.map((x) => x.heap).join(', ')}`);
      nota(`nós na cena: ${serie.map((x) => x.nos).join(', ')} · tweens ativos: ${serie.map((x) => x.tweens).join(', ')}`);
      checar(`a quantidade de nós na cena não cresce com os reinícios (${serie[0].nos} → ${serie[serie.length - 1].nos})`, serie[serie.length - 1].nos <= serie[0].nos + 2);
      checar(`os tweens ativos não se acumulam (${serie[0].tweens} → ${serie[serie.length - 1].tweens})`, serie[serie.length - 1].tweens <= serie[0].tweens + 3);
      checar(`o heap não cresce sem parar (${heapIni} KB → ${heapFim} KB, limite +60%)`, heapFim <= heapIni * 1.6);
    } else checar('R: rodou os reinícios', false);
    checar('os reinícios não geraram erro de JavaScript', erros.length === antes, erros.slice(antes, antes + 3).join(' | '));
  }

  // =================================================================== Z. REDIMENSIONAR
  console.log('\nZ. Redimensionar a janela no meio da carta');
  if (QUERO('Z')) {
    const antes = erros.length;
    if (await abrirPartida(1)) {
      await jg(RAPIDO + ' c.dadoDeTeste = 4; return 1;');
      await tocarNo('c.botaoDado');
      await esperarAte("c.fase === 'carta' && c.painel.alpha >= 1", 8000);
      for (const [w, h, mobile] of [[800, 600, false], [390, 844, true], [844, 390, true], [1920, 1080, false], [1280, 720, false]]) {
        await cdp.enviar('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile }, s);
        await esperar(500);
        const est = await jg("return { fase: c.fase, carta: c.painel.visible, pos: c.pos };");
        checar(`janela ${w}×${h}: a carta continua aberta e o estado intacto`, est.fase === 'carta' && est.carta && est.pos === 7, JSON.stringify(est));
      }
      await captura('Z-depois-de-redimensionar');
      await tocarNo(OPCAO_CERTA);
      checar('depois de tudo, a resposta ainda funciona e a ficha anda (7 − 4 = 3)', await esperarAte("c.fase === 'retorno'", 4000)
        && (await tocarNo(CONTINUAR)) && await esperarAte("c.vez.quem === 'computador' && c.pos === 3", 8000));
      await cdp.enviar('Emulation.setDeviceMetricsOverride', { width: 1280, height: 860, deviceScaleFactor: 1, mobile: false }, s);
    } else checar('Z: abriu a partida', false);
    checar('redimensionar não gerou erro de JavaScript', erros.length === antes, erros.slice(antes, antes + 3).join(' | '));
  }

  // =================================================================== F. FLUIDEZ
  console.log('\nF. Fluidez (quadros por segundo; o Chrome sem GPU é pessimista)');
  if (QUERO('F')) {
    const fps = (ms) => aval(`new Promise((ok) => { let n = 0; let longos = 0; let ult = performance.now(); const t0 = ult;
      const f = (t) => { n++; if (t - ult > 50) longos++; ult = t; if (t - t0 < ${ms}) requestAnimationFrame(f); else ok({ fps: +(n * 1000 / (t - t0)).toFixed(1), longos }); };
      requestAnimationFrame(f); })`);
    if (await abrirPartida(3)) {
      const parado = await fps(3000);
      await jg('c.regras.passoMs = 900; c.regras.rolarMs = 100; c.dadoDeTeste = 6; return 1;');
      await tocarNo('c.botaoDado');
      await esperarAte("c.fase === 'carta' && c.painel.alpha >= 1", 8000);
      await tocarNo(OPCAO_CERTA); await esperarAte("c.fase === 'retorno'", 4000); await tocarNo(CONTINUAR);
      await esperarAte("c.fase === 'puxando'", 4000);
      const andando = await fps(2500);
      nota(`quadros por segundo: ${parado.fps} na tela parada (${parado.longos} quadros acima de 50 ms), ${andando.fps} com a ficha andando (${andando.longos} acima de 50 ms)`);
      checar('a tela da partida roda a pelo menos 20 fps mesmo sem GPU', parado.fps >= 20 && andando.fps >= 20, JSON.stringify({ parado, andando }));
    } else checar('F: abriu a partida', false);
  }

  checar('fim: nenhum erro de JavaScript em toda a bateria', erros.length === 0, erros.slice(0, 4).join(' | '));
} catch (e) {
  falharam++; problemas.push(`o teste quebrou: ${e.stack ?? e}`);
  console.log(`\n  FALHOU  o teste quebrou: ${e.stack ?? e}`);
} finally {
  chrome.kill(); await esperar(500); await rm(perfil, { recursive: true, force: true }).catch(() => {});
}

console.log('\n========================================================');
console.log(`${passaram} passaram, ${falharam} falharam`);
if (notas.length) { console.log('Observações:'); for (const n of notas) console.log(`  · ${n}`); }
if (problemas.length) { console.log('O que falhou:'); for (const p of problemas) console.log(`  · ${p}`); }
console.log(`Capturas em ${path.relative(RAIZ, SAIDA)}/`);
process.exit(falharam ? 1 : 0);
