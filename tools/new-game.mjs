#!/usr/bin/env node
/**
 * new-game.mjs — cria um jogo novo a partir do template.
 *
 * É a prova prática de que o motor serve para jogos NOVOS, e não só para
 * refazer as aulas antigas: um comando produz uma pasta que já abre, percorre
 * menu → tutorial → níveis → partida → resultado e já emite o contrato do AVA,
 * sem uma linha de código escrita à mão.
 *
 * O que ele faz:
 *   1. copia `templates/jogo-base/` para `Games/<slug>/`;
 *   2. substitui os marcadores ({{SLUG}}, {{TITULO}}, {{DATA}}, {{VERSAO_MOTOR}});
 *   3. copia o motor para dentro (mesma cópia do build);
 *   4. gera o CHECKLIST.md do jogo já preenchido.
 *
 * Uso:
 *   node tools/new-game.mjs jogo-das-formas "Jogo das Formas"
 */
import { cp, mkdir, readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE = path.join(RAIZ, 'templates', 'jogo-base');
const PASTA_JOGOS = path.join(RAIZ, 'Games');
const ORIGEM_MOTOR = path.join(RAIZ, 'engine');

const EXTENSOES_TEXTO = new Set(['.html', '.js', '.mjs', '.css', '.json', '.md', '.txt', '.svg']);

function validarSlug(slug) {
  if (!slug) return 'informe o slug (ex.: jogo-das-formas)';
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return 'o slug deve ser minúsculo, sem acento, separado por hífen (ex.: jogo-das-formas)';
  }
  return null;
}

async function substituirMarcadores(pasta, valores) {
  for (const entrada of await readdir(pasta, { withFileTypes: true })) {
    const completo = path.join(pasta, entrada.name);
    if (entrada.isDirectory()) {
      await substituirMarcadores(completo, valores);
      continue;
    }
    if (!EXTENSOES_TEXTO.has(path.extname(entrada.name).toLowerCase())) continue;

    let conteudo = await readFile(completo, 'utf8');
    let mudou = false;
    for (const [marcador, valor] of Object.entries(valores)) {
      const regra = new RegExp(`\\{\\{${marcador}\\}\\}`, 'g');
      if (regra.test(conteudo)) {
        conteudo = conteudo.replace(regra, valor);
        mudou = true;
      }
    }
    if (mudou) await writeFile(completo, conteudo, 'utf8');
  }
}

async function principal() {
  const slug = process.argv[2];
  const titulo = process.argv[3] ?? slug;

  const problema = validarSlug(slug);
  if (problema) {
    console.error(`ERRO: ${problema}\n`);
    console.error('Uso: node tools/new-game.mjs <slug> "Nome do Jogo"');
    process.exit(1);
  }

  const destino = path.join(PASTA_JOGOS, slug);
  if (existsSync(destino)) {
    console.error(`ERRO: já existe Games/${slug}. Escolha outro slug ou apague a pasta.`);
    process.exit(1);
  }
  if (!existsSync(TEMPLATE)) {
    console.error(`ERRO: template não encontrado em ${TEMPLATE}`);
    process.exit(1);
  }

  let versaoMotor = '0.0.0';
  try {
    versaoMotor = JSON.parse(await readFile(path.join(ORIGEM_MOTOR, 'version.json'), 'utf8')).versao;
  } catch { /* segue com 0.0.0 */ }

  await mkdir(PASTA_JOGOS, { recursive: true });
  await cp(TEMPLATE, destino, { recursive: true });

  const hoje = new Date().toISOString().slice(0, 10);
  await substituirMarcadores(destino, {
    SLUG: slug,
    TITULO: titulo,
    DATA: hoje,
    VERSAO_MOTOR: versaoMotor,
  });

  // O motor entra como cópia — igual ao que o build faz.
  const destinoMotor = path.join(destino, 'engine');
  await rm(destinoMotor, { recursive: true, force: true });
  await cp(ORIGEM_MOTOR, destinoMotor, { recursive: true });
  await writeFile(
    path.join(destinoMotor, 'MOTOR-COPIA.txt'),
    `ESTA PASTA É UMA CÓPIA GERADA. NÃO EDITE NADA AQUI.\n\nMotor v${versaoMotor}\nJogo:  ${slug}\n\nPara atualizar:\n    node tools/build.mjs ${slug}\n`,
    'utf8',
  );

  console.log(`\nJogo criado: Games/${slug}\n`);
  console.log('Próximos passos:');
  console.log(`  1. node tools/serve.mjs`);
  console.log(`  2. abra http://localhost:8080/Games/${slug}/  (já deve jogar de ponta a ponta)`);
  console.log(`  3. edite Games/${slug}/src/config.js  (identidade, níveis, tutorial)`);
  console.log(`  4. escreva a mecânica em Games/${slug}/src/scenes/GameScene.js`);
  console.log(`  5. siga Games/${slug}/CHECKLIST.md até o fim`);
  console.log(`  6. node tools/verificar-independencia.mjs ${slug}\n`);
}

principal().catch((err) => {
  console.error('Falha ao criar o jogo:', err);
  process.exit(1);
});
