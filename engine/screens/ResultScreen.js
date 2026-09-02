import { Scene } from '../core/Scene.js';
import { Node } from '../core/Node.js';
import { TextNode } from '../core/TextNode.js';
import { Tween, Easing } from '../core/Tween.js';
import { ESTADOS } from '../core/Estados.js';
import { Background } from '../ui/Background.js';
import { Panel } from '../ui/Panel.js';
import { Button } from '../ui/Button.js';
import { Mascot, mascoteVisivel } from '../ui/Mascot.js';
import { desenharIcone } from '../theme/icons.js';
import { cores, tipografia, espaco } from '../theme/tokens.js';

/**
 * Estrelas — a nota visual da partida, sempre em CINCO.
 *
 * Só existe na tela: **não vai para o AVA**. Quanto a partida vale em XP ou
 * nota é decisão do servidor (METODO A3), e o jogo não deve nem calcular isso.
 * As estrelas são retorno imediato para a criança, não avaliação.
 */
class Estrelas extends Node {
  /**
   * @param {number} quantidade estrelas preenchidas
   * @param {{total?: number, tamanho?: number}} opcoes
   *   `total` é quantas estrelas a fileira desenha (padrão `Estrelas.TOTAL`).
   */
  constructor(quantidade, opcoes = {}) {
    const total = Math.max(1, Math.round(opcoes.total ?? Estrelas.TOTAL));
    const tamanho = opcoes.tamanho ?? Estrelas.ALTURA_PADRAO;
    super({ largura: Estrelas.larguraDe(total, tamanho), altura: tamanho, ...opcoes });
    this.total = total;
    this.tamanho = tamanho;
    // Recorta: preenchida a mais que o total desenharia fora da fileira.
    this.quantidade = Math.max(0, Math.min(Math.round(quantidade) || 0, total));
    this._escalas = new Array(total).fill(0);
  }

  /**
   * Largura que a fileira vai ocupar. Existe porque quem centraliza precisa do
   * número ANTES de instanciar (o Node só sabe sua largura depois de criado).
   */
  static larguraDe(total, tamanho = Estrelas.ALTURA_PADRAO) {
    return tamanho * total + 12 * (total - 1);
  }

  /**
   * Lado da estrela, e portanto a altura da fileira. Público porque quem
   * centraliza o bloco "título + estrelas" precisa do número antes de instanciar.
   */
  static ALTURA_PADRAO = 76;

  /**
   * Quantas estrelas a fileira tem — **cinco, em qualquer jogo e qualquer meta**.
   *
   * Cinco porque é a escala que a criança já reconhece de fora do jogo, e fixo
   * porque uma fileira de tamanho variável obriga a ler DOIS números (quantas
   * acesas de quantas) antes de saber se foi bem. Com o total sempre igual, a
   * quantidade de ouro na tela é a mensagem inteira.
   */
  static TOTAL = 5;

  animar() {
    // O atraso encolhe conforme a fileira cresce: com 220 ms fixos, cinco
    // estrelas levariam 1,5 s para terminar de aparecer, e uma criança de 4 anos
    // já teria tocado em algum botão antes do fim da comemoração.
    const atraso = Math.min(220, 700 / this.total);
    for (let i = 0; i < this.total; i++) {
      if (i < this.quantidade) {
        const alvo = { v: 0 };
        Tween.de(alvo)
          .esperar(atraso * i)
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
    for (let i = 0; i < this.total; i++) {
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
 * Quantas das cinco estrelas este resultado acende — **um quinto da meta por
 * estrela**, sobre a pontuação que a mesma tela mostra e que vai para o AVA.
 *
 * Está separada da tela, e exportada, por um motivo prático: é a única regra da
 * `ResultScreen` que produz um NÚMERO, e um número se prova sem navegador.
 * Enquanto ela morava dentro de `aoEntrar`, a única verificação possível era
 * abrir o jogo e contar estrelas na captura.
 *
 * @param {{acertos?: number, totalPerguntas?: number}} resultado o payload do AVA
 * @returns {number} 0 a `Estrelas.TOTAL`
 */
export function estrelasDoResultado(resultado) {
  const meta = Number(resultado?.totalPerguntas) || 0;
  const pontos = Number(resultado?.acertos) || 0;
  // Sem meta declarada não há fração de meta, e inventar uma nota seria pior do
  // que não dar nenhuma: a fileira vazia ao menos não afirma nada falso.
  if (meta <= 0) return 0;
  const fracao = Math.max(0, Math.min(1, pontos / meta));
  return Math.floor(fracao * Estrelas.TOTAL);
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

    // Mesmo canteiro de obras do menu e da partida, em vez de um céu vazio.
    // A tela de resultado é a última coisa que a criança vê da atividade; com
    // céu limpo e nada mais, ela parecia pertencer a outro jogo. Com a cidade,
    // o chão e os andaimes atrás, ela fecha o lugar onde a torre foi construída.
    //
    // O céu segue distinguindo vitória de derrota — na derrota fica encoberto,
    // não cinza-morto: perder não pode parecer castigo (docs/DESIGN.md).
    this.adicionar(new Background({
      largura: L,
      altura: A,
      // Também estava cravado: a última tela da atividade voltava ao canteiro
      // de obras mesmo num jogo de outro tema.
      tema: config.tema ?? 'construcao',
      corCeuTopo: venceu ? cores.ceuProfundo : '#94A3B8',
      corCeuBase: venceu ? cores.ceu : '#CBD5E1',
      // Sol só na vitória: sol a pino com glow amarelo sobre céu encoberto era
      // uma contradição visual — o céu dizia uma coisa e a luz dizia outra.
      mostrarSol: venceu,
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

    // ----------------------------------------------------- cabeçalho + nota
    //
    // Título, estrelas e placar são UM bloco, centrado no painel. Antes o título
    // nascia colado no topo (`espaco.lg`) e o placar era ancorado em
    // `alturaPainel * 0.55` — dois pontos independentes, então mexer em um
    // desequilibrava o outro. Agora as três alturas saem de um cálculo só.
    const PASSO_TITULO = tipografia.titulo * 1.5;
    const PASSO_ESTRELAS = Estrelas.ALTURA_PADRAO + espaco.md;
    const ALTURA_BLOCO = PASSO_TITULO + PASSO_ESTRELAS + tipografia.subtitulo * 1.3;
    const yTitulo = (alturaPainel - ALTURA_BLOCO) / 2;

    painel.adicionar(new TextNode(venceu ? 'Muito bem!' : 'Quase lá!', {
      x: larguraPainel / 2,
      y: yTitulo,
      tamanho: tipografia.titulo,
      peso: tipografia.pesoForte,
      cor: venceu ? cores.acerto : cores.primaria,
      alinhamento: 'center',
    }));

    // **Cinco estrelas, sempre**, preenchidas pelo PERCENTUAL DA META que a
    // pontuação alcançou — um quinto da meta por estrela.
    //
    // Três desenhos moraram aqui, e vale registrar todos para o quarto não
    // repetir nenhum:
    //
    //  1. Eram sempre TRÊS, vindas de `ScoreSystem.estrelas`, que derivava dos
    //     erros. A fileira era o medidor de vidas com outra roupa: dava para
    //     completar a meta e ver uma estrela só.
    //  2. Passaram a ser uma por pergunta preenchida pelo ACERTO BRUTO — e aí
    //     encheram sempre. Como vencer exige acertar a meta inteira, toda
    //     vitória virava nota máxima: "5 de 5" com duas quedas pelo caminho.
    //  3. Uma por pergunta preenchida pela PONTUAÇÃO, com queda para a nota de
    //     0 a 3 acima de 6 perguntas — porque 20 estrelas não caberiam no
    //     painel. Isso deu DUAS escalas no mesmo lugar: o Jogo dos Blocos
    //     mostrava 5 estrelas e o Jogo das Formas 3, sem que nada na tela
    //     explicasse por quê, e cada jogo com meta grande tinha de calcular a
    //     própria nota (havia duas fórmulas de "0 a 3" divergentes no repo).
    //
    // Agora a fileira tem tamanho fixo e o cálculo é UM, aqui, sobre os mesmos
    // campos que a tela já mostra e que vão para o AVA — o jogo não passa mais
    // nota nenhuma. Meta 5 dá exatamente o que dava antes (um ponto = uma
    // estrela), então o piloto não muda de comportamento.
    //
    // `Math.floor` de propósito: a quinta estrela exige a meta INTEIRA. Com
    // arredondamento, 90% da meta acenderia as cinco e a tela voltaria a dizer
    // "nota máxima" para uma partida incompleta, que é o defeito que a regra
    // RE-02 existe para impedir. O preço é o outro extremo: abaixo de 20% da
    // meta a fileira fica vazia. É aceitável porque a linha de baixo diz o
    // progresso na unidade ("2 pontos"), e porque o desenho anterior era mais
    // severo — zerava abaixo de 30%.
    const pontos = Number(resultado.acertos) || 0;
    const estrelasCheias = estrelasDoResultado(resultado);

    const estrelasNode = new Estrelas(estrelasCheias, {
      total: Estrelas.TOTAL,
      x: (larguraPainel - Estrelas.larguraDe(Estrelas.TOTAL)) / 2,
      y: yTitulo + PASSO_TITULO,
    });
    painel.adicionar(estrelasNode.animar());

    // -------------------------------------------------------------- placar
    //
    // **O placar diz a UNIDADE, não uma fração.** Esta linha dizia
    // "${acertos} de ${totalPerguntas}", e no Jogo das Formas isso produzia
    // **"13 de 12"** — uma fração impossível, anunciada como conquista.
    //
    // Não era erro de conta: a pontuação pode PASSAR da meta, porque um combo
    // resolve vários blocos de uma vez e o bloco-estrela vale 2 (REGRAS do jogo,
    // seção 4.4). Vencer é *atingir* a meta, não *empatar* com ela.
    //
    // O defeito era o "de N": ele promete que N é o máximo. Onde o total é o teto
    // exato — o Jogo dos Blocos, meta 5, cinco blocos e nada mais — a fração
    // fechava; onde não é, ela mente. Dizer "13 PONTOS" é verdade nos dois casos,
    // e é o que uma criança de 4 a 7 anos entende sem precisar comparar dois
    // números.
    //
    // A meta não desaparece da vida da criança: ela é anunciada na escolha de
    // nível ("3 formas · 12 pontos") e acompanhada pela barra durante a partida.
    // No fim, o que a tela precisa fazer é comemorar o que foi feito.
    //
    // Para o AVA nada muda: `acertos`, `erros` e `totalPerguntas` seguem indo
    // inteiros e crus na mensagem. Quanto a partida vale é do servidor (METODO A3).
    //
    // `pontos` está declarado junto com o cálculo das estrelas, acima: é o mesmo
    // número alimentando as duas leituras, e separá-los era o caminho curto para
    // a fileira dizer uma coisa e a linha dizer outra.
    painel.adicionar(new TextNode(
      `${pontos} ${pontos === 1 ? 'ponto' : 'pontos'}`,
      {
        x: larguraPainel / 2,
        y: yTitulo + PASSO_TITULO + PASSO_ESTRELAS,
        tamanho: tipografia.subtitulo,
        peso: tipografia.pesoForte,
        cor: cores.tinta,
        alinhamento: 'center',
      },
    ));

    // ------------------------------------------------------------- mascote
    // Agora que há chão atrás, o mascote se apoia nele: 0.82 é a linha do
    // horizonte do `Background` no tema construção, e descontar meia altura põe
    // os pés nela. Sem isso a arte (um busto recortado na coxa) ficava flutuando
    // no céu. É o mesmo acoplamento manual já anotado para a base da torre em
    // `GameScene`: se o horizonte mudar no motor, isto precisa acompanhar.
    const tamanhoMascote = 230;
    this.mascote = mascoteVisivel(config, 'resultado') ? new Mascot({
      tamanho: tamanhoMascote,
      x: L / 2 - larguraPainel / 2 - 24,
      y: A * 0.82 - tamanhoMascote / 2,
      expressao: venceu ? 'comemorando' : 'triste',
      imagem: this.loader.imagem(config.mascote?.asset),
    }) : null;
    if (this.mascote) this.adicionar(this.mascote);

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
    // Sem `falaVitoria`/`falaDerrota` no config, a tela fica em silêncio: o
    // efeito de vitória/derrota acima já toca, e o motor não sintetiza voz.
    this.audio.falar(falaFim ?? null, {
      texto: venceu ? 'Muito bem! Você conseguiu!' : 'Quase! Vamos tentar de novo?',
    });
  }

}
