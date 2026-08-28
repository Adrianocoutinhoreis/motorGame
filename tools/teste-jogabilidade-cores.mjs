#!/usr/bin/env node
/**
 * teste-jogabilidade-cores.mjs — a jogada do Jogo das Cores, com GESTO REAL.
 *
 * `testes.mjs` prova a lógica do `PathSelector` (18 testes, sem navegador).
 * Este arquivo prova o que só o navegador prova: que o dedo faz alguma coisa.
 *
 * ## A regra deste arquivo: nada é chamado por dentro
 *
 * Só ponteiro, via `Input.dispatchMouseEvent`, nas coordenadas de tela de
 * verdade — e o arrasto anda em passos intermediários, como um dedo, porque um
 * salto direto de célula para célula não exercita o caminho crescendo.
 *
 * A regra vem de uma lição do Jogo das Formas: a primeira verificação daquele
 * jogo chamava `cena._pegar(0)` direto e passava, enquanto o jogo não respondia a
 * toque nenhum. Ela pulava exatamente a parte quebrada.
 *
 * Ele já pagou por si aqui: pegou que "tocar fora do tabuleiro cancela o
 * caminho" NÃO funcionava, porque estava escrito com `toque` — e `toque` exige
 * um nó interativo sob o dedo, que fora do tabuleiro não existe.
 *
 * ## O que ele cobre
 *
 *   1. o jogo abre, os 8 SVG carregam, a geometria é a do PLANO-VISUAL;
 *   2. ARRASTO por três iguais pontua o tamanho do caminho, e o tabuleiro repõe;
 *   3. arrasto curto não pontua e NÃO conta erro (é tentativa cancelada);
 *   4. TOQUE sequencial monta o mesmo caminho e a espera o fecha sozinha;
 *   5. tocar de novo na última peça desfaz;
 *   6. apertar fora do tabuleiro cancela;
 *   7. a pausa abre;
 *   8. o `Watchdog` não dispara numa sessão normal.
 *
 * As lacunas de narração são esperadas e separadas do resto: os oito nomes de
 * cor de 2013 ainda não foram trazidos, e o motor as declara no console.
 *
 * ## Uso
 *
 * Com `node tools/serve.mjs 8099` rodando em outro terminal:
 *     node tools/teste-jogabilidade-cores.mjs
 *
 * As capturas vão para `.capturas/cores/`.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const PORTA = 8099;
const PORTA_CDP = 9353;
const SAIDA = 'c:/Users/ricoa/OneDrive/Desktop/motorGame/.capturas/cores';
const NAVEGADORES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
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
      setTimeout(() => { if (this.pend.has(id)) { this.pend.delete(id); erro(new Error('timeout ' + metodo)); } }, 25000);
    });
  }
  ao(fn) { this.ouvintes.push(fn); }
}

let passaram = 0; let falharam = 0; const problemas = [];
const checar = (nome, cond, det = '') => {
  if (cond) { passaram++; console.log(`  ok   ${nome}`); }
  else { falharam++; problemas.push(`${nome} — ${det}`); console.log(`  FALHOU  ${nome}\n          ${det}`); }
};

const navegador = NAVEGADORES.find((c) => existsSync(c));
mkdirSync(SAIDA, { recursive: true });
const perfil = path.join(os.tmpdir(), `cores-${Date.now()}`);
const chrome = spawn(navegador, [
  '--headless=new', `--remote-debugging-port=${PORTA_CDP}`, `--user-data-dir=${perfil}`,
  '--no-first-run', '--disable-gpu', '--mute-audio', '--window-size=1280,860',
  '--autoplay-policy=no-user-gesture-required',
], { stdio: 'ignore' });

const mensagens = [];
try {
  let v = null;
  for (let i = 0; i < 60 && !v; i++) {
    try { v = await (await fetch(`http://127.0.0.1:${PORTA_CDP}/json/version`)).json(); }
    catch { await esperar(250); }
  }
  const cdp = await new CDP(v.webSocketDebuggerUrl).conectar();
  const { targetId } = await cdp.enviar('Target.createTarget', { url: 'about:blank' });
  const s = (await cdp.enviar('Target.attachToTarget', { targetId, flatten: true })).sessionId;
  await cdp.enviar('Runtime.enable', {}, s);
  await cdp.enviar('Log.enable', {}, s);
  await cdp.enviar('Page.enable', {}, s);
  cdp.ao((m) => {
    if (m.method === 'Runtime.consoleAPICalled' && !['log', 'info'].includes(m.params.type)) {
      mensagens.push(`${m.params.type}: ${(m.params.args ?? []).map((a) => a.value ?? '').join(' ')}`);
    }
    if (m.method === 'Log.entryAdded') mensagens.push(`${m.params.entry.level}: ${m.params.entry.text}`);
    if (m.method === 'Runtime.exceptionThrown') mensagens.push(`EXCECAO: ${m.params.exceptionDetails.text}`);
  });

  const aval = async (expr) => {
    const r = await cdp.enviar('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, s);
    if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.text} ${r.exceptionDetails.exception?.description ?? ''}`);
    return r.result.value;
  };
  const captura = async (nome) => {
    const r = await cdp.enviar('Page.captureScreenshot', { format: 'png' }, s);
    writeFileSync(path.join(SAIDA, `${nome}.png`), Buffer.from(r.data, 'base64'));
  };
  const paraTela = (lx, ly) => aval(`(() => {
    const st = window.jogo.stage; const r = st.canvas.getBoundingClientRect();
    return { x: Math.round(r.left + ${lx} * st.escala + st.deslocX),
             y: Math.round(r.top + ${ly} * st.escala + st.deslocY) };
  })()`);
  const evento = (type, c, extra = {}) => cdp.enviar('Input.dispatchMouseEvent', {
    type, x: c.x, y: c.y, button: 'left', clickCount: 1, pointerType: 'mouse', ...extra,
  }, s);
  const tocar = async (lx, ly) => {
    const c = await paraTela(lx, ly);
    await evento('mousePressed', c, { buttons: 1 });
    await esperar(50);
    await evento('mouseReleased', c, { buttons: 0 });
    await esperar(60);
  };
  const arrastar = async (pontos) => {
    const telas = [];
    for (const [lx, ly] of pontos) telas.push(await paraTela(lx, ly));
    await evento('mousePressed', telas[0], { buttons: 1 });
    await esperar(60);
    for (let i = 1; i < telas.length; i++) {
      // Passos intermediários, para o arrasto ser contínuo como um dedo.
      const a = telas[i - 1]; const b = telas[i];
      for (let t = 1; t <= 4; t++) {
        await evento('mouseMoved', {
          x: Math.round(a.x + (b.x - a.x) * t / 4),
          y: Math.round(a.y + (b.y - a.y) * t / 4),
        }, { buttons: 1 });
        await esperar(25);
      }
    }
    await evento('mouseReleased', telas[telas.length - 1], { buttons: 0 });
    await esperar(120);
  };

  console.log('\n1. O jogo abre e chega à partida');
  await cdp.enviar('Page.navigate', { url: `http://127.0.0.1:${PORTA}/Games/jogo-das-cores/` }, s);
  let pronto = false;
  for (let i = 0; i < 80 && !pronto; i++) {
    pronto = await aval('!!(window.jogo && window.jogo.cena)').catch(() => false);
    if (!pronto) await esperar(250);
  }
  checar('a página carregou e o motor subiu', pronto);
  await captura('01-menu');

  await aval(`window.jogo.irPara('jogando', { nivel: window.jogo.config.niveis[0] })`);
  await esperar(1200);
  const geo = await aval(`(() => {
    const c = window.jogo.cena;
    return {
      estado: window.jogo.estado, fase: c.fase,
      celula: c.geo.celula, colunas: c.colunas, linhas: c.linhas,
      bx: c.tabuleiroX, by: c.tabuleiroY, hudW: c.hudLargura,
      naGrade: c.grade.todas().length,
      imagensOk: Object.values(c.arte.imagens).filter(Boolean).length,
    };
  })()`);
  console.log(`  geometria: ${JSON.stringify(geo)}`);
  checar('a partida montou', geo.estado === 'jogando' && geo.fase === 'livre');
  checar('35 peças no tabuleiro (7x5)', geo.naGrade === 35, `naGrade=${geo.naGrade}`);
  checar('os 8 SVG carregaram', geo.imagensOk === 8, `carregadas=${geo.imagensOk}`);
  checar('a geometria é a do plano (célula 128, x 364, y 40, HUD 324)',
    geo.celula === 128 && geo.bx === 364 && geo.by === 40 && geo.hudW === 324,
    JSON.stringify(geo));
  await captura('02-partida');

  // ---------------------------------------------------------------- arrasto
  console.log('\n2. ARRASTO: desenhar um caminho de 3 peças da mesma cor');
  // Planta um caminho conhecido: 3 peças iguais em linha na linha 2.
  await aval(`(() => {
    const c = window.jogo.cena;
    for (let col = 0; col < 3; col++) c.grade.obter(2, col).cor = 'azul';
    // e as vizinhas diferentes, para o caminho não poder crescer sem querer
    for (const [l, k] of [[1,0],[1,1],[1,2],[1,3],[3,0],[3,1],[3,2],[3,3],[2,3]])
      c.grade.obter(l, k).cor = 'verde';
    return true;
  })()`);
  const cel = (lin, col) => [geo.bx + col * geo.celula + geo.celula / 2,
    geo.by + lin * geo.celula + geo.celula / 2];

  const pontosAntes = await aval('window.jogo.cena.placar.acertos');
  await arrastar([cel(2, 0), cel(2, 1), cel(2, 2)]);
  await esperar(300);
  const meio = await aval(`(() => {
    const c = window.jogo.cena;
    return { fase: c.fase, pontos: c.placar.acertos, caminho: c.caminho.tamanho, feitos: c.caminhosFeitos };
  })()`);
  console.log(`  depois do arrasto: ${JSON.stringify(meio)}`);
  checar('o arrasto de 3 iguais pontuou 3',
    meio.pontos - pontosAntes === 3, `${pontosAntes} -> ${meio.pontos}`);
  checar('contou um caminho feito', meio.feitos === 1, `feitos=${meio.feitos}`);
  await esperar(1400);
  const depois = await aval(`(() => {
    const c = window.jogo.cena;
    return { fase: c.fase, naGrade: c.grade.todas().length, vazias: c.grade.vazias().length };
  })()`);
  checar('a fase voltou a livre', depois.fase === 'livre', JSON.stringify(depois));
  checar('o tabuleiro foi reposto (nenhuma célula vazia)',
    depois.naGrade === 35 && depois.vazias === 0, JSON.stringify(depois));
  await captura('03-depois-do-arrasto');

  // -------------------------------------------------- arrasto curto: cancela
  console.log('\n3. ARRASTO CURTO: duas peças não valem, e não é erro');
  await aval(`(() => {
    const c = window.jogo.cena;
    c.grade.obter(0, 0).cor = 'rosa'; c.grade.obter(0, 1).cor = 'rosa';
    c.grade.obter(0, 2).cor = 'verde';
    return true;
  })()`);
  const antesCurto = await aval('({ p: window.jogo.cena.placar.acertos, e: window.jogo.cena.placar.erros })');
  await arrastar([cel(0, 0), cel(0, 1)]);
  await esperar(400);
  const curto = await aval(`(() => {
    const c = window.jogo.cena;
    return { fase: c.fase, p: c.placar.acertos, e: c.placar.erros, caminho: c.caminho.tamanho };
  })()`);
  checar('caminho de 2 não pontua', curto.p === antesCurto.p, JSON.stringify(curto));
  checar('e NÃO conta erro (é tentativa cancelada)', curto.e === 0, `erros=${curto.e}`);
  checar('o seletor esvaziou', curto.caminho === 0, JSON.stringify(curto));

  // ------------------------------------------------------------------ toque
  console.log('\n4. TOQUE sequencial: monta o mesmo caminho, peça por peça');
  await aval(`(() => {
    const c = window.jogo.cena;
    for (let col = 0; col < 4; col++) c.grade.obter(4, col).cor = 'roxo';
    for (const [l, k] of [[3,0],[3,1],[3,2],[3,3],[3,4],[4,4]])
      c.grade.obter(l, k).cor = 'amarelo';
    return true;
  })()`);
  const antesToque = await aval('window.jogo.cena.placar.acertos');
  await tocar(...cel(4, 0));
  await esperar(200);
  const t1 = await aval('window.jogo.cena.caminho.tamanho');
  await tocar(...cel(4, 1));
  await esperar(200);
  await tocar(...cel(4, 2));
  await esperar(250);
  const t3 = await aval('({ n: window.jogo.cena.caminho.tamanho, valido: window.jogo.cena.caminho.valido })');
  checar('o primeiro toque começou o caminho', t1 === 1, `tamanho=${t1}`);
  checar('três toques montaram um caminho válido',
    t3.n === 3 && t3.valido === true, JSON.stringify(t3));
  await captura('04-caminho-por-toque');

  // A espera fecha sozinha.
  await esperar(1200);
  const fechou = await aval(`(() => {
    const c = window.jogo.cena;
    return { p: c.placar.acertos, caminho: c.caminho.tamanho, feitos: c.caminhosFeitos };
  })()`);
  checar('a espera fechou o caminho sozinha e pontuou 3',
    fechou.p - antesToque === 3, `${antesToque} -> ${fechou.p}`);
  await esperar(1200);

  console.log('\n5. TOQUE na última peça desfaz');
  await aval(`(() => {
    const c = window.jogo.cena;
    for (let col = 0; col < 3; col++) c.grade.obter(0, col).cor = 'marrom';
    return true;
  })()`);
  await tocar(...cel(0, 0));
  await esperar(150);
  await tocar(...cel(0, 1));
  await esperar(150);
  const antesDesfazer = await aval('window.jogo.cena.caminho.tamanho');
  await tocar(...cel(0, 1));
  await esperar(200);
  const desfeito = await aval('window.jogo.cena.caminho.tamanho');
  checar('tocar de novo na última removeu ela',
    antesDesfazer === 2 && desfeito === 1, `${antesDesfazer} -> ${desfeito}`);

  console.log('\n6. Tocar FORA do tabuleiro cancela o caminho');
  await tocar(150, 620);
  await esperar(200);
  const cancelado = await aval('window.jogo.cena.caminho.tamanho');
  checar('o caminho foi cancelado', cancelado === 0, `tamanho=${cancelado}`);

  console.log('\n7. A pausa');
  const btPausa = await aval(`(() => {
    const a = window.jogo.cena.filhos.find((f) => f.icone === 'pausa');
    const m = a.matrizMundo;
    return { x: Math.round(m.tx + (a.largura ?? 0) / 2), y: Math.round(m.ty + (a.altura ?? 0) / 2) };
  })()`);
  await tocar(btPausa.x, btPausa.y);
  await esperar(600);
  checar('a pausa abriu', await aval('!!window.jogo.cena.pausada'));
  await captura('05-pausa');

  console.log('\n8. O cão de guarda não dispara numa sessão normal');
  checar('nenhum disparo do Watchdog', await aval('window.jogo.cena.guarda.disparos') === 0);

  const lacunas = mensagens.filter((m) => /narra/i.test(m));
  const inesperadas = mensagens.filter((m) => !/narra/i.test(m));
  console.log(`\n  lacunas de narração declaradas: ${lacunas.length}`);
  checar('nenhum erro no console além das lacunas de narração declaradas',
    inesperadas.length === 0, inesperadas.join(' | '));
} catch (err) {
  falharam++;
  console.error('\nFALHOU (exceção):', err.message);
} finally {
  console.log(`\n${'-'.repeat(56)}`);
  console.log(`${passaram} passaram, ${falharam} falharam`);
  if (problemas.length) { console.log('\nProblemas:'); for (const p of problemas) console.log(`  - ${p}`); }
  if (mensagens.length) {
    console.log('\nConsole:');
    for (const m of [...new Set(mensagens)].slice(0, 12)) console.log(`  ${m}`);
  }
  console.log(`\nCapturas: ${SAIDA}`);
  try { chrome.kill(); } catch {}
  await rm(perfil, { recursive: true, force: true }).catch(() => {});
  process.exit(falharam > 0 ? 1 : 0);
}
