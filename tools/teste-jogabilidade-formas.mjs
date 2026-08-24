#!/usr/bin/env node
/**
 * teste-jogabilidade-formas.mjs — a jogada do Jogo das Formas, com TOQUE REAL.
 *
 * `testes.mjs` prova a lógica. `teste-navegador.mjs` prova as telas do piloto.
 * `teste-entrega-avulsa.mjs` prova que a pasta roda sozinha. Nenhum deles prova
 * que **o dedo faz alguma coisa** — e é aí que este entra.
 *
 * ## Por que ele existe
 *
 * A primeira versão jogável deste jogo não respondia a toque nenhum, e a
 * verificação que eu tinha rodado não pegou: ela chamava `cena._pegar(0)` e
 * `cena._depositar(1)` direto, pulando exatamente a parte quebrada. O jogo
 * "passava" e não dava para jogar.
 *
 * A causa era um contrato do motor fácil de errar: o `Input` só emite `toque`
 * quando o dedo aperta e solta **sobre o mesmo nó interativo**
 * (`Input._tratar`). Sem um nó cobrindo a área de jogo, o toque cai no vazio,
 * `noInicial` vem null e o evento nunca sai. E ouvir no `Input` global em vez de
 * num nó é pior: o motor emite primeiro no nó e só depois em si mesmo, então o
 * ouvinte global recebia o toque em QUALQUER botão — inclusive o CONTINUAR da
 * pausa, que roda antes e já tinha zerado `pausada`. O único toque que
 * funcionava era o de sair da pausa, e ele virava uma jogada no meio da tela.
 *
 * Daí a regra deste arquivo: **nada é chamado por dentro.** Só ponteiro, via
 * `Input.dispatchMouseEvent`, nas coordenadas de tela de verdade.
 *
 * ## Uso
 *
 * Com `node tools/serve.mjs 8099` rodando em outro terminal:
 *     node tools/teste-jogabilidade-formas.mjs [porta]
 *
 * As capturas vão para `.capturas/formas/`.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORTA_SITE = Number(process.argv[2]) || 8099;
const PORTA_CDP = 9351;
const SAIDA = process.argv[3] ?? path.join(RAIZ, '.capturas', 'formas');
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

const NAVEGADORES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

class CDP {
  constructor(url) { this.url = url; this.proximoId = 1; this.pendentes = new Map(); this.ouvintes = []; }
  async conectar() {
    this.ws = new WebSocket(this.url);
    await new Promise((res, rej) => {
      this.ws.addEventListener('open', res, { once: true });
      this.ws.addEventListener('error', rej, { once: true });
    });
    this.ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id && this.pendentes.has(msg.id)) {
        const { resolve, reject } = this.pendentes.get(msg.id);
        this.pendentes.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message)); else resolve(msg.result);
      } else for (const fn of this.ouvintes) fn(msg);
    });
    return this;
  }
  enviar(metodo, params = {}, sessionId) {
    const id = this.proximoId++;
    const p = { id, method: metodo, params };
    if (sessionId) p.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pendentes.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(p));
      setTimeout(() => {
        if (this.pendentes.has(id)) { this.pendentes.delete(id); reject(new Error(`timeout ${metodo}`)); }
      }, 30000);
    });
  }
  ao(fn) { this.ouvintes.push(fn); }
  fechar() { try { this.ws.close(); } catch {} }
}

let passaram = 0; let falharam = 0; const problemas = [];
function checar(nome, condicao, detalhe = '') {
  if (condicao) { passaram++; console.log(`  ok   ${nome}`); }
  else { falharam++; problemas.push(`${nome} — ${detalhe}`); console.log(`  FALHOU  ${nome}${detalhe ? `\n          ${detalhe}` : ''}`); }
}

const navegador = NAVEGADORES.find((n) => existsSync(n));
if (!navegador) { console.error('Chrome/Edge não encontrado'); process.exit(1); }
mkdirSync(SAIDA, { recursive: true });

const perfil = path.join(os.tmpdir(), `toque-formas-${Date.now()}`);
const proc = spawn(navegador, [
  '--headless=new', `--remote-debugging-port=${PORTA_CDP}`, `--user-data-dir=${perfil}`,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-gpu',
  '--window-size=1280,860', '--autoplay-policy=no-user-gesture-required', '--mute-audio',
], { stdio: 'ignore' });

let cdp; const mensagens = [];
try {
  let alvo = null;
  for (let i = 0; i < 60 && !alvo; i++) {
    try { alvo = (await (await fetch(`http://127.0.0.1:${PORTA_CDP}/json/version`)).json()).webSocketDebuggerUrl; }
    catch { await esperar(250); }
  }
  if (!alvo) throw new Error('CDP não respondeu');
  cdp = await new CDP(alvo).conectar();
  const { targetId } = await cdp.enviar('Target.createTarget', { url: 'about:blank' });
  const s = (await cdp.enviar('Target.attachToTarget', { targetId, flatten: true })).sessionId;
  await cdp.enviar('Runtime.enable', {}, s);
  await cdp.enviar('Log.enable', {}, s);
  await cdp.enviar('Page.enable', {}, s);
  cdp.ao((m) => {
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type !== 'log' && m.params.type !== 'info') {
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

  // Toque de verdade: pointer down + up nas coordenadas de tela.
  const tocar = async (lx, ly) => {
    const c = await aval(`(() => {
      const st = window.jogo.stage;
      const r = st.canvas.getBoundingClientRect();
      return { x: Math.round(r.left + ${lx} * st.escala + st.deslocX),
               y: Math.round(r.top + ${ly} * st.escala + st.deslocY) };
    })()`);
    for (const type of ['mousePressed', 'mouseReleased']) {
      await cdp.enviar('Input.dispatchMouseEvent', {
        type, x: c.x, y: c.y, button: 'left', clickCount: 1, buttons: type === 'mousePressed' ? 1 : 0,
        pointerType: 'mouse',
      }, s);
      await esperar(40);
    }
    return c;
  };
  const arrastar = async (deLx, deLy, paraLx, paraLy) => {
    const conv = async (lx, ly) => aval(`(() => {
      const st = window.jogo.stage; const r = st.canvas.getBoundingClientRect();
      return { x: Math.round(r.left + ${lx} * st.escala + st.deslocX),
               y: Math.round(r.top + ${ly} * st.escala + st.deslocY) };
    })()`);
    const a = await conv(deLx, deLy); const b = await conv(paraLx, paraLy);
    await cdp.enviar('Input.dispatchMouseEvent', { type: 'mousePressed', x: a.x, y: a.y, button: 'left', clickCount: 1, buttons: 1, pointerType: 'mouse' }, s);
    await esperar(50);
    for (let i = 1; i <= 6; i++) {
      await cdp.enviar('Input.dispatchMouseEvent', {
        type: 'mouseMoved', button: 'left', buttons: 1, pointerType: 'mouse',
        x: Math.round(a.x + (b.x - a.x) * (i / 6)), y: Math.round(a.y + (b.y - a.y) * (i / 6)),
      }, s);
      await esperar(40);
    }
    await cdp.enviar('Input.dispatchMouseEvent', { type: 'mouseReleased', x: b.x, y: b.y, button: 'left', clickCount: 1, buttons: 0, pointerType: 'mouse' }, s);
    await esperar(60);
  };
  const estado = () => aval(`(() => {
    const c = window.jogo.cena;
    return { fase: c.fase, carga: c.carga.length, naGrade: c.grade.todas().length,
             garraX: Math.round(c.garra.x), coluna: c.controle.indiceColuna,
             pausada: !!c.pausada, pontos: c.placar.acertos, erros: c.placar.erros };
  })()`);

  await cdp.enviar('Page.navigate', { url: `http://127.0.0.1:${PORTA_SITE}/Games/jogo-das-formas/` }, s);
  await esperar(3500);
  await aval(`window.jogo.irPara('jogando', { nivel: window.jogo.config.niveis[0] })`);
  await esperar(1200);

  const geo = await aval(`(() => {
    const c = window.jogo.cena;
    return { xColunas: c.xColunas.map(Math.round), baseY: c.geo.baseY, trilhoY: c.geo.trilhoY,
             meioDaGrade: Math.round(c.geo.baseY - 2 * c.geo.celula) };
  })()`);
  console.log(`\ncolunas em x = ${geo.xColunas.join(', ')} · faixa de jogo y ${geo.trilhoY + 18}..${geo.baseY}\n`);

  console.log('1. Pegar com um toque real na coluna');
  const antes = await estado();
  await tocar(geo.xColunas[0], geo.meioDaGrade);
  await esperar(1200);
  const depoisDePegar = await estado();
  checar('o toque na coluna 0 alinhou a garra',
    depoisDePegar.coluna === 0, `coluna=${depoisDePegar.coluna}`);
  checar('a garra pegou o grupo do topo (carga > 0)',
    depoisDePegar.carga > 0, `carga=${depoisDePegar.carga}`);
  checar('os blocos pegos saíram da grade',
    depoisDePegar.naGrade === antes.naGrade - depoisDePegar.carga,
    `grade ${antes.naGrade} -> ${depoisDePegar.naGrade}, carga ${depoisDePegar.carga}`);
  checar('a jogada terminou e a fase voltou a livre',
    depoisDePegar.fase === 'livre', `fase=${depoisDePegar.fase}`);
  await captura('20-toque-pegou');

  console.log('\n2. Arrastar com a garra carregada move a garra');
  const garraAntes = depoisDePegar.garraX;
  await arrastar(geo.xColunas[0], geo.meioDaGrade, geo.xColunas[3], geo.meioDaGrade);
  await esperar(500);
  const depoisDeArrastar = await estado();
  checar('arrastar levou a garra para a coluna 3',
    depoisDeArrastar.coluna === 3, `coluna=${depoisDeArrastar.coluna}`);
  checar('a garra realmente andou na tela',
    depoisDeArrastar.garraX !== garraAntes,
    `x ${garraAntes} -> ${depoisDeArrastar.garraX}`);
  checar('a carga continua pendurada durante o arrasto',
    depoisDeArrastar.carga === depoisDePegar.carga,
    `carga ${depoisDePegar.carga} -> ${depoisDeArrastar.carga}`);
  await captura('21-arrastou-carregado');

  console.log('\n3. Depositar com um toque real em outra coluna');
  await tocar(geo.xColunas[4], geo.meioDaGrade);
  await esperar(2600);
  const depoisDeSoltar = await estado();
  checar('a garra depositou (carga voltou a zero)',
    depoisDeSoltar.carga === 0, `carga=${depoisDeSoltar.carga}`);
  // Duas saídas legítimas: o depósito não formou combo (a grade volta ao total
  // de antes) ou formou (a grade encolhe E o placar sobe). O que NÃO pode é a
  // grade encolher sem ninguém pontuar — aí um bloco se perdeu.
  const semCombo = depoisDeSoltar.naGrade === antes.naGrade && depoisDeSoltar.pontos === 0;
  const comCombo = depoisDeSoltar.naGrade < antes.naGrade && depoisDeSoltar.pontos > 0
    && antes.naGrade - depoisDeSoltar.naGrade === depoisDeSoltar.pontos;
  checar('nenhum bloco se perdeu no depósito (grade e placar fecham)',
    semCombo || comCombo,
    `grade ${antes.naGrade} -> ${depoisDeSoltar.naGrade}, pontos ${depoisDeSoltar.pontos}`);
  if (comCombo) console.log(`       (o depósito formou combo: ${depoisDeSoltar.pontos} ponto(s))`);
  checar('a fase voltou a livre depois de depositar',
    depoisDeSoltar.fase === 'livre', `fase=${depoisDeSoltar.fase}`);
  await captura('22-toque-depositou');

  console.log('\n4. Toque fora da faixa de jogo NÃO é jogada');
  const antesDeFora = await estado();
  await tocar(150, 500);                    // sobre o mascote
  await esperar(500);
  await tocar(geo.xColunas[2], 40);         // sobre o HUD
  await esperar(500);
  const depoisDeFora = await estado();
  checar('tocar no mascote e no HUD não pega bloco',
    depoisDeFora.carga === 0 && depoisDeFora.naGrade === antesDeFora.naGrade,
    `carga=${depoisDeFora.carga} grade=${depoisDeFora.naGrade}`);

  console.log('\n5. Sair da pausa NÃO deve virar uma jogada (o bug relatado)');
  await tocar(1280 - 180 + 32, 20 + 32);    // botão de pausa
  await esperar(700);
  const naPausa = await estado();
  checar('a pausa abriu', naPausa.pausada === true, `pausada=${naPausa.pausada}`);
  await captura('23-pausado');

  const antesDeContinuar = await estado();
  // CONTINUAR é o primeiro botão do painel, perto do centro da tela.
  const botao = await aval(`(() => {
    const p = window.jogo.cena.pausa;
    const b = p.painel.filhos.find((f) => f.rotulo);
    if (!b) return null;
    const m = b.matrizMundo;
    return { x: Math.round(m.tx + (b.largura ?? 0) / 2), y: Math.round(m.ty + (b.altura ?? 0) / 2),
             rotulo: b.rotulo };
  })()`);
  if (!botao) throw new Error('não achei o botão da pausa');
  console.log(`  (tocando em "${botao.rotulo}" em x=${botao.x} y=${botao.y})`);
  await tocar(botao.x, botao.y);
  await esperar(1300);
  const depoisDeContinuar = await estado();
  checar('a pausa fechou', depoisDeContinuar.pausada === false, `pausada=${depoisDeContinuar.pausada}`);
  checar('o toque em CONTINUAR não pegou nenhum bloco',
    depoisDeContinuar.carga === 0, `carga=${depoisDeContinuar.carga}`);
  checar('a grade ficou intacta ao sair da pausa',
    depoisDeContinuar.naGrade === antesDeContinuar.naGrade,
    `grade ${antesDeContinuar.naGrade} -> ${depoisDeContinuar.naGrade}`);
  await captura('24-depois-da-pausa');

  console.log('\n6. O jogo continua jogável depois da pausa');
  await tocar(geo.xColunas[1], geo.meioDaGrade);
  await esperar(1200);
  const aposPausa = await estado();
  checar('tocar numa coluna depois da pausa ainda pega',
    aposPausa.carga > 0, `carga=${aposPausa.carga}`);

  checar('nenhum erro ou aviso no console durante a sessão',
    mensagens.length === 0, mensagens.join(' | '));
} catch (err) {
  falharam++;
  console.error('\nFALHOU (exceção):', err.message);
} finally {
  console.log(`\n${'-'.repeat(56)}`);
  console.log(`${passaram} passaram, ${falharam} falharam`);
  if (problemas.length) { console.log('\nProblemas:'); for (const p of problemas) console.log(`  - ${p}`); }
  if (mensagens.length) { console.log('\nConsole:'); for (const m of new Set(mensagens)) console.log(`  ${m}`); }
  console.log(`\nCapturas em: ${SAIDA}`);
  cdp?.fechar();
  proc.kill();
  await rm(perfil, { recursive: true, force: true }).catch(() => {});
  // Sair com código != 0 é o que faz este teste servir de portão num script.
  process.exit(falharam > 0 ? 1 : 0);
}
