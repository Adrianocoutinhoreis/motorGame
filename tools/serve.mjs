#!/usr/bin/env node
/**
 * serve.mjs — servidor estático local, sem dependências.
 *
 * Existe porque o motor usa módulos ES (`import`/`export`), e abrir o
 * `index.html` por `file://` faz o navegador bloquear os módulos por CORS. Sem
 * um servidor, o jogo simplesmente não abre em desenvolvimento — e o erro no
 * console aponta para o lugar errado.
 *
 * Serve a RAIZ do projeto, então dá para abrir tanto o jogo quanto o host de
 * teste do AVA (`tools/ava-teste.html`) na mesma origem.
 *
 * Uso:
 *   node tools/serve.mjs           # porta 8080
 *   node tools/serve.mjs 3000
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORTA = Number(process.argv[2]) || 8080;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

const servidor = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORTA}`);
    let caminho = decodeURIComponent(url.pathname);

    // Impede sair da raiz por "../" na URL.
    const destino = path.normalize(path.join(RAIZ, caminho));
    if (!destino.startsWith(RAIZ)) {
      res.writeHead(403).end('403 — fora da raiz');
      return;
    }

    let arquivo = destino;
    try {
      const info = await stat(arquivo);
      if (info.isDirectory()) arquivo = path.join(arquivo, 'index.html');
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
        .end(`404 — não encontrado: ${caminho}`);
      return;
    }

    const conteudo = await readFile(arquivo);
    const tipo = TIPOS[path.extname(arquivo).toLowerCase()] ?? 'application/octet-stream';

    res.writeHead(200, {
      'content-type': tipo,
      // Sem cache: durante o desenvolvimento, cache é a causa nº 1 de "editei e
      // não mudou nada" (a armadilha B4.4 do METODO.md, em outra roupa).
      'cache-control': 'no-store, no-cache, must-revalidate',
    });
    res.end(conteudo);
  } catch (err) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
      .end(`500 — ${err.message}`);
  }
});

servidor.listen(PORTA, () => {
  console.log(`\nServindo ${RAIZ}`);
  console.log(`\n  Jogos:          http://localhost:${PORTA}/Games/`);
  console.log(`  Host do AVA:    http://localhost:${PORTA}/tools/ava-teste.html`);
  console.log('\nCtrl+C para parar.\n');
});
