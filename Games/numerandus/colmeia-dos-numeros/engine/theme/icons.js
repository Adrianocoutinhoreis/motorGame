import { Node } from '../core/Node.js';

/**
 * icons.js — o conjunto de ícones do motor, desenhado no canvas.
 *
 * Por que ícones e não texto: no perfil 4–7 anos boa parte dos alunos ainda não
 * lê. Um botão precisa ser compreensível pelo desenho, com a palavra servindo de
 * apoio para quem já lê — e a narração cobrindo os dois casos.
 *
 * Por que desenhados em código: são caminhos vetoriais numa caixa de 24×24;
 * nítidos em qualquer escala, sem arquivo externo, sem requisição de rede — o
 * que mantém a pasta do jogo autossuficiente.
 */

/** Cada ícone é um conjunto de caminhos para preencher e/ou traçar, em 24×24. */
export const ICONES = {
  jogar: { preencher: ['M8 5v14l11-7z'] },
  pausa: { preencher: ['M6 5h4v14H6z', 'M14 5h4v14h-4z'] },
  // Interrogação num círculo, não a lâmpada de antes: "ideia" é metáfora (exige
  // inferir que luz = insight = ajuda), e para autismo/TDAH a orientação de
  // acessibilidade cognitiva (WCAG COGA) é preferir o sinal mais literal e sem
  // ambiguidade — "?" já É o símbolo universal de ajuda, sem tradução.
  tutorial: {
    tracar: ['M12 3a9 9 0 0 1 0 18a9 9 0 0 1 0 -18', 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3', 'M12 16.6v0.2'],
  },
  som: {
    preencher: ['M3 10v4h4l5 4V6L7 10z'],
    tracar: ['M15.5 9.2a4 4 0 010 5.6', 'M18.2 6.6a8 8 0 010 10.8'],
  },
  semSom: {
    preencher: ['M3 10v4h4l5 4V6L7 10z'],
    tracar: ['M16 9.5l5.5 5.5', 'M21.5 9.5L16 15'],
  },
  casa: { preencher: ['M12 3l9 8.2h-2.6V21h-4.6v-5.6h-3.6V21H5.6v-9.8H3z'] },
  reiniciar: {
    tracar: ['M19 12a7 7 0 11-2.6-5.4'],
    preencher: ['M20.4 3.2v5.2h-5.2z'],
  },
  estrela: {
    preencher: ['M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5-5.8-3.05L6.2 20.4l1.1-6.5-4.7-4.6 6.5-.95z'],
  },
  coracao: {
    preencher: ['M12 20.8S3.8 15.3 3.8 9.6A4.4 4.4 0 0112 7.2a4.4 4.4 0 018.2 2.4c0 5.7-8.2 11.2-8.2 11.2z'],
  },
  setaEsquerda: { preencher: ['M15.5 4.5L7 12l8.5 7.5z'] },
  setaDireita: { preencher: ['M8.5 4.5L17 12l-8.5 7.5z'] },
  fechar: { tracar: ['M6.5 6.5l11 11', 'M17.5 6.5l-11 11'] },
  certo: { tracar: ['M4.5 12.5l5 5 10-11'] },
  errado: { tracar: ['M6.5 6.5l11 11', 'M17.5 6.5l-11 11'] },
  pular: { preencher: ['M5 5l8 7-8 7z', 'M15 5h3v14h-3z'] },
  relogio: {
    tracar: ['M12 3a9 9 0 0 1 0 18a9 9 0 0 1 0 -18', 'M12 7v5h4.5'],
  },
};

const cacheCaminhos = new Map();

function caminho(d) {
  if (!cacheCaminhos.has(d)) cacheCaminhos.set(d, new Path2D(d));
  return cacheCaminhos.get(d);
}

/**
 * Desenha um ícone no contexto, a partir da origem (0,0), no tamanho dado.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} nome chave de ICONES
 * @param {number} tamanho lado em px lógicos
 * @param {string} cor
 * @param {number} espessura espessura do traço, em unidades de 24
 */
export function desenharIcone(ctx, nome, tamanho, cor = '#111827', espessura = 2.2) {
  const icone = ICONES[nome];
  if (!icone) {
    console.warn(`[motor] ícone "${nome}" não existe.`);
    return;
  }
  const escala = tamanho / 24;

  ctx.save();
  ctx.scale(escala, escala);
  ctx.fillStyle = cor;
  ctx.strokeStyle = cor;
  ctx.lineWidth = espessura;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const d of icone.preencher ?? []) ctx.fill(caminho(d));
  for (const d of icone.tracar ?? []) ctx.stroke(caminho(d));

  ctx.restore();
}

/** Nó pronto que desenha um ícone — para compor telas sem escrever render. */
export class Icone extends Node {
  constructor(nome, opcoes = {}) {
    super({ ...opcoes, largura: opcoes.tamanho ?? 32, altura: opcoes.tamanho ?? 32 });
    this.icone = nome;
    this.tamanho = opcoes.tamanho ?? 32;
    this.cor = opcoes.cor ?? '#111827';
    this.espessura = opcoes.espessura ?? 2.2;
  }

  desenhar(ctx) {
    desenharIcone(ctx, this.icone, this.tamanho, this.cor, this.espessura);
  }
}
