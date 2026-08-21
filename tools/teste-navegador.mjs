#!/usr/bin/env node
/**
 * teste-navegador.mjs — validação de ponta a ponta em navegador headless.
 *
 * `tools/testes.mjs` prova a lógica pura. Este aqui prova o que só o navegador
 * pode provar:
 *
 *   · o jogo abre, renderiza e percorre todas as telas;
 *   · nenhuma requisição sai para fora da pasta do jogo;
 *   · uma partida vencida e uma perdida produzem o `JOGO_CONCLUIDO` correto;
 *   · a mensagem CRUZA a fronteira do <iframe> e chega ao pai — que é o que
 *     vai acontecer no AVA e que não dá para verificar abrindo o jogo direto;
 *   · replay gera um novo registro, e ficar na tela de resultado não duplica.
 *
 * Ele carrega `tools/ava-teste.html` (o host que simula o AVA) e dirige o jogo
 * de dentro do iframe, então o caminho exercitado é o caminho real.
 *
 * Uso (com `node tools/serve.mjs 8099` rodando em outro terminal):
 *   node tools/teste-navegador.mjs [porta] [pastaDeCapturas]
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORTA_SITE = Number(process.argv[2]) || 8099;
const PASTA_CAPTURAS = process.argv[3] ?? path.join(RAIZ, '.capturas');
const PORTA_CDP = 9333;

const NAVEGADORES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------- cliente CDP

class CDP {
  constructor(url) {
    this.url = url;
    this.proximoId = 1;
    this.pendentes = new Map();
    this.ouvintes = [];
  }

  async conectar() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
    this.ws.addEventListener('message', (evento) => {
      const msg = JSON.parse(evento.data);
      if (msg.id && this.pendentes.has(msg.id)) {
        const { resolve, reject } = this.pendentes.get(msg.id);
        this.pendentes.delete(msg.id);
        if (msg.error) reject(new Error(`${msg.error.message} (${JSON.stringify(msg.error.data ?? '')})`));
        else resolve(msg.result);
      } else {
        for (const fn of this.ouvintes) fn(msg);
      }
    });
    return this;
  }

  enviar(metodo, params = {}, sessionId) {
    const id = this.proximoId++;
    const pacote = { id, method: metodo, params };
    if (sessionId) pacote.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pendentes.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(pacote));
      setTimeout(() => {
        if (this.pendentes.has(id)) {
          this.pendentes.delete(id);
          reject(new Error(`tempo esgotado em ${metodo}`));
        }
      }, 30000);
    });
  }

  ao(fn) {
    this.ouvintes.push(fn);
  }

  fechar() {
    try { this.ws.close(); } catch { /* já fechado */ }
  }
}

// ------------------------------------------------------------------ execução

let passaram = 0;
let falharam = 0;
const problemas = [];

function checar(nome, condicao, detalhe = '') {
  if (condicao) {
    passaram++;
    console.log(`  ok   ${nome}`);
  } else {
    falharam++;
    problemas.push(`${nome}${detalhe ? ` — ${detalhe}` : ''}`);
    console.log(`  FALHOU  ${nome}${detalhe ? `\n         ${detalhe}` : ''}`);
  }
}

function acharNavegador() {
  for (const caminho of NAVEGADORES) if (existsSync(caminho)) return caminho;
  return null;
}

async function principal() {
  const navegador = acharNavegador();
  if (!navegador) {
    console.error('Nenhum Chrome/Edge encontrado. Este teste precisa de um deles.');
    process.exit(2);
  }

  await mkdir(PASTA_CAPTURAS, { recursive: true });
  const perfil = path.join(os.tmpdir(), `motor-cdp-${Date.now()}`);

  console.log(`Navegador: ${path.basename(navegador)}`);
  console.log(`Site:      http://127.0.0.1:${PORTA_SITE}`);
  console.log(`Capturas:  ${PASTA_CAPTURAS}\n`);

  const processo = spawn(navegador, [
    '--headless=new',
    `--remote-debugging-port=${PORTA_CDP}`,
    `--user-data-dir=${perfil}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--disable-gpu',
    '--window-size=1280,860',
    '--autoplay-policy=no-user-gesture-required',
    '--mute-audio',
  ], { stdio: 'ignore' });

  const limpar = async () => {
    try { processo.kill(); } catch { /* já morreu */ }
    await rm(perfil, { recursive: true, force: true }).catch(() => {});
  };

  try {
    // Espera o CDP subir.
    let versao = null;
    for (let i = 0; i < 60; i++) {
      try {
        versao = await (await fetch(`http://127.0.0.1:${PORTA_CDP}/json/version`)).json();
        break;
      } catch { await esperar(250); }
    }
    if (!versao) throw new Error('o navegador não abriu a porta de depuração');

    const cdp = await new CDP(versao.webSocketDebuggerUrl).conectar();

    const { targetId } = await cdp.enviar('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.enviar('Target.attachToTarget', { targetId, flatten: true });

    const consoleLogs = [];
    const requisicoes = [];
    const errosDePagina = [];

    cdp.ao((msg) => {
      if (msg.method === 'Runtime.consoleAPICalled') {
        const texto = (msg.params.args ?? [])
          .map((a) => (a.value !== undefined ? JSON.stringify(a.value) : (a.description ?? a.type)))
          .join(' ');
        consoleLogs.push({ tipo: msg.params.type, texto });
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        errosDePagina.push(msg.params.exceptionDetails?.exception?.description
          ?? msg.params.exceptionDetails?.text ?? 'exceção sem descrição');
      }
      if (msg.method === 'Network.requestWillBeSent') {
        requisicoes.push(msg.params.request.url);
      }
    });

    await cdp.enviar('Page.enable', {}, sessionId);
    await cdp.enviar('Runtime.enable', {}, sessionId);
    await cdp.enviar('Network.enable', {}, sessionId);

    // Trava de execução da regra "todo som sai de arquivo": grava qualquer
    // chamada a `speechSynthesis.speak`, em toda página e todo iframe, desde
    // antes do primeiro script rodar. O teste de `testes.mjs` prova que a API
    // não aparece no código; este prova que ela não é usada em execução — nem
    // por um jogo que resolvesse chamá-la por conta própria.
    await cdp.enviar('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        window.__falasSintetizadas = [];
        if (window.speechSynthesis && window.speechSynthesis.speak) {
          const original = window.speechSynthesis.speak.bind(window.speechSynthesis);
          window.speechSynthesis.speak = function (u) {
            window.__falasSintetizadas.push(u && u.text ? String(u.text) : '(sem texto)');
            return original(u);
          };
        }
      `,
    }, sessionId);

    const avaliar = async (expressao) => {
      const r = await cdp.enviar('Runtime.evaluate', {
        expression: expressao,
        awaitPromise: true,
        returnByValue: true,
        userGesture: true,
      }, sessionId);
      if (r.exceptionDetails) {
        throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
      }
      return r.result.value;
    };

    const capturar = async (nome) => {
      const { data } = await cdp.enviar('Page.captureScreenshot', { format: 'png' }, sessionId);
      const arquivo = path.join(PASTA_CAPTURAS, `${nome}.png`);
      await writeFile(arquivo, Buffer.from(data, 'base64'));
      return arquivo;
    };

    // ------------------------------------------------------- abrir o host AVA
    const urlHost = `http://127.0.0.1:${PORTA_SITE}/tools/ava-teste.html`;
    await cdp.enviar('Page.navigate', { url: urlHost }, sessionId);
    await esperar(2500);

    // O host precisa guardar as mensagens para conferirmos depois.
    await avaliar(`
      window.__recebidas = window.__recebidas || [];
      if (!window.__gancho) {
        window.__gancho = true;
        window.addEventListener('message', (e) => {
          let d = e.data;
          if (typeof d === 'string') { try { d = JSON.parse(d); } catch { return; } }
          if (d && d.type === 'JOGO_CONCLUIDO') window.__recebidas.push(d);
        });
      }
      true;
    `);

    // Espera o jogo dentro do iframe terminar de carregar.
    const jogoPronto = await avaliar(`
      (async () => {
        const q = document.getElementById('quadro');
        for (let i = 0; i < 120; i++) {
          const j = q.contentWindow && q.contentWindow.jogo;
          if (j && j.rodando) return true;
          await new Promise(r => setTimeout(r, 250));
        }
        return false;
      })()
    `);

    console.log('\n1. Carregamento e telas');
    checar('o jogo carrega dentro do iframe', jogoPronto === true);

    const g = 'document.getElementById("quadro").contentWindow.jogo';

    checar('nenhum erro de JavaScript na página', errosDePagina.length === 0, errosDePagina.join(' | '));

    const externas = requisicoes.filter((u) => !u.startsWith(`http://127.0.0.1:${PORTA_SITE}`) && !u.startsWith('data:'));
    checar('nenhuma requisição para fora do servidor local', externas.length === 0, externas.join(' | '));

    await capturar('01-menu');
    checar('estado inicial é o menu', await avaliar(`${g}.estado`) === 'menu');

    // ------------------------------------- o toque sob a mão do mascote
    //
    // No menu, o mascote é desenhado DEPOIS dos botões, para a mão dele não ser
    // cortada pela borda do JOGAR. Isso cria 12 px em que a arte do mascote está
    // por cima de um alvo tocável — e é justamente onde um aluno de 4 anos, que
    // mira no personagem, vai tocar.
    //
    // Este teste bate nesses 12 px com um evento de ponteiro REAL (via CDP, não
    // sintético: o caminho sintético morre no `setPointerCapture` do Input) e
    // exige que o botão responda. Se alguém marcar o mascote como interativo, ou
    // inverter a ordem de desenho sem pensar, este teste cai.
    // Espera a animação de entrada TERMINAR antes de mirar. Os botões nascem
    // 60 px abaixo e sobem em 420 ms; tocar no meio disso erra o alvo, e foi
    // exatamente assim que este teste falhou na primeira execução. Esperar por
    // condição, e não por um tempo escolhido a dedo, é o que o mantém honesto.
    const botaoAssentou = await avaliar(`
      (async () => {
        const j = document.getElementById('quadro').contentWindow.jogo;
        for (let i = 0; i < 80; i++) {
          const b = j.cena && j.cena.botaoTutorial;   // o último a assentar (entra 120 ms depois)
          if (b && b.alpha >= 1) return true;
          await new Promise(r => setTimeout(r, 50));
        }
        return false;
      })()
    `);
    checar('a animação de entrada dos botões termina', botaoAssentou === true);

    const pontoSobMao = await avaliar(`
      (() => {
        const q = document.getElementById('quadro');
        const rq = q.getBoundingClientRect();
        const s = q.contentWindow.jogo.stage;
        const rc = s.canvas.getBoundingClientRect();
        const lx = 410, ly = 500;   // sobre a LUVA do mascote (x 335-460, y 436-540) E o botão COMO JOGAR
        return {
          x: rq.left + rc.left + lx * s.escala + s.deslocX,
          y: rq.top + rc.top + ly * s.escala + s.deslocY,
        };
      })()
    `);
    for (const type of ['mousePressed', 'mouseReleased']) {
      await cdp.enviar('Input.dispatchMouseEvent', {
        type,
        x: Math.round(pontoSobMao.x),
        y: Math.round(pontoSobMao.y),
        button: 'left',
        clickCount: 1,
        pointerType: 'mouse',
      }, sessionId);
    }
    await esperar(800);
    const estadoAposToque = await avaliar(`${g}.estado`);
    checar('tocar onde a mão do mascote cobre o botão ainda aciona o botão',
      estadoAposToque === 'tutorial', `estado após o toque: ${estadoAposToque}`);

    // Volta ao menu para o resto do roteiro seguir do começo.
    await avaliar(`${g}.irPara('menu')`);
    await esperar(500);

    // ------------------------------------------------------------- tutorial
    await avaliar(`${g}.irPara('tutorial')`);
    await esperar(700);
    await capturar('02-tutorial');
    checar('tutorial abre', await avaliar(`${g}.estado`) === 'tutorial');
    checar('tutorial tem passos', await avaliar(`${g}.cena.passos.length`) >= 2);

    await avaliar(`${g}.cena.mostrarPasso(1)`);
    await esperar(500);
    await capturar('03-tutorial-passo2');
    checar('tutorial avança de passo', await avaliar(`${g}.cena.indice`) === 1);

    // --------------------------------------------------------------- níveis
    await avaliar(`${g}.irPara('niveis')`);
    await esperar(800);
    await capturar('04-niveis');
    checar('seleção de nível abre', await avaliar(`${g}.estado`) === 'niveis');
    checar('mostra os 3 níveis', await avaliar(`${g}.config.niveis.length`) === 3);

    // ------------------------------------------------- partida vencida (nv1)
    console.log('\n2. Partida vencida (nível 1)');
    await avaliar(`${g}.irPara('jogando', { nivel: ${g}.config.niveis[0] })`);
    await esperar(900);
    await capturar('05-jogando');
    checar('partida inicia', await avaliar(`${g}.estado`) === 'jogando');
    checar('há um bloco no gancho', await avaliar(`!!${g}.cena.blocoNoGancho`));

    /**
     * Joga de verdade: espera o guindaste passar sobre o topo da torre e chama
     * `soltar()` — o mesmo caminho de código que o toque do aluno percorre.
     */
    const jogarBem = `
      (async () => {
        const jogo = ${g};
        // A altura da torre precisa ser lida DURANTE a partida: ao terminar, a
        // cena de jogo já foi trocada pela de resultado e o dado some.
        let maiorTorre = 0;
        for (let bloco = 0; bloco < 12; bloco++) {
          const cena = jogo.cena;
          if (!cena || jogo.estado !== 'jogando') break;
          let tentativas = 0;
          while (tentativas++ < 400) {
            if (!cena.blocoNoGancho || cena.travado) { await new Promise(r => setTimeout(r, 25)); continue; }
            if (Math.abs(cena.controle.x - cena.centroDoTopo) < 12) { cena.soltar(); break; }
            await new Promise(r => setTimeout(r, 16));
          }
          await new Promise(r => setTimeout(r, 700));
          if (cena.torre) maiorTorre = Math.max(maiorTorre, cena.torre.length);
          if (jogo.estado !== 'jogando') break;
        }
        return { estado: jogo.estado, torre: maiorTorre };
      })()
    `;
    const fim = await avaliar(jogarBem);
    await esperar(900);
    await capturar('06-resultado-vitoria');

    checar('a partida termina em resultado', await avaliar(`${g}.estado`) === 'resultado');

    let recebidas = await avaliar('window.__recebidas');
    checar('o postMessage CRUZA o iframe e chega ao pai', recebidas.length === 1,
      `recebidas: ${recebidas.length}`);

    const m1 = recebidas[0] ?? {};
    checar('type é exatamente "JOGO_CONCLUIDO"', m1.type === 'JOGO_CONCLUIDO');
    checar('jogo traz o slug', m1.jogo === 'jogo-dos-blocos', JSON.stringify(m1.jogo));
    checar('totalPerguntas = 5', m1.totalPerguntas === 5, JSON.stringify(m1.totalPerguntas));
    checar('acertos = 5 na vitória', m1.acertos === 5, JSON.stringify(m1));
    checar('nivel = 1', m1.nivel === 1, JSON.stringify(m1.nivel));
    checar('números vão como number', ['acertos', 'erros', 'totalPerguntas', 'nivel']
      .every((c) => typeof m1[c] === 'number'), JSON.stringify(m1));
    checar('não envia dado de aluno nem do AVA',
      !['lo_id', 'activity_id', 'aluno', 'turma', 'xp', 'nota'].some((c) => c in m1));
    checar('a torre foi realmente empilhada', fim.torre === 5, `torre: ${fim.torre}`);

    // ------------------------------------------------------- sem duplicação
    console.log('\n3. Sem duplicata e com replay');
    await esperar(2500); // fica parado na tela de resultado
    recebidas = await avaliar('window.__recebidas');
    checar('ficar parado no resultado NÃO gera mensagem extra', recebidas.length === 1,
      `recebidas: ${recebidas.length}`);

    // ------------------------------------------------- partida perdida (nv3)
    await avaliar(`${g}.irPara('jogando', { nivel: ${g}.config.niveis[2] })`);
    await esperar(900);
    checar('replay inicia uma nova partida', await avaliar(`${g}.estado`) === 'jogando');

    const jogarMal = `
      (async () => {
        const jogo = ${g};
        for (let i = 0; i < 8; i++) {
          const cena = jogo.cena;
          if (!cena || jogo.estado !== 'jogando') break;
          let tentativas = 0;
          while (tentativas++ < 400) {
            if (!cena.blocoNoGancho || cena.travado) { await new Promise(r => setTimeout(r, 25)); continue; }
            // Solta o mais longe possível do topo: erro garantido.
            if (Math.abs(cena.controle.x - cena.centroDoTopo) > 300) { cena.soltar(); break; }
            await new Promise(r => setTimeout(r, 16));
          }
          await new Promise(r => setTimeout(r, 900));
          if (jogo.estado !== 'jogando') break;
        }
        return jogo.estado;
      })()
    `;
    await avaliar(jogarMal);
    await esperar(1000);
    await capturar('07-resultado-derrota');

    recebidas = await avaliar('window.__recebidas');
    checar('replay genuíno gera um NOVO registro', recebidas.length === 2,
      `recebidas: ${recebidas.length}`);

    const m2 = recebidas[1] ?? {};
    checar('a derrota também é registrada', m2.acertos < 5, JSON.stringify(m2));
    checar('a derrota registra 3 erros', m2.erros === 3, JSON.stringify(m2));
    checar('o nível da segunda partida é 3', m2.nivel === 3, JSON.stringify(m2.nivel));

    // ---------------------------------------------------- tamanhos de iframe
    console.log('\n4. Comportamento em iframes de tamanhos diferentes');
    for (const [nome, l, a] of [['celular', 400, 700], ['pequeno', 640, 480], ['grande', 1280, 720]]) {
      await avaliar(`
        (() => {
          const m = document.getElementById('moldura');
          m.style.width = '${l}px'; m.style.height = '${a}px';
          return true;
        })()
      `);
      await esperar(700);
      const medidas = await avaliar(`
        (() => {
          const j = ${g};
          return { escala: j.stage.escala, lc: j.stage.canvas.clientWidth, ac: j.stage.canvas.clientHeight };
        })()
      `);
      await capturar(`08-iframe-${nome}`);
      checar(`iframe ${nome} (${l}×${a}): o canvas se ajusta sem deformar`,
        medidas.escala > 0 && medidas.lc > 0 && medidas.ac > 0, JSON.stringify(medidas));
    }

    // ------------------------------------------------------------ console AVA
    const logsAva = consoleLogs.filter((l) => l.texto.includes('JOGO_CONCLUIDO'));
    checar('o console registra [AVA] JOGO_CONCLUIDO para o humano validar',
      logsAva.length >= 2, `encontrados: ${logsAva.length}`);

    const avisos = consoleLogs.filter((l) => l.tipo === 'error');
    checar('nenhum console.error durante a sessão', avisos.length === 0,
      avisos.map((a) => a.texto).slice(0, 3).join(' | '));

    // -------------------------------------------------- som só vindo de arquivo
    const sintetizadas = await avaliar(`
      (() => {
        const q = document.getElementById('quadro');
        const dentro = (q && q.contentWindow && q.contentWindow.__falasSintetizadas) || [];
        return [...(window.__falasSintetizadas || []), ...dentro];
      })()
    `);
    checar('nenhuma fala foi sintetizada pelo navegador — todo som saiu de arquivo',
      sintetizadas.length === 0, `sintetizadas: ${JSON.stringify(sintetizadas)}`);

    // Relato, não asserção: as lacunas de narração são uma pendência conhecida
    // (ver A-GRAVAR.md do jogo) e vão desaparecer quando a locução for gravada.
    // Transformar isto em teste faria o teste falhar justamente ao ser resolvido.
    const lacunas = consoleLogs.filter((l) => l.texto.includes('narração ausente'));
    console.log(`\n   Lacunas de narração relatadas pelo motor nesta sessão: ${lacunas.length}`);
    for (const l of lacunas) {
      console.log(`     · ${l.texto.replace(/^"|"$/g, '')}`);
    }

    cdp.fechar();
  } finally {
    await limpar();
  }

  console.log(`\n${'-'.repeat(58)}`);
  console.log(`${passaram} passaram, ${falharam} falharam`);
  console.log(`Capturas em: ${PASTA_CAPTURAS}`);
  if (falharam > 0) {
    console.log('\nProblemas:');
    for (const p of problemas) console.log(`  - ${p}`);
    process.exit(1);
  }
}

principal().catch((err) => {
  console.error('\nTeste de navegador falhou:', err);
  process.exit(1);
});
