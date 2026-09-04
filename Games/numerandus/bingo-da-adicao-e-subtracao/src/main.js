/**
 * main.js — ponto de entrada do Bingo da Adição e Subtração.
 */
import { iniciarJogo } from '../engine/index.js';
import config from './config.js';
import { GameScene } from './scenes/GameScene.js';

iniciarJogo({
  canvas: '#jogo',
  config,
  cenas: {
    jogando: GameScene,
  },
}).catch((err) => {
  console.error('[bingo-da-adicao-e-subtracao] não foi possível iniciar o jogo:', err);
  const alvo = document.querySelector('#erro-fatal');
  if (alvo) {
    alvo.textContent = 'Não foi possível abrir o jogo. Recarregue a página.';
    alvo.dataset.visivel = 'sim';
  }
});
