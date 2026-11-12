#!/usr/bin/env node
/**
 * teste-jogabilidade-cubra-nove.mjs — o Cubra Nove jogado com GESTO REAL.
 *
 * Mesma estrutura de `teste-jogabilidade-cabo-de-guerra.mjs`: só ponteiro, via `Input.dispatchMouseEvent`
 * e `Input.dispatchTouchEvent`, nas coordenadas de tela de verdade. A cena só é LIDA, para conferir o
 * resultado do gesto; o ritmo é acelerado (`regras.rolarMs`, `vooMs`, `cpuEsperaMs`), nunca a entrada.
 * Os ganchos de teste da cena (`dadosDeTeste`, `esqueceDeTeste`) só escolhem os próximos sorteios.
 *
 * ## O que ele cobre
 *
 *   1. menu → níveis → partida, só com toques; o tema madeira, as duas fileiras de 9 casas, a rodada 1
 *      anunciada e o dedinho nos dados;
 *   2. tocar nos DADOS rola; no Fácil a conta aparece pronta ("5 + 4 = 9"), sem a diferença;
 *   3. ARRASTAR um cubinho do monte até a casa 9 cobre a casa (anel verde, conta acesa);
 *   4. TOCAR numa casa que os dados não dão: balança, 1 erro, nada coberto; tocar na casa 5: o cubinho voa;
 *   5. a AJUDA EM DEGRAUS: PRONTO cedo = bolinha no monte + 1 erro; de novo = o dado que falta acende;
 *   6. completou: PRONTO dá "CONSEGUIU!" (houve erro) e a vez passa ao computador;
 *   7. o COMPUTADOR esquece um número: a criança confere FALTOU UM; ele FICA SEM o número e o cubinho
 *      fantasma aparece, até a criança jogar os dados de novo;
 *   8. a PAUSA congela o voo do cubinho do computador; a AJUDA abre o tutorial e devolve a partida intacta;
 *   9. DOIS DEDOS (toque emulado): um segundo dedo encostando e saindo NÃO solta o cubinho arrastado;
 *  10. vez limpa: PRONTO direto dá um elogio sorteado ("MUITO BEM!"…); no Médio e no Difícil, as contas;
 *  11. o AVA dentro de um IFRAME: vitória e derrota registram, com a nota da RE-02 e os extras;
 *  12. nenhum erro de JavaScript e nenhum disparo do `Watchdog`.
 *
 * As lacunas de narração são esperadas: o motor as declara no console (aviso).
 *
 * ## Uso
 *
 * Com `node tools/serve.mjs 8099` rodando em outro terminal:
 *     node tools/teste-jogabilidade-cubra-nove.mjs
 *
 * As capturas vão para `.capturas/cubra-nove/`.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORTA = Number(process.argv[2]) || 8099;
const PORTA_CDP = 9381;
const SAIDA = path.join(RAIZ, '.capturas', 'cubra-nove');
const JOGO_URL = `http://127.0.0.1:${PORTA}/Games/numerandus/cubra-nove/`;
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

const navegador = NAVEGADORES.find((c) => existsSync(c));
if (!navegador) { console.error('nenhum Chrome/Edge encontrado'); process.exit(2); }
mkdirSync(SAIDA, { recursive: true });
const perfil = path.join(os.tmpdir(), `cubra-nove-${Date.now()}`);
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
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') {
      erros.push(`log: ${m.params.entry.text} ${m.params.entry.url ?? ''}`.slice(0, 220));
    }
    if (m.method === 'Runtime.exceptionThrown') erros.push(`EXCECAO: ${m.params.exceptionDetails.text} ${m.params.exceptionDetails.exception?.description ?? ''}`.slice(0, 240));
  });

  // ------------------------------------------------- ambiente: página ou iframe
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
  const esperarAte = async (corpo, ms = 15000, passo = 80) => {
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
    true;`;
  const garantir = () => aval(`typeof ${W}.__achar === 'function' || ${W}.eval(${JSON.stringify(AJUDANTES)})`);
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
  const tocarLogico = async (lx, ly) => {
    const c = await paraTela(lx, ly);
    await mouse('mousePressed', c, { buttons: 1 });
    await esperar(50);
    await mouse('mouseReleased', c, { buttons: 0 });
    await esperar(90);
  };
  /** O centro de um nó, em coordenadas lógicas (os Buttons têm o registro no centro). */
  const centro = (busca) => jg(`const no = (${busca}); if (!no) return null;
    const p = no.localParaGlobal((no.largura ?? 0) / 2, (no.altura ?? 0) / 2); return { x: p.x, y: p.y };`);
  const tocarNo = async (busca) => {
    await garantir();
    const c = await centro(busca);
    if (!c) return false;
    await tocarLogico(c.x, c.y);
    return true;
  };
  /** Arrasta com o mouse, de (x1, y1) a (x2, y2) lógicos, em passos. */
  const arrastar = async (de, para, passos = 8) => {
    const a = await paraTela(de.x, de.y);
    const b = await paraTela(para.x, para.y);
    await mouse('mousePressed', a, { buttons: 1 });
    await esperar(40);
    for (let k = 1; k <= passos; k++) {
      await mouse('mouseMoved', { x: Math.round(a.x + (b.x - a.x) * k / passos), y: Math.round(a.y + (b.y - a.y) * k / passos) }, { buttons: 1 });
      await esperar(25);
    }
    await mouse('mouseReleased', b, { buttons: 0 });
    await esperar(120);
  };
  const BTN = (re) => `${W}.__achar(c, (n) => typeof n.rotulo === 'string' && ${re}.test(n.rotulo) && n.visivelMundo)`;
  const CASA = (v) => `c.fileiraC.casas[${v}]`;
  /** O alvo de soltar o cubinho na casa `v`: o centro dela mais o "um pouco acima do dedo" (24 px) que a peça leva. */
  const soltarNaCasa = async (v) => { const p = await centro(CASA(v)); return { x: p.x, y: p.y + 24 }; };
  const MONTE = 'c.monte';
  const RAPIDO = 'c.regras.rolarMs = 120; c.regras.vooMs = 120; c.regras.cpuEsperaMs = 150;';
  const estado = () => jg(`return c.constructor.name !== 'GameScene' ? { cena: c.constructor.name } : {
    cena: c.constructor.name, fase: c.fase, quem: c.vez?.quem, erros: c.erros, rodada: c.rodada, extras: c.extras,
    cobC: c.cobertas.c.map((x, i) => (x ? i : 0)).filter(Boolean), cobP: c.cobertas.p.map((x, i) => (x ? i : 0)).filter(Boolean),
    aviso: c.aviso.tipo ? c.aviso.tipo + ':' + c.aviso.texto : null, contas: c.contas.itens.map((i) => i.texto + (i.estado ? '[' + i.estado + ']' : '')),
    dados: c.dados.estados, faces: c.dados.faces, badge: c.monte.badge, pausada: !!c.pausada,
    botoes: [c.botaoPronto, c.botaoTudo, c.botaoFaltou].filter((b) => b.visible).map((b) => b.rotulo) };`);

  /** Joga a partida inteira com um robô perfeito (ou que nunca cobre, `cobre: false`) até o resultado. */
  const partidaRobo = async ({ cobre = true } = {}) => {
    for (const fim = Date.now() + 240000; Date.now() < fim;) {
      const st = await jg(`return c.constructor.name !== 'GameScene' ? { cena: c.constructor.name } : { fase: c.fase, alvos: c.fase === 'cobrir' ? c._alvos() : [], esquecido: c.vez?.esquecido ?? null };`);
      if (st.cena) return true;
      if (st.fase === 'dado') await tocarNo('c.dados');
      else if (st.fase === 'cobrir') {
        if (cobre) for (const v of st.alvos) { await tocarNo(CASA(v)); await esperarAte(`!c._voando`, 3000); }
        await tocarNo('c.botaoPronto');
        await esperar(60);
      } else if (st.fase === 'conferir') {
        await tocarNo(st.esquecido != null ? 'c.botaoFaltou' : 'c.botaoTudo');
      } else await esperar(60);
    }
    return false;
  };
  /** Recarrega e abre uma partida do nível `id`, só com toques. */
  const novaPartida = async (id) => {
    await cdp.enviar('Page.navigate', { url: JOGO_URL }, s);
    await esperar(1200);
    await esperarAte(`c && c.constructor.name === 'MenuScreen'`, 15000);
    await esperar(700);
    await garantir();
    await tocarNo(BTN('/^jogar$/i'));
    await esperarAte(`c.constructor.name === 'LevelSelectScreen'`, 5000);
    await esperar(700); // os cartões entram em sequência: o do Difícil é o último
    await tocarNo(`${W}.__achar(c, (n) => n.nivel && n.nivel.id === ${id})`);
    return esperarAte(`c.constructor.name === 'GameScene' && c.fase === 'dado'`, 6000);
  };

  // --------------------------------------------------------- 1. abrir e navegar
  console.log('\n1. O jogo abre e chega à partida só com toques');
  await cdp.enviar('Page.navigate', { url: JOGO_URL }, s);
  let ok = false;
  for (let i = 0; i < 80 && !ok; i++) {
    ok = await aval('!!(window.jogo && window.jogo.cena && window.jogo.rodando)').catch(() => false);
    if (!ok) await esperar(250);
  }
  checar('a página carregou e o motor subiu', ok);
  await esperar(1200);
  await garantir();
  await captura('01-menu');
  checar('começa no menu', (await estado()).cena === 'MenuScreen');
  checar('toque em JOGAR leva à escolha de nível', await tocarNo(BTN('/^jogar$/i')) && await esperarAte(`c.constructor.name === 'LevelSelectScreen'`, 5000));
  await esperar(500);
  await captura('02-niveis');
  checar('toque no cartão FÁCIL abre a partida',
    await tocarNo(`${W}.__achar(c, (n) => n.nivel && n.nivel.id === 1)`) && await esperarAte(`c.constructor.name === 'GameScene'`, 6000));
  await esperar(500);
  const ini = await jg(`return { tema: c.config.tema, total: c.placar.total, casasC: c.fileiraC.casas.filter(Boolean).length, casasP: c.fileiraP.casas.filter(Boolean).length,
    fase: c.fase, aviso: c.aviso.tipo + ':' + c.aviso.texto, dedo: c.dica.visible, dados: c.dados.estados, ativaC: c.fileiraC.ativa, ativaP: c.fileiraP.ativa,
    botoes: [c.botaoPronto, c.botaoTudo, c.botaoFaltou].some((b) => b.visible), monte: c.monte.badge, dif: c.comDiferenca, modo: c.modoContas };`);
  checar('o Fácil: tema madeira, meta 9, duas fileiras de 9 casas, sem diferença, contas prontas',
    ini.tema === 'madeira' && ini.total === 9 && ini.casasC === 9 && ini.casasP === 9 && ini.dif === false && ini.modo === 'prontas', JSON.stringify(ini));
  checar('começa na vez da criança: "RODADA 1", o dedinho e os dados convidando, a fileira dela em azul, nenhum botão',
    ini.fase === 'dado' && ini.aviso === 'rodada:1' && ini.dedo && ini.dados.join() === 'convida,convida' && ini.ativaC && !ini.ativaP && !ini.botoes && ini.monte === 0, JSON.stringify(ini));
  await captura('03-partida');

  // ------------------------------------------------------------- 2. os dados
  console.log('\n2. Os dados: o toque rola; no Fácil a conta vem pronta');
  await jg(`c.regras.rolarMs = 700; c.regras.vooMs = 200; c.dadosDeTeste = [[5, 4], [6, 5]]; c.esqueceDeTeste = 5; return 1;`);
  await tocarNo('c.dados');
  checar('o toque nos dados rola (o aviso e o dedinho somem)', await jg(`return c.fase === 'rolando' && c.aviso.vazio && !c.dica.visible;`));
  await tocarNo('c.dados');
  checar('um toque a mais durante a rolagem não rola de novo', (await estado()).fase === 'rolando');
  checar('os dados param no 5 e no 4, e a vez de cobrir começa com o PRONTO', await esperarAte(`c.fase === 'cobrir' && c.dados.faces.join() === '5,4'`, 4000));
  let e = await estado();
  checar('no Fácil: só "5 + 4 = 9" (sem a diferença) e o PRONTO; nenhuma frase de instrução',
    e.contas.join() === '5 + 4 = 9' && e.botoes.join() === 'PRONTO' && e.aviso === null, JSON.stringify(e));
  await captura('04-cobrir');

  // ------------------------------------------------------- 3. arrastar
  console.log('\n3. Arrastar um cubinho do monte até a casa 9');
  const m0 = await centro(MONTE);
  await arrastar(m0, await soltarNaCasa(9));
  checar('a casa 9 fica coberta, sem erro, com o anel verde, e a conta acende',
    await esperarAte(`c.cobertas.c[9] && c.fileiraC.casas[9].coberta && !c._voando`, 3000)
      && await jg(`return c.erros === 0 && c.contas.itens[0].estado === 'feito' && c.stats.porOrigem.soma === 1;`), JSON.stringify(await estado()));
  await arrastar(m0, await soltarNaCasa(9));
  checar('arrastar até a casa 9 de novo (já coberta): a peça volta, sem erro', await jg(`return c.erros === 0 && !c._arrasto;`));
  await arrastar(m0, { x: 640, y: 300 });
  checar('soltar fora da fileira: a peça volta, sem erro', await jg(`return c.erros === 0 && !c._arrasto && c.vez.cobertasVez.length === 1;`));

  // ------------------------------------------------------- 4. tocar
  console.log('\n4. Tocar nas casas');
  await tocarNo(CASA(8));
  checar('a casa 8 (os dados não dão): balança com anel coral, 1 erro, nada coberto',
    await jg(`return c.erros === 1 && !c.cobertas.c[8] && c.fileiraC.casas[8].anim?.tipo === 'errado';`), JSON.stringify(await estado()));
  await tocarNo(CASA(5));
  checar('a casa 5: o cubinho voa do monte e a cobre; o dado 5 fica verde',
    await esperarAte(`c.cobertas.c[5] && !c._voando`, 3000) && await jg(`return c.dados.estados[0] === 'feito';`), JSON.stringify(await estado()));

  // ------------------------------------------------------- 5. a ajuda em degraus
  console.log('\n5. A ajuda em degraus');
  await tocarNo('c.botaoPronto');
  e = await estado();
  checar('PRONTO com o 4 ainda livre (2º erro da vez): a bolinha "1" no monte, o dado 4 em âmbar, a dica, e a vez continua',
    e.badge === 1 && e.erros === 2 && e.dados[1] === 'dica' && e.aviso === 'dica:AINDA DÁ PARA COBRIR UM NÚMERO.' && e.fase === 'cobrir', JSON.stringify(e));
  await captura('05-dica');
  await arrastar(m0, await soltarNaCasa(4));
  checar('arrastar até o 4: coberto, a bolinha do monte some',
    await esperarAte(`c.cobertas.c[4] && !c._voando`, 3000) && await jg(`return c.monte.badge === 0;`), JSON.stringify(await estado()));

  // ------------------------------------------------------- 6. fim da vez
  console.log('\n6. PRONTO com tudo coberto');
  await jg(`c.__falas = []; const f = c.audio.falar.bind(c.audio); c.audio.falar = (id, o) => { c.__falas.push(id); return f(id, o); }; return 1;`);
  await tocarNo('c.botaoPronto');
  e = await estado();
  checar('"CONSEGUIU!" (houve erro no caminho), as contas reveladas e nenhum botão', e.fase === 'fimVez' && e.aviso === 'elogio:CONSEGUIU!' && e.botoes.length === 0, JSON.stringify(e));
  await captura('06-conseguiu');

  // ------------------------------------------------------- 7. o computador
  console.log('\n7. O computador esquece o 5 e fica sem ele');
  checar('a vez do computador: a fileira dele em azul, os dados rolam', await esperarAte(`c.fase === 'rolando' && c.vez == null && c.fileiraP.ativa && !c.fileiraC.ativa`, 6000)
    || await esperarAte(`c.vez?.quem === 'p'`, 3000));
  checar('a voz diz "vez do computador"', (await jg(`return c.__falas;`)).includes('vezDoComputador'), JSON.stringify(await jg(`return c.__falas;`)));
  checar('ele cobre o 6 (6 + 5 = 11 não cabe; no Fácil não há diferença) e pede a conferência',
    await esperarAte(`c.fase === 'conferir'`, 8000) && await jg(`return c.cobertas.p[6] && !c.cobertas.p[5] && c.vez.esquecido === 5;`), JSON.stringify(await estado()));
  e = await estado();
  checar('a conferência: COBRIU TUDO e FALTOU UM, e nenhuma pergunta escrita', e.botoes.join() === 'COBRIU TUDO,FALTOU UM' && e.aviso === null, JSON.stringify(e));
  await captura('07-conferir');
  await tocarNo('c.botaoFaltou');
  e = await estado();
  checar('FALTOU UM, certo: "ISSO! FALTOU O 5 (O DADO 5). FICOU SEM ELE." e o 5 NÃO é coberto',
    e.aviso === 'ok:ISSO! FALTOU O 5 (O DADO 5). FICOU SEM ELE.' && !e.cobP.includes(5), JSON.stringify(e));
  checar('o cubinho fantasma aparece na casa 5 do computador', await jg(`return c.fileiraP.casas[5].fantasma === true && c.stats.conferenciasCertas === 1;`));
  await captura('08-fantasma');
  checar('a rodada 2 começa: "RODADA 2", o fantasma ainda à vista', await esperarAte(`c.fase === 'dado' && c.rodada === 2`, 6000)
    && await jg(`return c.aviso.texto === '2' && c.fileiraP.casas[5].fantasma;`));
  const falasRodada2 = await jg(`return c.__falas;`);
  checar('a vez da criança fala "Sua vez", logo depois do anúncio da rodada',
    falasRodada2.indexOf('suaVez') > falasRodada2.indexOf('rodada2') && falasRodada2.includes('rodada2'), JSON.stringify(falasRodada2));
  checar('o "Sua vez" tem gravação (o áudio está declarado e carregou)', await jg(`return c.audio.temSom('suaVez');`));
  await jg(`c.dadosDeTeste = [[3, 3], [2, 1]]; c.esqueceDeTeste = false; ${RAPIDO} return 1;`);
  await tocarNo('c.dados');
  checar('jogar os dados apaga o fantasma', await esperarAte(`c.fase === 'cobrir' && !c.fileiraP.casas[5].fantasma`, 4000));

  // ------------------------------------------------------- 10a. vez limpa
  console.log('\n10. Vez limpa: elogio sorteado');
  await tocarNo(CASA(3));
  await esperarAte(`!c._voando && c.cobertas.c[3]`, 3000);
  await tocarNo(CASA(6));
  await esperarAte(`!c._voando && c.cobertas.c[6]`, 3000);
  await tocarNo('c.botaoPronto');
  e = await estado();
  checar('3 e 3: cobertos o 3 e o 6, PRONTO direto dá um elogio grande ("MUITO BEM!", "ISSO AÍ!" ou "MANDOU BEM!")',
    /^elogio:(MUITO BEM!|ISSO AÍ!|MANDOU BEM!)$/.test(e.aviso) && e.erros === 2, JSON.stringify(e));

  // ------------------------------------------------------- 8. pausa e ajuda
  console.log('\n8. A pausa congela o voo do computador; a ajuda devolve a partida intacta');
  await jg(`c.regras.vooMs = 1600; return 1;`);
  checar('o cubinho do computador está no ar', await esperarAte(`c.fase === 'cpu' && c._voando`, 8000));
  await tocarNo(`${W}.__achar(c, (n) => n.icone === 'pausa' && n.visivelMundo)`);
  const p1 = await jg(`const p = c.camadaPecas.filhos[0]; return p ? { x: p.x, y: p.y } : null;`);
  await esperar(900);
  const p2 = await jg(`const p = c.camadaPecas.filhos[0]; return p ? { x: p.x, y: p.y } : null;`);
  checar('pausado, o cubinho não anda', !!p1 && JSON.stringify(p1) === JSON.stringify(p2) && (await estado()).pausada, JSON.stringify({ p1, p2 }));
  await captura('09-pausa');
  await tocarNo(BTN('/continuar/i'));
  checar('CONTINUAR: o voo termina e o computador pede a conferência', await esperarAte(`c.fase === 'conferir'`, 10000), JSON.stringify(await estado()));
  await jg(`${RAPIDO} return 1;`);
  await tocarNo('c.botaoTudo');
  await esperarAte(`c.fase === 'dado' && c.rodada === 3`, 8000);
  await jg(`c.dadosDeTeste = [[2, 2]]; return 1;`);
  await tocarNo('c.dados');
  await esperarAte(`c.fase === 'cobrir'`, 4000);
  const antes = await estado();
  await jg(`c.__tut = []; const f = c.audio.falar.bind(c.audio); c.audio.falar = (id, o) => { c.__tut.push(id); return f(id, o); }; return 1;`);
  await tocarNo(`${W}.__achar(c, (n) => n.icone === 'tutorial' && n.visivelMundo)`);
  checar('a AJUDA abre o tutorial por cima e pede a fala do passo 1', await esperarAte(`c.pausada && (c.__tut || []).includes('tutorialTela1')`, 3000), JSON.stringify(await jg(`return c.__tut;`)));
  await captura('10-ajuda');
  const fechou = await tocarNo(`${W}.__achar(c, (n) => n.icone === 'fechar' && n.visivelMundo)`) || await tocarNo(BTN('/voltar|fechar|continuar/i'));
  const depois = await estado();
  checar('fechar a ajuda devolve a partida exatamente como estava', fechou && !depois.pausada && depois.fase === 'cobrir'
    && JSON.stringify(depois.cobC) === JSON.stringify(antes.cobC) && depois.erros === antes.erros, JSON.stringify({ antes, depois }));

  // ------------------------------------------------------- 9. dois dedos
  console.log('\n9. Dois dedos: a palma encostando não solta o cubinho');
  await cdp.enviar('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, s);
  const a = await paraTela(m0.x, m0.y);
  const meio = await paraTela(640, 520);
  const alvo2 = await paraTela((await soltarNaCasa(2)).x, (await soltarNaCasa(2)).y);
  const longe = await paraTela(200, 160);
  const t1 = (p) => ({ x: p.x, y: p.y, id: 1 });
  const t2 = (p) => ({ x: p.x, y: p.y, id: 2 });
  await aval(`window.__pev = []; for (const tp of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) window.addEventListener(tp, (e) => window.__pev.push(tp.slice(7) + ':' + e.pointerId + ':' + e.isPrimary), true); true`);
  await cdp.enviar('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [t1(a)] }, s);
  await esperar(60);
  await cdp.enviar('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [t1(meio)] }, s);
  await esperar(60);
  checar('o 1º dedo pegou um cubinho do monte', await jg(`return !!c._arrasto;`));
  await cdp.enviar('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [t1(meio), t2(longe)] }, s);
  await esperar(60);
  // No CDP, o touchEnd solta os pontos LISTADOS: aqui, só o 2º dedo.
  await cdp.enviar('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [t2(longe)] }, s);
  await esperar(80);
  checar('o 2º dedo encostou e saiu: o cubinho CONTINUA no dedo (não caiu, nada coberto)', await jg(`return !!c._arrasto && !c.cobertas.c[2];`), `eventos de ponteiro: ${JSON.stringify(await aval('window.__pev'))}`);
  await cdp.enviar('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [t1(alvo2)] }, s);
  await esperar(60);
  await cdp.enviar('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [t1(alvo2)] }, s);
  checar('o 1º dedo solta na casa 2 (os dados 2 e 2 dão o 2): coberta', await esperarAte(`c.cobertas.c[2] && !c._arrasto && !c._voando`, 3000), JSON.stringify(await estado()));
  await cdp.enviar('Emulation.setTouchEmulationEnabled', { enabled: false }, s);

  // ------------------------------------------------------- 10b. Médio e Difícil
  console.log('\n10b. As contas no Médio e no Difícil');
  checar('Médio abre', await novaPartida(2), JSON.stringify(await estado().catch((x) => String(x))));
  await jg(`${RAPIDO} c.dadosDeTeste = [[5, 4]]; return 1;`);
  await tocarNo('c.dados');
  await esperarAte(`c.fase === 'cobrir'`, 4000);
  e = await estado();
  checar('Médio: "5 + 4 = ?" e "5 − 4 = ?", os dados sem estado', e.contas.join() === '5 + 4 = ?,5 − 4 = ?' && e.dados.join() === ',', JSON.stringify(e));
  await tocarNo(CASA(1));
  await esperarAte(`c.cobertas.c[1] && !c._voando`, 3000);
  e = await estado();
  checar('Médio: cobrir o 1 revela "5 − 4 = 1" em verde', e.contas.includes('5 − 4 = 1[feito]'), JSON.stringify(e));
  await captura('11-medio');
  console.log('\n10c. Três erros: a vez passa (sem o jogo cobrir nada por ela)');
  await tocarNo(CASA(2));
  await tocarNo(CASA(3));
  checar('duas casas erradas (2 e 3): 2 erros, a vez continua', await jg(`return c.erros === 2 && c.fase === 'cobrir';`), JSON.stringify(await estado()));
  await tocarNo(CASA(6));
  e = await estado();
  checar('a 3ª casa errada: a vez PASSA, "TRÊS ERROS: A VEZ PASSA.", e 4, 5 e 9 ficam DESCOBERTOS com o fantasma',
    e.aviso === 'erro:TRÊS ERROS: A VEZ PASSA.' && [4, 5, 9].every((v) => !e.cobC.includes(v))
      && await jg(`return [4, 5, 9].every((v) => c.fileiraC.casas[v].fantasma) && c.stats.vezesPerdidas === 1 && c.stats.numerosPerdidos === 3;`),
    JSON.stringify(e));
  await captura('11b-tres-erros');
  checar('a vez vai para o computador', await esperarAte(`c.fase === 'cpu' || c.fase === 'rolando' || c.fase === 'conferir'`, 6000));
  checar('Difícil abre', await novaPartida(3), JSON.stringify(await estado().catch((x) => String(x))));
  await jg(`${RAPIDO} c.dadosDeTeste = [[6, 2]]; return 1;`);
  await tocarNo('c.dados');
  await esperarAte(`c.fase === 'cobrir'`, 4000);
  e = await estado();
  checar('Difícil: nenhuma conta na tela, só os dados', e.contas.length === 0, JSON.stringify(e));
  await tocarNo('c.botaoPronto');
  e = await estado();
  checar('Difícil, 1º PRONTO cedo: só a conta que falta aparece, já brilhando ("6 − 2 = 4"), e o monte diz 4',
    e.contas.join() === '6 − 2 = 4[dica]' && e.badge === 4 && e.erros === 1, JSON.stringify(e));
  await jg(`c.regras.demonstraMs = 500; c.regras.vooMs = 250; return 1;`);
  await tocarNo('c.botaoPronto');
  checar('Difícil, 2º PRONTO cedo: o jogo MOSTRA (a peça vai até a casa), sem botão enquanto mostra',
    await esperarAte(`c.fase === 'demonstrando' && c.camadaPecas.filhos.length === 1`, 3000) && await jg(`return !c.botaoPronto.visible;`), JSON.stringify(await estado()));
  await esperarAte(`c.fileiraC.casas[2].indicada && c.camadaPecas.filhos.length === 1`, 3000);
  await captura('12a-demonstrando');
  checar('a peça VOLTA ao monte: nada coberto, as casas que faltam (2, 4, 6, 8) marcadas, o PRONTO de volta',
    await esperarAte(`c.fase === 'cobrir' && c.camadaPecas.filhos.length === 0`, 12000)
      && await jg(`return [2, 4, 6, 8].every((v) => c.fileiraC.casas[v].indicada && !c.cobertas.c[v]) && c.botaoPronto.visible && c.monte.badge === 4 && c.stats.demonstracoes === 1;`),
    JSON.stringify(await estado()));
  await captura('12b-casas-marcadas');
  await arrastar(await centro(MONTE), await soltarNaCasa(4));
  checar('a criança leva a peça até a casa 4 marcada: coberta, a marca some e o monte diz 3',
    await esperarAte(`c.cobertas.c[4] && !c._voando`, 3000) && await jg(`return c.monte.badge === 3 && c.fileiraC.casas[6].indicada;`), JSON.stringify(await estado()));
  await tocarNo('c.botaoPronto');
  checar('PRONTO de novo sem cobrir o resto (3º erro): a vez PASSA e 2, 6 e 8 ficam descobertos, com o fantasma — o jogo NÃO cobre por ela',
    await esperarAte(`c.fase === 'fimVez' || c.fase === 'cpu'`, 8000)
      && await jg(`return c.cobertas.c[4] && [2, 6, 8].every((v) => !c.cobertas.c[v] && c.fileiraC.casas[v].fantasma && !c.fileiraC.casas[v].indicada) && c.stats.vezesPerdidas === 1 && c.stats.numerosPerdidos === 3;`),
    JSON.stringify(await estado()));
  await captura('12-dificil');

  const guardaPagina = avisos.filter((x) => /watchdog|cão de guarda|travad|resgat/i.test(x));
  checar('nenhum erro de JavaScript na página', erros.length === 0, erros.slice(0, 4).join(' | '));
  checar('o Watchdog não disparou', guardaPagina.length === 0, guardaPagina.slice(0, 3).join(' | '));

  // ----------------------------------------------- 11. o AVA dentro do iframe
  console.log('\n11. AVA: a mensagem cruza o <iframe>');
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
  await esperarAte(`c && c.constructor.name === 'MenuScreen'`, 8000);
  await esperar(1000);
  await garantir();
  const errosAntesAva = erros.length;
  await tocarNo(BTN('/^jogar$/i'));
  await esperarAte(`c.constructor.name === 'LevelSelectScreen'`, 5000);
  await tocarNo(`${W}.__achar(c, (n) => n.nivel && n.nivel.id === 1)`);
  await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
  // Vitória garantida: dados que cobrem muito para a criança e nada para o computador.
  await jg(`${RAPIDO} c.regras.computadorEsquece = 0; c.dadosDeTeste = [[5, 4], [6, 6], [3, 2], [6, 6], [6, 1], [6, 6]]; return 1;`);
  const v1 = await partidaRobo();
  checar('1ª partida (Fácil, robô perfeito) chegou ao resultado', v1);
  await esperar(900);
  await captura('13-resultado-vitoria');
  let m = await aval(`window.__recebidas`);
  const m1 = m[0] ?? {};
  checar('vitória: jogo cubra-nove, nível 1, meta 9, sem erro; acertos = as casas cobertas (RE-02)',
    m.length === 1 && m1.jogo === 'cubra-nove' && m1.nivel === 1 && m1.totalPerguntas === 9 && m1.vitoria === true
      && m1.erros === 0 && m1.acertos === m1.cobertasCrianca && m1.cobertasCrianca > m1.cobertasComputador, JSON.stringify(m1));
  checar('os extras: cobertas por origem somam as cobertas da criança; conferências todas certas',
    m1.cobertasPorOrigem && (m1.cobertasPorOrigem.dado + m1.cobertasPorOrigem.soma + m1.cobertasPorOrigem.dif) === m1.cobertasCrianca
      && m1.conferencias === 3 && m1.conferenciasCertas === 3 && m1.rodadas === 3, JSON.stringify(m1));

  // Derrota garantida no Médio: a criança só tira 6 e 6 (cobre o 6), o computador cobre muito.
  await jg(`c.irPara('jogando', { nivel: j.config.niveis[1] }); return true;`);
  await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
  await jg(`${RAPIDO} c.regras.computadorEsquece = 0; c.dadosDeTeste = [[6, 6], [5, 4], [6, 6], [3, 2], [6, 6], [6, 1]]; return 1;`);
  const v2 = await partidaRobo();
  checar('2ª partida (Médio) chegou ao resultado', v2);
  await esperar(900);
  await captura('14-resultado-derrota');
  m = await aval(`window.__recebidas`);
  const m2 = m[1] ?? {};
  checar('derrota no Médio: vitoria false, meta 9, acertos = 1 (só o 6), computador 8',
    m.length === 2 && m2.vitoria === false && m2.nivel === 2 && m2.totalPerguntas === 9 && m2.acertos === 1 && m2.cobertasCrianca === 1 && m2.cobertasComputador === 8,
    JSON.stringify(m2));
  const validas = await aval(`document.querySelectorAll('#registro .msg.valida').length`);
  const invalidas = await aval(`document.querySelectorAll('#registro .msg.invalida').length`);
  checar('o host do AVA valida as duas mensagens contra o contrato', validas === 2 && invalidas === 0, `válidas=${validas} inválidas=${invalidas}`);
  await esperar(2500);
  checar('parado no resultado NÃO duplica', (await aval(`window.__recebidas.length`)) === 2);

  const novos = erros.slice(errosAntesAva).filter((x) => !/favicon.ico/.test(x));
  checar('nenhum erro de JavaScript nas partidas inteiras', novos.length === 0, novos.slice(0, 4).join(' | '));
  const guarda = avisos.filter((x) => /watchdog|cão de guarda|travad|resgat/i.test(x));
  checar('o Watchdog não disparou em nenhuma partida', guarda.length === 0, guarda.slice(0, 3).join(' | '));
} catch (err) {
  falharam++;
  problemas.push(`o teste quebrou: ${err.stack ?? err}`);
  console.error(err);
  if (erros.length) console.error('Erros da página:\n  ' + erros.slice(0, 8).join('\n  '));
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
console.log('Capturas em .capturas/cubra-nove/');
