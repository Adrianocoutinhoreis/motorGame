import { IconButton } from './Button.js';
import { cores } from '../theme/tokens.js';

/**
 * SoundToggle — liga/desliga todo o som do jogo.
 *
 * Sucede o `botaoSom` dos originais, com duas diferenças que importam em sala:
 * a preferência é **lembrada** entre sessões (via Storage) e o botão reflete o
 * estado real do AudioBus, inclusive se algo mudar por fora.
 *
 * Fica num canto discreto do menu e do HUD, e não como item de menu: numa turma
 * inteira com fones ou com o som na caixa, o professor precisa alcançar isso a
 * qualquer momento, mas não é uma escolha que a criança precise fazer para jogar.
 */
export class SoundToggle extends IconButton {
  /**
   * @param {object} opcoes  precisa de `audio` (AudioBus)
   */
  constructor(opcoes = {}) {
    super({
      icone: 'som',
      tamanho: opcoes.tamanho ?? 72,
      variante: 'suave',
      ...opcoes,
    });

    this.audioBus = opcoes.audio ?? null;
    if (!this.audioBus) console.warn('[motor] SoundToggle sem AudioBus: o botão não fará nada.');

    this._sincronizar();

    this.aoTocar = () => {
      const mudo = this.audioBus?.alternarMudo();
      this._sincronizar();
      // Confirma por som que o som voltou — o único retorno possível aqui.
      if (mudo === false && this.somToque) this.audioBus.efeito(this.somToque);
    };

    // Se outra parte do jogo mudar o mudo, o ícone acompanha.
    if (this.audioBus) {
      this._desinscrever = this.audioBus.on('mudo', () => this._sincronizar());
    }
  }

  _sincronizar() {
    const mudo = this.audioBus?.mudo ?? false;
    this.icone = mudo ? 'semSom' : 'som';
    this.corTexto = mudo ? cores.tintaSuave : cores.tinta;
  }

  destruir() {
    this._desinscrever?.();
    super.destruir();
  }
}
