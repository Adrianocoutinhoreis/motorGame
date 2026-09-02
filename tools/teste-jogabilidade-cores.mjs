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
 *  1b. a sangria do letterbox não deixa linha na junção, numa viewport torta;
 *   2. ARRASTO por três iguais pontua o tamanho do caminho, e o tabuleiro repõe;
 *   3. arrasto curto não pontua e NÃO conta erro (é tentativa cancelada);
 *   4. TOQUE sequencial monta o mesmo caminho e a espera o fecha sozinha;
 *   5. tocar de novo na última peça desfaz;
 *   6. apertar fora do tabuleiro cancela;
 *   7. TABULEIRO MORTO — o jogo detecta, mistura e devolve o gesto;
 *   8. e continua jogável depois da mistura;
 *   9. a pausa abre;
 *  10. o `Watchdog` não dispara numa sessão normal.
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
  // -------------------------------- a emenda da sangria, no tema 'formas'
  //
  // Vive aqui, e não no `teste-navegador.mjs`, porque a linha só aparece neste
  // tema: a faixa de base tem 55% de opacidade, e é a camada semitransparente
  // que transforma um pixel de cobertura parcial em linha visível. O jogo piloto
  // usa o tema 'campo', de chão opaco — lá a sabotagem do alinhamento passa sem
  // reprovar, e eu confirmei isso desligando-o.
  //
  // A queixa foi do humano, olhando o jogo publicado, sobre "uma pequena quebra
  // na imagem no background". Media 7% na direção do céu.
  //
  // ## Qual das duas verificações abaixo guarda o defeito
  //
  // A do ALINHAMENTO. Medi: desligando o alinhamento nesta viewport, o desvio de
  // luminância na junção fica em 3 — abaixo de qualquer limite que não reprove
  // também o ruído do degradê, que mede 1 ou 2. A causa raiz é geométrica e é
  // ela que se verifica direto.
  //
  // A medição de desvio fica porque cobre outra coisa: cenário que não chega à
  // barra, degradê recalculado no tamanho maior, faixa de chão que termina antes
  // da borda. Nenhuma dessas é sutil, e todas apareceriam aqui.
  console.log('\n1b. A emenda da sangria não deixa linha na faixa de base');

  // **Numa viewport TORTA, de propósito.** A janela normal deste teste
  // (1280×860, dpr 1) dá geometria naturalmente inteira: 1280 já é múltiplo de
  // 16 e a sobra vertical é 70 exatos. Medir ali não exercita nada — confirmei
  // desligando o alinhamento e vendo tudo passar. Os números abaixo são
  // escolhidos para NÃO fechar em pixel inteiro sem o alinhamento.
  await cdp.enviar('Emulation.setDeviceMetricsOverride',
    { width: 1207, height: 853, deviceScaleFactor: 1.25, mobile: false }, s);
  await esperar(600);

  const emenda = await aval(`(() => {
    const st = window.jogo.stage;
    const ctx = st.canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const lum = (bx, by) => {
      const d = ctx.getImageData(bx, by, 1, 1).data;
      return 0.2126 * d[0] + 0.7152 * d[1] + 0.0722 * d[2];
    };
    const bordas = [];
    if (st.deslocY > 1) {
      // Barras em cima e embaixo: a de BAIXO cruza a faixa de base.
      bordas.push({ nome: 'baixo', dev: (st.deslocY + st.alturaLogica * st.escala) * dpr, eixo: 'y' });
      bordas.push({ nome: 'cima', dev: st.deslocY * dpr, eixo: 'y' });
    }
    if (st.deslocX > 1) {
      bordas.push({ nome: 'esquerda', dev: st.deslocX * dpr, eixo: 'x' });
      bordas.push({ nome: 'direita', dev: (st.deslocX + st.larguraLogica * st.escala) * dpr, eixo: 'x' });
    }
    const relato = [];
    let pior = 0;
    for (const b of bordas) {
      for (const frac of [0.25, 0.5, 0.75]) {
        const serie = [];
        for (let d = -5; d <= 5; d++) {
          const bx = b.eixo === 'x' ? Math.round(b.dev) + d : Math.round(st.canvas.width * frac);
          const by = b.eixo === 'y' ? Math.round(b.dev) + d : Math.round(st.canvas.height * frac);
          if (bx < 0 || by < 0 || bx >= st.canvas.width || by >= st.canvas.height) continue;
          serie.push(Math.round(lum(bx, by)));
        }
        if (serie.length < 5) continue;
        const ord = [...serie].sort((x, y) => x - y);
        const mediana = ord[Math.floor(ord.length / 2)];
        for (const v of serie) pior = Math.max(pior, Math.abs(v - mediana));
        relato.push(b.nome + '@' + frac + ' [' + serie.join(' ') + ']');
      }
    }
    const alinhadas = bordas.every((b) => Math.abs(b.dev - Math.round(b.dev)) < 0.001);
    return { bordas: bordas.length, alinhadas, pior, relato };
  })()`);
  console.log(`  bordas medidas: ${emenda.bordas} · pior desvio: ${emenda.pior}`);
  checar('há barra para medir', emenda.bordas > 0, JSON.stringify(emenda.bordas));
  checar('as quatro bordas do jogo caem em pixel inteiro', emenda.alinhadas === true);
  checar('nenhuma linha na junção, em nenhuma borda',
    emenda.pior <= 4, `pior ${emenda.pior} · ${emenda.relato.join(' · ')}`);

  // Devolve a viewport, e CONFERE que voltou: as seções seguintes convertem
  // coordenadas com a `geo` medida na seção 1, e uma viewport que não voltasse
  // faria todas elas errarem o alvo sem dizer por quê.
  await cdp.enviar('Emulation.clearDeviceMetricsOverride', {}, s);
  await esperar(600);
  const devolvida = await aval(`(() => {
    const c = window.jogo.cena;
    return { bx: c.tabuleiroX, by: c.tabuleiroY, celula: c.geo.celula, escala: window.jogo.stage.escala };
  })()`);
  checar('a viewport voltou ao tamanho das outras seções',
    devolvida.bx === geo.bx && devolvida.by === geo.by, JSON.stringify(devolvida));


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

  console.log('\n7. TABULEIRO MORTO: o jogo mistura em vez de parar');
  // O defeito relatado. Planta um caminho de verdade, arrasta com o ponteiro, e
  // DEPOIS que a reposição encheu o tabuleiro pinta-o com uma coloração própria
  // do grafo do rei — `(lin%2)*2 + (col%2)` — em que nenhuma peça tem vizinha da
  // mesma cor, nem na diagonal. É o tabuleiro sem ligação nenhuma.
  //
  // O gesto é real e a cadeia de resolução é real: o que o teste injeta é só a
  // COR das peças, na janela entre a reposição e a conferência.
  await aval(`(() => {
    const c = window.jogo.cena;
    c.caminho.cancelar();
    for (let col = 0; col < 3; col++) c.grade.obter(4, col).cor = 'rosa';
    for (const [l, k] of [[3,0],[3,1],[3,2],[3,3],[4,3]]) c.grade.obter(l, k).cor = 'verde';
    return true;
  })()`);
  await arrastar([cel(4, 0), cel(4, 1), cel(4, 2)]);
  // Cadeia: soltar +380 ms cai e repõe · +336 ms confere. `arrastar` já voltou
  // 120 ms depois de soltar, então 300 aqui caem no meio da janela.
  await esperar(300);
  const morto = await aval(`(() => {
    const c = window.jogo.cena;
    if (c.grade.vazias().length > 0) return { erro: 'a reposição ainda não rodou' };
    c.grade.paraCada((p, l, k) => {
      if (p) p.cor = ['vermelho', 'azul', 'verde', 'amarelo'][(l % 2) * 2 + (k % 2)];
    });
    const censo = {};
    for (const p of c.grade.todas()) censo[p.cor] = (censo[p.cor] ?? 0) + 1;
    return {
      temJogada: c.grade.temJogada(3), fase: c.fase, censo, misturas: c.misturas,
      mapa: c.grade.celulas.map((li) => li.map((p) => ({vermelho:'R',azul:'A',verde:'V',amarelo:'M',laranja:'L',roxo:'X',rosa:'S',marrom:'B'})[p.cor]).join('')).join('/'),
    };
  })()`);
  console.log(`  tabuleiro morto: ${JSON.stringify(morto)}`);
  checar('o tabuleiro ficou de fato sem jogada nenhuma',
    morto.temJogada === false, JSON.stringify(morto));
  checar('e o jogo ainda estava resolvendo (a conferência vem depois)',
    morto.fase === 'movendo', `fase=${morto.fase}`);

  // A conferência dispara a ~716 ms do soltar; aqui estamos em ~420.
  await esperar(450);
  const misturando = await aval(`(() => {
    const c = window.jogo.cena;
    return {
      misturas: c.misturas, fase: c.fase,
      aviso: !!c.aviso.visible, tempoRodando: !!c.tempo.rodando,
      temJogada: c.grade.temJogada(3), naGrade: c.grade.todas().length,
    };
  })()`);
  console.log(`  misturando: ${JSON.stringify(misturando)}`);
  checar('o jogo detectou e misturou', misturando.misturas === 1, JSON.stringify(misturando));
  checar('a mistura resolveu o travamento', misturando.temJogada === true, JSON.stringify(misturando));
  checar('a criança foi avisada na tela', misturando.aviso === true, JSON.stringify(misturando));
  checar('o cronômetro parou durante a mistura (o defeito não é dela)',
    misturando.tempoRodando === false, JSON.stringify(misturando));
  checar('o gesto continua travado enquanto as peças voam',
    misturando.fase === 'movendo', `fase=${misturando.fase}`);
  checar('nenhuma peça se perdeu na mistura', misturando.naGrade === 35, `naGrade=${misturando.naGrade}`);
  await captura('06-misturando');

  // Fim da mistura: lento (420) + padrão (240).
  await esperar(900);
  const misturado = await aval(`(() => {
    const c = window.jogo.cena;
    const censo = {};
    for (const p of c.grade.todas()) censo[p.cor] = (censo[p.cor] ?? 0) + 1;
    // Cada peça precisa estar onde a grade diz — é o que prova que o tween de
    // posição foi para o lugar certo, e não que só a grade mudou.
    let foraDeLugar = 0;
    c.grade.paraCada((p, l, k) => {
      if (!p) return;
      if (Math.abs(p.x - c.xCelula(k)) > 1 || Math.abs(p.y - c.yCelula(l)) > 1) foraDeLugar++;
    });
    return {
      fase: c.fase, aviso: !!c.aviso.visible, tempoRodando: !!c.tempo.rodando,
      temJogada: c.grade.temJogada(3), censo, foraDeLugar,
      disparos: c.guarda.disparos,
      mapa: c.grade.celulas.map((li) => li.map((p) => ({vermelho:'R',azul:'A',verde:'V',amarelo:'M',laranja:'L',roxo:'X',rosa:'S',marrom:'B'})[p.cor]).join('')).join('/'),
    };
  })()`);
  console.log(`  depois da mistura: ${JSON.stringify(misturado)}`);
  checar('o gesto voltou para a criança', misturado.fase === 'livre', `fase=${misturado.fase}`);
  checar('o aviso saiu da tela', misturado.aviso === false, JSON.stringify(misturado));
  checar('o cronômetro voltou a correr', misturado.tempoRodando === true, JSON.stringify(misturado));
  checar('ainda há jogada no tabuleiro', misturado.temJogada === true, JSON.stringify(misturado));
  checar('as peças estão nas células que a grade diz',
    misturado.foraDeLugar === 0, `foraDeLugar=${misturado.foraDeLugar}`);
  // O censo é o que separa MISTURAR de trocar as cores: as mesmas peças, nos
  // mesmos números, em outros lugares.
  //
  // Comparado por entradas ORDENADAS, e não por `JSON.stringify` do objeto: a
  // primeira versão desta linha reprovou um censo idêntico só porque a ordem das
  // chaves mudou depois da mistura. Era a comparação errada, não o jogo.
  const censoEmTexto = (c) => Object.entries(c).sort(([a], [b]) => a.localeCompare(b))
    .map(([k, n]) => `${k}=${n}`).join(' ');
  checar('o censo de cores não mudou (misturou, não repintou)',
    censoEmTexto(morto.censo) === censoEmTexto(misturado.censo),
    `${censoEmTexto(morto.censo)} -> ${censoEmTexto(misturado.censo)}`);
  checar('o cão de guarda não confundiu a mistura com travamento',
    misturado.disparos === 0, `disparos=${misturado.disparos}`);
  await captura('07-depois-da-mistura');

  // ------------------------------------------------- o teste do daltonismo
  // Herdado de `tools/mock-cores.html`, que foi apagado quando esta cena passou
  // a existir. Num jogo cujo CONTEÚDO é a cor, a vista em escala de cinza não é
  // acréscimo: é o que faz o jogo existir para quem não distingue cor — sete das
  // oito cores da paleta caem numa faixa de 38 unidades de luminância, e
  // vermelho, azul e roxo ficam a 5 unidades um do outro.
  //
  // A captura não se julga sozinha: quem olha é uma pessoa. O que o teste
  // garante é que ela SEJA PRODUZIDA a cada rodada, sobre o jogo de verdade e
  // não sobre um protótipo que pode ter divergido dele.
  await aval(`(() => {
    window.jogo.stage.canvas.style.filter = 'grayscale(1) contrast(1.05)';
    return true;
  })()`);
  await esperar(200);
  await captura('08-escala-de-cinza');
  await aval(`(() => { window.jogo.stage.canvas.style.filter = ''; return true; })()`);
  checar('a vista em escala de cinza foi capturada para conferência humana', true);

  console.log('\n8. Um caminho ainda funciona depois da mistura');
  await aval(`(() => {
    const c = window.jogo.cena;
    for (let col = 0; col < 3; col++) c.grade.obter(0, col).cor = 'laranja';
    for (const [l, k] of [[1,0],[1,1],[1,2],[1,3],[0,3]]) c.grade.obter(l, k).cor = 'roxo';
    return true;
  })()`);
  const antesFinal = await aval('window.jogo.cena.placar.acertos');
  await arrastar([cel(0, 0), cel(0, 1), cel(0, 2)]);
  await esperar(300);
  const depoisFinal = await aval('window.jogo.cena.placar.acertos');
  checar('o jogo continua jogável depois de misturar',
    depoisFinal - antesFinal === 3, `${antesFinal} -> ${depoisFinal}`);
  await esperar(1600);

  console.log('\n9. A pausa');
  const btPausa = await aval(`(() => {
    const a = window.jogo.cena.filhos.find((f) => f.icone === 'pausa');
    const m = a.matrizMundo;
    return { x: Math.round(m.tx + (a.largura ?? 0) / 2), y: Math.round(m.ty + (a.altura ?? 0) / 2) };
  })()`);
  await tocar(btPausa.x, btPausa.y);
  await esperar(600);
  checar('a pausa abriu', await aval('!!window.jogo.cena.pausada'));
  await captura('05-pausa');

  checar('nenhum disparo do Watchdog', await aval('window.jogo.cena.guarda.disparos') === 0);

  const lacunas = mensagens.filter((m) => /narra/i.test(m));
  // `willReadFrequently` é aviso do Chrome causado por ESTE ARQUIVO, não pelo
  // jogo: a seção 1b lê pixels com `getImageData` para medir a emenda. Fica
  // dispensado por nome, e não por um filtro largo, para não abrir a porta a
  // aviso de verdade passar junto.
  const doTeste = /willReadFrequently/;
  const inesperadas = mensagens.filter((m) => !/narra/i.test(m) && !doTeste.test(m));
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
