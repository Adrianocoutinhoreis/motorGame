/**
 * main.js — ponto de entrada de Jogo das Cores.
 *
 * Todo o encanamento (tokens, carregamento, telas padrão, laço, AVA) está no
 * motor. Aqui só se declara o config e a cena de partida.
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
  console.error('[jogo-das-cores] não foi possível iniciar o jogo:', err);
  const alvo = document.querySelector('#erro-fatal');
  if (alvo) {
    alvo.textContent = 'Não foi possível abrir o jogo. Recarregue a página.';
    alvo.dataset.visivel = 'sim';
  }
});
