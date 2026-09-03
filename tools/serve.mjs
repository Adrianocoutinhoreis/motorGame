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
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
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

/**
 * O slug ESTÁVEL do contrato do AVA (`config.slug`), lido do texto de
 * `src/config.js` sem importar o módulo (não há navegador aqui — mesmo truque
 * que `pages-index.mjs` já usa para ler `subtitulo`/`aulaOriginal`).
 *
 * Existe porque `dir` (o caminho da pasta, usado nas URLs) e `slug` divergem
 * quando o jogo mora numa pasta de COLEÇÃO (`Games/numerandus/<slug>/`): o
 * caminho carrega o nome da coleção, o slug do AVA não. Sem isto, `dir`
 * cairia como aproximação do slug em todo lugar que mostra o identificador
 * do AVA (ex.: a aba do `ava-teste.html`), e mentiria sobre o campo `jogo`
 * que a mensagem `JOGO_CONCLUIDO` de verdade envia.
 */
async function slugDoJogo(pastaDoJogo, dirFallback) {
  try {
    const config = await readFile(path.join(pastaDoJogo, 'src', 'config.js'), 'utf8');
    return config.match(/slug:\s*'([^']+)'/)?.[1] ?? dirFallback;
  } catch {
    return dirFallback;
  }
}

/**
 * Os jogos que existem: cada subpasta de `Games/` que tenha um `index.html`
 * DIRETO dentro dela, OU — quando a subpasta não tem `index.html` próprio —
 * uma pasta de COLEÇÃO (ex.: `Games/numerandus/`), cujas subpastas SÃO jogos.
 * Um nível de aninhamento, não mais que isso.
 *
 * **Medida a cada chamada, nunca mantida à mão.** Um jogo criado por
 * `new-game.mjs` aparece sem ninguém precisar lembrar de registrá-lo em lugar
 * nenhum — é a mesma escolha de `verificar-independencia.mjs`: verificado por
 * script, não por disciplina. Uma lista fixa aqui envelheceria calada, e o
 * sintoma seria "criei o jogo e ele não aparece na aba".
 *
 * O nome de exibição sai do `<title>` do próprio `index.html` do jogo, que é
 * onde ele já está escrito. Sem `<title>`, cai para o slug.
 *
 * Cada jogo carrega DOIS campos, não um só: `dir` (caminho relativo a
 * `Games/`, usado em toda URL) e `slug` (o identificador do AVA — ver
 * `slugDoJogo`). Para um jogo direto os dois são o mesmo texto (é a
 * convenção: a pasta batiza o slug); só divergem dentro de uma coleção.
 */
async function listarJogos() {
  const pasta = path.join(RAIZ, 'Games');
  let entradas;
  try {
    entradas = await readdir(pasta, { withFileTypes: true });
  } catch {
    return [];
  }

  const candidatos = [];
  for (const entrada of entradas) {
    if (!entrada.isDirectory()) continue;
    const base = path.join(pasta, entrada.name);
    if (existsSync(path.join(base, 'index.html'))) {
      candidatos.push({ dir: entrada.name, pastaDoJogo: base });
      continue;
    }
    // Sem index.html próprio: talvez seja uma pasta de coleção — olha um
    // nível a mais dentro dela.
    let subentradas;
    try {
      subentradas = await readdir(base, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const sub of subentradas) {
      if (!sub.isDirectory()) continue;
      const subBase = path.join(base, sub.name);
      if (existsSync(path.join(subBase, 'index.html'))) {
        candidatos.push({ dir: `${entrada.name}/${sub.name}`, pastaDoJogo: subBase });
      }
    }
  }

  const jogos = [];
  for (const { dir, pastaDoJogo } of candidatos) {
    const html = await readFile(path.join(pastaDoJogo, 'index.html'), 'utf8');
    jogos.push({
      dir,
      slug: await slugDoJogo(pastaDoJogo, dir),
      titulo: html.match(new RegExp('<title>([^<]*)</title>', 'i'))?.[1]?.trim() || dir,
      url: `/Games/${dir}/index.html`,
    });
  }
  return jogos.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
}

const servidor = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORTA}`);
    let caminho = decodeURIComponent(url.pathname);

    // A lista dos jogos, para o host de teste montar as abas sem que ninguém
    // precise digitar caminho. Não é arquivo em disco, então responde antes
    // da resolução de caminho.
    if (caminho === '/__jogos.json') {
      res.writeHead(200, {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      });
      res.end(JSON.stringify(await listarJogos()));
      return;
    }

    // Impede sair da raiz por "../" na URL.
    const destino = path.normalize(path.join(RAIZ, caminho));
    if (!destino.startsWith(RAIZ)) {
      res.writeHead(403).end('403 — fora da raiz');
      return;
    }

    let arquivo = destino;
    try {
      const info = await stat(arquivo);
      if (info.isDirectory()) {
        arquivo = path.join(arquivo, 'index.html');
        // Pasta sem index.html é 404, não 500. Antes o `readFile` estourava
        // ENOENT e caía no catch geral: `/Games/` respondia "500 — ENOENT",
        // que culpa o servidor por uma pasta que só não tem índice.
        await stat(arquivo);
      }
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

servidor.listen(PORTA, async () => {
  console.log(`\nServindo ${RAIZ}`);
  // Os endereços dos jogos, um por um. A linha anterior apontava para
  // `/Games/`, que não tem `index.html` e portanto respondia 500 — o
  // próprio servidor imprimia um link quebrado.
  const jogos = await listarJogos();
  if (jogos.length) {
    console.log('');
    console.log('  Jogos:');
    for (const jogo of jogos) {
      console.log(`    ${jogo.titulo.padEnd(18)} http://localhost:${PORTA}/Games/${jogo.slug}/`);
    }
  } else {
    console.log('');
    console.log('  Nenhum jogo em Games/ (nenhuma subpasta com index.html).');
  }
  console.log('');
  console.log(`  Host do AVA:    http://localhost:${PORTA}/tools/ava-teste.html`);
  console.log('\nCtrl+C para parar.\n');
});
