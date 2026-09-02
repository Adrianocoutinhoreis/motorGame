import { Emitter } from './Emitter.js';
import { Stage } from './Stage.js';
import { Input } from './Input.js';
import { Loader } from './Loader.js';
import { Storage } from './Storage.js';
import { Tween } from './Tween.js';
import { AudioBus } from '../audio/AudioBus.js';
import { AvaBridge } from '../ava/AvaBridge.js';
import { ESTADOS, transicaoValida } from './Estados.js';

/**
 * Game — o orquestrador. Um jogo instancia isto e registra suas cenas.
 *
 * Junta Stage + Input + AudioBus + Loader + Storage + AvaBridge e roda o laço
 * principal. Três coisas que os jogos originais não faziam e que estão aqui:
 *
 * 1. **Tempo por delta.** O `setInterval(atualizaTempo, 1000)` dos originais
 *    continuava correndo com a aba em segundo plano — o aluno voltava e já
 *    tinha perdido. Aqui o laço é rAF, pausa sozinho e o `dt` é limitado.
 * 2. **Troca de cena de verdade.** Nada de esconder `MovieClip` e limpar array
 *    na mão: a cena sai, seus nós somem e seus ouvintes são desfeitos.
 * 3. **Registro no AVA** por um único ponto (entrada em RESULTADO).
 */
export class Game extends Emitter {
  /**
   * @param {object} opcoes
   *   canvas: HTMLCanvasElement
   *   config: objeto de configuração do jogo (src/config.js)
   *   cenas: { [nome]: classe de Scene }
   *   cenaInicial: nome da cena a abrir depois do carregamento
   */
  constructor(opcoes = {}) {
    super();
    this.config = opcoes.config ?? {};
    this.cenas = new Map(Object.entries(opcoes.cenas ?? {}));
    this.cenaInicial = opcoes.cenaInicial ?? 'menu';

    this.stage = new Stage(opcoes.canvas, {
      larguraLogica: this.config.largura ?? 1280,
      alturaLogica: this.config.altura ?? 720,
      corFundo: this.config.corLetterbox ?? '#0B1220',
    });
    this.input = new Input(this.stage);
    this.loader = new Loader();
    this.storage = new Storage(this.config.slug ?? 'motor');
    this.audio = new AudioBus({ storage: this.storage });
    this.ava = new AvaBridge({
      jogo: this.config.slug,
      registrarDerrota: this.config.registrarDerrota ?? true,
    });

    /** @type {import('./Scene.js').Scene|null} */
    this.cena = null;
    this.nomeCena = null;
    this.estado = ESTADOS.BOOT;
    this.rodando = false;
    this._ultimoTempo = 0;
    this._quadro = 0;
    /** Dados passados de uma cena para a próxima (nível escolhido, resultado…). */
    this.dados = {};

    this._aoMudarVisibilidade = () => {
      if (document.hidden) this.pausarLaco();
      else this.retomarLaco();
    };
    document.addEventListener('visibilitychange', this._aoMudarVisibilidade);

    // O áudio só pode começar depois de um gesto do usuário (política dos
    // navegadores). Sem isto, a narração dos jogos originais simplesmente não
    // toca em Chrome/Safari modernos.
    this.input.on('apertar', () => this.audio.destravar());
  }

  /** Registra ou substitui uma cena. */
  registrarCena(nome, classe) {
    this.cenas.set(nome, classe);
    return this;
  }

  /** Contexto injetado em cada cena. */
  _contexto(nome) {
    return {
      nome,
      game: this,
      stage: this.stage,
      input: this.input,
      audio: this.audio,
      loader: this.loader,
      storage: this.storage,
      config: this.config,
      largura: this.stage.larguraLogica,
      altura: this.stage.alturaLogica,
    };
  }

  /**
   * Troca de cena. Assíncrono porque a cena nova pode precisar pré-carregar.
   * @param {string} nome
   * @param {object} dados repassados à cena nova via `this.dados`
   */
  async irPara(nome, dados = {}) {
    const Classe = this.cenas.get(nome);
    if (!Classe) {
      console.error(`[motor] cena "${nome}" não registrada. Cenas: ${[...this.cenas.keys()].join(', ')}`);
      return;
    }

    // Evita reentrância: dois botões clicados no mesmo quadro trocariam duas vezes.
    if (this._trocando) return;
    this._trocando = true;

    try {
      this.dados = { ...this.dados, ...dados };

      if (this.cena) {
        this.stage.raiz.remover(this.cena);
        this.cena._desmontar();
        this.cena = null;
        // A cena que sai leva o cenário dela; deixar o ponteiro vivo faria o
        // `Stage` pintar as barras com um nó já desmontado.
        this.stage.sangria = null;
      }
      // Tweens da cena anterior não podem sobreviver à troca.
      Tween.removerTodos();

      const cena = new Classe(this._contexto(nome));
      this.cena = cena;
      this.nomeCena = nome;

      await cena.preload();
      cena.aoEntrar();
      this.stage.raiz.adicionar(cena);

      // Quem cobre as barras do letterbox é o cenário desta cena.
      //
      // Achado por CAPACIDADE (`pintarSangria`) e não por tipo: assim o motor
      // não importa `ui/Background` dentro do `core`, e um jogo pode oferecer o
      // próprio cenário sem herdar dele. Só entre os filhos diretos, porque
      // cenário que não é o primeiro plano da cena não é cenário.
      this.stage.sangria = cena.filhos.find((f) => typeof f.pintarSangria === 'function') ?? null;

      this._definirEstado(cena.estado ?? nome);
      this.emit('cena', nome, cena);
    } catch (err) {
      console.error(`[motor] falha ao entrar na cena "${nome}":`, err);
    } finally {
      this._trocando = false;
    }
  }

  /**
   * Muda o estado lógico e aciona o contrato do AVA nas bordas de RESULTADO.
   * Este é o único lugar do motor que fala com o AvaBridge.
   */
  _definirEstado(novo) {
    const anterior = this.estado;
    if (novo === anterior) return;

    if (!transicaoValida(anterior, novo)) {
      // Não bloqueia (um jogo pode ter um fluxo legítimo fora do padrão), mas
      // avisa alto: transição inesperada costuma ser bug de navegação.
      console.warn(`[motor] transição de estado incomum: ${anterior} → ${novo}`);
    }

    this.estado = novo;
    this.emit('estado', novo, anterior);

    if (novo === ESTADOS.RESULTADO) {
      // Borda de SUBIDA: fim de uma partida → registra uma vez.
      this.ava.concluir(this.dados.resultado ?? null);
    } else if (anterior === ESTADOS.RESULTADO) {
      // Borda de DESCIDA: saiu do resultado → re-arma para a próxima partida.
      this.ava.rearmar();
    }
  }

  /** Inicia o laço principal. */
  iniciar() {
    if (this.rodando) return this;
    this.rodando = true;
    this._ultimoTempo = performance.now();
    this._laco = (agora) => {
      if (!this.rodando) return;
      // Limita o dt: uma aba que volta do segundo plano entregaria um salto de
      // vários segundos e teleportaria tudo que está animando.
      const dt = Math.min((agora - this._ultimoTempo) / 1000, 0.1);
      this._ultimoTempo = agora;
      this._quadro++;

      // Animações e cena em blocos SEPARADOS, e isso não é estilo.
      //
      // Estava tudo num `try` só, e a consequência era grave: uma exceção nos
      // tweens pulava `stage.atualizar(dt)` no mesmo quadro. Como um tween
      // quebrado costuma quebrar todo quadro, a cena parava de atualizar para
      // sempre — inclusive o `Watchdog`, que é justamente quem deveria perceber
      // a jogada travada. A rede de segurança morria junto com o que ela vigia.
      try {
        Tween.atualizarTodos(dt);
      } catch (err) {
        console.error('[motor] erro nos tweens:', err);
      }

      try {
        this.stage.atualizar(dt);
        this.emit('quadro', dt, this._quadro);
      } catch (err) {
        console.error('[motor] erro no update da cena:', err);
      }

      try {
        this.stage.renderizar();
      } catch (err) {
        console.error('[motor] erro no render:', err);
      }

      this._id = requestAnimationFrame(this._laco);
    };
    this._id = requestAnimationFrame(this._laco);
    return this;
  }

  pausarLaco() {
    if (!this.rodando) return;
    this.rodando = false;
    cancelAnimationFrame(this._id);
    this.audio.pausarTudo();
    this.emit('lacoPausado');
  }

  retomarLaco() {
    if (this.rodando) return;
    this.rodando = true;
    this._ultimoTempo = performance.now();
    this._id = requestAnimationFrame(this._laco);
    this.audio.retomarTudo();
    this.emit('lacoRetomado');
  }

  destruir() {
    this.pausarLaco();
    document.removeEventListener('visibilitychange', this._aoMudarVisibilidade);
    this.cena?._desmontar();
    this.input.destruir();
    this.stage.destruir();
    this.audio.destruir();
    this.offAll();
  }
}
