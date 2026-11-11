/**
 * teste-logica-cabo-de-guerra.mjs — procura ERROS DE LÓGICA do Cabo de Guerra.
 *
 * Joga 180 partidas inteiras (60 por nível) com a cena REAL, no navegador, comandada por um robô que
 * decide ao acaso (acerta ou erra a carta, confere bem ou mal o computador, pausa no meio) e, a cada
 * vez, confere as INVARIANTES do jogo contra um modelo independente:
 *
 *   · as vezes alternam (criança, computador, criança…) e a posição da ficha fica entre as pontas
 *     enquanto o jogo não acabou;
 *   · a ficha só anda se a resposta DE QUEM JOGOU estava certa: a criança toca a certa; o computador
 *     acerta de verdade (o que a criança disse ao conferir NÃO muda o lado da ficha);
 *   · anda exatamente `dado` casas (limitado pela ponta) rumo à ponta de quem acertou;
 *   · o jogo acaba na hora em que a ficha chega a uma ponta, e só então;
 *   · nenhuma carta (nem pergunta) se repete na partida;
 *   · as contagens (cartas, erros, conferências, jogadas, maior puxada) e a nota enviada ao AVA batem
 *     com o que o robô fez;
 *   · pausar no meio de qualquer fase não muda nada.
 * Depois mede, para todas as cartas, o texto que o retorno escreve depois de conferir o computador.
 *
 * Precisa de `node tools/serve.mjs 8099` rodando.   node tools/teste-logica-cabo-de-guerra.mjs [porta] [partidasPorNivel]
 */
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const PORTA = Number(process.argv[2]) || 8099;
const POR_NIVEL = Number(process.argv[3]) || 60;
const PORTA_CDP = 9377;
const BASE = `http://127.0.0.1:${PORTA}/Games/numerandus/cabo-de-guerra`;
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
  enviar(metodo, params = {}, s, limite = 120000) {
    const id = this.id++; const p = { id, method: metodo, params }; if (s) p.sessionId = s;
    return new Promise((ok, erro) => {
      this.pend.set(id, { ok, erro }); this.ws.send(JSON.stringify(p));
      setTimeout(() => { if (this.pend.has(id)) { this.pend.delete(id); erro(new Error('timeout ' + metodo)); } }, limite);
    });
  }
  ao(fn) { this.ouvintes.push(fn); }
}

const navegador = NAVEGADORES.find((c) => existsSync(c));
if (!navegador) { console.error('nenhum Chrome/Edge encontrado'); process.exit(2); }
const perfil = path.join(os.tmpdir(), `cdg-logica-${Date.now()}`);
mkdirSync(perfil, { recursive: true });
const chrome = spawn(navegador, [
  '--headless=new', `--remote-debugging-port=${PORTA_CDP}`, `--user-data-dir=${perfil}`,
  '--no-first-run', '--disable-gpu', '--mute-audio', '--window-size=1280,860', '--autoplay-policy=no-user-gesture-required',
], { stdio: 'ignore' });

const erros = [];
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
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') erros.push(`console.error: ${(m.params.args ?? []).map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 200)}`);
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') erros.push(`log: ${m.params.entry.text} ${m.params.entry.url ?? ''}`.slice(0, 220));
    if (m.method === 'Runtime.exceptionThrown') erros.push(`EXCECAO: ${m.params.exceptionDetails.text} ${m.params.exceptionDetails.exception?.description ?? ''}`.slice(0, 240));
  });
  const aval = async (expr) => {
    const r = await cdp.enviar('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, s);
    if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.text} ${r.exceptionDetails.exception?.description ?? ''}`.slice(0, 400));
    return r.result.value;
  };

  await cdp.enviar('Page.navigate', { url: `${BASE}/` }, s);
  await esperar(1500);
  for (let i = 0; i < 60; i++) { if (await aval("!!(window.jogo && window.jogo.cena && window.jogo.cena.constructor.name === 'MenuScreen')").catch(() => false)) break; await esperar(250); }

  // ---- o robô e o monitor, dentro da página
  const ROBO = `window.__robo = async (nivelId, pCerto, pConfere, pPausa) => {
    const j = window.jogo;
    const { Tween } = await import('/Games/numerandus/cabo-de-guerra/engine/core/Tween.js');
    Tween.escalaTempo = 12; // as esperas fixas (450 ms, 900 ms…) correm 12 vezes mais depressa
    const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
    j.cena.irPara('jogando', { nivel: j.config.niveis[nivelId - 1] });
    for (let i = 0; i < 100 && j.cena.constructor.name !== 'GameScene'; i++) await dormir(30);
    const c = j.cena;
    if (c.constructor.name !== 'GameScene') return { erro: 'não abriu a partida' };
    for (let i = 0; i < 100 && !(c.regras && c.vez); i++) await dormir(30); // a cena termina de entrar no quadro seguinte
    c.regras.rolarMs = 30; c.regras.passoMs = 30; c.regras.cpuEsperaMs = 30; c.regras.falaMaxMs = 0;

    const P = c.passos; const viol = []; const marca = (m) => { if (viol.length < 6) viol.push(m); };
    const visto = new Set(); const perguntas = new Set();
    const modelo = { cartasCrianca: 0, errosCrianca: 0, conferencias: 0, conferenciasBem: 0, jogadas: 0, maiorPuxada: 0, melhor: 0, turnos: 0, ultimoQuem: null };
    let turno = null; // o primeiro turno só começa depois do sorteio
    const sorteiosLog = []; let primeiroQuem = null;
    let fim = null; let resultado = null;

    const verificar = (vz, motivo) => {
      if (!vz || !turno) return;
      modelo.turnos++;
      if (vz.quem !== turno.quem) marca('quem da vez trocou no meio do turno: ' + vz.quem + ' vs ' + turno.quem);
      if (modelo.ultimoQuem === vz.quem) marca('duas vezes seguidas de ' + vz.quem);
      modelo.ultimoQuem = vz.quem;
      if (!(vz.dado >= 1 && vz.dado <= 6)) marca('dado fora de 1-6: ' + vz.dado);
      if (!vz.carta) { marca('turno sem carta'); return; }
      if (visto.has(vz.carta.chave)) marca('carta repetida na partida: ' + vz.carta.chave);
      visto.add(vz.carta.chave);
      if (perguntas.has(vz.carta.pergunta)) marca('pergunta repetida: ' + vz.carta.pergunta);
      perguntas.add(vz.carta.pergunta);
      let certo;
      if (vz.quem === 'crianca') {
        certo = vz.escolhida === vz.carta.certa;
        modelo.cartasCrianca++; modelo.jogadas++;
        if (!certo) modelo.errosCrianca++;
      } else {
        certo = vz.resposta.opcao.valor === vz.carta.certa;
        if (certo !== vz.resposta.certo) marca('resposta.certo mentiu: ' + JSON.stringify({ certo, dito: vz.resposta.certo }));
        modelo.conferencias++;
      }
      if (!!vz.certo !== certo) marca('vez.certo (' + vz.certo + ') difere da verdade (' + certo + ') em ' + vz.quem);
      const esperado = certo ? (vz.quem === 'crianca' ? Math.max(0, turno.posAntes - vz.dado) : Math.min(2 * P, turno.posAntes + vz.dado)) : turno.posAntes;
      if (c.pos !== esperado) marca('posição errada depois do turno de ' + vz.quem + ': antes ' + turno.posAntes + ', dado ' + vz.dado + ', certo ' + certo + ', esperado ' + esperado + ', obtido ' + c.pos);
      if (vz.quem === 'crianca' && certo) modelo.maiorPuxada = Math.max(modelo.maiorPuxada, turno.posAntes - esperado);
      if (vz.quem === 'crianca') modelo.melhor = Math.max(modelo.melhor, P - c.pos);
      if (motivo !== 'fim' && (c.pos <= 0 || c.pos >= 2 * P)) marca('a ficha está numa ponta (' + c.pos + ') e o jogo não acabou');
      if (c.pos < 0 || c.pos > 2 * P) marca('posição fora da trilha: ' + c.pos);
    };
    const origCom = c._comecarVez.bind(c);
    c._comecarVez = (q) => {
      if (!c._fimResolvido) { verificar(c.vez, 'vez'); turno = { quem: q, posAntes: c.pos }; if (primeiroQuem === null) primeiroQuem = q; }
      return origCom(q);
    };
    const origSor = c._sorteioParou.bind(c);
    c._sorteioParou = (r) => { sorteiosLog.push({ crianca: r.crianca, computador: r.computador }); return origSor(r); };
    const origTer = c._terminar.bind(c);
    c._terminar = (venc) => { if (!c._fimResolvido) { verificar(c.vez, 'fim'); fim = { venc, pos: c.pos }; } return origTer(venc); };
    const origIr = c.irPara.bind(c);
    c.irPara = (n, d) => { if (n === 'resultado') resultado = d && d.resultado; return origIr(n, d); };

    let pausas = 0; let ultimaFase = ''; let desde = Date.now(); let pausando = false;
    const inicio = Date.now();
    while (c.constructor === j.cena.constructor && j.cena === c && !resultado) {
      if (Date.now() - inicio > 90000) return { erro: 'travou: ' + JSON.stringify({ fase: c.fase, quem: c.vez && c.vez.quem, pos: c.pos, pausada: c.pausada }), viol };
      if (c.fase !== ultimaFase) { ultimaFase = c.fase; desde = Date.now(); }
      if (Date.now() - desde > 15000 && !c.pausada) return { erro: 'ficou 15 s na fase ' + c.fase, viol };
      if (pausando || c.pausada) { await dormir(10); continue; }
      // pausa aleatória no meio de qualquer fase; o estado tem de ficar igual
      if (Math.random() < pPausa && !c._fimResolvido && c.fase !== 'chegou') {
        const antes = JSON.stringify({ f: c.fase, p: c.pos, q: c.vez && c.vez.quem, d: c.vez && c.vez.dado });
        pausando = true; pausas++;
        c.pausar();
        await dormir(60);
        const meio = JSON.stringify({ f: c.fase, p: c.pos, q: c.vez && c.vez.quem, d: c.vez && c.vez.dado });
        if (meio !== antes) marca('o estado mudou durante a pausa: ' + antes + ' → ' + meio);
        c.pausa.fechar(true);
        pausando = false;
        await dormir(10);
        continue;
      }
      if (c.fase === 'sorteio') c._tocarDado();
      else if (c.fase === 'dado' && c.vez && c.vez.quem === 'crianca') c._tocarDado();
      else if (c.fase === 'carta') {
        const certa = Math.random() < pCerto;
        const bs = c.painel.botoes.filter((b) => b.opcao);
        const b = certa ? bs.find((x) => x.opcao.valor === c.vez.carta.certa) : bs.find((x) => x.opcao.valor !== c.vez.carta.certa);
        if (b) { c.vez.escolhida = b.opcao.valor; c._responder(b.opcao, b); }
      } else if (c.fase === 'conferir') {
        const verdade = c.vez.resposta.certo;
        const disse = Math.random() < pConfere ? verdade : !verdade;
        const b = c.painel.botoes.find((x) => x.estilo === (disse ? 'sim' : 'nao'));
        if (b) c._conferir(disse, b);
      } else if (c.fase === 'retorno') {
        // o que o retorno ESCREVE tem de bater com o que a ficha vai fazer
        const vz = c.vez; const det = (c.painel.retorno && c.painel.retorno.detalhe) || '';
        if (vz.certo) {
          const casas = Math.abs(c.pos - vz.alvo);
          const dizCasas = det.includes(casas + ' CASA' + (casas === 1 ? ' ' : 'S ')) || det.includes(casas + ' CASA ');
          if (!dizCasas) marca('o retorno diz "' + det + '" mas a ficha anda ' + casas + ' (dado ' + vz.dado + ')');
          if (vz.quem === 'crianca' && !det.includes('PARA VOCÊ')) marca('retorno da criança sem "PARA VOCÊ": ' + det);
          if (vz.quem === 'computador' && !det.includes('PARA O COMPUTADOR')) marca('retorno do computador sem "PARA O COMPUTADOR": ' + det);
        } else if (!det.includes('FICA PARADA')) marca('errou e o retorno não diz que a ficha fica parada: ' + det);
        c._continuar();
      }
      await dormir(8);
    }
    await dormir(30);
    const r = resultado;
    if (!r) return { erro: 'a partida não chegou ao resultado', viol };
    // ---- o resultado enviado ao AVA contra o modelo
    const vit = fim && fim.venc === 'crianca';
    if (!fim) marca('terminou sem passar por _terminar');
    else if (vit && fim.pos !== 0) marca('a criança venceu com a ficha em ' + fim.pos);
    else if (!vit && fim.pos !== 2 * P) marca('o computador venceu com a ficha em ' + fim.pos);
    const ex = r.extras || {};
    if (r.vitoria !== vit) marca('vitoria ' + r.vitoria + ' ≠ ' + vit);
    if (r.totalPerguntas !== P) marca('totalPerguntas ' + r.totalPerguntas + ' ≠ passos ' + P);
    if (r.nivel !== nivelId) marca('nivel ' + r.nivel);
    if (r.erros !== modelo.errosCrianca) marca('erros ' + r.erros + ' ≠ ' + modelo.errosCrianca);
    const acertosEsperados = vit ? Math.max(0, P - modelo.errosCrianca) : Math.min(modelo.melhor, P - 1);
    if (r.acertos !== acertosEsperados) marca('acertos ' + r.acertos + ' ≠ esperado ' + acertosEsperados + ' (vitoria ' + vit + ', erros ' + modelo.errosCrianca + ', melhor ' + modelo.melhor + ')');
    if (ex.casasPuxadas !== (vit ? P : Math.min(modelo.melhor, P - 1))) marca('casasPuxadas ' + ex.casasPuxadas);
    if (ex.cartasRespondidas !== modelo.cartasCrianca) marca('cartasRespondidas ' + ex.cartasRespondidas + ' ≠ ' + modelo.cartasCrianca);
    if (ex.cartasCertas !== modelo.cartasCrianca - modelo.errosCrianca) marca('cartasCertas ' + ex.cartasCertas);
    if (ex.conferencias !== modelo.conferencias) marca('conferencias ' + ex.conferencias + ' ≠ ' + modelo.conferencias);
    if (ex.jogadas !== modelo.jogadas) marca('jogadas ' + ex.jogadas + ' ≠ ' + modelo.jogadas);
    if (ex.maiorPuxada !== modelo.maiorPuxada) marca('maiorPuxada ' + ex.maiorPuxada + ' ≠ ' + modelo.maiorPuxada);
    if (ex.venceuCabo !== vit) marca('venceuCabo ' + ex.venceuCabo);
    if (r.acertos > r.totalPerguntas || r.acertos < 0) marca('acertos fora de 0..total');
    // ---- o sorteio de quem começa
    const ultimo = sorteiosLog[sorteiosLog.length - 1];
    if (!ultimo) marca('a partida não sorteou quem começa');
    else {
      if (sorteiosLog.slice(0, -1).some((x) => x.crianca !== x.computador)) marca('sorteou de novo sem empate: ' + JSON.stringify(sorteiosLog));
      if (ultimo.crianca === ultimo.computador) marca('começou com empate: ' + JSON.stringify(ultimo));
      const vencedorDoSorteio = ultimo.crianca > ultimo.computador ? 'crianca' : 'computador';
      if (primeiroQuem !== vencedorDoSorteio) marca('o primeiro a jogar (' + primeiroQuem + ') não é o do maior dado ' + JSON.stringify(ultimo));
      if (ex.quemComecou !== primeiroQuem) marca('quemComecou ' + ex.quemComecou + ' ≠ ' + primeiroQuem);
      if (ex.sorteios !== sorteiosLog.length) marca('sorteios ' + ex.sorteios + ' ≠ ' + sorteiosLog.length);
    }
    return { ok: true, viol, venceu: vit, comecou: primeiroQuem, empates: Math.max(0, sorteiosLog.length - 1), cartas: modelo.cartasCrianca, turnos: modelo.turnos, pausas, erros: modelo.errosCrianca };
  }; true;`;
  await aval(ROBO);

  console.log(`\nL. ${POR_NIVEL * 3} partidas inteiras com robô e monitor de invariantes`);
  const resumo = { total: 0, vitorias: 0, cartas: 0, turnos: 0, pausas: 0, criancaComecou: 0, empates: 0 };
  const violacoes = []; const travadas = [];
  for (const nivel of [1, 2, 3]) {
    const pCerto = [0.85, 0.6, 0.35][nivel - 1];
    for (let i = 0; i < POR_NIVEL; i++) {
      let r;
      try { r = await aval(`window.__robo(${nivel}, ${pCerto}, ${Math.random() < 0.5 ? 0.8 : 0.5}, 0.004)`); }
      catch (e) { r = { erro: 'exceção no robô: ' + e.message, viol: [] }; }
      resumo.total++;
      if (r.erro) travadas.push(`nível ${nivel} #${i + 1}: ${r.erro}`);
      if (r.viol?.length) violacoes.push(`nível ${nivel} #${i + 1}: ${r.viol.join(' | ')}`);
      if (r.ok) { resumo.criancaComecou += r.comecou === 'crianca' ? 1 : 0; resumo.empates += r.empates; resumo.vitorias += r.venceu ? 1 : 0; resumo.cartas += r.cartas; resumo.turnos += r.turnos; resumo.pausas += r.pausas; }
      if (r.erro) {
        await cdp.enviar('Page.navigate', { url: `${BASE}/` }, s); await esperar(1500);
        for (let k = 0; k < 40 && !(await aval("!!(window.jogo && window.jogo.cena && window.jogo.cena.constructor.name === 'MenuScreen')").catch(() => false)); k++) await esperar(250);
        await aval(ROBO);
      }
    }
    console.log(`  nível ${nivel}: ${POR_NIVEL} partidas jogadas`);
  }
  checar(`${resumo.total} partidas: todas terminam sem travar`, travadas.length === 0, travadas.slice(0, 4).join('\n          '));
  checar(`${resumo.turnos} turnos conferidos: a ficha anda exatamente o que as regras mandam e as vezes alternam`, violacoes.length === 0, violacoes.slice(0, 6).join('\n          '));
  checar(`pausar em momentos aleatórios (${resumo.pausas} pausas) não alterou nenhum estado`, !violacoes.some((x) => x.includes('durante a pausa')));
  const pc = 100 * resumo.criancaComecou / resumo.total;
  checar(`o sorteio é justo: a criança começou ${pc.toFixed(0)}% das ${resumo.total} partidas (esperado ~50%, aceito 35–65%); ${resumo.empates} empates sorteados de novo`, pc >= 35 && pc <= 65, pc.toFixed(1));
  checar('nenhum erro de JavaScript em todas as partidas', erros.length === 0, erros.slice(0, 4).join(' | '));
  console.log(`  (${resumo.vitorias} vitórias em ${resumo.total} partidas; ${(resumo.cartas / resumo.total).toFixed(1)} cartas da criança por partida)`);

  // ---- o texto do retorno depois de conferir o computador, para TODAS as cartas
  await cdp.enviar('Page.navigate', { url: `${BASE}/` }, s);
  await esperar(1500);
  const T = await aval(`(async () => {
    const R = await import('/Games/numerandus/cabo-de-guerra/src/regras.js');
    const D = await import('/Games/numerandus/cabo-de-guerra/src/desenho.js');
    const cm = await import('/Games/numerandus/cabo-de-guerra/src/config.js');
    const cfg = cm.default ?? cm.config ?? Object.values(cm)[0];
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = '700 24px ' + D.FONTE;
    let max = 0; let pior = ''; const vistas = new Set();
    for (const nivel of cfg.niveis) for (let i = 0; i < 5000; i++) {
      const c = R.sortearCarta(nivel.cartas, []).carta;
      if (vistas.has(c.chave)) continue; vistas.add(c.chave);
      for (const destino of ['A FICHA VAI 6 CASAS PARA O COMPUTADOR.', 'A FICHA FICA PARADA.']) {
        const n = D.quebrarLinhas(ctx, c.conta + '. ' + destino, 940).length;
        if (n > max) { max = n; pior = c.conta + '. ' + destino; }
      }
    }
    return { max, pior, cartas: vistas.size };
  })()`);
  checar(`texto do retorno da conferência: no máximo 2 linhas em ${T.cartas} cartas (pior: ${T.max}) — "${T.pior}"`, T.max <= 2, T.pior);
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
