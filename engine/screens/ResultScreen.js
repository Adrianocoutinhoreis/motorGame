import { Scene } from '../core/Scene.js';
import { Node } from '../core/Node.js';
import { TextNode } from '../core/TextNode.js';
import { Tween, Easing } from '../core/Tween.js';
import { ESTADOS } from '../core/Estados.js';
import { Background } from '../ui/Background.js';
import { Panel } from '../ui/Panel.js';
import { Button } from '../ui/Button.js';
import { Mascot } from '../ui/Mascot.js';
import { desenharIcone } from '../theme/icons.js';
import { cores, tipografia, espaco } from '../theme/tokens.js';

/**
 * Estrelas — a nota visual da partida (0 a 3).
 *
 * Só existe na tela: **não vai para o AVA**. Quanto a partida vale em XP ou
 * nota é decisão do servidor (METODO A3), e o jogo não deve nem calcular isso.
 * As estrelas são retorno imediato para a criança, não avaliação.
 */
class Estrelas extends Node {
  constructor(quantidade, opcoes = {}) {
    const tamanho = opcoes.tamanho ?? 76;
    super({ largura: tamanho * 3 + 24, altura: tamanho, ...opcoes });
    this.quantidade = quantidade;
    this.tamanho = tamanho;
    this._escalas = [0, 0, 0];
  }

  animar() {
    for (let i = 0; i < 3; i++) {
      if (i < this.quantidade) {
        const alvo = { v: 0 };
        Tween.de(alvo)
          .esperar(220 * i)
          .entao({ v: 1 }, 380, Easing.costasSaida);
        this._alvos ??= [];
        this._alvos.push({ i, alvo });
      } else {
        this._escalas[i] = 1; // a vazia já aparece, em contorno
      }
    }
    return this;
  }

  atualizar(dt) {
    super.atualizar(dt);
    for (const item of this._alvos ?? []) this._escalas[item.i] = item.alvo.v;
  }

  desenhar(ctx) {
    const passo = this.tamanho + 12;
    for (let i = 0; i < 3; i++) {
      const ganha = i < this.quantidade;
      ctx.save();
      ctx.translate(i * passo + this.tamanho / 2, this.tamanho / 2);
      if (!ganha) {
        ctx.save();
        ctx.globalAlpha *= 0.35;
        ctx.translate(-this.tamanho / 2, -this.tamanho / 2);
        desenharIcone(ctx, 'estrela', this.tamanho, cores.tintaSuave, 2);
        ctx.restore();
      } else {
        const e = this._escalas[i];
        ctx.scale(e, e);
        ctx.translate(-this.tamanho / 2, -this.tamanho / 2);
        desenharIcone(ctx, 'estrela', this.tamanho, cores.atencao, 2);
      }
      ctx.restore();
    }
  }
}

/**
 * ResultScreen — fim de partida: vitória ou derrota.
 *
 * É o ponto ÚNICO de registro no AVA. O `Game` dispara o `AvaBridge` ao entrar
 * neste estado e o re-arma ao sair — o que implementa a borda de subida/descida
 * do METODO.md (B3.5): uma partida levada ao fim conta uma vez, um replay conta
 * de novo, e ficar parado nesta tela nunca duplica o registro.
 *
 * Sucede o `FeedbackSOS` dos originais (um MovieClip "Acerto"/"Erro" com
 * sim/não), com duas correções: a derrota também é reconhecida com dignidade
 * (mostra o quanto o aluno avançou, em vez de só "errou"), e "não" não fecha a
 * janela do navegador — volta ao menu, que é o que funciona dentro do iframe.
 */
export class ResultScreen extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.RESULTADO;
    const { largura: L, altura: A, config } = this;

    const resultado = this.game.dados.resultado ?? {
      acertos: 0, erros: 0, totalPerguntas: 0, nivel: 1, vitoria: false,
    };
    const venceu = !!resultado.vitoria;
    const estrelas = this.game.dados.estrelas ?? (venceu ? 1 : 0);

    this.adicionar(new Background({
      largura: L,
      altura: A,
      corCeuTopo: venceu ? cores.ceuProfundo : '#CBD5E1',
      corCeuBase: venceu ? cores.ceu : '#E2E8F0',
      mostrarColinas: false,
    }));

    // O painel precisa deixar espaço para a fileira de botões ABAIXO dele sem
    // sair da área lógica: painel + margem + botão (88) tem de caber em `A`.
    const larguraPainel = Math.min(760, L - espaco.xl * 2);
    const alturaPainel = Math.min(430, A - espaco.xl * 2 - 120);
    const painel = new Panel({
      largura: larguraPainel,
      altura: alturaPainel,
      x: (L - larguraPainel) / 2,
      y: (A - alturaPainel) / 2,
    });
    this.adicionar(painel);

    // ------------------------------------------------------------- cabeçalho
    painel.adicionar(new TextNode(venceu ? 'Muito bem!' : 'Quase lá!', {
      x: larguraPainel / 2,
      y: espaco.lg,
      tamanho: tipografia.titulo,
      peso: tipografia.pesoForte,
      cor: venceu ? cores.acerto : cores.primaria,
      alinhamento: 'center',
    }));

    const estrelasNode = new Estrelas(estrelas, {
      x: (larguraPainel - (76 * 3 + 24)) / 2,
      y: espaco.lg + tipografia.titulo * 1.5,
    });
    painel.adicionar(estrelasNode.animar());

    // ------------------------------------------------------------- números
    // Mostrados como conquista, não como boletim: "3 de 5" é progresso.
    const yNumeros = alturaPainel * 0.55;
    const total = resultado.totalPerguntas ?? 0;

    painel.adicionar(new TextNode(
      total > 0 ? `${resultado.acertos} de ${total}` : `${resultado.acertos}`,
      {
        x: larguraPainel / 2,
        y: yNumeros,
        tamanho: tipografia.subtitulo,
        peso: tipografia.pesoForte,
        cor: cores.tinta,
        alinhamento: 'center',
      },
    ));

    painel.adicionar(new TextNode(
      resultado.erros > 0
        ? `${resultado.erros} ${resultado.erros === 1 ? 'tentativa perdida' : 'tentativas perdidas'}`
        : 'sem nenhum erro!',
      {
        x: larguraPainel / 2,
        y: yNumeros + tipografia.subtitulo * 1.35,
        tamanho: tipografia.apoio,
        cor: resultado.erros > 0 ? cores.tintaSuave : cores.acerto,
        alinhamento: 'center',
      },
    ));

    // ------------------------------------------------------------- mascote
    this.mascote = new Mascot({
      tamanho: 230,
      x: L / 2 - larguraPainel / 2 - 24,
      y: A / 2 + 66,
      expressao: venceu ? 'comemorando' : 'triste',
      imagem: this.loader.imagem(config.mascote?.asset),
    });
    this.adicionar(this.mascote);

    // ------------------------------------------------------------- botões
    const niveis = config.niveis ?? [];
    const botoes = [];

    botoes.push(new Button({
      rotulo: 'JOGAR DE NOVO',
      icone: 'reiniciar',
      largura: 320,
      altura: 88,
      variante: 'primario',
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.irPara('jogando', { nivel: this.game.dados.nivel }),
    }));

    if (niveis.length > 1) {
      botoes.push(new Button({
        rotulo: 'NÍVEIS',
        largura: 220,
        altura: 88,
        variante: 'secundario',
        audio: this.audio,
        somToque: config.audio?.clique,
        aoTocar: () => this.irPara('niveis'),
      }));
    }

    botoes.push(new Button({
      rotulo: 'MENU',
      icone: 'casa',
      largura: 220,
      altura: 88,
      variante: 'suave',
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.irPara('menu'),
    }));

    const larguraTotal = botoes.reduce((s, b) => s + b.largura, 0) + (botoes.length - 1) * espaco.md;
    let cursorX = (L - larguraTotal) / 2;
    const yBotoes = (A + alturaPainel) / 2 + espaco.lg;

    for (const botao of botoes) {
      // Button ancora no centro: soma metade da largura ao posicionar.
      botao.x = cursorX + botao.largura / 2;
      botao.y = yBotoes + botao.altura / 2;
      cursorX += botao.largura + espaco.md;
      this.adicionar(botao);

      botao.alpha = 0;
      Tween.de(botao).esperar(500).entao({ alpha: 1 }, 300, Easing.suaveSaida);
    }

    // ------------------------------------------------------------- áudio
    const somFim = venceu ? config.audio?.vitoria : config.audio?.derrota;
    if (somFim) this.audio.efeito(somFim);
    const falaFim = venceu ? config.audio?.falaVitoria : config.audio?.falaDerrota;
    this.audio.falar(falaFim ?? '__fim', {
      texto: venceu ? 'Muito bem! Você conseguiu!' : 'Quase! Vamos tentar de novo?',
    });
  }

  aoSair() {
    this.audio.calar();
  }
}
