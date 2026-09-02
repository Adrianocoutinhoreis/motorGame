import { Scene } from '../core/Scene.js';
import { Node } from '../core/Node.js';
import { TextNode } from '../core/TextNode.js';
import { Tween, Easing } from '../core/Tween.js';
import { ESTADOS } from '../core/Estados.js';
import { Background } from '../ui/Background.js';
import { Button } from '../ui/Button.js';
import { SoundToggle } from '../ui/SoundToggle.js';
import { Mascot, mascoteVisivel } from '../ui/Mascot.js';
import { cores, tipografia, espaco, raio } from '../theme/tokens.js';
import { texto as aplicarCaixa } from '../theme/texto.js';

/**
 * PlacaTituloLimpa — a placa de título sem tema de cenário.
 *
 * Nasceu para o Jogo das Formas, e o que ela NÃO tem é a decisão de projeto:
 * **nenhum círculo, quadrado, triângulo ou retângulo como enfeite.** As quatro
 * formas são o CONTEÚDO do exercício; espalhá-las pela interface ensina a
 * criança a ignorá-las justamente onde ela precisa repará-las. Uma placa que
 * decora com o conteúdo da lição compete com a lição.
 *
 * Sobra então o que uma placa deve fazer: um painel claro, texto escuro e
 * grande, e o subtítulo numa faixa de contraste menor. Legível sobre céu claro
 * ou escuro, porque o painel é opaco e traz a própria sombra.
 */
class PlacaTituloLimpa extends Node {
  constructor(titulo, subtitulo, opcoes = {}) {
    super({ largura: 740, altura: 170, ...opcoes });
    this.titulo = titulo;
    this.subtitulo = subtitulo;
    this.regX = 370;
    this.regY = 85;
  }

  desenhar(ctx) {
    const l = this.largura;
    const a = this.altura;
    const alturaPainel = a * 0.78;

    ctx.save();

    // Painel: branco quente, canto generoso, sombra de cartão.
    ctx.save();
    ctx.shadowColor = 'rgba(15, 23, 42, 0.28)';
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = cores.superficie;
    ctx.beginPath();
    ctx.roundRect(0, 0, l, alturaPainel, raio.lg);
    ctx.fill();
    ctx.restore();

    // Fio de luz no topo: dá espessura ao painel sem virar moldura.
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(raio.lg, 2);
    ctx.lineTo(l - raio.lg, 2);
    ctx.stroke();

    // Título
    const txtTitulo = aplicarCaixa(this.titulo);
    ctx.font = `${tipografia.pesoForte} 50px ${tipografia.familia}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = cores.tinta;
    ctx.fillText(txtTitulo, l / 2, alturaPainel * 0.40);

    // Subtítulo, numa faixa discreta
    if (this.subtitulo) {
      const txtSub = aplicarCaixa(this.subtitulo);
      const bh = 40;
      const by = alturaPainel * 0.62;

      ctx.font = `${tipografia.pesoForte} 20px ${tipografia.familia}`;
      const bw = Math.min(l * 0.86, ctx.measureText(txtSub).width + espaco.xl);
      const bx = (l - bw) / 2;

      ctx.fillStyle = cores.superficieSuave;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, raio.sm);
      ctx.fill();

      ctx.fillStyle = cores.tintaSuave;
      ctx.fillText(txtSub, l / 2, by + bh / 2 + 1);
    }

    ctx.restore();
  }
}

/**
 * PlacaTituloMadeira — Placa estilizada de madeira 3D para a capa do jogo.
 */
class PlacaTituloMadeira extends Node {
  constructor(titulo, subtitulo, opcoes = {}) {
    super({ largura: 740, altura: 170, ...opcoes });
    this.titulo = titulo;
    this.subtitulo = subtitulo;
    this.regX = 370;
    this.regY = 85;
  }

  desenhar(ctx) {
    const l = this.largura;
    const a = this.altura;

    ctx.save();

    // Sombras da placa
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 6;

    // Placa de Madeira Principal em degradê rico
    const grad = ctx.createLinearGradient(0, 0, 0, a * 0.72);
    grad.addColorStop(0, '#B45309');
    grad.addColorStop(0.5, '#92400E');
    grad.addColorStop(1, '#78350F');

    ctx.fillStyle = grad;
    ctx.strokeStyle = '#451A03';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a * 0.72, 16);
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = 'transparent';

    // Borda/Chanfro interno da placa
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(8, 8, l - 16, a * 0.72 - 16, 12);
    ctx.stroke();

    // Parafusos metálicos nos cantos
    ctx.fillStyle = '#CBD5E1';
    [ [18, 18], [l - 18, 18], [18, a * 0.72 - 18], [l - 18, a * 0.72 - 18] ].forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#475569';
      ctx.fillRect(cx - 3, cy - 1, 6, 2);
      ctx.fillStyle = '#CBD5E1';
    });

    // Título principal 3D em CAIXA ALTA (RE-01)
    const txtTitulo = aplicarCaixa(this.titulo);
    ctx.font = `${tipografia.pesoForte} 50px ${tipografia.familia}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Sombra projetada do texto
    ctx.fillStyle = '#451A03';
    ctx.fillText(txtTitulo, l / 2 + 3, a * 0.36 + 3);

    // Texto 3D gradiente amarelo ensolarado
    ctx.fillStyle = '#FEF08A';
    ctx.fillText(txtTitulo, l / 2, a * 0.36);

    // Faixa/Banner de subtítulo em CAIXA ALTA
    if (this.subtitulo) {
      const txtSub = aplicarCaixa(this.subtitulo);
      const bw = l * 0.78;
      const bh = 38;
      const bx = (l - bw) / 2;
      const by = a * 0.65;

      ctx.fillStyle = '#FACC15';
      ctx.strokeStyle = '#CA8A04';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#78350F';
      ctx.font = `${tipografia.pesoForte} 20px ${tipografia.familia}`;
      ctx.fillText(txtSub, l / 2, by + bh / 2 + 1);
    }

    ctx.restore();
  }
}

/**
 * MenuScreen — a capa do jogo: JOGAR e TUTORIAL.
 */
export class MenuScreen extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.MENU;
    const { largura: L, altura: A, config } = this;

    // O tema vem do jogo. Estava cravado em 'construcao' aqui, então o
    // `config.tema` — que o Tutorial e a Seleção de Níveis já respeitavam — era
    // silenciosamente ignorado no menu: uma opção documentada que não funcionava.
    this.adicionar(new Background({ largura: L, altura: A, tema: config.tema ?? 'construcao' }));

    // ---------------------------------------------------------------- título
    // A placa segue o tema, e não uma chave própria: tema É a linguagem visual
    // do jogo, e placa de madeira com parafusos é vocabulário de canteiro de
    // obras. Quem não declara tema continua com a de madeira, como o piloto.
    const Placa = (config.tema === 'formas') ? PlacaTituloLimpa : PlacaTituloMadeira;
    this.placaTitulo = new Placa(
      config.titulo ?? 'JOGO DOS BLOCOS',
      config.subtitulo ?? 'EMPILHE OS BLOCOS NA ORDEM CERTA!',
      { x: L / 2, y: A * 0.16 },
    );
    this.adicionar(this.placaTitulo);

    // --------------------------------------------------------------- mascote
    //
    // O mascote é CRIADO aqui, junto do resto do layout, mas só entra na cena
    // depois dos botões (ver o final deste método). O motor pinta na ordem em
    // que os nós são adicionados, e a caixa do mascote invade 12 px a do botão
    // JOGAR — adicionado antes, o botão cortava a mão dele.
    // `tamanho` é a ALTURA; a largura sai da proporção da arte. `bob.webp` é
    // 1760×2000 (proporção 0.88), então 550 de altura dá 484 de largura.
    //
    // Os números vêm de medir a arte, não de tentativa e erro. Dentro da imagem:
    // a cabeça começa a 4,3% da altura, o corpo ocupa de 6% a 57% da largura e a
    // mão estendida vai de 71% a 97%. Com altura 550 e centro em (233, 455):
    //
    //   · a borda esquerda cai em -9, e os 9 px que saem do palco são
    //     transparentes (o corpo só começa em 6% da imagem, ou seja, em x ≈ 20);
    //   · a cabeça começa em y ≈ 195, quase exatamente como na referência;
    //   · o rodapé fica em 730, 10 px além do palco — a arte JÁ vem recortada na
    //     coxa, então basta apoiá-la no fim da tela para ter o corte da referência;
    //   · a mão cai em x 335–460 e y 436–540, invadindo o botão COMO JOGAR — que
    //     é onde ela está na referência.
    this.mascote = mascoteVisivel(config, 'menu') ? new Mascot({
      tamanho: 550,
      x: L * 0.182,
      y: A * 0.632,
      expressao: 'feliz',
      imagem: this.loader.imagem(config.mascote?.asset),
    }) : null;

    // ---------------------------------------------------------------- botões
    //
    // Centralizados no eixo da tela, alinhados com a placa do título.
    //
    // O `- larguraBotao / 2` não é decoração: no CONSTRUTOR do Button, o `x` é a
    // borda ESQUERDA, não o centro (`Button.js` põe `regX = largura / 2` e depois
    // soma `largura / 2` ao `x`, e as duas coisas se cancelam). `TutorialScreen`
    // e `ResultScreen` já compensavam assim; este menu era o único que não, e
    // era por isso que os botões pareciam empurrados para a direita.
    //
    // Resultado: o grupo ocupa de 370 a 910 num palco de 1280, centro em 640.
    //
    // A largura foi de 390 para 540 (30% → 42% da tela) e a altura de 104 para
    // 156, seguindo a referência. Os alvos ficam bem acima do mínimo de 64 px
    // que o `Button` garante — e para uma criança de 4 anos, alvo grande é
    // acerto na primeira tentativa, não desperdício de espaço.
    //
    // A mão do mascote (que termina em ~445) invade a borda esquerda dos botões.
    // É intencional e é assim na referência: o mascote entra na cena por último,
    // então a mão passa NA FRENTE, e o hit-test ignora nós não interativos, então
    // o toque ali continua acionando o botão (há teste para isso).
    const larguraBotao = 540;
    const xBotoes = L / 2 - larguraBotao / 2;

    this.botaoJogar = new Button({
      rotulo: 'JOGAR',
      icone: 'jogar',
      largura: larguraBotao,
      altura: 156,
      tamanhoTexto: tipografia.gigante,
      variante: 'sucesso', // Verde Educativo Vibrante
      pulse: true,
      x: xBotoes,
      y: A * 0.364,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this._jogar(),
    });

    this.botaoTutorial = new Button({
      rotulo: 'COMO JOGAR',
      icone: 'tutorial',
      largura: larguraBotao,
      altura: 136,
      tamanhoTexto: tipografia.titulo,
      variante: 'dourado', // Amarelo/Dourado Educativo
      x: xBotoes,
      // 0.644 e não 0.618: o Button ocupa ~19 px ABAIXO da altura declarada (a
      // aba 3D de relevo em +8 e a sombra em +5 com desfoque 12). Espaçar pela
      // altura nominal fazia os dois botões se encostarem na tela, mesmo com a
      // conta "certa" no papel.
      y: A * 0.644,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.irPara('tutorial', { voltarPara: 'menu' }),
    });

    this.adicionar(this.botaoJogar, this.botaoTutorial);

    // O mascote entra por ÚLTIMO, então a mão dele passa NA FRENTE da borda do
    // botão em vez de ser cortada por ela. O toque continua funcionando: o
    // hit-test do Input percorre os nós de cima para baixo, e o mascote não é
    // interativo, então ele não intercepta o toque no botão que está atrás.
    if (this.mascote) this.adicionar(this.mascote);

    // Entrada animada
    for (const [i, botao] of [this.botaoJogar, this.botaoTutorial].entries()) {
      const alvoY = botao.y;
      botao.y = alvoY + 60;
      botao.alpha = 0;
      Tween.de(botao)
        .esperar(120 * i)
        .entao({ y: alvoY, alpha: 1 }, 420, Easing.costasSaida);
    }

    // --------------------------------------------------------------- som
    this.adicionar(new SoundToggle({
      audio: this.audio,
      x: L - 96,
      y: espaco.md,
      tamanho: 72,
      somToque: config.audio?.clique,
    }));

    // ------------------------------------------------------- áudio e narração
    // A música NÃO é pedida aqui: quem a comanda é o Game, no primeiro gesto.
    // Ver o construtor dele.
    if (config.audio?.abertura) {
      this.audio.falar(config.audio.abertura, { texto: config.titulo });
    }
  }

  _jogar() {
    const niveis = this.config.niveis ?? [];
    if (niveis.length > 1) {
      this.irPara('niveis');
    } else {
      this.irPara('jogando', { nivel: niveis[0] ?? { id: 1 } });
    }
  }

}
