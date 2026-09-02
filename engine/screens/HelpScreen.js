import { Node } from '../core/Node.js';
import { Tween, Easing } from '../core/Tween.js';
import { TutorialScreen } from './TutorialScreen.js';

/**
 * HelpScreen — a AJUDA durante a partida: o tutorial, por cima do jogo.
 *
 * ## Por que camada, e não troca de tela
 *
 * Mesmo motivo do `PauseScreen`: trocar de cena destruiria o tabuleiro, o
 * placar e o tempo, e "pedir ajuda" viraria "desistir da partida". A criança que
 * não entendeu o que fazer é justamente quem não pode ser punida por perguntar.
 *
 * Então o jogo continua vivo atrás do véu, pausado, e fechar a ajuda devolve a
 * partida exatamente como estava.
 *
 * ## Por que ela HOSPEDA o `TutorialScreen` em vez de redesenhar os passos
 *
 * Porque a ajuda **é** o tutorial. Recriar aqui o cartão, a ilustração, as setas
 * e o contador daria duas definições da mesma explicação — e duas definições da
 * mesma coisa divergem: alguém conserta um passo no tutorial do menu e a ajuda
 * dentro do jogo continua ensinando o jeito antigo.
 *
 * Uma `Scene` É um `Node` (é por isso que a classe foi escrita assim), então ela
 * compõe. O que muda no modo ajuda está no próprio `TutorialScreen`: sem cenário
 * de fundo (o véu daqui já separa), e o botão do último passo volta ao jogo em
 * vez de começar uma partida nova.
 *
 * ## Uso, dentro da cena de jogo
 *
 *   this.ajuda = new HelpScreen({
 *     cena: this,
 *     aoFechar: () => { this.pausada = false; this.tempo.retomar(); },
 *   });
 *   this.adicionar(this.ajuda);
 *   // no botão:  this.pausada = true; this.tempo.pausar(); this.ajuda.abrir();
 *
 * A CONTAGEM não é assunto do jogo: `abrir()` avisa o `Game`, que soma e reporta
 * `ajuda` ao AVA. Um jogo não tem como esquecer de contar.
 */
export class HelpScreen extends Node {
  /**
   * @param {object} opcoes
   *   cena {Scene}       a cena de jogo que hospeda a ajuda — de onde saem
   *                      `game`, `audio`, `loader`, `config` e o tamanho
   *   aoFechar {Function} chamado ao voltar para o jogo (retomar o que pausou)
   */
  constructor(opcoes = {}) {
    const cena = opcoes.cena ?? null;
    super({
      largura: opcoes.largura ?? cena?.largura ?? 1280,
      altura: opcoes.altura ?? cena?.altura ?? 720,
      interativo: true,   // bloqueia toques na partida atrás da camada
      visible: false,
    });

    if (!cena) throw new Error('HelpScreen: `cena` é obrigatória');
    this.cena = cena;
    this.aoFechar = opcoes.aoFechar ?? null;

    /**
     * O tutorial, montado uma vez e reaproveitado a cada abertura.
     *
     * O contexto é o mesmo que o `Game` injeta numa cena, montado a partir da
     * cena hospedeira — assim o tutorial recebe áudio, loader e config exatamente
     * como receberia se fosse aberto pelo menu.
     */
    this.tutorial = new TutorialScreen({
      nome: 'ajuda',
      game: cena.game,
      stage: cena.stage,
      input: cena.input,
      audio: cena.audio,
      loader: cena.loader,
      storage: cena.storage,
      config: cena.config,
      largura: this.largura,
      altura: this.altura,
      // É este campo que liga o modo ajuda no TutorialScreen.
      aoFecharAjuda: () => this.fechar(),
    });
    this.tutorial.aoEntrar();
    this.adicionar(this.tutorial);
  }

  abrir() {
    this.visible = true;
    this.interativo = true;
    // Sobe ao abrir, pelo mesmo motivo do `PauseScreen`: quem recebe o toque é o
    // nó mais ao topo, e um jogo que adicione a área de gesto depois desta camada
    // enterraria os botões do tutorial — a ajuda abriria e não daria para passar
    // o passo nem voltar ao jogo. Aconteceu no Jogo das Cores.
    this.paraFrente();
    // Sempre do primeiro passo: quem pede ajuda no meio da partida quer a
    // explicação inteira, não a continuação de onde parou na vez anterior.
    this.tutorial.mostrarPasso(0);

    this.tutorial.alpha = 0;
    Tween.removerDe(this.tutorial);
    Tween.para(this.tutorial, { alpha: 1 }, 220, Easing.suaveSaida);

    // Quem conta é o motor, não o jogo. Ver `Game.registrarAjuda`.
    this.cena.game?.registrarAjuda?.();
    this.emit('abriu');
    return this;
  }

  fechar() {
    this.visible = false;
    this.interativo = false;
    // A narração do passo não sobrevive à ajuda que a produziu.
    this.cena.audio?.calar();
    this.emit('fechou');
    try {
      this.aoFechar?.();
    } catch (err) {
      console.error('[motor] aoFechar da ajuda falhou:', err);
    }
    return this;
  }

  get aberta() {
    return this.visible;
  }

  desenhar(ctx) {
    // Véu escuro, o mesmo da pausa: separa a ajuda da partida sem esconder o
    // que a criança estava fazendo.
    ctx.fillStyle = 'rgba(17, 24, 39, 0.55)';
    ctx.fillRect(0, 0, this.largura, this.altura);
  }

  contemPontoLocal(x, y) {
    return x >= 0 && y >= 0 && x <= this.largura && y <= this.altura;
  }
}
