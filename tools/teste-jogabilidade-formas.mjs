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
  await tocar(150, 500);                    // faixa vazia sob a coluna do HUD
  await esperar(500);
  await tocar(geo.xColunas[2], 20);         // acima do trilho, sobre o pórtico
  await esperar(500);
  const depoisDeFora = await estado();
  checar('tocar fora da faixa de jogo e no HUD não pega bloco',
    depoisDeFora.carga === 0 && depoisDeFora.naGrade === antesDeFora.naGrade,
    `carga=${depoisDeFora.carga} grade=${depoisDeFora.naGrade}`);

  console.log('\n5. Sair da pausa NÃO deve virar uma jogada (o bug relatado)');

  // O botão de pausa é PROCURADO na cena, não cravado em coordenada.
  //
  // Estava `tocar(1280 - 180 + 32, 20 + 32)`, a posição dele quando o HUD era uma
  // faixa no topo. Quando o HUD virou coluna à esquerda (para a grade poder
  // crescer no celular), essas coordenadas passaram a cair no vazio e QUATRO
  // verificações desta seção quebraram — sem que nada do jogo tivesse quebrado.
  // Um teste que codifica o layout falha quando o layout muda de propósito, que é
  // exatamente quando ele deveria continuar valendo.
  const botaoPausa = await aval(`(() => {
    const alvo = window.jogo.cena.filhos.find((f) => f.icone === 'pausa');
    if (!alvo) return null;
    const m = alvo.matrizMundo;
    return { x: Math.round(m.tx + (alvo.largura ?? 0) / 2),
             y: Math.round(m.ty + (alvo.altura ?? 0) / 2) };
  })()`);
  if (!botaoPausa) throw new Error('não achei o botão de pausa na cena');
  console.log(`  (tocando na pausa em x=${botaoPausa.x} y=${botaoPausa.y})`);
  await tocar(botaoPausa.x, botaoPausa.y);
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

  // ------------------------------------------------------------------------
  // 6b. Um combo que CONSOME um bloco-estrela não pode travar a garra
  //
  // O defeito relatado, e por que ele era total: os efeitos do bloco-estrela
  // (`criarEstrelaVoadora`) rodam DENTRO de `_resolver()`, e `_resolver()` roda
  // dentro de um `Tween.chamar`, que engole exceções e as manda para o console.
  // Uma chamada a uma API inexistente ali — era `Tween.emCadaQuadro`, que não
  // existia — não derrubava a página: abortava a cascata pela metade. Os blocos
  // não saíam da grade, o passe seguinte não era agendado e `this.fase` ficava
  // em 'movendo' para sempre. A garra parava, e nada na tela dizia por quê.
  //
  // Por isso a verificação é de ESTADO, e não de console: o que precisa ser
  // impossível é a partida ficar sem saída da fase 'movendo'.
  /**
   * Prepara um tabuleiro previsível: UM grupo de exatamente quatro na coluna 0,
   * opcionalmente com um bloco-estrela plantado dentro dele.
   *
   * Começa com uma PARTIDA NOVA, e isso não é zelo: a primeira versão desta
   * montagem herdava o tabuleiro da seção anterior, que já estava gasto pelos
   * toques — sobravam menos de quatro blocos, nenhum grupo se formava e a
   * verificação seguinte media um jogo que não tinha nada para resolver. Ela
   * passou a "provar" o contrário do que eu queria provar.
   *
   * `estrelaEm` é o índice na coluna. Note que o 2 não é o bloco que a cena vai
   * eleger como estrela nova (ela elege o mais próximo da base), então ele é
   * CONSUMIDO pelo combo — que é justamente o caminho onde o efeito roda.
   */
  const montarGrupoDeQuatro = async ({ tipo, estrelaEm = null }) => {
    await aval(`window.jogo.irPara('jogando', { nivel: window.jogo.config.niveis[0] })`);
    await esperar(1500);
    return aval(`(() => {
      const c = window.jogo.cena;
      const blocos = [];
      for (let lin = 0; lin < c.linhas; lin++) {
        for (let col = 0; col < c.colunas; col++) {
          const b = c.grade.obter(lin, col);
          if (b) blocos.push(b);
        }
      }
      for (const b of c.carga) b.removerDoPai();
      c.carga = [];
      for (const b of blocos) c.grade.remover(b.lin, b.col);
      const usados = blocos.slice(0, 4);
      for (const b of blocos.slice(4)) b.removerDoPai();
      for (let i = 0; i < usados.length; i++) {
        const b = usados[i];
        b.tipo = '${tipo}';
        b.estrela = false;
        c.grade.definir(i, 0, b);
        b.x = c.xColunas[0];
        b.y = c._yDaLinha(i);
      }
      const iEstrela = ${estrelaEm === null ? 'null' : estrelaEm};
      if (iEstrela !== null) usados[iEstrela].estrela = true;
      c.ultimoDepositado = null;
      return {
        blocosDisponiveis: blocos.length,
        grupos: c.grade.gruposValidos(3).map((g) => g.length),
        fase: c.fase,
      };
    })()`);
  };

  console.log('\n6b. Combo que consome um bloco-estrela (garra travada)');

  const montado = await montarGrupoDeQuatro({ tipo: 'circulo', estrelaEm: 2 });
  checar('o cenário montou UM grupo de quatro',
    montado.grupos.length === 1 && montado.grupos[0] === 4, JSON.stringify(montado));

  const pontosAntes = await aval('window.jogo.cena.placar.acertos');
  await aval('window.jogo.cena._resolver()');
  await esperar(2500);

  const depoisDoCombo = await aval(`(() => {
    const c = window.jogo.cena;
    let naGrade = 0;
    for (let lin = 0; lin < c.linhas; lin++)
      for (let col = 0; col < c.colunas; col++) if (c.grade.obter(lin, col)) naGrade++;
    return { estado: window.jogo.estado, fase: c.fase, pontos: c.placar.acertos, naGrade };
  })()`);

  checar('a cascata terminou e a garra voltou a aceitar toque (fase = livre)',
    depoisDoCombo.fase === 'livre', JSON.stringify(depoisDoCombo));
  checar('os blocos do combo saíram da grade, sobrando só a estrela nova',
    depoisDoCombo.naGrade === 1, JSON.stringify(depoisDoCombo));
  checar('a estrela consumida valeu 2 pontos (1+2+1 no combo de quatro)',
    depoisDoCombo.pontos - pontosAntes === 4,
    `${pontosAntes} -> ${depoisDoCombo.pontos}`);

  // O HUD depois da festa. A estrela voadora termina pulsando o ícone do placar,
  // e o pulso já deixou dois rastros permanentes por cancelamento cruzado:
  // `Tween.removerDe` cancela por ALVO, e `definirValor` da barra cancela os
  // tweens dela a cada mudança de placar. Se o pulso morresse no meio, o ícone
  // ficaria grande para sempre — nada mais mexe naquele valor.
  const hud = await aval(`(() => {
    const b = window.jogo.cena.barra;
    return { escalaIcone: b._pulso?.escala ?? 1, valor: b.valor, visual: b._valorVisual };
  })()`);
  checar('o ícone do placar voltou ao tamanho normal depois do pulso',
    Math.abs(hud.escalaIcone - 1) < 0.01, JSON.stringify(hud));
  checar('a barra de pontos chegou ao valor novo, sem congelar no meio',
    Math.abs(hud.visual - hud.valor) < 0.01, JSON.stringify(hud));
  await captura('26-combo-com-estrela');

  // Toque de verdade, para provar que a trava não sobreviveu ao efeito.
  //
  // A coluna é DESCOBERTA, e não a 0: o cenário acima esvaziou o tabuleiro para
  // isolar um único grupo, e depois da cascata sobra pouca coisa em lugares que
  // dependem da gravidade e da linha que estava a subir. Tocar numa coluna vazia
  // é ação neutra por regra — a garra nem sai do lugar —, então cravar a coluna
  // fazia esta verificação reprovar por causa do cenário, não do jogo.
  const colunaComBloco = await aval(`(() => {
    const c = window.jogo.cena;
    for (let col = 0; col < c.colunas; col++) {
      for (let lin = 0; lin < c.linhas; lin++) {
        if (c.grade.obter(lin, col)) return { col, x: Math.round(c.xColunas[col]) };
      }
    }
    return null;
  })()`);
  if (!colunaComBloco) throw new Error('nenhuma coluna com bloco depois da cascata');
  await tocar(colunaComBloco.x, geo.meioDaGrade);
  await esperar(1400);
  const aindaJoga = await estado();
  checar('depois do combo com estrela a garra volta a pegar bloco',
    aindaJoga.carga > 0, `coluna ${colunaComBloco.col}: ${JSON.stringify(aindaJoga)}`);

  checar('nenhum erro ou aviso no console durante a partida',
    mensagens.length === 0, mensagens.join(' | '));
  const disparosAntes = await aval('window.jogo.cena.guarda.disparos');
  checar('o cão de guarda NÃO disparou na partida normal',
    disparosAntes === 0, `disparos=${disparosAntes}`);

  // ------------------------------------------------------------------------
  // 6c. INJEÇÃO DE FALHA: o cão de guarda resgata a partida travada?
  //
  // Um dispositivo de segurança que ninguém viu funcionar é fé, não engenharia.
  // Aqui a cascata é quebrada de propósito — `aplicarGravidade` passa a lançar,
  // exatamente como o efeito da estrela lançava — e o que se verifica é que o
  // jogo VOLTA. Sem o cão, `fase` ficaria em 'movendo' para sempre.
  //
  // Repare no que a quebra escolhida tem de fiel: ela acontece dentro de um
  // `Tween.chamar`, que engole a exceção. Nenhum try/catch da cena veria isso, e
  // é por isso que a rede precisa ser um observador de fora.
  console.log('\n6c. Injeção de falha: a partida travada se recupera (Watchdog)');

  const cenarioDaFalha = await montarGrupoDeQuatro({ tipo: 'quadrado' });
  checar('o cenário da falha tem um grupo para resolver',
    cenarioDaFalha.grupos.length === 1 && cenarioDaFalha.grupos[0] === 4,
    JSON.stringify(cenarioDaFalha));

  // A quebra: some a gravidade da cascata. Ela é chamada dentro do `chamar` do
  // passe, então o passe seguinte nunca é agendado — e `Tween.chamar` engole a
  // exceção, que é o que torna o travamento silencioso.
  await aval(`(() => {
    const c = window.jogo.cena;
    window.__gravidadeReal = c.grade.aplicarGravidade.bind(c.grade);
    c.grade.aplicarGravidade = () => { throw new Error('falha injetada no teste'); };
    return true;
  })()`);

  const marcadorFalha = mensagens.length;
  await aval('window.jogo.cena._resolver()');

  // Antes da graça de 0,5 s terminar: o jogo está travado, e é isso que se espera.
  await esperar(600);
  const travado = await aval(`(() => {
    const c = window.jogo.cena;
    return { fase: c.fase, disparos: c.guarda.disparos };
  })()`);
  checar('logo depois da falha o ciclo está de fato travado',
    travado.fase === 'movendo', JSON.stringify(travado));

  // Depois: o cão precisa ter percebido e devolvido a jogada.
  await esperar(1200);
  const resgatado = await aval(`(() => {
    const c = window.jogo.cena;
    return { estado: window.jogo.estado, fase: c.fase, disparos: c.guarda.disparos };
  })()`);
  checar('o cão de guarda percebeu o travamento',
    resgatado.disparos >= 1, JSON.stringify(resgatado));
  checar('a jogada foi devolvida: a fase voltou a livre',
    resgatado.fase === 'livre' && resgatado.estado === 'jogando',
    JSON.stringify(resgatado));

  const doTravamento = mensagens.slice(marcadorFalha);
  checar('o travamento gritou no console, com nome e motivo',
    doTravamento.some((m) => m.includes('Watchdog') && m.includes('ciclo da jogada')),
    doTravamento.join(' | '));

  // Desfaz a quebra e prova que a criança consegue jogar de novo.
  await aval('window.jogo.cena.grade.aplicarGravidade = window.__gravidadeReal');
  const colunaViva = await aval(`(() => {
    const c = window.jogo.cena;
    for (let col = 0; col < c.colunas; col++)
      for (let lin = 0; lin < c.linhas; lin++)
        if (c.grade.obter(lin, col)) return { col, x: Math.round(c.xColunas[col]) };
    return null;
  })()`);
  if (!colunaViva) throw new Error('nenhuma coluna com bloco depois do resgate');
  await tocar(colunaViva.x, geo.meioDaGrade);
  await esperar(1400);
  const jogaDeNovo = await estado();
  checar('depois do resgate a criança consegue jogar de novo',
    jogaDeNovo.carga > 0, `coluna ${colunaViva.col}: ${JSON.stringify(jogaDeNovo)}`);
  await captura('27-resgatado-pelo-cao-de-guarda');

  // Marca o ponto: a partir daqui a tela de resultado entra em cena, e ela
  // avisa no console cada narração de fim de partida que o config ainda não
  // declara. Essas lacunas são conhecidas e estão listadas no README do jogo —
  // então a verificação abaixo é a que interessa: NADA ALÉM delas.
  const mensagensDaPartida = mensagens.length;

  // ------------------------------------------------------------------------
  // 7. A fileira de estrelas da tela final (regra RE-04)
  //
  // Jogar até a meta de 12 pontos levaria minutos e daria um número diferente a
  // cada execução, então aqui o resultado é ENTREGUE à tela — é o mesmo payload
  // que `_terminar` monta. O que se verifica é só a tela: quantas estrelas ela
  // desenha e se ela as calcula sozinha.
  //
  // Este jogo é o motivo da regra: com meta 12, 16 ou 20, a fileira antiga tinha
  // TRÊS estrelas enquanto o piloto tinha cinco.
  console.log('\n7. A tela final desenha cinco estrelas e calcula a nota (RE-04)');

  const CASOS = [
    { rotulo: 'venceu na meta (12 de 12)', acertos: 12, meta: 12, vitoria: true, esperado: 5 },
    { rotulo: 'passou da meta (15 de 12)', acertos: 15, meta: 12, vitoria: true, esperado: 5 },
    { rotulo: 'parou em 14 de 20', acertos: 14, meta: 20, vitoria: false, esperado: 3 },
    { rotulo: 'parou em 2 de 12', acertos: 2, meta: 12, vitoria: false, esperado: 0 },
  ];

  for (const caso of CASOS) {
    await aval(`window.jogo.irPara('resultado', ${JSON.stringify({
      nivel: { id: 1 },
      resultado: {
        acertos: caso.acertos, erros: 0, totalPerguntas: caso.meta,
        nivel: 1, vitoria: caso.vitoria,
      },
    })})`);
    await esperar(1400);

    const tela = await aval(`(() => {
      const achatar = (no, saida = []) => {
        saida.push(no);
        for (const f of no.filhos ?? []) achatar(f, saida);
        return saida;
      };
      const todos = achatar(window.jogo.cena);
      const fileira = todos.find((n) => n._escalas && typeof n.total === 'number');
      return {
        total: fileira?.total ?? null,
        cheias: fileira?.quantidade ?? null,
        notaDaCena: window.jogo.dados.estrelas ?? 'ausente',
        textos: todos.filter((n) => typeof n.texto === 'string').map((n) => n.texto),
      };
    })()`);

    checar(`${caso.rotulo}: cinco estrelas, ${caso.esperado} acesas`,
      tela.total === 5 && tela.cheias === caso.esperado,
      `${tela.cheias} de ${tela.total}`);
    checar(`${caso.rotulo}: o placar diz a unidade`,
      tela.textos.some((x) => x.includes(`${caso.acertos} pontos`))
      && !tela.textos.some((x) => /\d+ de \d+/.test(x)),
      JSON.stringify(tela.textos));
    if (caso === CASOS[0]) {
      checar('a cena não passa nota de estrelas — quem calcula é a tela',
        tela.notaDaCena === 'ausente', JSON.stringify(tela.notaDaCena));
      await captura('25-resultado-cinco-estrelas');
    }
  }

  const novasNaTelaFinal = mensagens.slice(mensagensDaPartida);
  const inesperadas = novasNaTelaFinal.filter((m) => !/narra|locu|áudio|audio/i.test(m));
  checar('a tela final não produz erro no console além das lacunas de narração',
    inesperadas.length === 0, inesperadas.join(' | '));
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
