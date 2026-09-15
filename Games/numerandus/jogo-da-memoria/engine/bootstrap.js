import { Game } from './core/Game.js';
import { Scene } from './core/Scene.js';
import { LoadingScreen } from './screens/LoadingScreen.js';
import { MenuScreen } from './screens/MenuScreen.js';
import { TutorialScreen } from './screens/TutorialScreen.js';
import { LevelSelectScreen } from './screens/LevelSelectScreen.js';
import { ResultScreen } from './screens/ResultScreen.js';
import { aplicarTokensNoCSS } from './theme/tokens.js';
import { definirCaixaAlta } from './theme/texto.js';
import { ESTADOS } from './core/Estados.js';

/**
 * bootstrap — a partida de largada de qualquer jogo do motor.
 *
 * Um jogo novo só precisa de: um `config`, uma cena de partida, e uma chamada a
 * `iniciarJogo(...)`. Todo o resto — tokens no CSS, tela de carregamento,
 * pré-carga dos assets, registro das telas padrão (menu, tutorial, níveis,
 * resultado), laço principal e ponte com o AVA — acontece aqui.
 *
 * É o que faz "criar um jogo novo" ser preencher um formulário e escrever a
 * mecânica, em vez de repetir 200 linhas de encanamento como nos originais,
 * onde cada jogo reimplementava carregamento, som e telas do zero.
 */

/**
 * @param {object} opcoes
 *   config {object}          o `src/config.js` do jogo
 *   cenas {object}           { jogando: ClasseDaCena, ...sobrescritas }
 *   canvas {string|Element}  seletor ou elemento do canvas (padrão '#jogo')
 *   aoPronto {Function}      chamado com a instância de Game
 * @returns {Promise<Game>}
 */
export async function iniciarJogo(opcoes = {}) {
  const config = opcoes.config ?? {};

  aplicarTokensNoCSS();
  garantirAvisoOrientacao();

  // Regra RE-01 (docs/REGRAS-EDUCACIONAIS.md): em jogos para 4–7 anos, todo
  // texto exibido vai em caixa alta, porque nessa faixa a criança lê letra
  // bastão maiúscula. Fica no config para um jogo voltado a leitores fluentes
  // poder desligar.
  definirCaixaAlta(config.textoEmCaixaAlta ?? true);

  const carregando = new LoadingScreen(opcoes.seletorCarregando ?? '#carregando');
  carregando.definirTitulo(config.titulo ?? 'Carregando…').mostrar();

  const canvas = typeof opcoes.canvas === 'string'
    ? document.querySelector(opcoes.canvas)
    : (opcoes.canvas ?? document.querySelector('#jogo'));

  if (!canvas) {
    carregando.falhar('Não encontrei o canvas do jogo.');
    throw new Error('[motor] canvas não encontrado');
  }

  // As telas padrão vêm de graça; o jogo só precisa fornecer `jogando`, e pode
  // sobrescrever qualquer uma se tiver motivo.
  const cenas = {
    menu: MenuScreen,
    tutorial: TutorialScreen,
    niveis: LevelSelectScreen,
    resultado: ResultScreen,
    ...(opcoes.cenas ?? {}),
  };

  if (!cenas.jogando) {
    carregando.falhar('Este jogo não declarou a cena de partida ("jogando").');
    throw new Error('[motor] cena "jogando" ausente em iniciarJogo({ cenas })');
  }

  const game = new Game({ canvas, config, cenas });

  // Marca o estado de carregamento antes de baixar os assets. Sem isto o jogo
  // saltaria de BOOT direto para MENU — uma transição fora da tabela de
  // `Estados.js`, que o próprio motor denuncia no console (e com razão: quem
  // depurar o fluxo precisa ver a fase de carregamento no histórico de estados).
  game._definirEstado(ESTADOS.CARREGANDO);

  carregando.acompanhar(game.loader);

  const manifesto = config.assets ?? [];
  try {
    await game.loader.carregar(manifesto);
  } catch (err) {
    console.error('[motor] carregamento falhou:', err);
  }

  game.audio.registrarDoLoader(game.loader);

  // Falhar em alguns assets não impede o jogo de abrir: o Loader já avisou no
  // console e, onde faltar narração, a tela fica em silêncio com o AudioBus
  // dizendo qual gravação falta. O motor não substitui arquivo por voz sintética.
  if (game.loader.falhas.length > 0) {
    console.warn(`[motor] ${game.loader.falhas.length} recurso(s) não carregaram; abrindo assim mesmo.`);
  }

  carregando.definirProgresso(1).esconder();

  await game.irPara(opcoes.cenaInicial ?? 'menu');
  game.iniciar();

  // Exposto para depuração no console do navegador — e é assim que se inspeciona
  // o estado ao validar a instrumentação do AVA.
  window.jogo = game;

  opcoes.aoPronto?.(game);
  return game;
}

export { Game, Scene };

/**
 * Injeta a dica "gire o aparelho", uma vez por página.
 *
 * Quem decide QUANDO ela aparece é o CSS (`tokens.css`, mesma condição que gira
 * o `#palco`), não este código: manter a condição num só lugar evita a dica e o
 * giro discordarem. O texto diz "aparelho", e não "celular", porque a mesma
 * regra vale para tablet.
 *
 * **Vai no `<body>`, FORA do `#palco`, e isso é o ponto todo.** O `#palco` é o
 * que gira; um filho dele giraria também, e a dica ficaria legível só depois de
 * o aparelho ser virado — pediria o que já foi feito. Fora do palco ela fica em
 * pé em relação à mão que segura o aparelho, que é a única orientação em que
 * "gire" quer dizer alguma coisa.
 *
 * Pendência conhecida: a dica não é narrada, e o público não lê. Hoje quem
 * comunica é o ícone girando. Narrar exige gravação — o motor não sintetiza voz
 * (ver o A-GRAVAR.md do jogo).
 */
function garantirAvisoOrientacao() {
  if (typeof document === 'undefined' || document.querySelector('#aviso-orientacao')) return;
  const casa = document.body;
  if (!casa) return;

  const div = document.createElement('div');
  div.id = 'aviso-orientacao';
  // É um recado de estado, não um alerta: `status` é anunciado sem interromper.
  div.setAttribute('role', 'status');
  div.innerHTML = `
    <svg class="icone-celular" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <path d="M12 18h.01"></path>
    </svg>
    <p class="texto">GIRE O APARELHO</p>
  `;
  casa.appendChild(div);
}

