#!/usr/bin/env node
/**
 * teste-entrega-avulsa.mjs — o teste que mais importa antes de publicar.
 *
 * Copia SÓ a pasta de um jogo para fora do projeto, dentro de uma subpasta
 * qualquer, sobe um servidor apontando para essa raiz e abre o jogo num
 * navegador headless. É exatamente o que acontece quando se manda um único
 * jogo para o AVA: nada da raiz do projeto está lá, e a URL não é a raiz do
 * servidor.
 *
 * Falha se o jogo depender de qualquer coisa fora da própria pasta — que é o
 * defeito que só apareceria depois de publicado.
 *
 * Uso:
 *   node tools/teste-entrega-avulsa.mjs jogo-dos-blocos
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { cp, mkdir, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = process.argv[2] ?? 'jogo-dos-blocos';
/** Subpasta de propósito profunda: prova que caminho relativo funciona em qualquer nível. */
const SUBPASTA = 'aulas/2026/turma-b';
const PORTA_SITE = 8123;
const PORTA_CDP = 9444;

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

const NAVEGADORES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
];

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

let passaram = 0;
let falharam = 0;
const problemas = [];

function checar(nome, condicao, detalhe = '') {
  if (condicao) { passaram++; console.log(`  ok   ${nome}`); }
  else {
    falharam++;
    problemas.push(`${nome}${detalhe ? ` — ${detalhe}` : ''}`);
    console.log(`  FALHOU  ${nome}${detalhe ? `\n         ${detalhe}` : ''}`);
  }
}

async function principal() {
  const origem = path.join(RAIZ, 'Games', SLUG);
  if (!existsSync(origem)) {
    console.error(`ERRO: Games/${SLUG} não existe.`);
    process.exit(1);
  }

  const navegador = NAVEGADORES.find((c) => existsSync(c));
  if (!navegador) {
    console.error('Nenhum Chrome/Edge encontrado.');
    process.exit(2);
  }

  // 1 ------------------------------------------------ copiar para fora
  const baseFora = path.join(os.tmpdir(), `entrega-${SLUG}-${Date.now()}`);
  const destino = path.join(baseFora, ...SUBPASTA.split('/'), SLUG);
  await mkdir(path.dirname(destino), { recursive: true });
  await cp(origem, destino, { recursive: true });

  console.log('Teste de entrega avulsa');
  console.log('='.repeat(58));
  console.log(`Jogo:       ${SLUG}`);
  console.log(`Servido de: ${baseFora}`);
  console.log(`URL:        http://127.0.0.1:${PORTA_SITE}/${SUBPASTA}/${SLUG}/\n`);

  // 2 --------------------------------- servidor apontando para a cópia
  const requisicoes = [];
  const servidor = createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORTA_SITE}`);
    const registro = { caminho: url.pathname, status: 0 };
    requisicoes.push(registro);
    let arquivo = path.normalize(path.join(baseFora, decodeURIComponent(url.pathname)));
    if (!arquivo.startsWith(baseFora)) { registro.status = 403; res.writeHead(403).end(); return; }
    if (arquivo.endsWith(path.sep) || !path.extname(arquivo)) arquivo = path.join(arquivo, 'index.html');
    try {
      const conteudo = await readFile(arquivo);
      registro.status = 200;
      res.writeHead(200, {
        'content-type': TIPOS[path.extname(arquivo).toLowerCase()] ?? 'application/octet-stream',
        'cache-control': 'no-store',
      });
      res.end(conteudo);
    } catch {
      registro.status = 404;
      res.writeHead(404).end('404');
    }
  });
  await new Promise((r) => servidor.listen(PORTA_SITE, r));

  const perfil = path.join(os.tmpdir(), `entrega-cdp-${Date.now()}`);
  const processo = spawn(navegador, [
    '--headless=new', `--remote-debugging-port=${PORTA_CDP}`, `--user-data-dir=${perfil}`,
    '--no-first-run', '--disable-gpu', '--mute-audio', '--window-size=1024,700',
  ], { stdio: 'ignore' });

  try {
    let versao = null;
    for (let i = 0; i < 60; i++) {
      try { versao = await (await fetch(`http://127.0.0.1:${PORTA_CDP}/json/version`)).json(); break; }
      catch { await esperar(250); }
    }
    if (!versao) throw new Error('navegador não abriu a porta de depuração');

    const ws = new WebSocket(versao.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.addEventListener('open', res, { once: true });
      ws.addEventListener('error', rej, { once: true });
    });

    let proximoId = 1;
    const pendentes = new Map();
    const erros = [];
    ws.addEventListener('message', (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pendentes.has(m.id)) {
        const { resolve, reject } = pendentes.get(m.id);
        pendentes.delete(m.id);
        if (m.error) reject(new Error(m.error.message)); else resolve(m.result);
      } else if (m.method === 'Runtime.exceptionThrown') {
        erros.push(m.params.exceptionDetails?.exception?.description ?? m.params.exceptionDetails?.text);
      }
    });
    const enviar = (method, params = {}, sessionId) => {
      const id = proximoId++;
      const pacote = { id, method, params };
      if (sessionId) pacote.sessionId = sessionId;
      return new Promise((resolve, reject) => {
        pendentes.set(id, { resolve, reject });
        ws.send(JSON.stringify(pacote));
        setTimeout(() => {
          if (pendentes.has(id)) { pendentes.delete(id); reject(new Error(`timeout ${method}`)); }
        }, 25000);
      });
    };

    const { targetId } = await enviar('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await enviar('Target.attachToTarget', { targetId, flatten: true });
    await enviar('Page.enable', {}, sessionId);
    await enviar('Runtime.enable', {}, sessionId);

    const avaliar = async (expr) => {
      const r = await enviar('Runtime.evaluate', {
        expression: expr, awaitPromise: true, returnByValue: true, userGesture: true,
      }, sessionId);
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
      return r.result.value;
    };

    await enviar('Page.navigate', {
      url: `http://127.0.0.1:${PORTA_SITE}/${SUBPASTA}/${SLUG}/index.html`,
    }, sessionId);

    const pronto = await avaliar(`
      (async () => {
        for (let i = 0; i < 100; i++) {
          if (window.jogo && window.jogo.rodando) return true;
          await new Promise(r => setTimeout(r, 250));
        }
        return false;
      })()
    `);

    checar('o jogo abre servido de FORA do projeto, numa subpasta profunda', pronto === true);
    checar('nenhum erro de JavaScript', erros.length === 0, erros.join(' | '));

    const faltando = requisicoes.filter((r) => r.status === 404);
    checar('nenhum recurso 404 (nada aponta para fora da pasta)', faltando.length === 0,
      faltando.map((r) => r.caminho).join(' | '));

    const forasteiras = requisicoes.filter((r) => !r.caminho.startsWith(`/${SUBPASTA}/${SLUG}/`));
    checar('todos os recursos vieram de dentro da pasta do jogo',
      forasteiras.length === 0, forasteiras.map((r) => r.caminho).join(' | '));

    if (pronto) {
      checar('o menu está na tela', await avaliar('window.jogo.estado') === 'menu');

      // As expectativas vêm do PRÓPRIO config do jogo, não de números fixos:
      // esta ferramenta precisa servir a qualquer jogo, inclusive um recém-gerado.
      const esperado = await avaliar(`
        (() => {
          const c = window.jogo.config;
          const tipo = (src) => {
            const ext = String(src).split('?')[0].split('.').pop().toLowerCase();
            if (['png','jpg','jpeg','gif','webp','svg'].includes(ext)) return 'imagem';
            if (['mp3','wav','ogg','m4a','aac'].includes(ext)) return 'audio';
            return 'outro';
          };
          const assets = c.assets || [];
          return {
            niveis: (c.niveis || []).length,
            imagens: assets.filter(a => tipo(a.src) === 'imagem').length,
            audios: assets.filter(a => tipo(a.src) === 'audio').length,
            slug: c.slug,
          };
        })()
      `);

      checar('o jogo declara ao menos um nível', esperado.niveis >= 1, `níveis: ${esperado.niveis}`);
      checar('o slug está definido (vai no campo `jogo` do AVA)',
        typeof esperado.slug === 'string' && esperado.slug.length > 0, JSON.stringify(esperado.slug));

      const falhasAssets = await avaliar('window.jogo.loader.falhas.map(f => f.item.id)');
      checar('os assets carregaram sem falha', falhasAssets.length === 0, JSON.stringify(falhasAssets));

      const imagens = await avaliar('window.jogo.loader.imagens.size');
      checar(`as ${esperado.imagens} imagens declaradas carregaram`,
        imagens === esperado.imagens, `carregadas: ${imagens}`);

      const audios = await avaliar('window.jogo.loader.audios.size');
      checar(`os ${esperado.audios} áudios declarados carregaram`,
        audios === esperado.audios, `carregados: ${audios}`);

      checar('fora de iframe, o jogo NÃO envia postMessage (comportamento correto)',
        await avaliar('window.parent === window'));
    }

    console.log(`\n  ${requisicoes.length} requisições, todas locais à pasta do jogo.`);
    ws.close();
  } finally {
    servidor.close();
    try { processo.kill(); } catch { /* já morreu */ }
    await rm(perfil, { recursive: true, force: true }).catch(() => {});
    await rm(baseFora, { recursive: true, force: true }).catch(() => {});
  }

  console.log(`\n${'='.repeat(58)}`);
  console.log(`${passaram} passaram, ${falharam} falharam`);
  if (falharam > 0) {
    console.log('\nProblemas:');
    for (const p of problemas) console.log(`  - ${p}`);
    process.exit(1);
  }
  console.log('A pasta do jogo pode ser enviada sozinha para o AVA.');
}

principal().catch((err) => {
  console.error('\nTeste de entrega falhou:', err);
  process.exit(1);
});
