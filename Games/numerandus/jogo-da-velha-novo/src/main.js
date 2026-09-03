/**
 * main.js — ponto de entrada de Jogo da Velha.
 *
 * Todo o encanamento (tokens, carregamento, telas padrão, laço, AVA) está no
 * motor. Aqui só se declara o config e a cena de partida.
 */
import { iniciarJogo } from '../engine/index.js';
import config from './config.js';
import { GameScene } from './scenes/GameScene.js';
import { EscolhaCorScreen } from './scenes/EscolhaCorScreen.js';

iniciarJogo({
  canvas: '#jogo',
  config,
  cenas: {
    jogando: GameScene,
    escolhaCor: EscolhaCorScreen,
  },
}).catch((err) => {
  console.error('[jogo-da-velha-novo] não foi possível iniciar o jogo:', err);
  const alvo = document.querySelector('#erro-fatal');
  if (alvo) {
    alvo.textContent = 'Não foi possível abrir o jogo. Recarregue a página.';
    alvo.dataset.visivel = 'sim';
  }
});
