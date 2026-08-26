import {
  Scene, Node, ScoreSystem, ScoreBar, Lives, IconButton, PauseScreen,
  Background, Tween, Easing, ESTADOS, desenharIcone, cores, espaco, rand,
} from '../../engine/index.js';

/**
 * Alvo — a estrela que aparece na tela.
 *
 * Exemplo mínimo de um objeto de jogo: um Node com desenho próprio, área de
 * toque redonda e um evento quando é acertado.
 */
class Alvo extends Node {
  constructor(opcoes = {}) {
    const tamanho = opcoes.tamanho ?? 120;
    super({ ...opcoes, largura: tamanho, altura: tamanho, interativo: true });
    this.tamanho = tamanho;
    this.regX = tamanho / 2;
    this.regY = tamanho / 2;
    this._t = 0;
  }

  atualizar(dt) {
    super.atualizar(dt);
    this._t += dt;
    // Pulsar chama a atenção sem piscar (piscar cansa e pode incomodar).
    const p = 1 + Math.sin(this._t * 3.2) * 0.06;
    this.scaleX = this.scaleY = p;
  }

  desenhar(ctx) {
    desenharIcone(ctx, 'estrela', this.tamanho, cores.atencao, 2);
  }

  contemPontoLocal(x, y) {
    const r = this.tamanho / 2;
    const dx = x - r;
    const dy = y - r;
    return dx * dx + dy * dy <= r * r;
  }
}

/**
 * GameScene — a partida.
 *
 * Este é o esqueleto que um jogo novo substitui pela sua mecânica. Ele já faz,
 * de ponta a ponta, tudo que uma partida do motor precisa fazer:
 *
 *   1. lê o nível escolhido em `this.game.dados.nivel`;
 *   2. cria um `ScoreSystem` — a fonte ÚNICA dos números da tela e do AVA;
 *   3. monta HUD (progresso, vidas, pausa);
 *   4. reage ao toque contando acerto/erro;
 *   5. ao terminar, vai para 'resultado' passando `resultado: placar.paraAva(...)`
 *      — e é isso que faz o motor registrar a partida no AVA, uma única vez.
 *
 * O passo 5 é o contrato: qualquer jogo novo precisa fazer exatamente isso.
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.placar = new ScoreSystem({
      total: this.nivel.meta ?? 5,
      nivel: this.nivel.id ?? 1,
      vidas: this.nivel.vidas ?? 3,
    });

    this.adicionar(new Background({ largura: L, altura: A }));

    // ------------------------------------------------------------------ HUD
    this.barra = new ScoreBar({ largura: 340, altura: 34, x: espaco.md, y: espaco.md })
      .acompanhar(this.placar);
    this.vidas = new Lives({ total: this.nivel.vidas ?? 3, x: L / 2 - 80, y: espaco.md })
      .acompanhar(this.placar);
    this.adicionar(this.barra, this.vidas);

    this.adicionar(new IconButton({
      icone: 'pausa',
      x: L - 96,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.pausar(),
    }));

    // ---------------------------------------------------------------- pausa
    this.pausa = new PauseScreen({
      largura: L,
      altura: A,
      audio: this.audio,
      config,
      aoContinuar: () => { this.pausada = false; },
      aoReiniciar: () => this.irPara('jogando', { nivel: this.nivel }),
      aoSair: () => this.irPara('menu'),
    });
    this.adicionar(this.pausa);

    // ----------------------------------------------------------- mecânica
    this.alvo = new Alvo({ tamanho: 130 });
    this.alvo.on('toque', () => this._acertou());
    this.adicionar(this.alvo);
    this.pausa.paraFrente(); // a camada de pausa fica sempre por cima

    // Toque que NÃO caiu no alvo conta como erro.
    this.ouvirEntrada('toque', (_ponto, no) => {
      if (this.pausada || this.placar.encerrado) return;
      if (no !== this.alvo) this._errou();
    });

    this.placar.on('vitoria', () => this._terminar(true));
    this.placar.on('derrota', () => this._terminar(false));

    this._reposicionar();
  }

  _reposicionar() {
    const margem = 140;
    this.alvo.x = rand.entre(margem, this.largura - margem);
    this.alvo.y = rand.entre(margem + 60, this.altura - margem);
    this.alvo.alpha = 0;
    Tween.removerDe(this.alvo);
    Tween.para(this.alvo, { alpha: 1 }, 180, Easing.suaveSaida);
  }

  _acertou() {
    if (this.pausada || this.placar.encerrado) return;
    if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);
    this.placar.acertar();
    if (!this.placar.encerrado) this._reposicionar();
  }

  _errou() {
    if (this.config.audio?.erro) this.audio.efeito(this.config.audio.erro);
    this.placar.errar();
  }

  pausar() {
    if (this.placar.encerrado) return;
    this.pausada = true;
    this.pausa.abrir();
  }

  /**
   * Fim de partida. É AQUI que o registro no AVA acontece: ao entrar no estado
   * 'resultado', o motor chama o AvaBridge com este objeto — uma vez só.
   *
   * **Não passe `estrelas` aqui.** A fileira da tela de resultado tem cinco e
   * quem a calcula é a própria tela, pelo percentual da meta que este payload já
   * carrega (regra RE-04 de `docs/REGRAS-EDUCACIONAIS.md`). Um jogo que calcule
   * a própria nota recria a divergência que a regra fechou: a tela dizendo um
   * número e o jogo achando outro.
   */
  _terminar(venceu) {
    this.alvo.visible = false;
    this.irPara('resultado', {
      nivel: this.nivel,
      resultado: this.placar.paraAva(venceu),
    });
  }

  atualizar(dt) {
    // A pausa precisa continuar animando mesmo com a partida congelada.
    if (this.pausada) {
      this.pausa.atualizar(dt);
      return;
    }
    super.atualizar(dt);
  }
}
