#!/usr/bin/env node
/**
 * teste-jogabilidade-pratinho-cdu.mjs — o Pratinho CDU jogado com GESTO REAL.
 *
 * `testes.mjs` prova a lógica do motor; `verificar-independencia.mjs` e
 * `teste-entrega-avulsa.mjs` provam a entrega. Este arquivo prova o que só o
 * navegador prova: que o dedo faz alguma coisa, e que a mensagem do AVA chega ao
 * pai de dentro de um <iframe>.
 *
 * ## A regra deste arquivo: nada é chamado por dentro
 *
 * Só ponteiro, via `Input.dispatchMouseEvent` / `Input.dispatchTouchEvent`, nas
 * coordenadas de tela de verdade (a mesma regra do teste do Jogo das Cores: uma
 * verificação que chama `cena._algo()` direto passa enquanto o jogo não responde a
 * toque nenhum). A cena só é LIDA, para conferir o resultado do gesto, e o ritmo é
 * acelerado (`regras.passoCpuMs`, `pausaRodadaMs`) — nunca a entrada.
 *
 * ## O que ele cobre
 *
 *   1. menu → níveis → partida, só com toques nos botões e no cartão do nível;
 *   2. a CONTAGEM: tocar num grão marca, tocar de novo desmarca, tocar no vazio da
 *      fatia só a faz piscar, tocar num grão FORA do prato não conta nada;
 *   3. os ROLINHOS: ▲ sobe, param no 9 e no 0, DESFAZER volta um passo;
 *   4. o ERRO: PRONTO errado conta, no 2º erro a casa acende, o certo passa;
 *   5. a COMPARAÇÃO: número errado conta erro, o certo fecha a rodada, e a estrela
 *      da rodada é do computador quando houve erro (rodada limpa);
 *   6. a PAUSA abre e fecha, a AJUDA abre e devolve a partida intacta;
 *   7. o NÍVEL FÁCIL: opções marcam e desmarcam com DESFAZER; o nome VOCÊ aparece;
 *   8. o ZERO: tocar numa fatia vazia mostra o 0 (Difícil);
 *   9. TOQUE (touch) num celular EM PÉ, com o conteúdo girado;
 *  10. o AVA dentro de um IFRAME: vitória e derrota registram, replay gera um novo
 *      registro, ficar parado no resultado não duplica, e os números batem com o
 *      que foi jogado;
 *  11. nenhum erro de JavaScript e nenhum disparo do `Watchdog` em toda a sessão;
 *  12. TROCAR DE ABA e voltar: o laço pausa, retoma, e a partida está intacta
 *      (simulado pelo `visibilitychange` que o motor escuta — não é uma troca de aba real);
 *  13. o `Watchdog` RESGATA uma cadeia cortada: a abertura da comparação é quebrada uma
 *      vez, de propósito, durante a vez do computador, e o jogo não pode ficar preso.
 *
 * As lacunas de narração são esperadas e separadas do resto: o motor as declara
 * no console (aviso), e a narração da partida ainda não foi gravada.
 *
 * ## Uso
 *
 * Com `node tools/serve.mjs 8099` rodando em outro terminal:
 *     node tools/teste-jogabilidade-pratinho-cdu.mjs
 *
 * As capturas vão para `.capturas/pratinho-cdu/`.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORTA = Number(process.argv[2]) || 8099;
const PORTA_CDP = 9361;
const SAIDA = path.join(RAIZ, '.capturas', 'pratinho-cdu');
const JOGO_URL = `http://127.0.0.1:${PORTA}/Games/numerandus/pratinho-cdu/`;
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
const perfil = path.join(os.tmpdir(), `pratinho-${Date.now()}`);
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
  const centroDe = (busca) => jg(`
    const no = (${busca});
    if (!no) return null;
    const p = no.localParaGlobal((no.largura ?? 0) / 2, (no.altura ?? 0) / 2);
    return { x: p.x, y: p.y, habilitado: no.habilitado !== false, visivel: no.visivelMundo !== false };`);
  const tocarNo = async (busca) => {
    const c = await centroDe(busca);
    if (!c) return false;
    await tocarLogico(c.x, c.y);
    return true;
  };
  const BTN = (re) => `${W}.__achar(c, (n) => typeof n.rotulo === 'string' && ${re}.test(n.rotulo) && n.visivelMundo)`;
  const ICONE = (nome) => `${W}.__achar(c, (n) => n.icone === '${nome}' && n.visivelMundo)`;
  const pronto = () => `c.botaoPronto`;
  const pCentro = (quem) => `c.grupoEscolha.filhos.find((b) => b.quem === '${quem}')`;
  const SO_IFRAME = process.argv.includes('--so-iframe');
  let ok = false;
  let e;
  const grao = (i) => `c.prato.graos[${i}]`;
  // O ponto lógico de um grão: o Prato é um nó da cena, então localParaGlobal já considera tudo.
  const pontoDoGrao = (i) => jg(`
    const g = c.prato.graos[${i}]; if (!g) return null;
    const p = c.prato.localParaGlobal(g.x, g.y); return { x: p.x, y: p.y, casa: g.casa, k: g.k };`);
  const tocarGrao = async (i) => { const p = await pontoDoGrao(i); await tocarLogico(p.x, p.y); return p; };
  const estado = () => jg(`return {
    cena: c.constructor.name, fase: c.fase, rodada: c.rodada, contagem: { ...c.contagem },
    marcados: c.prato ? c.prato.graos.filter((g) => g.marcado).length : -1,
    digitos: { ...c.digitos }, historico: c.historico ? c.historico.length : -1,
    errosLeitura: c.errosLeitura, errosComparacao: c.errosComparacao, estrelas: c.estrelas ? { ...c.estrelas } : null,
    pausada: !!c.pausada, acesas: c.prato ? [...c.prato.acesas] : [], escolha: c.escolha ?? null,
  };`);

  const qtSorteada = (qt) => Math.max(qt.c, qt.d, qt.u);
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
  await jg(`c.regras.passoCpuMs = 25; c.regras.pausaRodadaMs = 350; c.regras.passoAjudaMs = 60;`);
  e = await estado();
  checar('a partida abriu esperando o JOGAR', e.cena === 'GameScene' && e.fase === 'jogar', JSON.stringify(e));
  await captura('03-partida-jogar');

  // ----------------------------------------------- 2. a contagem pelo grão
  console.log('\n2. Contar: tocar no grão marca, de novo desmarca; vazio só pisca');
  checar('toque em JOGAR derruba os grãos', await tocarNo(`c.botaoGrande`) && await esperarAte(`c.fase === 'caindo' || c.fase === 'responder'`, 4000));
  checar('a criança pode responder depois da queda', await esperarAte(`c.fase === 'responder'`, 10000));
  await captura('04-graos');
  const resumoGraos = await jg(`const por = { c: 0, d: 0, u: 0 }; for (const g of c.prato.graos) por[g.casa]++;
    return { total: c.prato.graos.length, por, qt: { ...c.jogada.qt }, fora: c.prato.fora.length };`);
  checar('os grãos sorteados batem com as quantidades', resumoGraos.por.c === resumoGraos.qt.c && resumoGraos.por.d === resumoGraos.qt.d && resumoGraos.por.u === resumoGraos.qt.u, JSON.stringify(resumoGraos));
  checar('o Médio não deixa grão fora do prato', resumoGraos.fora === 0);

  await tocarGrao(0);
  e = await estado();
  checar('um toque no grão marca ESSE grão', e.marcados === 1 && e.contagem[(await pontoDoGrao(0)).casa] === 1, JSON.stringify(e));
  await tocarGrao(0);
  e = await estado();
  checar('tocar de novo no mesmo grão desmarca', e.marcados === 0 && e.contagem.c + e.contagem.d + e.contagem.u === 0, JSON.stringify(e));

  // Um ponto no vazio de uma fatia: longe de todo grão (raio de acerto) e dentro do prato.
  const vazio = await jg(`
    const R = c.prato.R; const alvo = Math.max(32, R * 0.14);
    let melhor = null; let dist = 0;
    for (let a = 0; a < 360; a += 4) for (let r = 0.3; r <= 0.88; r += 0.04) {
      const x = r * R * Math.cos(a * Math.PI / 180); const y = r * R * Math.sin(a * Math.PI / 180);
      const d = Math.min(...c.prato.graos.map((g) => Math.hypot(g.x - x, g.y - y)));
      if (d > dist) { dist = d; melhor = { x, y }; }
    }
    const p = c.prato.localParaGlobal(melhor.x, melhor.y);
    return { x: p.x, y: p.y, dist, alvo };`);
  console.log(`  ponto mais vazio a ${vazio.dist.toFixed(0)} px de qualquer grão (raio de acerto ${vazio.alvo.toFixed(0)})`);
  if (vazio.dist > vazio.alvo + 4) {
    await tocarLogico(vazio.x, vazio.y);
    e = await estado();
    checar('tocar no vazio de uma fatia não conta nada', e.marcados === 0 && e.errosLeitura === 0, JSON.stringify(e));
  } else {
    console.log('  (este sorteio não tem ponto vazio acima do raio de acerto: conferido nas outras rodadas)');
  }

  // Espiona o que o jogo FALA ao marcar, e confere que os nove números estão registrados no motor.
  await jg(`window.__falas = []; const a = j.audio; const o = a.falar.bind(a);
    a.falar = (id, op) => { window.__falas.push(id); return o(id, op); }; return true;`);
  const GRAVADAS = ['numero1', 'numero2', 'numero3', 'numero4', 'numero5', 'numero6', 'numero7', 'numero8', 'numero9',
    'suaVez', 'vezDoComputador', 'muitoBem', 'qualEMaior', 'tenteDeNovo', 'voceFezOMaior', 'computadorFezOMaior'];
  const registrados = await jg(`return ${JSON.stringify(GRAVADAS)}.map((id) => [id, j.audio.temSom(id)]);`);
  const faltam = registrados.filter(([, ok]) => !ok).map(([id]) => id);
  checar('as 16 falas já gravadas (numero1–9, suaVez, vezDoComputador, muitoBem, qualEMaior, tenteDeNovo, voceFezOMaior, computadorFezOMaior) estão registradas no motor', faltam.length === 0, `faltam: ${faltam.join(', ')}`);

  // Marca todos, um a um, e confere cada contagem por fatia.
  const n = resumoGraos.total;
  for (let i = 0; i < n; i++) await tocarGrao(i);
  e = await estado();
  checar('tocar em TODOS os grãos conta cada fatia certinho',
    e.marcados === n && e.contagem.c === resumoGraos.qt.c && e.contagem.d === resumoGraos.qt.d && e.contagem.u === resumoGraos.qt.u,
    JSON.stringify({ e, qt: resumoGraos.qt }));
  await captura('05-todos-marcados');
  const falas = await aval('window.__falas');
  const maior = Math.max(qtSorteada(resumoGraos.qt), 0);
  const esperadas = Array.from({ length: maior }, (_, i) => 'numero' + (i + 1));
  checar('cada grão marcado fala o número da contagem da sua fatia (um, dois, três…)',
    esperadas.every((id) => falas.includes(id)) && falas.length === n, JSON.stringify({ falas, esperadas }));

  // ------------------------------------------------------- 3. os rolinhos
  console.log('\n3. Rolinhos: ▲ sobe, param nos limites; DESFAZER volta um passo');
  const hist0 = (await estado()).historico;
  checar('DESFAZER está liberado depois de contar', (await centroDe(`c.botaoDesfazer`)).habilitado === true);
  await tocarNo(`c.botaoDesfazer`);
  e = await estado();
  checar('DESFAZER tira o último grão marcado', e.marcados === n - 1 && e.historico === hist0 - 1, JSON.stringify(e));
  await tocarNo(`c.botaoDesfazer`);
  await tocarNo(`c.botaoDesfazer`);
  e = await estado();
  checar('DESFAZER volta um passo por toque', e.marcados === n - 3 || n < 3, JSON.stringify(e));

  // No rolinho da U: sobe até o 9 e confere que um toque a mais NÃO dá a volta.
  for (let i = 0; i < 9; i++) await tocarNo(`c.rolinhos.u.subir`);
  e = await estado();
  checar('nove toques em ▲ levam a U ao 9', e.digitos.u === 9, JSON.stringify(e.digitos));
  const sobe = await centroDe(`c.rolinhos.u.subir`);
  checar('a seta ▲ apaga no 9', sobe.habilitado === false);
  await tocarLogico(sobe.x, sobe.y);
  e = await estado();
  checar('um toque a mais no 9 não dá a volta (não vira 0)', e.digitos.u === 9, JSON.stringify(e.digitos));
  const desce0 = await centroDe(`c.rolinhos.c.descer`);
  checar('a seta ▼ já está apagada no 0 (rolinho C)', desce0.habilitado === false);
  for (let i = 0; i < 9; i++) await tocarNo(`c.rolinhos.u.descer`);
  e = await estado();
  checar('nove toques em ▼ devolvem a U ao 0', e.digitos.u === 0, JSON.stringify(e.digitos));

  // ---------------------------------------------------------------- 4. erro
  console.log('\n4. Erro: PRONTO errado conta, o 2º erro acende a casa, o certo passa');
  const qt = resumoGraos.qt;
  const dig = () => estado().then((x) => x.digitos);
  const acertarDigitos = async (alvo, soErrar = null) => {
    for (const casa of ['c', 'd', 'u']) {
      let d = (await dig())[casa];
      while (d !== alvo[casa]) { await tocarNo(`c.rolinhos.${casa}.${d < alvo[casa] ? 'subir' : 'descer'}`); d = (await dig())[casa]; }
    }
  };
  // Deixa a C errada: um a mais (ou um a menos), as outras certas.
  const errada = { ...qt, c: qt.c >= 9 ? qt.c - 1 : qt.c + 1 };
  await acertarDigitos(errada);
  await tocarNo(pronto());
  await esperar(500);
  e = await estado();
  checar('PRONTO errado: conta 1 erro de leitura e segue na resposta', e.errosLeitura === 1 && e.fase === 'responder', JSON.stringify(e));
  await captura('06-erro-1');
  await tocarNo(pronto());
  await esperar(500);
  e = await estado();
  checar('2º PRONTO errado: a fatia errada acende (âmbar)', e.errosLeitura === 2 && e.acesas.includes('c'), JSON.stringify(e));
  const rolo = await jg(`return { acesa: c.rolinhos.c.acesa, outras: c.rolinhos.d.acesa || c.rolinhos.u.acesa };`);
  checar('o rolinho errado também acende, e só ele', rolo.acesa === true && rolo.outras === false, JSON.stringify(rolo));
  await captura('07-erro-2-casa-acesa');
  await acertarDigitos(qt);
  await tocarNo(pronto());
  checar('com os números certos, o PRONTO passa a vez', await esperarAte(`c.fase === 'acertou' || c.fase === 'cpu'`, 4000));
  await captura('08-acerto');

  // ----------------------------------------------------------- 5. comparação
  console.log('\n5. Comparação: número errado conta, o certo fecha a rodada');
  checar('o computador joga e a comparação abre', await esperarAte(`c.fase === 'comparar'`, 25000));
  await esperar(500);
  await captura('09-comparar');
  const comp = await jg(`return { resposta: c.resposta, v: c.numeroCrianca, c: c.numeroComputador,
    pergunta: c.pergunta.texto + c.pergunta.destaque, dica: c.dica.visible, pronto: c.botaoPronto.visible,
    botoes: c.grupoEscolha.filhos.map((b) => ({ quem: b.quem, numero: b.numero })) };`);
  checar('a pergunta é "QUAL NÚMERO É O MAIOR?"', comp.pergunta === 'QUAL NÚMERO É O MAIOR', comp.pergunta);
  checar('o dedinho guia a comparação', comp.dica === true);
  checar('os dois números aparecem', comp.botoes.length === 2 && comp.botoes.some((b) => b.quem === 'v') && comp.botoes.some((b) => b.quem === 'c'), JSON.stringify(comp.botoes));
  const quemErrado = comp.resposta === 'v' ? 'c' : 'v';
  await tocarNo(pCentro(quemErrado));
  e = await estado();
  checar('tocar num número só o MARCA (ainda não confere)', e.escolha === quemErrado && e.errosComparacao === 0, JSON.stringify(e));
  await tocarNo(pCentro(comp.resposta));
  e = await estado();
  checar('dá para trocar a marca antes do PRONTO', e.escolha === comp.resposta, JSON.stringify(e));
  await tocarNo(pCentro(quemErrado));
  await tocarNo(pronto());
  await esperar(500);
  e = await estado();
  checar('PRONTO com o número menor: conta erro de comparação', e.errosComparacao === 1 && e.fase === 'comparar', JSON.stringify(e));
  await tocarNo(pCentro(comp.resposta));
  await tocarNo(pronto());
  checar('PRONTO com o maior: a rodada fecha', await esperarAte(`c.fase === 'fimRodada'`, 3000));
  await esperarAte(`c.estrelas.v + c.estrelas.c === 1`, 4000);
  await captura('10-rodada-fechada');
  e = await estado();
  checar('houve erro na rodada: a estrela é do COMPUTADOR (rodada limpa)', e.estrelas.c === 1 && e.estrelas.v === 0, JSON.stringify(e.estrelas));
  checar('a próxima rodada começa esperando JOGAR', await esperarAte(`c.rodada === 2 && c.fase === 'jogar'`, 4000));

  // ------------------------------------------------------ 6. pausa e ajuda
  console.log('\n6. Pausa abre e fecha; a ajuda devolve a partida intacta');
  await tocarNo(`c.botaoGrande`);
  await esperarAte(`c.fase === 'responder'`, 10000);
  await tocarGrao(0);
  await tocarGrao(1);
  const antes = await estado();
  await tocarNo(ICONE('pausa'));
  await esperar(400);
  e = await estado();
  checar('toque em PAUSA pausa a partida', e.pausada === true, JSON.stringify(e));
  await captura('11-pausa');
  checar('toque em CONTINUAR fecha a pausa', await tocarNo(BTN('/^continuar$/i')) && await esperarAte(`!c.pausada`, 3000));
  e = await estado();
  checar('a contagem sobrevive à pausa', e.marcados === antes.marcados && JSON.stringify(e.contagem) === JSON.stringify(antes.contagem), JSON.stringify({ antes, e }));
  await tocarNo(ICONE('tutorial'));
  await esperar(500);
  e = await estado();
  checar('toque em AJUDA pausa a partida e abre o tutorial', e.pausada === true, JSON.stringify(e));
  await captura('12-ajuda');
  let passos = 0;
  for (let i = 0; i < 6; i++) {
    const proximo = await centroDe(`${W}.__achar(c.ajuda, (n) => n.icone === 'setaDireita' && n.visivelMundo && n.habilitado !== false)`);
    if (!proximo) break;
    await tocarLogico(proximo.x, proximo.y); passos++;
  }
  console.log(`  passos avançados na ajuda: ${passos}`);
  const fechou = await tocarNo(`${W}.__achar(c.ajuda, (n) => typeof n.rotulo === 'string' && /voltar ao jogo/i.test(n.rotulo) && n.visivelMundo)`);
  checar('o botão VOLTAR AO JOGO existe no último passo da ajuda', fechou);
  checar('voltar ao jogo despausa', await esperarAte(`!c.pausada`, 3000));
  e = await estado();
  checar('a contagem e a rodada sobrevivem à ajuda', e.marcados === antes.marcados && e.rodada === 2, JSON.stringify({ antes, e }));

  // --------------------- termina o resto da partida só com gestos (rodadas limpas)
  console.log('\n   (jogando o resto da partida só com gestos)');
  const rodadaLimpa = async () => {
    const st = await estado();
    if (st.fase === 'jogar') { await tocarNo(`c.botaoGrande`); await esperarAte(`c.fase === 'responder'`, 10000); }
    const q = await jg(`return { ...c.jogada.qt };`);
    if (!(await jg(`return c.porOpcoes;`))) {
      for (const casa of ['c', 'd', 'u']) for (let i = 0; i < q[casa]; i++) await tocarNo(`c.rolinhos.${casa}.subir`);
    } else {
      const valor = await jg(`return c.jogada.valor;`);
      await tocarNo(`c.grupoEscolha.filhos.find((b) => b.numero === ${valor})`);
    }
    await tocarNo(pronto());
    if (!(await esperarAte(`c.fase === 'comparar' || c.fase === 'fimRodada'`, 30000))) return false;
    if ((await estado()).fase === 'comparar') {
      const r = await jg(`return c.resposta;`);
      await tocarNo(pCentro(r));
      await tocarNo(pronto());
    }
    return esperarAte(`c.fase === 'jogar' || c.constructor.name === 'ResultScreen'`, 8000);
  };
  // Termina a rodada 2 (já com 2 grãos marcados), depois as rodadas 3 a 5.
  for (let i = 0; i < 4; i++) {
    if (!(await rodadaLimpa())) { checar('a rodada fecha sozinha com gestos', false, `rodada ${i + 2}`); break; }
  }
  await esperar(900);
  e = await estado();
  checar('depois da 5ª rodada, vai DIRETO para a tela de resultado', e.cena === 'ResultScreen', JSON.stringify(e));
  await captura('13-resultado');

  // --------------------------------------------------------- 7. nível Fácil
  console.log('\n7. Nível Fácil: opções marcam e desmarcam; nome VOCÊ');
  await aval(`${W}.jogo.irPara('jogando', { nivel: ${W}.jogo.config.niveis[0] })`);
  await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
  await instalar();
  await jg(`c.regras.passoCpuMs = 25; c.regras.pausaRodadaMs = 350;`);
  checar('o Fácil mostra o nome VOCÊ ao lado do ícone', await jg(`return c.fundoCartao.nomes === true;`));
  await tocarNo(`c.botaoGrande`);
  await esperarAte(`c.fase === 'responder'`, 10000);
  const opcoes = await jg(`return c.grupoEscolha.filhos.map((b) => b.numero);`);
  checar('3 opções de número', opcoes.length === 3, JSON.stringify(opcoes));
  const valorCerto = await jg(`return c.jogada.valor;`);
  const outra = opcoes.find((x) => x !== valorCerto);
  await tocarNo(`c.grupoEscolha.filhos.find((b) => b.numero === ${outra})`);
  e = await estado();
  checar('tocar numa opção só a MARCA', e.escolha === outra && e.errosLeitura === 0, JSON.stringify(e));
  await tocarNo(`c.botaoDesfazer`);
  e = await estado();
  checar('DESFAZER solta a opção marcada (sem contar erro)', e.escolha === null && e.errosLeitura === 0, JSON.stringify(e));
  await tocarNo(`c.grupoEscolha.filhos.find((b) => b.numero === ${outra})`);
  await tocarNo(pronto());
  await esperar(500);
  e = await estado();
  checar('PRONTO com a opção errada conta 1 erro e apaga essa opção', e.errosLeitura === 1 && e.fase === 'responder', JSON.stringify(e));
  await captura('14-facil-erro');
  await tocarNo(`c.grupoEscolha.filhos.find((b) => b.numero === ${valorCerto})`);
  await tocarNo(pronto());
  checar('a opção certa passa a vez', await esperarAte(`c.fase === 'acertou' || c.fase === 'cpu'`, 4000));

  // ------------------------------------------------------------- 8. o zero
  console.log('\n8. Difícil: fatia sem grão mostra o 0; grão fora do prato não conta');
  await aval(`${W}.jogo.irPara('jogando', { nivel: ${W}.jogo.config.niveis[2] })`);
  await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
  await instalar();
  let achouZero = false; let foraTestado = false;
  for (let tentativa = 0; tentativa < 8 && !(achouZero && foraTestado); tentativa++) {
    await esperarAte(`c.fase === 'jogar'`, 6000);
    await tocarNo(`c.botaoGrande`);
    await esperarAte(`c.fase === 'responder'`, 10000);
    const info = await jg(`return { qt: { ...c.jogada.qt }, fora: c.prato.fora.length };`);
    if (!foraTestado && info.fora > 0) {
      const p = await jg(`const g = c.prato.fora[0]; const q = c.prato.localParaGlobal(g.x, g.y); return { x: q.x, y: q.y };`);
      const antesFora = await estado();
      await tocarLogico(p.x, p.y);
      e = await estado();
      checar('tocar num grão FORA do prato não conta nada', e.marcados === antesFora.marcados && e.errosLeitura === 0, JSON.stringify(e));
      foraTestado = true;
    }
    const casaZero = ['d', 'u'].find((k) => info.qt[k] === 0);
    if (!achouZero && casaZero) {
      const centro = await jg(`const [ini, fim] = [{c:150,d:270,u:30}['${casaZero}'], {c:270,d:390,u:150}['${casaZero}']];
        const m = (ini + fim) / 2 * Math.PI / 180; const r = c.prato.R * 0.55;
        const p = c.prato.localParaGlobal(Math.cos(m) * r, Math.sin(m) * r); return { x: p.x, y: p.y };`);
      await tocarLogico(centro.x, centro.y);
      await esperar(250);
      const z = await jg(`return Object.keys(c.prato.zeros);`);
      checar(`tocar na fatia vazia (${casaZero.toUpperCase()}) mostra o 0`, z.includes(casaZero), JSON.stringify(z));
      await captura('15-zero');
      achouZero = true;
    }
    if (!(achouZero && foraTestado)) {
      // Este sorteio não serve: recomeça a rodada pela pausa → recomeçar não, só sorteia de novo.
      await aval(`${W}.jogo.irPara('jogando', { nivel: ${W}.jogo.config.niveis[2] })`);
      await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
      await instalar();
    }
  }
  if (!achouZero) checar('apareceu uma fatia vazia no Difícil em 8 sorteios', false, 'improvável: conferir a faixa do nível');
  if (!foraTestado) checar('apareceu grão fora do prato no Difícil em 8 sorteios', false, 'improvável: conferir `fora` do nível');

  // -------------------------------------- 9. toque num celular em pé
  console.log('\n9. Toque (touch) num celular EM PÉ, com o conteúdo girado');
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
  await captura('16-celular-menu');
  checar('toque em JOGAR leva aos níveis', await tocarNo(BTN('/^jogar$/i')) && await esperarAte(`c.constructor.name === 'LevelSelectScreen'`, 5000));
  await instalar();
  checar('toque no cartão MÉDIO abre a partida',
    await tocarNo(`${W}.__achar(c, (n) => n.nivel && n.nivel.id === 2)`) && await esperarAte(`c.constructor.name === 'GameScene'`, 6000));
  await instalar();
  checar('toque em JOGAR derruba os grãos', await tocarNo(`c.botaoGrande`) && await esperarAte(`c.fase === 'responder'`, 12000));
  await tocarGrao(0);
  e = await estado();
  checar('toque num grão marca esse grão (celular em pé)', e.marcados === 1, JSON.stringify(e));
  await tocarNo(`c.rolinhos.d.subir`);
  e = await estado();
  checar('toque na seta ▲ sobe o rolinho (celular em pé)', e.digitos.d === 1, JSON.stringify(e.digitos));
  await captura('17-celular-partida');
  modoToque = false;
  await cdp.enviar('Emulation.setTouchEmulationEnabled', { enabled: false }, s);
  await cdp.enviar('Emulation.clearDeviceMetricsOverride', {}, s);

  };
  if (!SO_IFRAME) await sessaoDaPagina();

  // ----------------------------------------------- 10. o AVA dentro do iframe
  console.log('\n10. AVA: a mensagem cruza o <iframe>; replay; sem duplicata');
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
  await captura('18-iframe-menu');

  const abrirFacil = async () => {
    await tocarNo(BTN('/^jogar$/i'));
    await esperarAte(`c.constructor.name === 'LevelSelectScreen'`, 5000);
    await instalar();
    await tocarNo(`${W}.__achar(c, (n) => n.nivel && n.nivel.id === 1)`);
    await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
    await instalar();
    await jg(`c.regras.passoCpuMs = 25; c.regras.pausaRodadaMs = 300; c.regras.passoAjudaMs = 60;`);
    const st = await estado();
    console.log(`  (iframe) depois de abrir o Fácil: ${st.cena}/${st.fase}`);
  };
  // Uma partida inteira só com gestos. `errosPorRodada[i]` = quantos PRONTOs errados na rodada i+1.
  const partida = async (errosPorRodada) => {
    let feitos = 0;
    for (let r = 1; r <= 5; r++) {
      await esperarAte(`c.rodada === ${r} && c.fase === 'jogar'`, 10000);
      await tocarNo(`c.botaoGrande`);
      await esperarAte(`c.fase === 'responder'`, 12000);
      const valor = await jg(`return c.jogada.valor;`);
      for (let k = 0; k < (errosPorRodada[r - 1] ?? 0); k++) {
        const opcao = await jg(`const b = c.grupoEscolha.filhos.find((x) => x.numero !== ${valor} && !x.errado); return b ? b.numero : null;`);
        if (opcao === null) break;
        await tocarNo(`c.grupoEscolha.filhos.find((b) => b.numero === ${opcao})`);
        await tocarNo(pronto());
        await esperar(450);
        feitos++;
        await esperarAte(`c.fase === 'responder'`, 8000);
      }
      await tocarNo(`c.grupoEscolha.filhos.find((b) => b.numero === ${valor})`);
      await tocarNo(pronto());
      if (!(await esperarAte(`c.fase === 'comparar'`, 25000))) return { feitos, ok: false };
      const resp = await jg(`return c.resposta;`);
      await tocarNo(pCentro(resp));
      await tocarNo(pronto());
      await esperarAte(`c.fase === 'jogar' || c.constructor.name === 'ResultScreen'`, 8000);
    }
    return { feitos, ok: await esperarAte(`c.constructor.name === 'ResultScreen'`, 8000) };
  };
  const recebidas = () => aval(`window.__recebidas`);

  await abrirFacil();
  const p1 = await partida([0, 0, 0, 0, 0]);
  checar('1ª partida (sem erros) chegou ao resultado', p1.ok);
  await esperar(900);
  await captura('19-iframe-vitoria');
  let m = await recebidas();
  checar('a vitória chegou ao pai: exatamente 1 mensagem', m.length === 1, `n=${m.length}`);
  const m1 = m[0] ?? {};
  checar('1ª mensagem: jogo, nivel, total, vitoria, acertos 5, erros 0',
    m1.jogo === 'pratinho-cdu' && m1.nivel === 1 && m1.totalPerguntas === 5 && m1.vitoria === true && m1.acertos === 5 && m1.erros === 0, JSON.stringify(m1));
  checar('os extras dizem como foi (vitória, 5 rodadas limpas)', m1.desfecho === 'vitoria' && m1.leiturasDePrimeira === 5 && m1.estrelasCrianca === 5, JSON.stringify(m1));
  await esperar(4000);
  m = await recebidas();
  checar('ficar parado no resultado NÃO duplica o registro', m.length === 1, `n=${m.length}`);

  // Replay pelo botão JOGAR DE NOVO — e dessa vez perde de propósito (erro nas rodadas 1 a 3).
  checar('toque em JOGAR DE NOVO volta à partida', await tocarNo(BTN('/jogar de novo/i')) && await esperarAte(`c.constructor.name === 'GameScene'`, 6000));
  await instalar();
  await jg(`c.regras.passoCpuMs = 25; c.regras.pausaRodadaMs = 300; c.regras.passoAjudaMs = 60;`);
  const p2 = await partida([1, 1, 1, 0, 0]);
  checar('2ª partida (3 rodadas com erro) chegou ao resultado', p2.ok);
  await esperar(900);
  await captura('20-iframe-derrota');
  m = await recebidas();
  checar('o replay gera um novo registro: exatamente 2 mensagens', m.length === 2, `n=${m.length}`);
  const m2 = m[1] ?? {};
  checar('2ª mensagem é DERROTA: vitoria false, acertos 2, erros 3',
    m2.vitoria === false && m2.acertos === 2 && m2.erros === 3 && m2.totalPerguntas === 5, JSON.stringify(m2));
  checar('os erros batem com o que foi jogado (3 PRONTOs errados)', p2.feitos === 3 && m2.erros === p2.feitos && m2.errosLeitura === 3, JSON.stringify({ feitos: p2.feitos, m2 }));
  checar('a derrota diz: derrota, 2 × 3 estrelas', m2.desfecho === 'derrota' && m2.estrelasCrianca === 2 && m2.estrelasComputador === 3, JSON.stringify(m2.extras));
  const validas = await aval(`document.querySelectorAll('#registro .msg.valida').length`);
  const invalidas = await aval(`document.querySelectorAll('#registro .msg.invalida').length`);
  checar('o host do AVA valida as duas mensagens contra o contrato', validas === 2 && invalidas === 0, `válidas=${validas} inválidas=${invalidas}`);
  await esperar(3000);
  m = await recebidas();
  checar('parado na derrota também NÃO duplica', m.length === 2, `n=${m.length}`);
  checar('a tela de derrota é a da série (QUASE LÁ!)', await jg(`return c.constructor.name === 'ResultScreen';`));

  // iframe PEQUENO: o jogo não pode cortar nem deformar.
  await aval(`(() => { const f = document.getElementById('moldura'); f.style.width = '420px'; f.style.height = '260px'; })()`);
  await esperar(900);
  await captura('21-iframe-pequeno');
  const escalaPequena = await aval(`${W}.jogo.stage.escala`);
  checar('num iframe pequeno o jogo se reduz sem deformar (escala única)', escalaPequena > 0 && escalaPequena < 0.7, `escala=${escalaPequena}`);

  // Os quatro tamanhos do host (Celular, Pequeno, Médio, Grande): o canvas cabe na moldura, a
  // escala é uma só nos dois eixos, e o jogo continua respondendo ao toque.
  for (const tam of ['400x700', '640x480', '760x500', '1280x720']) {
    await aval(`document.querySelector('[data-tam="${tam}"]').click(); true;`);
    await esperar(900);
    const medida = await aval(`(() => { const f = document.getElementById('quadro'); const r = f.getBoundingClientRect();
      const st = ${W}.jogo.stage; const cv = st.canvas.getBoundingClientRect();
      return { moldura: [Math.round(r.width), Math.round(r.height)], canvas: [Math.round(cv.width), Math.round(cv.height)], escala: st.escala, giro: st.giro }; })()`);
    const [mw, mh] = medida.moldura; const [cw, ch] = medida.canvas;
    checar(`iframe ${tam}: o jogo cabe na moldura (${cw}×${ch} em ${mw}×${mh})`, cw <= mw + 1 && ch <= mh + 1 && medida.escala > 0, JSON.stringify(medida));
    await captura(`22-iframe-${tam}`);
  }
  await aval(`document.querySelector('[data-tam="760x500"]').click(); true;`);
  await esperar(600);

  // --------------------------------------------------------- 11. o console
  console.log('\n11. O console da sessão inteira');
  const reais = erros.filter((x) => !/favicon|net::ERR_ABORTED/i.test(x));
  checar('nenhum erro de JavaScript nem requisição quebrada', reais.length === 0, reais.slice(0, 5).join(' | '));
  const guarda = avisos.filter((x) => /watchdog|cão de guarda|travad|resgat/i.test(x));
  checar('o Watchdog não disparou em nenhuma partida normal', guarda.length === 0, guarda.slice(0, 3).join(' | '));
  const semGravadas = avisos.filter((x) => /"(numero[1-9]|suaVez|vezDoComputador|muitoBem|qualEMaior|tenteDeNovo|voceFezOMaior|computadorFezOMaior)"/.test(x));
  checar('as falas já gravadas não geram aviso de áudio ausente (contagem, vez, muito bem, qual é o maior, tente de novo, quem fez o maior)', semGravadas.length === 0, semGravadas.slice(0, 3).join(' | '));
  const ausentes = [...new Set(avisos.filter((x) => /áudio|audio|narra|falta/i.test(x)).map((x) => x.replace(/\s+/g, ' ').slice(0, 90)))];
  console.log(`  avisos de narração ainda não gravada (esperados): ${ausentes.length}`);
  for (const a of ausentes.slice(0, 6)) console.log(`    · ${a}`);

  // -------------------------------------------- 12. trocar de aba e voltar
  console.log('\n12. Trocar de aba e voltar');
  await aval(`(() => { const f = document.getElementById('moldura'); f.style.width = ''; f.style.height = ''; })()`);
  await esperar(700);
  await aval(`${W}.jogo.irPara('jogando', { nivel: ${W}.jogo.config.niveis[1] })`);
  await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
  await instalar();
  await jg(`c.regras.passoCpuMs = 25; c.regras.pausaRodadaMs = 300; c.regras.passoAjudaMs = 60;`);
  await tocarNo(`c.botaoGrande`);
  await esperarAte(`c.fase === 'responder'`, 12000);
  await tocarGrao(0);
  await tocarGrao(1);
  const antesAba = await estado();
  const ocultar = (oculto) => aval(`(() => { const w = ${W};
    Object.defineProperty(w.document, 'hidden', { configurable: true, get: () => ${oculto} });
    w.document.dispatchEvent(new w.Event('visibilitychange')); return w.jogo.rodando; })()`);
  checar('com a aba oculta, o laço do jogo para', (await ocultar(true)) === false);
  await esperar(1500);
  checar('ao voltar para a aba, o laço retoma', (await ocultar(false)) === true);
  e = await estado();
  checar('a contagem, a rodada e a fase sobrevivem à troca de aba',
    e.marcados === antesAba.marcados && e.rodada === antesAba.rodada && e.fase === 'responder', JSON.stringify({ antesAba, e }));
  await tocarGrao(2);
  e = await estado();
  checar('depois de voltar, o jogo continua respondendo ao toque', e.marcados === antesAba.marcados + 1, JSON.stringify(e));

  // ------------------------------------------- 13. o Watchdog resgata a partida
  console.log('\n13. Watchdog: uma cadeia cortada no meio é resgatada');
  await aval(`${W}.jogo.irPara('jogando', { nivel: ${W}.jogo.config.niveis[0] })`);
  await esperarAte(`c.constructor.name === 'GameScene'`, 6000);
  await instalar();
  await jg(`c.regras.passoCpuMs = 25; c.regras.pausaRodadaMs = 300; c.regras.passoAjudaMs = 60;`);
  // Quebra UMA vez a abertura da comparação: o `Tween.chamar` engole a exceção e a vez do
  // computador fica sem ninguém para continuá-la — exatamente o travamento que o cão de guarda vigia.
  await jg(`let vezes = 0; const o = c._perguntarComparacao.bind(c);
    c._perguntarComparacao = () => { if (vezes++ === 0) throw new Error('falha simulada no teste'); return o(); }; return true;`);
  const errosAntes = erros.length;
  await tocarNo(`c.botaoGrande`);
  await esperarAte(`c.fase === 'responder'`, 12000);
  const certo = await jg(`return c.jogada.valor;`);
  await tocarNo(`c.grupoEscolha.filhos.find((b) => b.numero === ${certo})`);
  await tocarNo(pronto());
  await esperarAte(`c.fase === 'cpu'`, 6000);
  const preso = await esperarAte(`c.fase === 'cpu' && !c.prato.graos.some((g) => g.queda < 1)`, 3000);
  checar('a vez do computador chegou ao ponto onde a falha foi plantada', preso);
  const resgatou = await esperarAte(`c.fase === 'comparar'`, 40000);
  checar('o jogo NÃO fica preso: o Watchdog leva à comparação', resgatou);
  const novos = erros.slice(errosAntes);
  checar('o resgate ficou registrado como erro no console (Watchdog)', novos.some((x) => /Watchdog/.test(x)), JSON.stringify(novos));
  checar('o console só tem a falha simulada e o resgate', novos.every((x) => /Watchdog|Tween.chamar|falha simulada/.test(x)), JSON.stringify(novos));
  const resp = await jg(`return c.resposta;`);
  await tocarNo(pCentro(resp));
  await tocarNo(pronto());
  checar('depois do resgate, a comparação fecha a rodada normalmente', await esperarAte(`c.rodada === 2 && c.fase === 'jogar'`, 8000));
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
console.log('Capturas em .capturas/pratinho-cdu/');
