/**
 * index.js — a porta de entrada do motor.
 *
 * Um jogo importa daqui e só daqui:
 *   import { iniciarJogo, Scene, ScoreSystem } from './engine/index.js';
 *
 * Manter um ponto único de importação é o que permite reorganizar o interior do
 * motor sem tocar em nenhum jogo já publicado.
 */

// ---------------------------------------------------------------------- núcleo
export { Emitter } from './core/Emitter.js';
export { Matrix2D } from './core/Matrix2D.js';
export { Node } from './core/Node.js';
export { Sprite } from './core/Sprite.js';
export { Shape } from './core/Shape.js';
export { TextNode } from './core/TextNode.js';
export { Stage } from './core/Stage.js';
export { Input } from './core/Input.js';
export { Loader } from './core/Loader.js';
export { Storage } from './core/Storage.js';
export { Rand, rand } from './core/Rand.js';
export { Tween, Easing } from './core/Tween.js';
export { Scene } from './core/Scene.js';
export { Game } from './core/Game.js';
export { ESTADOS, TRANSICOES, transicaoValida } from './core/Estados.js';
export { Watchdog } from './core/Watchdog.js';

// ------------------------------------------------------------------------ tema
export {
  tema, cores, tipografia, espaco, raio, sombras, movimento, acessibilidade,
  aplicarTokensNoCSS, alvoAcessivel,
} from './theme/tokens.js';
export { ICONES, Icone, desenharIcone } from './theme/icons.js';
export { texto, definirCaixaAlta, estaEmCaixaAlta } from './theme/texto.js';

// -------------------------------------------------------------------- interface
export { Panel } from './ui/Panel.js';
export { Button, IconButton } from './ui/Button.js';
export { ScoreBar, TimerBar } from './ui/ScoreBar.js';
export { Lives } from './ui/Lives.js';
export { SoundToggle } from './ui/SoundToggle.js';
export { Mascot, mascoteVisivel } from './ui/Mascot.js';
export { Background } from './ui/Background.js';
export { ParticleSystem, criarEstrelaVoadora } from './ui/FX.js';

// ----------------------------------------------------------------------- telas
export { LoadingScreen } from './screens/LoadingScreen.js';
export { MenuScreen } from './screens/MenuScreen.js';
export { TutorialScreen } from './screens/TutorialScreen.js';
export { LevelSelectScreen } from './screens/LevelSelectScreen.js';
export { PauseScreen } from './screens/PauseScreen.js';
export { ResultScreen } from './screens/ResultScreen.js';

// ------------------------------------------------------------------ jogabilidade
export { ScoreSystem } from './gameplay/ScoreSystem.js';
export { GridBoard } from './gameplay/GridBoard.js';
export { CraneController } from './gameplay/CraneController.js';
export { PathSelector } from './gameplay/PathSelector.js';

// -------------------------------------------------------------------------- ava
export { AvaBridge } from './ava/AvaBridge.js';

// --------------------------------------------------------------------- áudio
export { AudioBus } from './audio/AudioBus.js';

// ------------------------------------------------------------------- bootstrap
export { iniciarJogo } from './bootstrap.js';
