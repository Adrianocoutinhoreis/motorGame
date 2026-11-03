#!/usr/bin/env node
/**
 * teste-jogabilidade-corrida-maluca.mjs — a Corrida Maluca jogada com GESTO REAL.
 *
 * Mesma estrutura de `teste-jogabilidade-subtraindo-o-domino.mjs`: só ponteiro, via
 * `Input.dispatchMouseEvent`, nas coordenadas de tela de verdade. A cena só é LIDA, para conferir o
 * resultado do gesto, e o ritmo é acelerado (`regras.rolarMs`, `passoMs`, `cpuEsperaMs`) — nunca a
 * entrada. Os dois ganchos de teste da cena (`dadoDeTeste` e `computadorErraDeTeste`) só escolhem o
 * próximo sorteio, para alcançar de propósito a casa verde, a SAÍDA e o erro do computador.
 *
 * ## O que ele cobre
 *
 *   0. as REGRAS PURAS (`src/regras.js`) em Node: a trilha de cada nível, as verdes, as cartas
 *      (3 respostas diferentes, a certa entre elas), o computador errando ~1 em 4, a nota;
 *   1. menu → níveis → partida, só com toques; o Fácil com 15 passos e 3 verdes;
 *   2. o DADO: o toque rola, a ficha anda as casas do dado e a carta abre;
 *   3. a carta CERTA: a ficha fica e a vez passa ao computador;
 *   4. a VEZ DO COMPUTADOR: ele responde, a criança confere; errou, a ficha dele volta;
 *   5. a carta ERRADA: a ficha volta de onde partiu e conta um erro;
 *   6. a CASA VERDE: quem fica nela joga de novo, com o anel; errar a carta extra volta para a verde;
 *   7. a PAUSA congela a ficha andando, a AJUDA devolve a partida intacta;
 *   8. o AVA dentro de um IFRAME: vitória e derrota registram, com os números do que foi jogado;
 *   9. nenhum erro de JavaScript e nenhum disparo do `Watchdog`.
 *
 * As lacunas de narração são esperadas: o motor as declara no console (aviso), e as perguntas, os
 * ordinais, a casa verde, a conferência e o tutorial ainda não foram gravados.
 *
 * ## Uso
 *
 * Com `node tools/serve.mjs 8099` rodando em outro terminal:
 *     node tools/teste-jogabilidade-corrida-maluca.mjs
 *
 * As capturas vão para `.capturas/corrida-maluca/`.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORTA = Number(process.argv[2]) || 8099;
const PORTA_CDP = 9373;
const SAIDA = path.join(RAIZ, '.capturas', 'corrida-maluca');
const JOGO_URL = `http://127.0.0.1:${PORTA}/Games/numerandus/corrida-maluca/`;
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
  const R = await import(pathToFileURL(path.join(RAIZ, 'Games/numerandus/corrida-maluca/src/regras.js')).href);
  const esperado = { 15: [5, 8, 12], 21: [7, 12, 17], 27: [9, 15, 22] };
  for (const passos of [15, 21, 27]) {
    const t = R.montarTrilha(passos);
    const dist = t.casas.slice(1).map((c, i) => Math.hypot(c[0] - t.casas[i][0], c[1] - t.casas[i][1]));
    const folga = Math.min(...dist) - 2 * t.raio;
    checar(`${passos} passos: ${passos + 1} casas, verdes ${esperado[passos]}, da ENTRADA (110,630) à SAÍDA (915,140)`,
      t.casas.length === passos + 1 && t.verdes.join() === esperado[passos].join() && t.casas[0].join() === '110,630' && t.casas[passos].join() === '915,140',
      JSON.stringify({ n: t.casas.length, verdes: t.verdes, ini: t.casas[0], fim: t.casas[passos] }));
    checar(`${passos} passos: casas de ${2 * t.raio} px (≥ 64) que não se encostam (folga ${folga.toFixed(0)} px) e cabem no tabuleiro`,
      2 * t.raio >= 64 && folga >= 20 && t.casas.every(([x, y]) => x - t.raio >= 46 && x + t.raio <= 994 && y - t.raio >= 78 && y + t.raio <= 686),
      JSON.stringify({ raio: t.raio, folga }));
  }
  let cartasOk = true;
  for (let i = 0; i < 20000; i++) {
    for (const [tipo, max] of [['dobro', 10], ['triplo', 10], ['ordinal', 5], ['ordinal', 10], ['problema', 0], ['dobro', 1], ['ordinal', 1]]) {
      const c = R.gerarCarta(tipo, max);
      const vs = c.opcoes.map((o) => o.valor);
      if (new Set(vs).size !== 3 || !vs.includes(c.certa) || vs.some((v) => v < 1) || c.opcoes.some((o) => !o.texto) || c.pergunta !== c.pergunta.toUpperCase()) cartasOk = false;
    }
  }
  checar('140 000 cartas: 3 respostas diferentes e positivas, a certa entre elas, pergunta em CAIXA ALTA', cartasOk);
  const d4 = R.gerarCarta('dobro', 4, () => 0.99);
  checar('a carta de dobro traz a confusão com o triplo e a conta em parcelas', d4.certa === 8 && d4.opcoes.some((o) => o.valor === 12) && d4.conta === 'O DOBRO DE 4 É 4 + 4 = 8', JSON.stringify(d4));
  let rec = []; let repetiu = false;
  for (let i = 0; i < 400; i++) { const r = R.sortearCarta({ dobro: 5, ordinal: 5 }, rec); if (rec.includes(r.carta.chave)) repetiu = true; rec = r.recentes; }
  checar('a mesma carta não volta dentro de 4 sorteios', !repetiu);
  const tipos = new Set(Array.from({ length: 400 }, () => R.sortearCarta({ dobro: 10, triplo: 10, ordinal: 10, problema: true }).carta.tipo));
  checar('o Difícil sorteia os 4 tipos', tipos.size === 4, [...tipos].join());
  let erradas = 0; let errouValido = true;
  for (let i = 0; i < 20000; i++) {
    const c = R.gerarCarta('triplo', 5);
    const r = R.respostaDoComputador(c);
    if (!r.certo) { erradas++; if (r.opcao.valor === c.certa || !c.opcoes.includes(r.opcao)) errouValido = false; }
  }
  checar(`o computador erra ~1 em 4 (${(erradas / 200).toFixed(1)}%) e, errando, escolhe uma resposta errada da carta`, Math.abs(erradas / 20000 - 0.25) < 0.02 && errouValido);
  checar('nota (RE-02): vitória = meta − erros (mínimo 0); derrota = a casa alcançada',
    R.notaDaPartida({ vitoria: true, meta: 15, erros: 3, casa: 15 }) === 12 && R.notaDaPartida({ vitoria: true, meta: 15, erros: 20, casa: 15 }) === 0
      && R.notaDaPartida({ vitoria: false, meta: 21, erros: 5, casa: 9 }) === 9);
  checar('passar da SAÍDA para nela', R.alvoDaJogada(13, 6, 15) === 15 && R.alvoDaJogada(3, 4, 15) === 7);
}

const navegador = NAVEGADORES.find((c) => existsSync(c));
if (!navegador) { console.error('nenhum Chrome/Edge encontrado'); process.exit(2); }
mkdirSync(SAIDA, { recursive: true });
const perfil = path.join(os.tmpdir(), `corrida-maluca-${Date.now()}`);
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
  const tocarNo = async (busca) => {
    await garantir();
    const c = await jg(`const no = (${busca}); if (!no) return null;
      const p = no.localParaGlobal((no.largura ?? 0) / 2, (no.altura ?? 0) / 2); return { x: p.x, y: p.y };`);
    if (!c) return false;
    await tocarLogico(c.x, c.y);
    return true;
  };
  const BTN = (re) => `${W}.__achar(c, (n) => typeof n.rotulo === 'string' && ${re}.test(n.rotulo) && n.visivelMundo)`;
  const ICONE = (nome) => `${W}.__achar(c, (n) => n.icone === '${nome}' && n.visivelMundo)`;
  const OPCAO_CERTA = `c.painel.botoes.find((b) => b.opcao && b.opcao.valor === c.vez.carta.certa)`;
  const OPCAO_ERRADA = `c.painel.botoes.find((b) => b.opcao && b.opcao.valor !== c.vez.carta.certa && b.estilo === 'opcao')`;
  const CONFERIR = (certo) => `c.painel.botoes.find((b) => b.estilo === '${certo ? 'sim' : 'nao'}')`;
  const CONTINUAR = `c.painel.botoes.find((b) => b.rotulo === 'CONTINUAR')`;
  const RAPIDO = `c.regras.rolarMs = 100; c.regras.passoMs = 60; c.regras.cpuEsperaMs = 80;`;
  const estado = () => jg(`return {
    cena: c.constructor.name, fase: c.fase, quem: c.vez?.quem, deNovo: c.vez?.deNovo, inicio: c.vez?.inicio, alvo: c.vez?.alvo,
    pos: c.pos ? { ...c.pos } : null, erros: c.placar?.erros, anel: c.tabuleiro?.anelCasa, pausada: !!c.pausada,
    faixa: c.faixa ? c.faixa.quem + (c.faixa.deNovo ? '+' : '') : null };`);

  /** A vez da criança: toca o dado (com `dado` forçado, se dado), responde e toca CONTINUAR. */
  const vezDaCrianca = async (certo, dado = null) => {
    if (!(await esperarAte(`c.constructor.name === 'ResultScreen' || (c.fase === 'dado' && c.vez.quem === 'crianca')`, 15000))) return 'a vez dela não começou';
    if (await jg(`return c.constructor.name === 'ResultScreen';`)) return 'fim';
    if (dado) await jg(`c.dadoDeTeste = ${dado}; return 1;`);
    await tocarNo('c.botaoDado');
    if (!(await esperarAte(`c.fase === 'carta' && c.painel.alpha >= 1`, 10000))) return 'a carta dela não abriu';
    await tocarNo(certo ? OPCAO_CERTA : OPCAO_ERRADA);
    if (!(await esperarAte(`c.fase === 'retorno'`, 4000))) return 'a resposta não deu retorno';
    await tocarNo(CONTINUAR);
    return 'ok';
  };
  /** A vez do computador: espera ele responder e confere (bem ou mal) e toca CONTINUAR. */
  const vezDoComputador = async (conferirBem = true, erra = null) => {
    if (!(await esperarAte(`c.constructor.name === 'ResultScreen' || (c.vez.quem === 'computador' && ['cpuEspera', 'rolando', 'andando', 'conferir'].includes(c.fase))`, 15000))) return 'a vez dele não começou';
    if (await jg(`return c.constructor.name === 'ResultScreen';`)) return 'fim';
    if (erra != null) await jg(`c.computadorErraDeTeste = ${erra}; return 1;`);
    if (!(await esperarAte(`c.fase === 'conferir' && c.painel.alpha >= 1`, 15000))) return 'ele não respondeu';
    const certo = await jg(`return c.vez.resposta.certo;`);
    await tocarNo(CONFERIR(conferirBem ? certo : !certo));
    if (!(await esperarAte(`c.fase === 'retorno'`, 4000))) return 'a conferência não deu retorno';
    await tocarNo(CONTINUAR);
    return 'ok';
  };
  /**
   * Confere as vezes do computador até a vez voltar à criança. Ele ERRA de propósito: errando volta e não sai
   * do lugar, então não chega à SAÍDA no meio de um passo do teste (acertando, com sorte nas verdes, chegava).
   */
  const ateACrianca = async () => {
    for (let i = 0; i < 8 && !(await esperarAte(`c.vez.quem === 'crianca' && c.fase === 'dado'`, 300)); i++) await vezDoComputador(true, true);
    return esperarAte(`c.vez.quem === 'crianca' && c.fase === 'dado'`, 3000);
  };
  /** Uma partida inteira só com gestos: a criança acerta (ou erra) tudo; devolve quantas cartas ela errou. */
  const partida = async (crianca) => {
    let errou = 0;
    // Limite por TEMPO, não por voltas: cada volta dura o que a fase pede (a ficha andando, a carta…).
    for (const fim = Date.now() + 180000; Date.now() < fim;) {
      if (await esperarAte(`c.constructor.name === 'ResultScreen'`, 50)) return { ok: true, errou };
      // Decide pela FASE, não só por quem joga: com a ficha dela voltando a vez ainda é dela, e o próximo
      // gesto é do computador.
      const st = await jg(`return c.constructor.name === 'GameScene' ? { quem: c.vez.quem, fase: c.fase } : null;`);
      if (st?.quem === 'crianca' && st.fase === 'dado') {
        const certo = crianca === 'acerta';
        const r = await vezDaCrianca(certo);
        if (r !== 'ok' && r !== 'fim') return { ok: false, em: r, errou };
        if (r === 'ok' && !certo) errou++;
      } else if (st?.fase === 'conferir') {
        const r = await vezDoComputador(true);
        if (r !== 'ok' && r !== 'fim') return { ok: false, em: r, errou };
      } else {
        await esperar(60);
      }
    }
    return { ok: await esperarAte(`c.constructor.name === 'ResultScreen'`, 8000), errou };
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
  await captura('01-menu');
  checar('começa no menu', (await estado()).cena === 'MenuScreen');
  checar('toque em JOGAR leva à escolha de nível', await tocarNo(BTN('/^jogar$/i')) && await esperarAte(`c.constructor.name === 'LevelSelectScreen'`, 5000));
  await esperar(500);
  await captura('02-niveis');
  checar('toque no cartão FÁCIL abre a partida',
    await tocarNo(`${W}.__achar(c, (n) => n.nivel && n.nivel.id === 1)`) && await esperarAte(`c.constructor.name === 'GameScene'`, 6000));
  await jg(RAPIDO);
  const ini = await jg(`return { saida: c.saida, verdes: c.trilha.verdes.join(), tema: c.config.tema, total: c.placar.total, face: c.dado.face,
    pos: c.pos.crianca + ',' + c.pos.computador, fase: c.fase, quem: c.vez.quem, botao: c.botaoDado.habilitado, carta: c.painel.visible };`);
  checar('o Fácil: trilha de 15, verdes 5, 8, 12, meta 15, tema tabuleiro',
    ini.saida === 15 && ini.verdes === '5,8,12' && ini.total === 15 && ini.tema === 'tabuleiro', JSON.stringify(ini));
  checar('começa com as duas fichas na ENTRADA, a vez da criança, o dado com "?" e o botão ligado',
    ini.pos === '0,0' && ini.fase === 'dado' && ini.quem === 'crianca' && ini.face === 0 && ini.botao === true && ini.carta === false, JSON.stringify(ini));
  await captura('03-partida');

  // ------------------------------------------------------------- 2. o dado
  console.log('\n2. O dado: o toque rola, a ficha anda as casas e a carta abre');
  // Espia as falas pedidas, com a fase em que foram pedidas (a contagem é 'andando'; a carta, 'carta' e 'conferir').
  // `__fim` guarda como cada fala TERMINOU: `true` tocou inteira, `false` foi cortada (ou não tem gravação).
  await jg(`c.__falas = []; c.__fim = []; const f = c.audio.falar.bind(c.audio);
    c.audio.falar = (id, o) => { c.__falas.push(c.fase + ':' + id); const p = f(id, o); p.then((r) => c.__fim.push(id + ':' + r + ':' + c.fase)); return p; }; return 1;`);
  await jg(`c.regras.rolarMs = 1200; c.dadoDeTeste = 3; return 1;`);
  await tocarNo('c.botaoDado');
  checar('toque no botão rola o dado', (await estado()).fase === 'rolando');
  await tocarNo('c.dado');
  checar('um toque a mais durante a rolagem não rola de novo', (await estado()).fase === 'rolando');
  await jg(`c.regras.passoMs = 400; return 1;`);
  checar('o dado para no 3 e a ficha começa a andar', await esperarAte(`c.fase === 'andando' && c.dado.face === 3`, 4000));
  checar('a ficha conta os passos (selo com 1, 2…)', await esperarAte(`c.fichas.crianca.contagem >= 2`, 3000));
  await captura('04-andando');
  checar('a ficha para na casa 3 e a carta abre', await esperarAte(`c.fase === 'carta'`, 6000) && (await estado()).pos.crianca === 3);
  await jg(RAPIDO);
  const carta = await jg(`return { botoes: c.painel.botoes.length, pergunta: c.vez.carta.pergunta, visivel: c.painel.visible };`);
  await esperarAte(`c.painel.alpha >= 1`, 2000);
  checar('a carta tem 3 respostas tocáveis', carta.botoes === 3 && carta.visivel, JSON.stringify(carta));
  const falas = await jg(`return c.__falas;`);
  checar('a contagem dos passos fala "um", "dois", "três"', ['numero1', 'numero2', 'numero3'].every((id) => falas.includes('andando:' + id)), falas.join());
  const fins = await jg(`return c.__fim;`);
  checar('a carta só abre DEPOIS de a voz terminar o último número: "um", "dois" e "três" tocam inteiros, com a ficha ainda andando',
    ['numero1', 'numero2', 'numero3'].every((id) => fins.includes(`${id}:true:andando`)), fins.join());
  checar('a carta abre SEM o número solto (a pergunta ainda não tem gravação: fica muda inteira)',
    !falas.some((x) => x.startsWith('carta:')), falas.join());
  await captura('05-carta');
  await tocarNo('c.botaoDado');
  checar('com a carta aberta, o botão do dado não faz nada', (await estado()).fase === 'carta');

  // ------------------------------------------------------- 3. a carta certa
  console.log('\n3. A carta certa: a ficha fica');
  await tocarNo(OPCAO_CERTA);
  checar('tocar a certa mostra o retorno', await esperarAte(`c.fase === 'retorno'`, 3000));
  await captura('06-acertou');
  const r3 = await jg(`return { titulo: c.painel.retorno.titulo, erros: c.placar.erros, certas: c.stats.certas };`);
  checar('ACERTOU!, sem erro na conta', r3.titulo === 'ACERTOU!' && r3.erros === 0 && r3.certas === 1, JSON.stringify(r3));
  await jg(`c.dadoDeTeste = 2; c.computadorErraDeTeste = true; return 1;`);
  await tocarNo(CONTINUAR);
  checar('CONTINUAR passa a vez ao computador e a ficha fica na casa 3',
    await esperarAte(`c.vez.quem === 'computador'`, 3000) && (await estado()).pos.crianca === 3);

  // ---------------------------------------------------- 4. a vez do computador
  console.log('\n4. A vez do computador: ele responde e a criança confere');
  checar('ele joga o dado sozinho, anda e responde', await esperarAte(`c.fase === 'conferir' && c.painel.alpha >= 1`, 10000));
  const cpu = await jg(`return { pos: c.pos.computador, certo: c.vez.resposta.certo, diz: c.painel.diz?.texto, botoes: c.painel.botoes.map((b) => b.estilo).join() };`);
  checar('ele andou 2 casas, respondeu ERRADO e a criança tem CERTO e ERRADO', cpu.pos === 2 && cpu.certo === false && cpu.botoes === 'sim,nao', JSON.stringify(cpu));
  await captura('07-computador-diz');
  checar('a resposta do computador também não solta o número sozinho', !(await jg(`return c.__falas;`)).some((x) => x.startsWith('conferir:')));
  await tocarNo(CONFERIR(false));
  checar('a criança toca ERRADO: conferiu bem', await esperarAte(`c.fase === 'retorno'`, 3000)
    && (await jg(`return c.painel.retorno.titulo === 'ISSO! ELE ERROU.' && c.stats.conferenciasCertas === 1 && c.placar.erros === 0;`)));
  await tocarNo(CONTINUAR);
  checar('ele errou: a ficha dele VOLTA para a ENTRADA e a vez volta à criança',
    await esperarAte(`c.vez.quem === 'crianca' && c.fase === 'dado'`, 6000) && (await estado()).pos.computador === 0);

  // ------------------------------------------------------- 5. a carta errada
  console.log('\n5. A carta errada: a ficha volta de onde partiu');
  const r5 = await vezDaCrianca(false, 1);
  const e5 = await estado();
  checar('errou a carta: conta 1 erro', r5 === 'ok' && e5.erros === 1, JSON.stringify({ r5, e5 }));
  checar('a ficha volta da casa 4 para a 3 (de onde partiu) e a vez passa',
    await esperarAte(`c.vez.quem === 'computador'`, 6000) && (await estado()).pos.crianca === 3);

  // --------------------------------------------------------- 6. a casa verde
  console.log('\n6. A casa verde: quem fica joga de novo');
  // Da casa 3, um 2 leva à 5 (verde no Fácil).
  checar('a vez é da criança, na casa 3', await ateACrianca() && (await estado()).pos.crianca === 3, JSON.stringify(await estado()));
  const r6 = await vezDaCrianca(true, 2);
  checar('caiu na 5 e acertou: joga DE NOVO, com o anel na verde',
    r6 === 'ok' && await esperarAte(`c.fase === 'dado' && c.vez.quem === 'crianca' && c.vez.deNovo`, 4000)
      && (await jg(`return c.tabuleiro.anelCasa === 5 && c.faixa.deNovo && c.stats.jogadasExtras === 1;`)), JSON.stringify(await estado()));
  await captura('08-casa-verde');
  // A jogada extra errada volta para a VERDE, não para antes dela.
  await vezDaCrianca(false, 1);
  checar('errou a carta da jogada extra: volta para a verde (casa 5), e a vez passa',
    await esperarAte(`c.vez.quem === 'computador'`, 6000) && (await estado()).pos.crianca === 5, JSON.stringify(await estado()));

  // -------------------------------------------------------- 7. pausa e ajuda
  console.log('\n7. A pausa e a ajuda');
  checar('a vez volta à criança, ainda na verde (casa 5)', await ateACrianca() && (await estado()).pos.crianca === 5, JSON.stringify(await estado()));
  await jg(`c.regras.passoMs = 700; c.dadoDeTeste = 6; return 1;`);
  await tocarNo('c.botaoDado');
  await esperarAte(`c.fase === 'andando' && c.vez.passos >= 1`, 4000);
  checar('a pausa abre no meio da ficha andando', await tocarNo(ICONE('pausa')) && (await estado()).pausada === true);
  const antes = (await estado()).pos.crianca;
  await esperar(2000);
  checar('pausado, a ficha NÃO anda', (await estado()).pos.crianca === antes);
  checar('CONTINUAR devolve a partida', await tocarNo(BTN('/^continuar$/i')) && (await estado()).pausada === false);
  checar('e a ficha termina de andar até a casa 11', await esperarAte(`c.fase === 'carta'`, 15000) && (await estado()).pos.crianca === 11, JSON.stringify(await estado()));
  const fins6 = await jg(`return c.__fim;`);
  checar('dado 6, com uma pausa no meio: a voz conta de "um" a "seis" inteiros antes de a carta abrir',
    ['numero4', 'numero5', 'numero6'].every((id) => fins6.includes(`${id}:true:andando`)), fins6.slice(-8).join());
  await jg(RAPIDO);
  checar('a ajuda abre por cima da carta', await tocarNo(ICONE('tutorial')) && (await estado()).pausada === true);
  await esperar(800);
  await captura('09-ajuda');
  const fechou = await tocarNo(`${W}.__achar(c, (n) => n.icone === 'fechar' && n.visivelMundo)`) || await tocarNo(BTN('/voltar|fechar|continuar/i'));
  checar('fechar a ajuda devolve a carta intacta', fechou && await esperarAte(`!c.pausada && c.fase === 'carta' && c.painel.visible`, 4000));

  const guardaPagina = avisos.filter((x) => /watchdog|cão de guarda|travad|resgat/i.test(x));
  checar('nenhum erro de JavaScript na página', erros.length === 0, erros.slice(0, 4).join(' | '));
  checar('o Watchdog não disparou', guardaPagina.length === 0, guardaPagina.slice(0, 3).join(' | '));

  // ----------------------------------------------- 8. o AVA dentro do iframe
  console.log('\n8. AVA: a mensagem cruza o <iframe>');
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
  // O host pode recarregar o iframe logo depois de o jogo subir: espera o menu estar de pé antes de tocar.
  await esperarAte(`c && c.constructor.name === 'MenuScreen'`, 8000);
  await esperar(1000);
  await esperarAte(`c && c.constructor.name === 'MenuScreen'`, 8000);
  const errosAntesAva = erros.length;
  await tocarNo(BTN('/^jogar$/i'));
  await esperarAte(`c.constructor.name === 'LevelSelectScreen'`, 5000);
  await tocarNo(`${W}.__achar(c, (n) => n.nivel && n.nivel.id === 1)`);
  await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
  // Aqui só os NÚMEROS do AVA importam: a espera pela voz da contagem (conferida nos itens 2 e 7) sai, para as partidas inteiras não levarem minutos.
  const PARTIDA_RAPIDA = `${RAPIDO} c.regras.computadorErra = 0; c.regras.falaMaxMs = 0;`;
  await jg(`${PARTIDA_RAPIDA} return 1;`);
  const p1 = await partida('acerta');
  checar('1ª partida (Fácil, a criança acerta tudo) chegou ao resultado', p1.ok, JSON.stringify(p1));
  await esperar(900);
  await captura('10-resultado-1');
  let m = await aval(`window.__recebidas`);
  const m1 = m[0] ?? {};
  checar('uma mensagem, com jogo, nível 1, meta 15', m.length === 1 && m1.jogo === 'corrida-maluca' && m1.nivel === 1 && m1.totalPerguntas === 15, JSON.stringify(m1));
  const venceu1 = m1.vitoria === true;
  checar(venceu1 ? 'vitória sem erro: acertos 15, erros 0 e a casa 15' : 'derrota (o computador correu mais): acertos = a casa alcançada, erros 0',
    venceu1 ? (m1.acertos === 15 && m1.erros === 0 && m1.casaAlcancada === 15) : (m1.acertos === m1.casaAlcancada && m1.erros === 0 && m1.casaComputador === 15), JSON.stringify(m1));
  checar('os extras batem: todas as cartas certas, conferências todas certas',
    m1.cartasRespondidas === m1.cartasCertas && m1.cartasRespondidas >= 1 && m1.conferencias === m1.conferenciasCertas, JSON.stringify(m1));

  // Derrota garantida: a criança erra tudo e nunca sai do lugar; o computador acerta tudo.
  await jg(`c.irPara('jogando', { nivel: j.config.niveis[1] }); return true;`);
  await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
  await jg(`${PARTIDA_RAPIDA} return 1;`);
  const p2 = await partida('erra');
  checar('2ª partida (Médio, a criança erra tudo) chegou ao resultado', p2.ok, JSON.stringify(p2));
  await esperar(900);
  await captura('11-resultado-derrota');
  m = await aval(`window.__recebidas`);
  const m2 = m[1] ?? {};
  checar('derrota no Médio: vitoria false, meta 21, acertos 0 (a casa dela: a ENTRADA), erros = as cartas que ela errou',
    m.length === 2 && m2.vitoria === false && m2.nivel === 2 && m2.totalPerguntas === 21 && m2.acertos === 0 && m2.erros === p2.errou && m2.casaComputador === 21,
    JSON.stringify({ m2, errou: p2.errou }));
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
console.log('Capturas em .capturas/corrida-maluca/');
