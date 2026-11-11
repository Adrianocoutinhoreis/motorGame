#!/usr/bin/env node
/**
 * teste-jogabilidade-cabo-de-guerra.mjs — o Cabo de Guerra jogado com GESTO REAL.
 *
 * Mesma estrutura de `teste-jogabilidade-corrida-maluca.mjs`: só ponteiro, via
 * `Input.dispatchMouseEvent`, nas coordenadas de tela de verdade. A cena só é LIDA, para conferir o
 * resultado do gesto, e o ritmo é acelerado (`regras.rolarMs`, `passoMs`, `cpuEsperaMs`) — nunca a
 * entrada. Os dois ganchos de teste da cena (`dadoDeTeste` e `computadorErraDeTeste`) só escolhem o
 * próximo sorteio, para alcançar de propósito a ponta e o erro do computador.
 *
 * ## O que ele cobre
 *
 *   0. as REGRAS PURAS (`src/regras.js`) em Node: a trilha de cada nível, a puxada, as cartas de todos
 *      os grupos (3 respostas diferentes, a certa entre elas), nenhuma carta repetida na partida, o
 *      computador errando ~1 em 4, a nota;
 *   1. menu → níveis → partida, só com toques; o Fácil com 7 passos e 15 bolinhas;
 *   2. o DADO: o toque rola, a carta abre COM o nó parado no centro;
 *   3. a carta CERTA: o nó anda as casas do dado, contando, e a vez passa ao computador;
 *   4. a VEZ DO COMPUTADOR: ele responde, a criança confere; errou, o nó fica parado;
 *   5. a carta ERRADA: o nó fica, conta um erro e a vez passa;
 *   6. a PAUSA congela o nó andando, a AJUDA devolve a partida intacta;
 *   7. o nó chegando à ponta vence na hora, sem carta (7b a criança, 7c o computador);
 *   8. o AVA dentro de um IFRAME: vitória e derrota registram, com os números do que foi jogado;
 *   9. nenhum erro de JavaScript e nenhum disparo do `Watchdog`.
 *
 * As lacunas de narração são esperadas: o motor as declara no console (aviso), e as perguntas, as
 * unidades, a conferência e o tutorial ainda não foram gravados.
 *
 * ## Uso
 *
 * Com `node tools/serve.mjs 8099` rodando em outro terminal:
 *     node tools/teste-jogabilidade-cabo-de-guerra.mjs
 *
 * As capturas vão para `.capturas/cabo-de-guerra/`.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORTA = Number(process.argv[2]) || 8099;
const PORTA_CDP = 9374;
const SAIDA = path.join(RAIZ, '.capturas', 'cabo-de-guerra');
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

let passaram = 0; let falharam = 0; const problemas = [];
const checar = (nome, cond, det = '') => {
  if (cond) { passaram++; console.log(`  ok   ${nome}`); }
  else { falharam++; problemas.push(`${nome} — ${det}`); console.log(`  FALHOU  ${nome}\n          ${det}`); }
};


// ---------------------------------------------------------------- 0. regras puras
console.log('\n0. As regras puras (src/regras.js), em Node');
{
  const R = await import(pathToFileURL(path.join(RAIZ, 'Games/numerandus/cabo-de-guerra/src/regras.js')).href);
  const cfgMod = await import(pathToFileURL(path.join(RAIZ, 'Games/numerandus/cabo-de-guerra/src/config.js')).href);
  const passosDosNiveis = (cfgMod.default ?? cfgMod.config ?? Object.values(cfgMod)[0]).niveis.map((n) => n.passos);
  checar('níveis de 7, 8 e 9 passos, e NENHUM com menos de 7 (o dado 6 não decide a partida numa jogada)',
    JSON.stringify(passosDosNiveis) === '[7,8,9]' && Math.min(...passosDosNiveis) > 6, JSON.stringify(passosDosNiveis));
  for (const passos of [7, 8, 9]) {
    const t = R.montarTrilha(passos);
    const dist = t.xs.slice(1).map((x, i) => x - t.xs[i]);
    const folga = Math.min(...dist) - 2 * t.raio;
    checar(`${passos} passos: ${2 * passos + 1} bolinhas, a do meio em ${t.xs[passos]}, crescendo da esquerda para a direita`,
      t.xs.length === 2 * passos + 1 && t.ultimo === 2 * passos && t.xs.every((x, i) => i === 0 || x > t.xs[i - 1])
        && Math.abs(t.xs[passos] - (R.TIRA.x + R.TIRA.l / 2)) <= 1, JSON.stringify({ n: t.xs.length, meio: t.xs[passos] }));
    checar(`${passos} passos: bolinhas de ${2 * t.raio} px que não se encostam (folga ${folga.toFixed(0)} px) e o nó cabe na tira`,
      folga >= 6 && t.noRaio > t.raio && t.noRaio * 2 <= R.TIRA.a - 20 && t.xs[0] - t.raio * 1.3 >= R.TIRA.x,
      JSON.stringify({ raio: t.raio, noRaio: t.noRaio, folga }));
  }
  checar('puxada: a criança vai para 0, o computador para 2·passos, e passar da ponta para nela',
    R.alvoDaPuxada(5, 'crianca', 3, 5) === 2 && R.alvoDaPuxada(2, 'crianca', 6, 5) === 0
      && R.alvoDaPuxada(5, 'computador', 4, 5) === 9 && R.alvoDaPuxada(8, 'computador', 6, 5) === 10);
  checar('vencedor: 0 é da criança, 2·passos do computador, o meio de ninguém',
    R.vencedorDaPartida(0, 5) === 'crianca' && R.vencedorDaPartida(10, 5) === 'computador' && R.vencedorDaPartida(5, 5) === null && R.vencedorDaPartida(1, 5) === null);
  checar('faltam: a criança precisa da posição; o computador, do resto até 2·passos',
    R.faltam(5, 'crianca', 5) === 5 && R.faltam(5, 'computador', 5) === 5 && R.faltam(2, 'crianca', 5) === 2 && R.faltam(2, 'computador', 5) === 8);
  checar('progresso da criança: casas do centro rumo à ponta dela, nunca negativo',
    R.progressoDaCrianca(2, 5) === 3 && R.progressoDaCrianca(5, 5) === 0 && R.progressoDaCrianca(8, 5) === 0);

  // As cartas de cada nível vêm do próprio config (uma fonte só): o teste confere o que o jogo realmente sorteia.
  const cfgNiveis = (cfgMod.default ?? cfgMod.config ?? Object.values(cfgMod)[0]).niveis;
  const NIVEIS = { 1: cfgNiveis[0].cartas, 2: cfgNiveis[1].cartas, 3: cfgNiveis[2].cartas };
  let cartasOk = true; let motivo = '';
  let total = 0;
  for (let i = 0; i < 4000 && cartasOk; i++) {
    for (const [, cartas] of Object.entries(NIVEIS)) {
      for (const g of R.gruposDoNivel(cartas)) {
        const c = R.gerarCarta(g.grupo, g.cfg);
        total++;
        const vs = c.opcoes.map((o) => o.valor);
        if (new Set(vs).size !== 3 || !vs.includes(c.certa) || c.opcoes.some((o) => !o.texto)
          || (typeof c.certa === 'number' && vs.some((v) => v < 1))
          || c.pergunta !== c.pergunta.toUpperCase() || !R.NOME_DO_TIPO[c.tipo] || !c.conta || !c.fala.length) {
          cartasOk = false; motivo = JSON.stringify(c);
        }
      }
    }
  }
  checar(`${total} cartas dos três níveis: 3 respostas diferentes (positivas), a certa entre elas, pergunta em CAIXA ALTA, tipo, conta e fala`, cartasOk, motivo);

  const m76 = R.gerarCarta('multiplicacao', { a: [7], b: [6, 6] });
  checar('7 × 6: a certa é 42, com a confusão de um grupo a mais (49) e a conta',
    m76.certa === 42 && m76.pergunta === '7 × 6 = ?' && m76.opcoes.some((o) => o.valor === 49) && m76.conta === '7 × 6 = 42', JSON.stringify(m76));
  const a30 = R.gerarCarta('antecessor', [30, 30]);
  checar('antecessor de 30: a certa é 29 e o sucessor (31) vem entre as erradas, como no vídeo',
    a30.certa === 29 && a30.opcoes.some((o) => o.valor === 31) && a30.pergunta === 'QUAL É O ANTECESSOR DE 30?', JSON.stringify(a30));
  const s39 = R.gerarCarta('sucessor', [39, 39]);
  checar('sucessor de 39: a certa é 40 e o antecessor (38) vem entre as erradas',
    s39.certa === 40 && s39.opcoes.some((o) => o.valor === 38), JSON.stringify(s39));
  const graupos = new Set();
  for (let i = 0; i < 400; i++) for (const k of [1, 2, 3]) graupos.add(`${k}:${R.sortearCarta(NIVEIS[k], []).carta.grupo}`);
  checar('cada nível sorteia só os seus grupos, todos eles (7, 10 e 11 grupos)',
    [1, 2, 3].map((k) => [...graupos].filter((x) => x.startsWith(`${k}:`)).length).join() === '7,10,11', [...graupos].join());
  checar('os 11 grupos de carta existem e o config só liga grupos que existem',
    R.GRUPOS.length === 11 && Object.values(NIVEIS).every((c) => Object.keys(c).every((g) => R.GRUPOS.includes(g))));

  // Quantas cartas diferentes cada nível oferece (chaves distintas em 30 000 sorteios).
  const variedade = [1, 2, 3].map((k) => {
    const chaves = new Set();
    for (let i = 0; i < 30000; i++) chaves.add(R.sortearCarta(NIVEIS[k], []).carta.chave);
    return chaves.size;
  });
  checar(`cartas diferentes por nível: ${variedade.join(' / ')} (só as que saem em 30 000 sorteios)`,
    variedade[0] >= 190 && variedade[1] >= 500 && variedade[2] >= 2000, JSON.stringify(variedade));

  // As cartas novas: a conta de cada uma, com sorteio travado.
  const cd = R.gerarCarta('dobro', [7, 7]);
  const ct = R.gerarCarta('triplo', [4, 4]);
  const ch = R.gerarCarta('metade', [14, 14]);
  const cr = R.gerarCarta('adicaoRepetida', { n: [4, 4], k: [3, 3] });
  const cs1 = R.gerarCarta('sequencia', { passos: [5], inicio: [10, 10] });
  const cs2 = R.gerarCarta('sequencia', { passos: [5], inicio: [30, 30], desce: true }, () => 0.1);
  checar('dobro de 7 = 14, triplo de 4 = 12, metade de 14 = 7, 4 + 4 + 4 = 12',
    cd.certa === 14 && ct.certa === 12 && ch.certa === 7 && cr.certa === 12 && cr.pergunta === '4 + 4 + 4 = ?'
      && cd.pergunta === 'QUAL É O DOBRO DE 7?' && ch.pergunta === 'QUAL É A METADE DE 14?', JSON.stringify([cd, ct, ch, cr]));
  checar('sequência de 5 em 5: 10, 15, 20, 25 → 30; descendo: 30, 25, 20, 15 → 10; a confusão é o número seguinte comum',
    cs1.certa === 30 && cs1.pergunta.startsWith('10, 15, 20, 25,') && cs2.certa === 10 && cs2.pergunta.startsWith('30, 25, 20, 15,')
      && cs1.opcoes.some((o) => o.valor === 26), JSON.stringify([cs1, cs2]));
  const s1 = R.gerarCarta('soma', { max: 1 }, () => 0);
  checar('plural certo: "1 LITRO", nunca "1 LITROS"', s1.pergunta.startsWith('1 LITRO DE SUCO E MAIS 1 LITRO DE SUCO'), s1.pergunta);
  checar('24 cartas de unidade, 12 de capacidade e 12 de massa, cada uma com a unidade certa entre as respostas',
    R.UNIDADES.length === 24 && R.UNIDADES.filter((u) => u.tipo === 'capacidade').length === 12
      && R.UNIDADES.every((u) => !u.erradas.includes(u.certa) && u.erradas.length === 2));

  let usadas = []; let repetiu = false;
  for (let i = 0; i < 60; i++) { const r = R.sortearCarta(NIVEIS[1], usadas); if (usadas.includes(r.carta.chave)) repetiu = true; usadas = r.usadas; }
  checar('nenhuma carta repete numa partida (60 cartas seguidas no Fácil)', !repetiu && usadas.length === 60);

  let erradas = 0; let errouValido = true;
  for (let i = 0; i < 20000; i++) {
    const c = R.gerarCarta('multiplicacao', NIVEIS[2].multiplicacao);
    const r = R.respostaDoComputador(c);
    if (!r.certo) { erradas++; if (r.opcao.valor === c.certa || !c.opcoes.includes(r.opcao)) errouValido = false; }
  }
  checar(`o computador erra ~1 em 4 (${(erradas / 200).toFixed(1)}%) e, errando, escolhe uma resposta errada da carta`,
    Math.abs(erradas / 20000 - 0.25) < 0.02 && errouValido);
  checar('nota (RE-02): vitória = meta − erros (mínimo 0); derrota = as casas puxadas',
    R.notaDaPartida({ vitoria: true, meta: 5, erros: 2, progresso: 5 }) === 3 && R.notaDaPartida({ vitoria: true, meta: 5, erros: 9, progresso: 5 }) === 0
      && R.notaDaPartida({ vitoria: false, meta: 7, erros: 3, progresso: 2 }) === 2);
}

const navegador = NAVEGADORES.find((c) => existsSync(c));
if (!navegador) { console.error('nenhum Chrome/Edge encontrado'); process.exit(2); }
mkdirSync(SAIDA, { recursive: true });
const perfil = path.join(os.tmpdir(), `cabo-de-guerra-${Date.now()}`);
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
  const RAPIDO = `c.regras.rolarMs = 100; c.regras.passoMs = 60; c.regras.cpuEsperaMs = 1500;`;
  const estado = () => jg(`return {
    cena: c.constructor.name, fase: c.fase, quem: c.vez?.quem, alvo: c.vez?.alvo, pos: c.pos, erros: c.placar?.erros,
    pausada: !!c.pausada, faixa: c.faixa ? c.faixa.quem : null, faltaC: c.ladoC?.falta, faltaP: c.ladoP?.falta };`);

  /** A vez da criança: toca o dado (com `dado` forçado, se dado), responde e toca CONTINUAR. */
  const vezDaCrianca = async (certo, dado = null) => {
    if (!(await esperarAte(`c.constructor.name === 'ResultScreen' || (c.fase === 'dado' && c.vez.quem === 'crianca')`, 15000))) return 'a vez dela não começou';
    if (await jg(`return c.constructor.name === 'ResultScreen';`)) return 'fim';
    if (dado) await jg(`c.dadoDeTeste = ${dado}; return 1;`);
    await tocarNo('c.botaoDado');
    if (!(await esperarAte(`c.constructor.name === 'ResultScreen' || (c.fase === 'carta' && c.painel.alpha >= 1)`, 10000))) return 'a carta dela não abriu';
    if (await jg(`return c.constructor.name === 'ResultScreen';`)) return 'fim';
    await tocarNo(certo ? OPCAO_CERTA : OPCAO_ERRADA);
    if (!(await esperarAte(`c.fase === 'retorno'`, 4000))) return 'a resposta não deu retorno';
    await tocarNo(CONTINUAR);
    return 'ok';
  };
  /** A vez do computador: espera ele responder e confere (bem ou mal) e toca CONTINUAR. */
  const vezDoComputador = async (conferirBem = true, erra = null) => {
    if (!(await esperarAte(`c.constructor.name === 'ResultScreen' || (c.vez.quem === 'computador' && ['cpuEspera', 'rolando', 'conferir'].includes(c.fase))`, 15000))) return 'a vez dele não começou';
    if (await jg(`return c.constructor.name === 'ResultScreen';`)) return 'fim';
    if (erra != null) await jg(`c.computadorErraDeTeste = ${erra}; return 1;`);
    if (!(await esperarAte(`c.fase === 'conferir' && c.painel.alpha >= 1`, 15000))) return 'ele não respondeu';
    const certo = await jg(`return c.vez.resposta.certo;`);
    await tocarNo(CONFERIR(conferirBem ? certo : !certo));
    if (!(await esperarAte(`c.fase === 'retorno'`, 4000))) return 'a conferência não deu retorno';
    await tocarNo(CONTINUAR);
    return 'ok';
  };
  /** Confere as vezes do computador (ele ERRA de propósito: o nó não sai do lugar) até a vez voltar à criança. */
  const ateACrianca = async () => {
    for (let i = 0; i < 8 && !(await esperarAte(`c.vez.quem === 'crianca' && c.fase === 'dado'`, 300)); i++) await vezDoComputador(true, true);
    return esperarAte(`c.vez.quem === 'crianca' && c.fase === 'dado'`, 3000);
  };
  /** Espera a vez do computador começar (ainda parado, antes de rolar) e escolhe o próximo dado e se ele erra. */
  const forcarComputador = async (dado, erra = false) => {
    const ok7 = await esperarAte(`c.vez.quem === 'computador' && c.fase === 'cpuEspera'`, 8000);
    await jg(`c.dadoDeTeste = ${dado}; c.computadorErraDeTeste = ${erra}; return 1;`);
    return ok7;
  };
  /** Uma partida inteira só com gestos: a criança acerta (ou erra) tudo; devolve quantas cartas ela errou. */
  const partida = async (crianca) => {
    let errou = 0;
    for (const fim = Date.now() + 180000; Date.now() < fim;) {
      if (await esperarAte(`c.constructor.name === 'ResultScreen'`, 50)) return { ok: true, errou };
      const st = await jg(`return c.constructor.name === 'GameScene' ? { quem: c.vez.quem, fase: c.fase } : null;`);
      if (st?.fase === 'sorteio') {
        await tocarNo('c.botaoDado');
      } else if (st?.quem === 'crianca' && st.fase === 'dado') {
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
  /** Recarrega a página e abre uma partida do nível `id`, só com toques. */
  const novaPartida = async (id, quemComeca = 'crianca') => {
    await cdp.enviar('Page.navigate', { url: JOGO_URL }, s);
    await esperar(1500);
    await esperarAte(`c && c.constructor.name === 'MenuScreen'`, 15000);
    await esperar(800);
    await tocarNo(BTN('/^jogar$/i'));
    await esperarAte(`c.constructor.name === 'LevelSelectScreen'`, 5000);
    await tocarNo(`${W}.__achar(c, (n) => n.nivel && n.nivel.id === ${id})`);
    if (!(await esperarAte(`c.constructor.name === 'GameScene'`, 6000))) return false;
    const dados = quemComeca === 'crianca' ? '{ crianca: 6, computador: 1 }' : '{ crianca: 1, computador: 6 }';
    await jg(`c.sorteioDeTeste = ${dados}; c.regras.rolarMs = 100; return 1;`);
    await tocarNo('c.botaoDado');
    return esperarAte(`c.vez.quem === '${quemComeca}'`, 8000);
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

  // ------------------------------------------------------ 1b. o sorteio de quem começa
  console.log('\n1b. O sorteio: os dois jogam um dado e o maior começa (empate sorteia de novo)');
  const s0 = await jg(`return { fase: c.fase, dadoBarra: c.dado.visible, sorteio: c.sorteioNos.visible, faces: [c.sorteioNos.dadoC.face, c.sorteioNos.dadoP.face],
    botao: c.botaoDado.habilitado, faixa: c.faixa.texto, vezNaTira: c.tira.vez, pos: c.pos, quemComecou: c.quemComecou };`);
  checar('a partida abre no SORTEIO: dois dados em "?", o dado da barra escondido, o botão ligado, ninguém com a vez',
    s0.fase === 'sorteio' && s0.dadoBarra === false && s0.sorteio === true && s0.faces.join() === '0,0' && s0.botao === true
      && s0.faixa === 'QUEM COMEÇA?' && s0.vezNaTira === null && s0.pos === 7 && s0.quemComecou === null, JSON.stringify(s0));
  await captura('03a-sorteio');
  await jg(`c.sorteioDeTeste = [{ crianca: 3, computador: 3 }, { crianca: 5, computador: 2 }]; c.regras.rolarMs = 700; return 1;`);
  await tocarNo('c.botaoDado');
  checar('tocar JOGAR O DADO rola os DOIS dados juntos', await esperarAte(`c.fase === 'sorteando' && c.sorteioNos.dadoC.rolando && c.sorteioNos.dadoP.rolando`, 2000));
  await tocarNo('c.botaoDado');
  checar('um toque a mais durante a rolagem não sorteia de novo', await jg(`return c.fase === 'sorteando' && c.sorteios === 0;`));
  checar('empate 3 × 3: a faixa diz "EMPATE! DE NOVO" e ninguém começa',
    await esperarAte(`c.faixa.texto === 'EMPATE! DE NOVO'`, 4000) && await jg(`return c.quemComecou === null && c.sorteios === 1 && c.sorteioNos.dadoC.face === 3 && c.sorteioNos.dadoP.face === 3 && c.sorteioNos.vencedor === null && c.sorteioNos.dadoC.escalaBase === 1 && c.sorteioNos.dadoP.escalaBase === 1;`));
  checar('depois do empate, o sorteio volta: dados em "?" e o botão ligado',
    await esperarAte(`c.fase === 'sorteio' && c.sorteioNos.dadoC.face === 0 && c.botaoDado.habilitado`, 4000));
  await jg(`c.regras.rolarMs = 100; return 1;`);
  await tocarNo('c.sorteioNos.dadoC');
  checar('o próprio dado da criança também sorteia (toque no dado)', await esperarAte(`c.fase === 'sorteando'`, 2000));
  checar('5 × 2: "VOCÊ COMEÇA!" e a criança é quem começa', await esperarAte(`c.faixa.texto === 'VOCÊ COMEÇA!' && c.quemComecou === 'crianca' && c.sorteios === 2`, 4000));
  checar('o dado MAIOR (o da criança, 5) ganha destaque (cresce) e o outro (2) encolhe e esmaece',
    await esperarAte(`c.sorteioNos.vencedor === 'crianca' && c.sorteioNos.dadoC.escalaBase > 1.1 && c.sorteioNos.dadoP.escalaBase < 0.95 && c.sorteioNos.dadoP.alpha < 0.7`, 2000));
  await captura('03b-sorteio-voce-comeca');
  checar('o sorteio some e a vez da criança começa (dado da barra de volta, "SUA VEZ")',
    await esperarAte(`c.fase === 'dado' && c.vez.quem === 'crianca' && c.sorteioNos.visible === false && c.dado.visible === true && c.faixa.texto === null`, 6000));
  const ini = await jg(`return { passos: c.passos, bolinhas: c.trilha.xs.length, tema: c.config.tema, total: c.placar.total, face: c.dado.face,
    pos: c.pos, fase: c.fase, quem: c.vez.quem, botao: c.botaoDado.habilitado, carta: c.painel.visible, noX: c.no.x, meioX: c.trilha.xs[c.passos] };`);
  checar('o Fácil: 7 passos, 15 bolinhas, meta 7, tema cabo',
    ini.passos === 7 && ini.bolinhas === 15 && ini.total === 7 && ini.tema === 'cabo', JSON.stringify(ini));
  checar('começa com o nó no CENTRO, a vez da criança, o dado com "?" e o botão ligado',
    ini.pos === 7 && ini.noX === ini.meioX && ini.fase === 'dado' && ini.quem === 'crianca' && ini.face === 0 && ini.botao === true && ini.carta === false, JSON.stringify(ini));
  await captura('03-partida');

  // ------------------------------------------------------------- 2. o dado
  console.log('\n2. O dado: o toque rola e a carta abre com o nó ainda parado');
  // Espia as falas pedidas, com a fase em que foram pedidas, e como cada uma TERMINOU.
  await jg(`c.__falas = []; c.__fim = []; const f = c.audio.falar.bind(c.audio);
    c.audio.falar = (id, o) => { c.__falas.push(c.fase + ':' + id); const p = f(id, o); p.then((r) => c.__fim.push(id + ':' + r + ':' + c.fase)); return p; }; return 1;`);
  await jg(`c.regras.rolarMs = 1200; c.dadoDeTeste = 3; return 1;`);
  await tocarNo('c.botaoDado');
  checar('toque no botão rola o dado', (await estado()).fase === 'rolando');
  await tocarNo('c.dado');
  checar('um toque a mais durante a rolagem não rola de novo', (await estado()).fase === 'rolando');
  checar('o dado para no 3 e a carta abre', await esperarAte(`c.fase === 'carta' && c.painel.alpha >= 1 && c.dado.face === 3`, 6000));
  await jg(RAPIDO);
  const carta = await jg(`return { botoes: c.painel.botoes.length, pergunta: c.vez.carta.pergunta, visivel: c.painel.visible, pos: c.pos, alvo: c.vez.alvo, dado: c.painel.dado };`);
  checar('a carta tem 3 respostas tocáveis, mostra o dado 3 e o nó AINDA está no centro (só anda se acertar)',
    carta.botoes === 3 && carta.visivel && carta.pos === 7 && carta.alvo === 4 && carta.dado === 3, JSON.stringify(carta));
  await captura('04-carta');
  await tocarNo('c.botaoDado');
  checar('com a carta aberta, o botão do dado não faz nada', (await estado()).fase === 'carta');

  // ------------------------------------------------------- 3. a carta certa
  console.log('\n3. A carta certa: o nó vem para a criança, contando');
  await tocarNo(OPCAO_CERTA);
  checar('tocar a certa mostra o retorno', await esperarAte(`c.fase === 'retorno'`, 3000));
  await captura('05-acertou');
  const r3 = await jg(`return { titulo: c.painel.retorno.titulo, detalhe: c.painel.retorno.detalhe, erros: c.placar.erros, certas: c.stats.certas, pos: c.pos };`);
  checar('ACERTOU!, "A FICHA VEM 3 CASAS PARA VOCÊ!", sem erro na conta e o nó ainda no centro',
    r3.titulo === 'ACERTOU!' && r3.detalhe === 'A FICHA VEM 3 CASAS PARA VOCÊ!' && r3.erros === 0 && r3.certas === 1 && r3.pos === 7, JSON.stringify(r3));
  await jg(`c.regras.passoMs = 400; return 1;`);
  await tocarNo(CONTINUAR);
  checar('CONTINUAR: o nó começa a andar e a fase é "puxando"', await esperarAte(`c.fase === 'puxando'`, 3000));
  checar('o nó conta os passos (selo com 1, 2…)', await esperarAte(`c.no.contagem >= 2`, 4000));
  await captura('06-puxando');
  checar('o nó para na posição 4 (3 casas para a criança), sem carta de chegada, e a vez passa ao computador',
    await esperarAte(`c.vez.quem === 'computador'`, 8000) && (await estado()).pos === 4, JSON.stringify(await estado()));
  const e3 = await estado();
  checar('os quadros dizem: a criança falta 4 casas e o computador 10', e3.faltaC === 4 && e3.faltaP === 10, JSON.stringify(e3));
  await jg(RAPIDO);
  const falas = await jg(`return c.__falas;`);
  checar('a contagem fala "um", "dois", "três"', ['numero1', 'numero2', 'numero3'].every((id) => falas.includes('puxando:' + id)), falas.join());
  const fins = await jg(`return c.__fim;`);
  checar('"um", "dois" e "três" tocam inteiros, com o nó ainda puxando',
    ['numero1', 'numero2', 'numero3'].every((id) => fins.includes(`${id}:true:puxando`)), fins.join());

  // ---------------------------------------------------- 4. a vez do computador
  console.log('\n4. A vez do computador: ele responde e a criança confere');
  await forcarComputador(2, true);
  checar('ele joga o dado sozinho e responde', await esperarAte(`c.fase === 'conferir' && c.painel.alpha >= 1`, 10000));
  const cpu = await jg(`return { pos: c.pos, certo: c.vez.resposta.certo, botoes: c.painel.botoes.map((b) => b.estilo).join(), dado: c.painel.dado };`);
  checar('o nó NÃO anda antes de conferir; ele respondeu ERRADO e a criança tem CERTO e ERRADO',
    cpu.pos === 4 && cpu.certo === false && cpu.botoes === 'sim,nao' && cpu.dado === 2, JSON.stringify(cpu));
  await captura('07-computador-diz');
  checar('a resposta do computador não solta o número sozinho (sem a pergunta gravada, fica mudo)', !(await jg(`return c.__falas;`)).some((x) => x.startsWith('conferir:')));
  await tocarNo(CONFERIR(false));
  checar('a criança toca ERRADO: conferiu bem', await esperarAte(`c.fase === 'retorno'`, 3000)
    && (await jg(`return c.painel.retorno.titulo === 'ISSO! ELE ERROU.' && c.stats.conferenciasCertas === 1 && c.placar.erros === 0;`)));
  await esperarAte(`c.painel.retorno && c.painel.retorno.k >= 1`, 2000);
  await captura('07b-computador-conferido');
  await tocarNo(CONTINUAR);
  checar('ele errou: o nó FICA na posição 4 e a vez volta à criança',
    await esperarAte(`c.vez.quem === 'crianca' && c.fase === 'dado'`, 6000) && (await estado()).pos === 4, JSON.stringify(await estado()));

  // ------------------------------------------------------- 5. a carta errada
  console.log('\n5. A carta errada: o nó fica e a vez passa');
  const r5 = await vezDaCrianca(false, 1);
  const e5 = await estado();
  checar('errou a carta: conta 1 erro e o nó fica na posição 4', r5 === 'ok' && e5.erros === 1 && e5.pos === 4, JSON.stringify({ r5, e5 }));
  checar('a vez passa ao computador', await esperarAte(`c.vez.quem === 'computador'`, 6000));

  // ---------------------------------------------- 5b. o computador acerta e puxa
  console.log('\n5b. O computador acerta: o nó vai para o lado dele');
  await forcarComputador(2, false);
  const r5b = await vezDoComputador(true);
  checar('ele acertou, a criança conferiu bem: o nó vai de 4 para 6 e a vez volta à criança',
    r5b === 'ok' && await esperarAte(`c.vez.quem === 'crianca' && c.fase === 'dado'`, 8000) && (await estado()).pos === 6, JSON.stringify({ r5b, e: await estado() }));
  const e5b = await estado();
  checar('os quadros: a criança falta 6 casas e o computador 8', e5b.faltaC === 6 && e5b.faltaP === 8, JSON.stringify(e5b));

  // -------------------------------------------------------- 6. pausa e ajuda
  console.log('\n6. A pausa e a ajuda');
  await jg(`c.regras.passoMs = 700; c.dadoDeTeste = 2; return 1;`);
  const certaPausa = await vezDaCrianca(true, 2).catch((e) => String(e));
  void certaPausa;
  // vezDaCrianca já tocou CONTINUAR: o nó está puxando devagar.
  await esperarAte(`c.fase === 'puxando'`, 4000);
  checar('a pausa abre no meio do nó andando', await tocarNo(ICONE('pausa')) && (await estado()).pausada === true);
  const antes = (await estado()).pos;
  await esperar(2000);
  checar('pausado, o nó NÃO anda', (await estado()).pos === antes);
  checar('CONTINUAR devolve a partida', await tocarNo(BTN('/^continuar$/i')) && (await estado()).pausada === false);
  checar('e o nó termina de andar até a posição 4', await esperarAte(`c.vez.quem === 'computador'`, 15000) && (await estado()).pos === 4, JSON.stringify(await estado()));
  await jg(RAPIDO);
  // A ajuda por cima da carta do computador.
  await forcarComputador(1, false);
  await esperarAte(`c.fase === 'conferir' && c.painel.alpha >= 1`, 10000);
  // A narração do tutorial: os 5 arquivos carregaram e a ajuda fala o passo 1 ao abrir.
  await jg(`c.__tut = []; const f = c.audio.falar.bind(c.audio); c.audio.falar = (id, o) => { c.__tut.push(id); return f(id, o); }; return 1;`);
  checar('a ajuda abre por cima da carta', await tocarNo(ICONE('tutorial')) && (await estado()).pausada === true);
  checar('os 5 áudios do tutorial carregaram (tutorialTela1..5)', await jg(`return [1, 2, 3, 4, 5].every((i) => c.audio.temSom('tutorialTela' + i));`));
  checar('a ajuda fala o passo 1 do tutorial ao abrir', await esperarAte(`(c.__tut || []).includes('tutorialTela1')`, 3000), JSON.stringify(await jg(`return c.__tut;`)));
  await esperar(800);
  await captura('08-ajuda');
  checar('o tutorial tem 5 passos', await jg(`return c.config.tutorial.length === 5;`));
  const fechou = await tocarNo(`${W}.__achar(c, (n) => n.icone === 'fechar' && n.visivelMundo)`) || await tocarNo(BTN('/voltar|fechar|continuar/i'));
  checar('fechar a ajuda devolve a carta intacta', fechou && await esperarAte(`!c.pausada && c.fase === 'conferir' && c.painel.visible`, 4000));
  await tocarNo(CONFERIR(true));
  await esperarAte(`c.fase === 'retorno'`, 3000);
  await tocarNo(CONTINUAR);

  // ----------------------------------------------------------------- 7b. a chegada
  console.log('\n7b. A chegada: o nó na ponta vence na hora, sem carta');
  checar('a vez volta à criança e o nó está na posição 5', await ateACrianca() && (await estado()).pos === 5, JSON.stringify(await estado()));
  await vezDaCrianca(true, 2);
  checar('acertou o 2: o nó vai para a posição 3', await ateACrianca() && (await estado()).pos === 3, JSON.stringify(await estado()));
  const cartasAntes = await jg(`return c.stats.respondidas;`);
  // Para chegar, a criança ainda precisa acertar a carta (a chegada é depois da puxada).
  await jg(`c.dadoDeTeste = 6; return 1;`);
  await tocarNo('c.botaoDado');
  await esperarAte(`c.fase === 'carta' && c.painel.alpha >= 1`, 8000);
  await tocarNo(OPCAO_CERTA);
  await esperarAte(`c.fase === 'retorno'`, 3000);
  const antes7 = await jg(`window.__fim7 = null; const ir = c.irPara.bind(c); c.irPara = (n, d) => { window.__fim7 = d?.resultado ?? null; return ir(n, d); }; return c.stats.respondidas;`);
  await tocarNo(CONTINUAR);
  checar('dado 6 da posição 3 PASSA da ponta: o nó para nela (0) e a partida entra em "chegou"',
    await esperarAte(`c.fase === 'chegou'`, 10000) && (await estado()).pos === 0, JSON.stringify(await estado()));
  const chegada = await jg(`return { carta: c.painel.visible, respondidas: c.stats.respondidas, ganhou: c.tira.ganhou };`);
  checar('na chegada NENHUMA carta abre e a ponta da criança acende', chegada.carta === false && chegada.respondidas === antes7 && chegada.ganhou === 'crianca' && antes7 === cartasAntes + 1, JSON.stringify({ chegada, antes7, cartasAntes }));
  await captura('09-chegada');
  checar('e a partida vai direto ao resultado (vitória)', await esperarAte(`c.constructor.name === 'ResultScreen'`, 5000)
    && await jg(`const r = window.__fim7; return !!r && r.vitoria === true && r.acertos === 7 - r.erros && r.extras?.casasPuxadas === 7;`), JSON.stringify(await jg(`return window.__fim7;`)));
  await esperar(900);
  await captura('09d-resultado-vitoria'); // a vitória não tem sol (o sol do tema "campo" não combina com o campo do Cabo de Guerra)

  // --------------------------------------------------- 7c. a chegada do computador
  console.log('\n7c. A chegada do computador: ele também vence na hora, sem carta');
  await novaPartida(1);
  await jg(`${RAPIDO} c.regras.falaMaxMs = 0; return 1;`);
  const p7c = [];
  p7c.push(await vezDaCrianca(false, 1));
  p7c.push(await forcarComputador(3), await vezDoComputador(true));
  checar('o computador puxou 3: o nó está na posição 10 e a vez volta à criança', p7c.every((x) => x === 'ok' || x === true) && await esperarAte(`c.vez.quem === 'crianca' && c.fase === 'dado'`, 8000) && (await estado()).pos === 10, JSON.stringify({ p7c, e: await estado() }));
  p7c.push(await vezDaCrianca(false, 1));
  await jg(`window.__fim7c = null; const ir = c.irPara.bind(c); c.irPara = (n, d) => { window.__fim7c = d?.resultado ?? null; return ir(n, d); }; return 1;`);
  p7c.push(await forcarComputador(6));
  const antes7c = await jg(`return { conferencias: c.stats.conferencias };`);
  p7c.push(await vezDoComputador(true));
  checar('ele acertou com o 6: o nó passa de 10 para a ponta (14) e a partida entra em "chegou"',
    await esperarAte(`c.fase === 'chegou'`, 10000) && (await estado()).pos === 14, JSON.stringify({ p7c, e: await estado() }));
  const chegada7c = await jg(`return { carta: c.painel.visible, quem: c.vez.quem, ganhou: c.tira.ganhou };`);
  checar('a ponta dele acende e nenhuma carta abre', chegada7c.carta === false && chegada7c.quem === 'computador' && chegada7c.ganhou === 'computador' && antes7c.conferencias === 1, JSON.stringify({ chegada7c, antes7c }));
  await captura('09c-chegada-computador');
  checar('e vai direto ao resultado: derrota, com as casas puxadas = 0',
    await esperarAte(`c.constructor.name === 'ResultScreen'`, 5000)
      && await jg(`const r = window.__fim7c; return !!r && r.vitoria === false && r.acertos === 0 && r.extras?.casasPuxadas === 0;`),
    JSON.stringify(await jg(`return window.__fim7c;`)));

  // --------------------------------------------------- 7d. a derrota guarda o MELHOR ponto da criança
  console.log('\n7d. Derrota depois de avançar: a nota é o melhor ponto a que a criança chegou (não 0)');
  await novaPartida(1);
  await jg(`${RAPIDO} c.regras.falaMaxMs = 0; window.__fim7d = null; const ir = c.irPara.bind(c); c.irPara = (n, d) => { window.__fim7d = d?.resultado ?? null; return ir(n, d); }; return 1;`);
  const p7d = [];
  p7d.push(await vezDaCrianca(true, 2)); // posição 5: 2 casas à frente
  p7d.push(await forcarComputador(6), await vezDoComputador(true)); // o computador puxa 6: posição 11
  p7d.push(await vezDaCrianca(false, 1)); // a criança erra: fica em 11
  p7d.push(await forcarComputador(6), await vezDoComputador(true)); // 11 + 6 passa de 14: ele chega
  checar('a criança chegou a 2 casas do centro, o computador puxou de volta e depois venceu',
    await esperarAte(`c.fase === 'chegou' || c.constructor.name === 'ResultScreen'`, 15000), JSON.stringify({ p7d, e: await estado() }));
  checar('derrota com 2 casas puxadas: acertos 2 (e não 0), casasPuxadas 2, 1 erro',
    await esperarAte(`c.constructor.name === 'ResultScreen'`, 6000)
      && await jg(`const r = window.__fim7d; return !!r && r.vitoria === false && r.acertos === 2 && r.extras?.casasPuxadas === 2 && r.erros === 1;`),
    JSON.stringify(await jg(`return window.__fim7d;`)));

  // --------------------------------------------------- 7e. o computador começa
  console.log('\n7e. O sorteio dá o computador na frente: ele joga primeiro e a criança confere');
  await novaPartida(1, 'computador');
  await jg(`${RAPIDO} c.regras.falaMaxMs = 0; return 1;`);
  const e7 = await jg(`return { quemComecou: c.quemComecou, faixa: c.faixa.texto, vez: c.vez.quem, sorteios: c.sorteios, dados: [c.sorteioNos.dadoC.face, c.sorteioNos.dadoP.face], vencedor: c.sorteioNos.vencedor };`);
  checar('1 × 6: o computador começa e a vez dele já está em andamento',
    e7.quemComecou === 'computador' && e7.vez === 'computador' && e7.sorteios === 1 && e7.dados.join() === '1,6' && e7.vencedor === 'computador', JSON.stringify(e7));
  checar('o computador joga o dado sozinho, responde, e a criança confere (a ficha ainda no centro)',
    await esperarAte(`c.fase === 'conferir' && c.painel.alpha >= 1 && c.pos === 7`, 15000));
  const r7e = await vezDoComputador(true);
  checar('depois de conferir, a vez passa para a criança, que joga o dado normalmente',
    await esperarAte(`c.vez.quem === 'crianca' && c.fase === 'dado' && c.dado.visible`, 12000), JSON.stringify({ r7e, e: await estado() }));
  await captura('03c-computador-comecou');

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
  await esperarAte(`c && c.constructor.name === 'MenuScreen'`, 8000);
  await esperar(1000);
  await esperarAte(`c && c.constructor.name === 'MenuScreen'`, 8000);
  const errosAntesAva = erros.length;
  await tocarNo(BTN('/^jogar$/i'));
  await esperarAte(`c.constructor.name === 'LevelSelectScreen'`, 5000);
  await tocarNo(`${W}.__achar(c, (n) => n.nivel && n.nivel.id === 1)`);
  await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
  // Aqui só os NÚMEROS do AVA importam: a espera pela voz da contagem (conferida no item 3) sai.
  const PARTIDA_RAPIDA = `${RAPIDO} c.regras.cpuEsperaMs = 80; c.regras.computadorErra = 0; c.regras.falaMaxMs = 0;`;
  await jg(`${PARTIDA_RAPIDA} return 1;`);
  const p1 = await partida('acerta');
  checar('1ª partida (Fácil, a criança acerta tudo) chegou ao resultado', p1.ok, JSON.stringify(p1));
  await esperar(900);
  await captura('10-resultado-1');
  let m = await aval(`window.__recebidas`);
  const m1 = m[0] ?? {};
  checar('uma mensagem, com jogo, nível 1, meta 7', m.length === 1 && m1.jogo === 'cabo-de-guerra' && m1.nivel === 1 && m1.totalPerguntas === 7, JSON.stringify(m1));
  const venceu1 = m1.vitoria === true;
  checar(venceu1 ? 'vitória sem erro: acertos 7, erros 0 e 7 casas puxadas' : 'derrota (o computador puxou mais): acertos = as casas puxadas, erros 0',
    venceu1 ? (m1.acertos === 7 && m1.erros === 0 && m1.casasPuxadas === 7) : (m1.acertos === m1.casasPuxadas && m1.erros === 0), JSON.stringify(m1));
  checar('os extras batem: todas as cartas certas, conferências todas certas',
    m1.cartasRespondidas === m1.cartasCertas && m1.cartasRespondidas >= 1 && m1.conferencias === m1.conferenciasCertas, JSON.stringify(m1));

  // Derrota garantida: a criança erra tudo e nunca puxa; o computador acerta tudo.
  await jg(`c.irPara('jogando', { nivel: j.config.niveis[1] }); return true;`);
  await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
  await jg(`${PARTIDA_RAPIDA} return 1;`);
  const p2 = await partida('erra');
  checar('2ª partida (Médio, a criança erra tudo) chegou ao resultado', p2.ok, JSON.stringify(p2));
  await esperar(900);
  await captura('11-resultado-derrota');
  m = await aval(`window.__recebidas`);
  const m2 = m[1] ?? {};
  checar('derrota no Médio: vitoria false, meta 8, acertos 0 (nada puxado), erros = as cartas que ela errou',
    m.length === 2 && m2.vitoria === false && m2.nivel === 2 && m2.totalPerguntas === 8 && m2.acertos === 0 && m2.erros === p2.errou && m2.casasPuxadas === 0,
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
console.log('Capturas em .capturas/cabo-de-guerra/');
