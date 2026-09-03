#!/usr/bin/env node
/**
 * pages-index.mjs — gera o `index.html` da RAIZ: a capa que lista os jogos.
 *
 * ## Por que existe
 *
 * O repositório não tinha `index.html` na raiz, então a raiz do GitHub Pages
 * respondia 404 e só dava para abrir um jogo digitando o caminho profundo de
 * cabeça. É o mesmo defeito que o `serve.mjs` tinha ao imprimir `/Games/`: um
 * endereço anunciado que não leva a lugar nenhum.
 *
 * ## Por que é GERADO
 *
 * A lista sai da mesma medição do `serve.mjs`: cada subpasta de `Games/` que
 * tenha um `index.html`, com o nome vindo do `<title>` do próprio jogo. Escrever
 * a lista à mão criaria a terceira cópia da mesma informação — e a que
 * envelheceria calada, porque nenhum teste olha a capa.
 *
 * No Pages não há como descobrir isso em tempo de execução (não existe a rota
 * `/__jogos.json` nem listagem de diretório), então a descoberta acontece AQUI,
 * na geração, e o resultado é commitado.
 *
 * ## Uso
 *
 *     node tools/pages-index.mjs
 *
 * Rode depois de criar um jogo novo. O arquivo gerado avisa, no topo, que foi
 * gerado — para ninguém editá-lo à mão e perder a edição na próxima geração.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Mesma regra do `serve.mjs`: subpasta de `Games/` com `index.html` DIRETO
 * dentro, OU — sem `index.html` próprio — uma pasta de COLEÇÃO (ex.:
 * `Games/numerandus/`), cujas subpastas SÃO jogos. Um nível de aninhamento,
 * não mais que isso.
 *
 * `dir` é o caminho relativo a `Games/` (vai no `href` do card); `slug` é o
 * identificador ESTÁVEL do contrato do AVA (`config.slug`, lido do texto de
 * `src/config.js`, sem importar o módulo — não há navegador aqui). Para um
 * jogo direto os dois são o mesmo texto; só divergem dentro de uma coleção.
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
    let html;
    try {
      html = await readFile(path.join(pastaDoJogo, 'index.html'), 'utf8');
    } catch {
      continue;
    }
    const titulo = html.match(new RegExp('<title>([^<]*)</title>', 'i'))?.[1]?.trim() || dir;

    // Slug, subtítulo e aula saem do config do jogo, sem importar o módulo (o
    // config depende do motor, e aqui não há navegador). Leitura textual, e o
    // valor ausente simplesmente não aparece na capa.
    let slug = dir;
    let subtitulo = '';
    let aula = '';
    try {
      const config = await readFile(path.join(pastaDoJogo, 'src', 'config.js'), 'utf8');
      slug = config.match(/slug:\s*'([^']+)'/)?.[1] ?? dir;
      subtitulo = config.match(/subtitulo:\s*'([^']*)'/)?.[1] ?? '';
      aula = config.match(/aulaOriginal:\s*'([^']*)'/)?.[1] ?? '';
    } catch { /* jogo sem config legível: a capa mostra só o título */ }

    jogos.push({ dir, slug, titulo, subtitulo, aula });
  }
  return jogos.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
}

const escapar = (t) => String(t)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const jogos = await listarJogos();

const cartoes = jogos.map((jogo) => `      <a class="jogo" href="./Games/${escapar(jogo.dir)}/">
        <span class="nome">${escapar(jogo.titulo)}</span>
        ${jogo.subtitulo ? `<span class="sub">${escapar(jogo.subtitulo)}</span>` : ''}
        ${jogo.aula ? `<span class="aula">aula ${escapar(jogo.aula)}</span>` : ''}
        <span class="abrir">ABRIR &rsaquo;</span>
      </a>`).join('\n');

const html = `<!DOCTYPE html>
<!--
  GERADO por tools/pages-index.mjs — NÃO editar à mão.
  Regenere com: node tools/pages-index.mjs
  A lista de jogos é medida em Games/, não escrita aqui.
-->
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Motor Educandus — jogos</title>
<style>
  :root {
    --tinta: #111827;
    --suave: #4B5563;
    --linha: #E5E7EB;
    --azul: #2563EB;
    --fundo: #EFF6FF;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font: 16px/1.55 system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    color: var(--tinta);
    background: linear-gradient(160deg, #4338CA 0%, #6366F1 55%, #22D3EE 100%);
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 32px 20px;
  }
  main {
    width: 100%;
    max-width: 760px;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 18px 50px rgba(15, 23, 42, .28);
    padding: 36px;
  }
  h1 { font-size: 30px; letter-spacing: -.01em; }
  .lede { color: var(--suave); margin-top: 8px; }
  .jogos { display: grid; gap: 14px; margin-top: 28px; }
  a.jogo {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 4px 16px;
    text-decoration: none;
    color: inherit;
    border: 2px solid var(--linha);
    border-radius: 16px;
    padding: 18px 20px;
    background: var(--fundo);
  }
  a.jogo:hover { border-color: var(--azul); }
  .nome { font-size: 20px; font-weight: 700; }
  .sub, .aula { grid-column: 1; color: var(--suave); font-size: 14px; }
  .aula { font-variant-numeric: tabular-nums; }
  .abrir { grid-row: 1 / span 3; grid-column: 2; font-weight: 700; color: var(--azul); white-space: nowrap; }
  .vazio { color: var(--suave); font-style: italic; margin-top: 24px; }
  footer { margin-top: 28px; padding-top: 18px; border-top: 2px solid var(--linha); color: var(--suave); font-size: 14px; }
  footer a { color: var(--azul); }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 6px; font-size: 13px; }
</style>
</head>
<body>
<main>
  <h1>Motor Educandus</h1>
  <p class="lede">
    Jogos educacionais em HTML, CSS e JavaScript puro, sem dependência externa.
    Cada pasta abaixo é uma entrega independente — roda sozinha, e é assim que vai para o AVA.
  </p>

${jogos.length ? `  <div class="jogos">
${cartoes}
  </div>` : '  <p class="vazio">Nenhum jogo em Games/ (nenhuma subpasta com index.html).</p>'}

  <footer>
    <p>
      O <a href="./tools/ava-teste.html">host de teste do AVA</a> simula a página que hospeda o jogo
      num <code>&lt;iframe&gt;</code> e valida a mensagem de fim de partida.
      Servido pelo GitHub Pages, as abas de jogo dele não aparecem — não há
      <code>/__jogos.json</code> nem listagem de diretório —, então use o campo de caminho.
    </p>
  </footer>
</main>
</body>
</html>
`;

await writeFile(path.join(RAIZ, 'index.html'), html, 'utf8');
console.log(`index.html gerado com ${jogos.length} jogo(s):`);
for (const jogo of jogos) console.log(`  ${jogo.titulo}  ->  ./Games/${jogo.dir}/`);
