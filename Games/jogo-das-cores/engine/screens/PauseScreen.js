import { Node } from '../core/Node.js';
import { TextNode } from '../core/TextNode.js';
import { Tween, Easing } from '../core/Tween.js';
import { Panel } from '../ui/Panel.js';
import { Button } from '../ui/Button.js';
import { SoundToggle } from '../ui/SoundToggle.js';
import { cores, tipografia, espaco } from '../theme/tokens.js';

/**
 * PauseScreen — a pausa, como CAMADA sobre a partida (não como cena).
 *
 * A distinção é deliberada: trocar de cena destruiria o tabuleiro, a torre e o
 * placar, e "pausar" viraria "desistir". Então a pausa é um `Node` que a cena
 * de jogo adiciona por cima de si mesma, congelando a lógica sem descartar
 * nada.
 *
 * Não existia nos jogos originais — o aluno que precisasse parar só tinha a
 * opção de perder. Numa aula com interrupção constante (professor falando,
 * troca de atividade), isso é uma falha de uso, não um detalhe.
 *
 * Uso, dentro da cena de jogo:
 *   this.pausa = new PauseScreen({ ...contexto, aoContinuar, aoReiniciar, aoSair });
 *   this.adicionar(this.pausa);
 *   this.pausa.abrir();
 */
export class PauseScreen extends Node {
  constructor(opcoes = {}) {
    super({
      largura: opcoes.largura ?? 1280,
      altura: opcoes.altura ?? 720,
      interativo: true,     // bloqueia toques na partida atrás da camada
      visible: false,
    });

    this.audio = opcoes.audio ?? null;
    this.config = opcoes.config ?? {};
    this.aoContinuar = opcoes.aoContinuar ?? null;
    this.aoReiniciar = opcoes.aoReiniciar ?? null;
    this.aoSair = opcoes.aoSair ?? null;

    const L = this.largura;
    const A = this.altura;
    const larguraPainel = Math.min(560, L - espaco.xl * 2);
    const alturaPainel = 440;

    this.painel = new Panel({
      largura: larguraPainel,
      altura: alturaPainel,
      x: (L - larguraPainel) / 2,
      y: (A - alturaPainel) / 2,
    });
    this.adicionar(this.painel);

    this.painel.adicionar(new TextNode('Pausa', {
      x: larguraPainel / 2,
      y: espaco.lg,
      tamanho: tipografia.titulo,
      peso: tipografia.pesoForte,
      cor: cores.tinta,
      alinhamento: 'center',
    }));

    const largBotao = larguraPainel - espaco.xl * 2;
    const opcoesBotoes = [
      { rotulo: 'CONTINUAR', icone: 'jogar', variante: 'primario', acao: () => this.fechar(true) },
      { rotulo: 'COMEÇAR DE NOVO', icone: 'reiniciar', variante: 'secundario', acao: () => this._chamar(this.aoReiniciar) },
      { rotulo: 'SAIR', icone: 'casa', variante: 'suave', acao: () => this._chamar(this.aoSair) },
    ];

    opcoesBotoes.forEach((def, i) => {
      const botao = new Button({
        rotulo: def.rotulo,
        icone: def.icone,
        variante: def.variante,
        largura: largBotao,
        altura: 84,
        tamanhoTexto: tipografia.corpo,
        x: espaco.xl,
        y: 120 + i * 100,
        audio: this.audio,
        somToque: this.config.audio?.clique,
        aoTocar: def.acao,
      });
      this.painel.adicionar(botao);
    });

    this.painel.adicionar(new SoundToggle({
      audio: this.audio,
      x: larguraPainel - 80,
      y: 8,
      tamanho: 64,
      somToque: this.config.audio?.clique,
    }));
  }

  _chamar(fn) {
    this.fechar(false);
    try {
      fn?.();
    } catch (err) {
      console.error('[motor] ação da pausa falhou:', err);
    }
  }

  abrir() {
    this.visible = true;
    this.interativo = true;
    // A camada SOBE ao abrir, e isto não é enfeite visual: a ordem dos filhos é
    // quem decide o toque, porque o `Input` procura de cima para baixo. Uma cena
    // que adicione qualquer nó interativo DEPOIS da pausa — a área de gesto do
    // Jogo das Cores foi o caso real — enterra estes botões, e o resultado é a
    // pausa que abre e não fecha: a criança fica presa e precisa recarregar a
    // página. Subir aqui torna a ordem de montagem do jogo irrelevante.
    this.paraFrente();
    this.painel.scaleX = this.painel.scaleY = 0.9;
    Tween.removerDe(this.painel);
    Tween.para(this.painel, { scaleX: 1, scaleY: 1 }, 240, Easing.costasSaida);
    this.audio?.calar();
    this.emit('abriu');
    return this;
  }

  fechar(continuar = true) {
    this.visible = false;
    this.interativo = false;
    this.emit('fechou', continuar);
    if (continuar) this._chamarContinuar();
    return this;
  }

  _chamarContinuar() {
    try {
      this.aoContinuar?.();
    } catch (err) {
      console.error('[motor] aoContinuar da pausa falhou:', err);
    }
  }

  get aberta() {
    return this.visible;
  }

  desenhar(ctx) {
    // Véu escuro: separa a pausa da partida sem esconder o que estava fazendo.
    ctx.fillStyle = 'rgba(17, 24, 39, 0.55)';
    ctx.fillRect(0, 0, this.largura, this.altura);
  }

  contemPontoLocal(x, y) {
    return x >= 0 && y >= 0 && x <= this.largura && y <= this.altura;
  }
}
