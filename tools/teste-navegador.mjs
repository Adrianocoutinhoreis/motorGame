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

    // Último passo: é o único em que o JOGAR aparece, e por isso o único em que
    // ele divide a faixa de navegação com a seta de voltar. Estas duas caixas
    // chegaram a se sobrepor em 4 px sem ninguém ver, porque o roteiro nunca
    // vinha até aqui. Agora vem, e mede a folga em vez de confiar no olho.
    await avaliar(`${g}.cena.mostrarPasso(${await avaliar(`${g}.cena.passos.length`) - 1})`);
    await esperar(500);
    await capturar('03b-tutorial-ultimo');
    const navUltimo = await avaliar(`
      (() => {
        const c = document.getElementById('quadro').contentWindow.jogo.cena;
        const caixa = (n) => ({ e: n.x - n.regX, d: n.x - n.regX + n.largura });
        const voltar = caixa(c.botaoAnterior);
        const jogar = caixa(c.botaoJogar);
        return {
          jogarVisivel: c.botaoJogar.visible === true,
          proximoOculto: c.botaoProximo.visible === false,
          folga: Math.round(jogar.e - voltar.d),
          jogarCentrado: Math.abs((jogar.e + jogar.d) / 2 - 640) <= 1,
        };
      })()
    `);
    checar('no último passo aparece o JOGAR e a seta de avançar sai',
      navUltimo.jogarVisivel && navUltimo.proximoOculto, JSON.stringify(navUltimo));
    checar('o JOGAR não encosta na seta de voltar',
      navUltimo.folga >= 24, `folga medida: ${navUltimo.folga} px`);
    checar('o JOGAR fica centrado na tela', navUltimo.jogarCentrado === true,
      JSON.stringify(navUltimo));

    await avaliar(`${g}.cena.mostrarPasso(0)`);
    await esperar(300);

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
    // Esta vitória é LIMPA (`jogarBem` só solta sobre o centro do topo), então a
    // pontuação é a meta inteira. A vitória COM quedas tem seção própria abaixo:
    // é lá que a regra RE-02 aparece.
    checar('acertos = 5 na vitória limpa', m1.acertos === 5, JSON.stringify(m1));
    checar('vitória limpa não registra erro', m1.erros === 0, JSON.stringify(m1));
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

    // --------------------------------- 3b. vitória COM quedas: a nota desconta
    //
    // Regra RE-02 (docs/REGRAS-EDUCACIONAIS.md). O defeito que esta seção trava:
    // vencer exige encaixar a meta inteira, então o acerto BRUTO de toda vitória
    // é 5 — e enquanto a nota era o bruto, a fileira de estrelas enchia sempre.
    // Dava "5 de 5" com dois blocos derrubados pelo caminho.
    //
    // Aqui a partida é vencida DE PROPÓSITO com duas quedas, e a verificação é
    // dupla: o que a mensagem do AVA leva e o que a tela desenha. Os dois têm de
    // dizer o mesmo número.
    console.log('\n3b. Vitória com quedas: a nota desconta o erro (RE-02)');

    await avaliar(`${g}.irPara('menu')`);
    await esperar(400);
    await avaliar(`${g}.irPara('jogando', { nivel: ${g}.config.niveis[0] })`);
    await esperar(900);

    // ------------------------------------------- o cão de guarda da queda
    //
    // A rede que percebe a partida travada só serve se a INVARIANTE dela estiver
    // certa: enquanto `travado`, tem de haver tween vivo no bloco que cai ou na
    // cena. Se o predicado olhasse para o alvo errado, o cão acusaria travamento
    // no meio de uma queda perfeitamente normal — e um resgate em falso é pior
    // que não ter rede. Por isso a verificação é feita DURANTE a queda.
    //
    // O `nenhum console.error durante a sessão`, no fim deste arquivo, é a outra
    // metade: o cão grita em `console.error`, então qualquer disparo em falso ao
    // longo das partidas inteiras já reprova ali.
    const naQueda = await avaliar(`(() => {
      const c = ${g}.cena;
      if (!c.guarda) return { semGuarda: true };
      c.soltar();
      return {
        travado: c.travado,
        vivo: c.guarda.vivo(),
        ocupado: c.guarda.ocupado(),
        disparos: c.guarda.disparos,
      };
    })()`);
    checar('a partida tem cão de guarda armado', !naQueda.semGuarda, JSON.stringify(naQueda));
    checar('durante a queda o ciclo está ocupado — o cão sabe que há o que terminar',
      naQueda.travado === true && naQueda.ocupado === true, JSON.stringify(naQueda));
    checar('durante a queda a invariante dá sinal de vida (nada de resgate em falso)',
      naQueda.vivo === true, JSON.stringify(naQueda));

    await esperar(1600);
    const depoisDaQueda = await avaliar(`(() => {
      const c = ${g}.cena;
      return { travado: c.travado, disparos: c.guarda.disparos, ocupado: c.guarda.ocupado() };
    })()`);
    checar('a queda terminou sozinha e o cão não precisou intervir',
      depoisDaQueda.travado === false && depoisDaQueda.disparos === 0,
      JSON.stringify(depoisDaQueda));

    // Recomeça a partida: a inspeção acima soltou um bloco de verdade, e a
    // verificação da RE-02, logo abaixo, conta erros a partir de um tabuleiro do
    // zero. Sem isto ela media uma partida que já tinha uma jogada feita — e foi
    // exatamente assim que ela reprovou na primeira tentativa desta seção.
    await avaliar(`${g}.irPara('menu')`);
    await esperar(400);
    await avaliar(`${g}.irPara('jogando', { nivel: ${g}.config.niveis[0] })`);
    await esperar(900);

    // Derruba exatamente 2 (o terceiro erro encerraria por derrota) e depois
    // completa a torre. Mesmo caminho de código do toque do aluno.
    const vencerComQuedas = `
      (async () => {
        const jogo = ${g};
        const soltarQuando = async (condicao) => {
          let tentativas = 0;
          while (tentativas++ < 400) {
            const cena = jogo.cena;
            if (!cena || jogo.estado !== 'jogando') return false;
            if (!cena.blocoNoGancho || cena.travado) { await new Promise(r => setTimeout(r, 25)); continue; }
            if (condicao(cena)) { cena.soltar(); await new Promise(r => setTimeout(r, 900)); return true; }
            await new Promise(r => setTimeout(r, 16));
          }
          return false;
        };

        const longe = (cena) => Math.abs(cena.controle.x - cena.centroDoTopo) > 300;
        const emCima = (cena) => Math.abs(cena.controle.x - cena.centroDoTopo) < 12;

        await soltarQuando(longe);
        await soltarQuando(longe);
        const errosDepoisDasQuedas = jogo.cena?.placar?.erros ?? -1;

        for (let i = 0; i < 12 && jogo.estado === 'jogando'; i++) await soltarQuando(emCima);

        return { estado: jogo.estado, errosDepoisDasQuedas };
      })()
    `;
    const comQuedas = await avaliar(vencerComQuedas);
    await esperar(1000);
    await capturar('10-resultado-vitoria-com-quedas');

    checar('a partida com quedas chega ao resultado',
      comQuedas.estado === 'resultado', JSON.stringify(comQuedas));
    checar('as duas quedas foram registradas como erro',
      comQuedas.errosDepoisDasQuedas === 2, JSON.stringify(comQuedas));

    recebidas = await avaliar('window.__recebidas');
    const m3 = recebidas[recebidas.length - 1] ?? {};

    checar('a vitória com 2 quedas envia acertos = 3, não 5',
      m3.acertos === 3, JSON.stringify(m3));
    checar('os 2 erros seguem indo crus no campo erros',
      m3.erros === 2, JSON.stringify(m3));
    checar('a meta continua sendo 5', m3.totalPerguntas === 5, JSON.stringify(m3));
    checar('o acerto bruto não se perde: vai em blocosEmpilhados',
      m3.blocosEmpilhados === 5, JSON.stringify(m3.blocosEmpilhados));

    // O que a criança vê tem de ser o mesmo número que foi para o relatório.
    const telaComQuedas = await avaliar(`
      (() => {
        const q = document.getElementById('quadro');
        const w = q.contentWindow;
        let estrelas = null;
        const textos = [];
        (function andar(no) {
          if (no.constructor.name === 'Estrelas') estrelas = { cheias: no.quantidade, total: no.total };
          if (no.texto) textos.push(String(no.texto));
          for (const f of no.filhos) andar(f);
        })(w.jogo.stage.raiz);
        return { estrelas, textos };
      })()
    `);

    // A fileira tem CINCO, em qualquer jogo e qualquer meta (regra RE-04), e a
    // tela é que a calcula — um quinto da meta por estrela. Aqui a meta é 5, e
    // por isso um quinto dela é um ponto: 3 pontos acendem 3 estrelas. Esta
    // igualdade é a que garante que o piloto não mudou de comportamento quando a
    // fileira deixou de ter tamanho variável.
    checar('a tela mostra 3 estrelas de 5, não 5 de 5',
      telaComQuedas.estrelas?.cheias === 3 && telaComQuedas.estrelas?.total === 5,
      JSON.stringify(telaComQuedas.estrelas));

    // RE-04: a cena não passa nota nenhuma. Se voltar a passar, volta a existir
    // uma segunda fórmula de "quantas estrelas" divergindo da que a tela usa.
    const notaDaCena = await avaliar(
      'document.getElementById("quadro").contentWindow.jogo.dados.estrelas ?? "ausente"',
    );
    checar('a cena não passa nota de estrelas — quem calcula é a tela',
      notaDaCena === 'ausente', JSON.stringify(notaDaCena));
    // O placar da tela diz a UNIDADE, não uma fração: "3 pontos", não "3 de 5".
    // O "de N" saiu porque a pontuação pode passar da meta (um combo do Jogo das
    // Formas fechava a partida anunciando "13 de 12"). A verificação que importa
    // é a mesma de antes e continua aqui: o número que a criança lê tem de ser o
    // número que foi para o relatório.
    checar('o número da tela é o MESMO que foi para o AVA',
      telaComQuedas.textos.some((x) => x.includes(`${m3.acertos} pontos`)),
      JSON.stringify(telaComQuedas.textos));
    // Atenção ao escrever esta regex: ela já esteve aqui como `/d+ de d+/`, sem
    // as barras invertidas — um heredoc as engoliu na hora de escrever o arquivo.
    // O padrão passou a casar o texto literal "d+ de d+", que nunca aparece, e a
    // verificação passou a aprovar sempre, inclusive uma tela dizendo "3 de 5".
    // Teste que não pode falhar não é teste.
    checar('a tela NÃO promete um total que a pontuação pode passar',
      !telaComQuedas.textos.some((x) => /\d+ de \d+/.test(x)),
      JSON.stringify(telaComQuedas.textos));
    // E a prova de que a verificação acima ainda MORDE: o mesmo padrão contra um
    // texto que deveria reprovar.
    checar('a verificação do "N de N" reprova quando existe um "N de N"',
      /\d+ de \d+/.test('3 de 5'));

    // A linha "2 tentativas perdidas" saiu da tela de resultado (o fim de partida
    // comemora o avanço, não enumera falha — docs/DESIGN.md). Os erros seguem
    // sendo verificados onde o professor de fato os lê: a mensagem do AVA, no
    // `checar` de `m3.erros` algumas linhas acima.
    checar('a tela não enumera as falhas, mas o AVA recebe as duas',
      !telaComQuedas.textos.some((x) => x.includes('tentativa')) && m3.erros === 2,
      JSON.stringify({ textos: telaComQuedas.textos, erros: m3.erros }));

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

    // ------------------------------- 4b. as barras do letterbox, cobertas
    //
    // O jogo tem proporção fixa (1280×720), então num quadro de outra proporção
    // sobram duas faixas. Elas apareciam como tarjas escuras em volta da tela —
    // foi reclamação do humano olhando o jogo publicado.
    //
    // Agora o cenário da cena continua para dentro delas (`Stage.sangria`). Duas
    // coisas são verificadas aqui, e a segunda é a que pega o defeito difícil:
    //
    //  1. a barra não é mais a cor lisa do letterbox;
    //  2. **não há linha de emenda.** A borda do recorte sofre antialiasing e
    //     misturava com a cor lisa por baixo, desenhando uma linha escura de 1 px
    //     exatamente na junção — medida em 80% do brilho do céu. Olhar a captura
    //     não bastava para julgar; medir o pixel, sim.
    console.log('\n4b. As barras do letterbox, cobertas pelo cenário');
    for (const [nome, l, a] of [['larga', 1280, 560], ['alta', 800, 720]]) {
      await avaliar(`
        (() => {
          const m = document.getElementById('moldura');
          m.style.width = '${l}px'; m.style.height = '${a}px';
          return true;
        })()
      `);
      await esperar(700);
      const m = await avaliar(`
        (() => {
          const st = ${g}.stage;
          const ctx = st.canvas.getContext('2d');
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const lum = (x, y) => {
            const d = ctx.getImageData(Math.round(x * dpr), Math.round(y * dpr), 1, 1).data;
            return 0.2126 * d[0] + 0.7152 * d[1] + 0.0722 * d[2];
          };
          const hex = (x, y) => {
            const d = ctx.getImageData(Math.round(x * dpr), Math.round(y * dpr), 1, 1).data;
            return '#' + [d[0], d[1], d[2]].map((n) => n.toString(16).padStart(2, '0')).join('');
          };
          const horizontal = st.deslocX > 1;
          const cw = st.canvas.clientWidth;
          const ch = st.canvas.clientHeight;
          // Amostra dentro da barra, andando até a borda. O último é o vizinho
          // imediato da junção — onde a linha de emenda aparecia.
          const luzes = [];
          for (let d = 6; d >= 1; d--) {
            luzes.push(horizontal ? lum(st.deslocX - d, ch / 2) : lum(cw / 2, st.deslocY - d));
          }
          return {
            eixo: horizontal ? 'x' : 'y',
            sangria: Math.round(horizontal ? st.sangriaX : st.sangriaY),
            temPintor: !!st.sangria,
            corBarra: horizontal ? hex(st.deslocX / 2, ch / 2) : hex(cw / 2, st.deslocY / 2),
            luzes: luzes.map((v) => Math.round(v)),
          };
        })()
      `);
      const maior = Math.max(...m.luzes);
      const menor = Math.min(...m.luzes);
      checar(`letterbox ${nome} (${l}×${a}): há barra e há quem a pinte`,
        m.sangria > 1 && m.temPintor === true, JSON.stringify(m));
      checar(`letterbox ${nome}: a barra recebeu o cenário, não a cor lisa`,
        m.corBarra !== '#0b1220', JSON.stringify(m));
      // 10 em 255 é ~4%: passa uma variação de degradê e reprova a emenda, que
      // custava 20% do brilho.
      checar(`letterbox ${nome}: sem linha de emenda na junção`,
        maior - menor <= 10, `luminâncias na barra: ${m.luzes.join(' ')}`);
      await capturar(`08b-letterbox-${nome}`);
    }

    // ------------------------------------------- 5. celular de pé: gira o jogo
    //
    // A seção que faltava. As de cima provam que o canvas não deforma em iframe
    // de qualquer tamanho; nenhuma provava que o jogo é JOGÁVEL num aparelho de
    // pé — e não era: 75% da tela virava barra preta e o jogo ficava numa tira
    // de 203 px de altura.
    //
    // Agora o CSS gira `#palco` um quarto de volta e o Stage inverte o mapa
    // tela→lógico. A verificação que importa é a última: um toque de verdade, no
    // pixel de verdade, com o palco girado. Sem a inversão do mapa esse toque
    // caía em OUTRO botão, e nada aqui teria acusado.
    //
    // Roda numa aba própria, com o jogo aberto direto: o giro depende só da
    // viewport do jogo e do tipo de ponteiro, e dentro do AVA a viewport do jogo
    // É o iframe — `100vh` ali já mede o quadro, não a janela. O tamanho
    // arbitrário do quadro é assunto da seção 4. Aba separada também garante que
    // a emulação de celular não contamine as verificações seguintes.
    console.log('\n5. Celular de pé: o jogo gira sozinho para a horizontal');

    const alvoGiro = await cdp.enviar('Target.createTarget', { url: 'about:blank' });
    const sessaoGiro = (await cdp.enviar('Target.attachToTarget', {
      targetId: alvoGiro.targetId, flatten: true,
    })).sessionId;
    await cdp.enviar('Page.enable', {}, sessaoGiro);
    await cdp.enviar('Runtime.enable', {}, sessaoGiro);

    const avaliarGiro = async (expressao) => {
      const r = await cdp.enviar('Runtime.evaluate', {
        expression: expressao, awaitPromise: true, returnByValue: true, userGesture: true,
      }, sessaoGiro);
      if (r.exceptionDetails) {
        throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
      }
      return r.result.value;
    };

    // Um celular comum de pé. `mobile: true` é o que faz `pointer: coarse` casar
    // — a condição que separa aparelho de toque de janela estreita de desktop.
    await cdp.enviar('Emulation.setDeviceMetricsOverride', {
      width: 360, height: 800, deviceScaleFactor: 2, mobile: true,
      screenWidth: 360, screenHeight: 800,
      screenOrientation: { type: 'portraitPrimary', angle: 0 },
    }, sessaoGiro);
    await cdp.enviar('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, sessaoGiro);

    await cdp.enviar('Page.navigate', {
      url: `http://127.0.0.1:${PORTA_SITE}/Games/jogo-dos-blocos/`,
    }, sessaoGiro);

    for (let i = 0; i < 80; i++) {
      await esperar(250);
      if (await avaliarGiro('!!(window.jogo && window.jogo.stage)').catch(() => false)) break;
    }
    await esperar(1400); // a animação de entrada dos botões do menu

    const dePe = await avaliarGiro(`
      (() => {
        const s = window.jogo.stage;
        const palco = document.querySelector('#palco');
        const dica = document.querySelector('#aviso-orientacao');
        return {
          ponteiroGrosso: matchMedia('(pointer: coarse)').matches,
          orientacao: matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape',
          giroDoStage: s.giro,
          caixaDeLayout: palco.clientWidth + 'x' + palco.clientHeight,
          escala: Number(s.escala.toFixed(4)),
          areaDoJogo: Math.round(s.larguraLogica * s.escala) + 'x' + Math.round(s.alturaLogica * s.escala),
          desperdicio: Math.round(100 * (1 - (s.larguraLogica * s.escala * s.alturaLogica * s.escala)
            / (innerWidth * innerHeight))),
          dicaBloqueiaToque: dica ? getComputedStyle(dica).pointerEvents !== 'none' : 'sem dica',
          dicaEmPe: dica ? dica.getBoundingClientRect().width > dica.getBoundingClientRect().height : 'sem dica',
          dicaCaixa: dica ? Math.round(dica.getBoundingClientRect().width) + 'x' + Math.round(dica.getBoundingClientRect().height) : 'sem dica',
          dicaDentroDoPalco: !!(dica && palco.contains(dica)),
          cena: window.jogo.nomeCena,
        };
      })()
    `);

    const { data: pngGiro } = await cdp.enviar('Page.captureScreenshot', { format: 'png' }, sessaoGiro);
    await writeFile(path.join(PASTA_CAPTURAS, '09-celular-de-pe-girado.png'), Buffer.from(pngGiro, 'base64'));

    checar('num celular de pé o motor detecta o giro que o CSS aplicou',
      dePe.orientacao === 'portrait' && dePe.ponteiroGrosso === true && dePe.giroDoStage === 90,
      JSON.stringify(dePe));
    checar('a caixa do palco fica na horizontal, e não de pé',
      dePe.caixaDeLayout === '800x360', `caixa: ${dePe.caixaDeLayout}`);
    checar('girar recupera a tela em vez de deixar o jogo numa tira',
      dePe.escala >= 0.5 && dePe.desperdicio <= 25,
      `escala ${dePe.escala}, área ${dePe.areaDoJogo}, desperdício ${dePe.desperdicio}%`);
    checar('a dica de girar não bloqueia o toque do jogo',
      dePe.dicaBloqueiaToque === false, JSON.stringify(dePe.dicaBloqueiaToque));
    // A dica NÃO pode girar com o jogo: girada, ela só seria legível depois de o
    // aparelho ser virado — pediria o que já foi feito. Em pé a pílula é mais
    // larga que alta; girada seria mais alta que larga.
    checar('a dica fica em pé para quem segura o aparelho, não girada com o jogo',
      dePe.dicaEmPe === true, JSON.stringify(dePe.dicaCaixa));

    // ---- o toque de verdade, no pixel de verdade, com o palco girado --------
    const pontoJogar = await avaliarGiro(`
      (() => {
        const s = window.jogo.stage;
        const r = s.canvas.getBoundingClientRect();

        let botao = null;
        (function andar(no) {
          if (botao || !no.visible) return;
          if (no.rotulo && String(no.rotulo).includes('JOGAR')) { botao = no; return; }
          for (const f of no.filhos) andar(f);
        })(s.raiz);
        if (!botao) return { erro: 'não achei o botão JOGAR no menu' };

        // A IDA do mapa, para 90 graus: o x lógico vira o y da tela, e o y lógico
        // corre no sentido inverso do x da tela. É o espelho exato da conta que
        // Stage.desfazerGiro desfaz — se as duas discordarem, o toque erra.
        return {
          logico: { x: Math.round(botao.x), y: Math.round(botao.y) },
          x: r.left + (r.width - (s.deslocY + botao.y * s.escala)),
          y: r.top + (s.deslocX + botao.x * s.escala),
        };
      })()
    `);

    checar('achou o botão JOGAR no menu para tocar', !pontoJogar.erro,
      pontoJogar.erro ?? `cena: ${dePe.cena}`);

    if (!pontoJogar.erro) {
      const toque = [{ x: Math.round(pontoJogar.x), y: Math.round(pontoJogar.y), id: 1 }];
      await cdp.enviar('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: toque }, sessaoGiro);
      await cdp.enviar('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }, sessaoGiro);
      await esperar(1000);

      const estado = await avaliarGiro('window.jogo.estado');
      checar('com o palco girado, o toque em JOGAR abre a seleção de nível',
        estado === 'niveis',
        `tocou em (${Math.round(pontoJogar.x)}, ${Math.round(pontoJogar.y)}) da tela,`
        + ` botão em ${JSON.stringify(pontoJogar.logico)} lógico, estado virou "${estado}"`);
    }

    // Deitar o mesmo aparelho: o giro tem de se desfazer sozinho, sem recarregar.
    await cdp.enviar('Emulation.setDeviceMetricsOverride', {
      width: 800, height: 360, deviceScaleFactor: 2, mobile: true,
      screenWidth: 800, screenHeight: 360,
      screenOrientation: { type: 'landscapePrimary', angle: 90 },
    }, sessaoGiro);
    await esperar(900);
    const deitado = await avaliarGiro(`
      (() => {
        const s = window.jogo.stage;
        const dica = document.querySelector('#aviso-orientacao');
        return {
          giro: s.giro,
          escala: Number(s.escala.toFixed(4)),
          dicaVisivel: dica ? getComputedStyle(dica).display !== 'none' : 'sem dica',
        };
      })()
    `);
    checar('ao deitar o aparelho o giro se desfaz sozinho, sem recarregar',
      deitado.giro === 0 && deitado.escala >= 0.5, JSON.stringify(deitado));
    checar('deitado, a dica de girar sai da tela',
      deitado.dicaVisivel === false, JSON.stringify(deitado));

    await cdp.enviar('Target.closeTarget', { targetId: alvoGiro.targetId });

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
