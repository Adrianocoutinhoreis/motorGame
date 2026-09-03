#!/usr/bin/env node
/**
 * build.mjs — copia o motor para dentro de cada jogo.
 *
 * Este script É a resposta ao requisito central do projeto: o motor tem uma
 * fonte única (`engine/`, onde se edita), mas cada jogo precisa ser publicável
 * SOZINHO no AVA. A solução é a cópia: `Games/<jogo>/engine/` é gerada aqui e
 * nunca editada à mão.
 *
 * A cópia leva um carimbo (`engine/version.json` + `MOTOR-COPIA.txt`) para que,
 * meses depois, seja possível saber qual versão do motor foi publicada com cada
 * jogo — e, portanto, se uma correção já chegou lá.
 *
 * Uso:
 *   node tools/build.mjs              # todos os jogos
 *   node tools/build.mjs jogo-dos-blocos
 */
import { cp, mkdir, readdir, readFile, rm, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEM_MOTOR = path.join(RAIZ, 'engine');
const PASTA_JOGOS = path.join(RAIZ, 'Games');

async function versaoDoMotor() {
  try {
    return JSON.parse(await readFile(path.join(ORIGEM_MOTOR, 'version.json'), 'utf8'));
  } catch {
    return { versao: '0.0.0', nome: 'Motor Educandus' };
  }
}

/**
 * Cada jogo direto em `Games/<pasta>/`, MAIS cada jogo dentro de uma pasta de
 * COLEÇÃO (`Games/<colecao>/<pasta>/`) — mesma descoberta de um nível de
 * `serve.mjs`/`pages-index.mjs`/`verificar-independencia.mjs`. O caminho
 * devolvido é sempre relativo a `Games/`, e é o que `copiarMotor` usa para
 * montar `Games/<caminho>/engine/`.
 */
async function listarJogos() {
  if (!existsSync(PASTA_JOGOS)) return [];
  const entradas = await readdir(PASTA_JOGOS, { withFileTypes: true });
  const jogos = [];
  for (const entrada of entradas) {
    if (!entrada.isDirectory()) continue;
    const base = path.join(PASTA_JOGOS, entrada.name);
    // Uma pasta só é um jogo se tiver index.html — evita copiar o motor para
    // dentro de pastas de apoio criadas por engano.
    if (existsSync(path.join(base, 'index.html'))) {
      jogos.push(entrada.name);
      continue;
    }
    // Sem index.html próprio: pode ser uma pasta de COLEÇÃO — olha um nível
    // a mais, em vez de avisar de cara que "não tem index.html".
    let subentradas = [];
    try {
      subentradas = await readdir(base, { withFileTypes: true });
    } catch {
      subentradas = [];
    }
    const subjogos = subentradas.filter(
      (sub) => sub.isDirectory() && existsSync(path.join(base, sub.name, 'index.html')),
    );
    if (subjogos.length > 0) {
      for (const sub of subjogos) jogos.push(`${entrada.name}/${sub.name}`);
    } else {
      console.warn(`  aviso: "${entrada.name}" não tem index.html (nem como coleção); ignorando.`);
    }
  }
  return jogos;
}

async function copiarMotor(slug, versao) {
  const destino = path.join(PASTA_JOGOS, slug, 'engine');

  // Remove antes de copiar: sem isso, um arquivo excluído do motor sobreviveria
  // para sempre dentro dos jogos já construídos.
  await rm(destino, { recursive: true, force: true });
  await mkdir(destino, { recursive: true });
  await cp(ORIGEM_MOTOR, destino, { recursive: true });

  const carimbo = [
    'ESTA PASTA É UMA CÓPIA GERADA. NÃO EDITE NADA AQUI.',
    '',
    `Motor:   ${versao.nome ?? 'Motor Educandus'} v${versao.versao}`,
    `Jogo:    ${slug}`,
    '',
    'Para alterar o motor, edite `engine/` na raiz do projeto e rode:',
    `    node tools/build.mjs ${slug}`,
    '',
    'Qualquer edição feita diretamente aqui será apagada na próxima build.',
    '',
  ].join('\n');
  await writeFile(path.join(destino, 'MOTOR-COPIA.txt'), carimbo, 'utf8');

  return destino;
}

async function contarArquivos(pasta) {
  let total = 0;
  let bytes = 0;
  const percorrer = async (dir) => {
    for (const entrada of await readdir(dir, { withFileTypes: true })) {
      const completo = path.join(dir, entrada.name);
      if (entrada.isDirectory()) await percorrer(completo);
      else {
        total++;
        bytes += (await stat(completo)).size;
      }
    }
  };
  await percorrer(pasta);
  return { total, bytes };
}

async function principal() {
  const alvo = process.argv[2];
  const versao = await versaoDoMotor();

  if (!existsSync(ORIGEM_MOTOR)) {
    console.error(`ERRO: não achei o motor em ${ORIGEM_MOTOR}`);
    process.exit(1);
  }

  const jogos = alvo ? [alvo] : await listarJogos();

  if (jogos.length === 0) {
    console.log('Nenhum jogo encontrado em Games/. Crie um com:');
    console.log('    node tools/new-game.mjs meu-jogo "Meu Jogo"');
    return;
  }

  console.log(`Motor ${versao.nome ?? ''} v${versao.versao}\n`);

  for (const slug of jogos) {
    const pastaJogo = path.join(PASTA_JOGOS, slug);
    if (!existsSync(pastaJogo)) {
      console.error(`  ERRO: jogo "${slug}" não existe em Games/.`);
      process.exitCode = 1;
      continue;
    }
    const destino = await copiarMotor(slug, versao);
    const { total, bytes } = await contarArquivos(destino);
    console.log(`  ${slug}  ->  engine/ (${total} arquivos, ${(bytes / 1024).toFixed(0)} KB)`);
  }

  console.log('\nPronto. Valide a independência antes de publicar:');
  console.log(`    node tools/verificar-independencia.mjs ${jogos[0]}`);
}

principal().catch((err) => {
  console.error('Build falhou:', err);
  process.exit(1);
});
