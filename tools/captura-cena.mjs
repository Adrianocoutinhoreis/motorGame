#!/usr/bin/env node
/**
 * captura-cena.mjs — screenshot de qualquer cena de um jogo, renderizada de
 * verdade num navegador headless (não um desenho calculado no papel).
 *
 * Nasceu de dois scripts descartáveis escritos na mão durante o ajuste do
 * selo de contraste do Jogo da Memória (commits b476fd8/4902f73): a pergunta
 * "como ficou isso desenhado?" não tem resposta sem renderizar o canvas de
 * verdade — e foi renderizando que se viu que uma correção calculada só no
 * papel (a 2ª rodada de contraste) ainda tinha ficado errada. Reescrever o
 * driver CDP à mão a cada vez é desperdício, e planta bug: a pressa foi
 * exatamente o que deixou a 2ª tentativa torta.
 *
 * O cliente CDP aqui é deliberadamente uma CÓPIA reduzida do de
 * `teste-navegador.mjs`/`teste-jogabilidade-*.mjs` (que já é repetida três
 * vezes) — extrair uma lib compartilhada mexeria nos três arquivos que já
 * funcionam, fora do escopo de uma ferramenta nova.
 *
 * Uso (com `node tools/serve.mjs 8099` rodando em outro terminal):
 *
 *   node tools/captura-cena.mjs jogo-dos-blocos
 *   node tools/captura-cena.mjs numerandus/jogo-da-memoria --cena=jogando --nivel=2
 *   node tools/captura-cena.mjs numerandus/jogo-da-memoria --cena=jogando --nivel=2 \
 *     --preparar="for (const c of jogo.cena.cartas) { c._frenteVisivel = true; c.virada = true; }" \
 *     --saida=.capturas/tabuleiro.png
 *   node tools/captura-cena.mjs tools/ava-teste.html
 *
 * Opções:
 *   --porta=N        porta do serve.mjs (padrão 8099)
 *   --cena=nome      chama `jogo.irPara(nome, { nivel })` depois do jogo carregar
 *   --nivel=N        índice em `config.niveis` usado no --cena (padrão 0)
 *   --preparar=JS    expressão avaliada na página ANTES do print — `jogo` é
 *                    `window.jogo` — para forçar um estado que só aconteceria
 *                    depois de vários toques (ex.: virar todas as cartas)
 *   --espera=ms      pausa extra antes do print, depois do --preparar (padrão 300)
 *   --saida=arquivo  caminho do PNG, relativo à raiz (padrão .capturas/captura-<hora>.png)
 *   --clip=x,y,l,a   recorta a região (em px CSS) em vez da tela inteira
 *   --escala=N       multiplica a resolução do print/recorte (padrão 2)
 *
 * O primeiro argumento aceita três formas: um `dir` de `Games/` (vira
 * `Games/<dir>/index.html`), um caminho `.html` do projeto (ex.:
 * `tools/ava-teste.html`), ou uma URL completa.
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORTA_CDP = 9345;

const NAVEGADORES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

function acharNavegador() {
  for (const caminho of NAVEGADORES) if (existsSync(caminho)) return caminho;
  return null;
}

// ---------------------------------------------------------------- cliente CDP

class CDP {
  constructor(url) {
    this.url = url;
    this.proximoId = 1;
    this.pendentes = new Map();
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
      } else if (msg.method === 'Page.loadEventFired') {
        this._aoCarregar?.();
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

  esperarCarregar() {
    return new Promise((resolve) => { this._aoCarregar = resolve; });
  }

  fechar() {
    try { this.ws.close(); } catch { /* já fechado */ }
  }
}

// --------------------------------------------------------------- argumentos

function analisarArgumentos(argv) {
  const opcoes = { porta: 8099, nivel: 0, espera: 300, escala: 2 };
  const posicionais = [];
  for (const arg of argv) {
    const m = arg.match(/^--([\w-]+)=([\s\S]*)$/);
    if (!m) { posicionais.push(arg); continue; }
    const [, chave, valor] = m;
    if (chave === 'clip') opcoes.clip = valor.split(',').map(Number);
    else if (['porta', 'nivel', 'espera', 'escala'].includes(chave)) opcoes[chave] = Number(valor);
    else opcoes[chave] = valor;
  }
  return { alvo: posicionais[0], opcoes };
}

const { alvo, opcoes } = analisarArgumentos(process.argv.slice(2));
if (!alvo) {
  console.error('Uso: node tools/captura-cena.mjs <jogo-ou-caminho.html|url> [opções]');
  console.error('Ver o cabeçalho de tools/captura-cena.mjs para a lista de opções.');
  process.exit(1);
}

const url = /^https?:\/\//.test(alvo)
  ? alvo
  : alvo.endsWith('.html')
    ? `http://127.0.0.1:${opcoes.porta}/${alvo.replace(/^\/+/, '')}`
    : `http://127.0.0.1:${opcoes.porta}/Games/${alvo.replace(/^\/+/, '')}/index.html`;

// ------------------------------------------------------------------ execução

async function principal() {
  const navegador = acharNavegador();
  if (!navegador) {
    console.error('Nenhum Chrome/Edge encontrado neste sistema.');
    process.exit(2);
  }

  const perfil = path.join(os.tmpdir(), `motor-captura-${Date.now()}`);
  const processo = spawn(navegador, [
    '--headless=new',
    `--remote-debugging-port=${PORTA_CDP}`,
    `--user-data-dir=${perfil}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--disable-gpu',
    '--window-size=1280,860',
    '--mute-audio',
  ], { stdio: 'ignore' });

  const limpar = async () => {
    try { processo.kill(); } catch { /* já morreu */ }
    await rm(perfil, { recursive: true, force: true }).catch(() => {});
  };

  try {
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

    await cdp.enviar('Page.enable', {}, sessionId);
    await cdp.enviar('Runtime.enable', {}, sessionId);

    const avaliar = async (expressao) => {
      const r = await cdp.enviar('Runtime.evaluate', {
        expression: expressao,
        awaitPromise: true,
        returnByValue: true,
      }, sessionId);
      if (r.exceptionDetails) {
        throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
      }
      return r.result.value;
    };

    console.log(`Abrindo ${url} ...`);
    const carregou = cdp.esperarCarregar();
    await cdp.enviar('Page.navigate', { url }, sessionId);
    await carregou;
    await esperar(1200); // loader/animação inicial do motor assentar

    // Se a página tem um jogo do motor, espera ele ficar pronto antes de mexer.
    const temJogo = await avaliar('typeof window.jogo !== "undefined"');
    if (temJogo) {
      const pronto = await avaliar(`
        (async () => {
          for (let i = 0; i < 80; i++) {
            if (window.jogo.rodando) return true;
            await new Promise((r) => setTimeout(r, 100));
          }
          return false;
        })()
      `);
      if (!pronto) console.warn('aviso: window.jogo nunca ficou "rodando" — a captura segue mesmo assim');

      if (opcoes.cena) {
        console.log(`Indo para a cena "${opcoes.cena}" (nível ${opcoes.nivel})...`);
        await avaliar(`window.jogo.irPara(${JSON.stringify(opcoes.cena)}, {
          nivel: window.jogo.config.niveis?.[${opcoes.nivel}],
        })`);
        await esperar(600);
      }
    } else if (opcoes.cena) {
      console.warn('aviso: --cena foi passado, mas a página não tem window.jogo — ignorando');
    }

    if (opcoes.preparar) {
      console.log('Rodando --preparar...');
      await avaliar(`(() => {
        const jogo = window.jogo;
        ${opcoes.preparar}
        return true;
      })()`);
    }

    await esperar(opcoes.espera);

    const params = { format: 'png' };
    if (opcoes.clip) {
      const [x, y, width, height] = opcoes.clip;
      params.clip = { x, y, width, height, scale: opcoes.escala };
    }
    const { data } = await cdp.enviar('Page.captureScreenshot', params, sessionId);

    const saida = opcoes.saida
      ? path.resolve(RAIZ, opcoes.saida)
      : path.join(RAIZ, '.capturas', `captura-${Date.now()}.png`);
    await mkdir(path.dirname(saida), { recursive: true });
    await writeFile(saida, Buffer.from(data, 'base64'));
    console.log(`Captura salva em ${path.relative(RAIZ, saida)}`);

    cdp.fechar();
  } finally {
    await limpar();
  }
}

principal().catch((err) => {
  console.error('Falhou:', err.message);
  process.exit(1);
});
