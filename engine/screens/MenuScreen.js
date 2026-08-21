import { Scene } from '../core/Scene.js';
import { Node } from '../core/Node.js';
import { TextNode } from '../core/TextNode.js';
import { Tween, Easing } from '../core/Tween.js';
import { ESTADOS } from '../core/Estados.js';
import { Background } from '../ui/Background.js';
import { Button } from '../ui/Button.js';
import { SoundToggle } from '../ui/SoundToggle.js';
import { Mascot } from '../ui/Mascot.js';
import { cores, tipografia, espaco } from '../theme/tokens.js';
import { texto as aplicarCaixa } from '../theme/texto.js';

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
      ctx.font = `${tipografia.pesoForte} 17px ${tipografia.familia}`;
      ctx.fillText(txtSub, l / 2, by + bh / 2 + 1);
    }

    ctx.restore();
  }
}

/**
 * BlocosDecorativos — Pilhas de brinquedos de madeira na entrada.
 */
class BlocosDecorativos extends Node {
  desenhar(ctx) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    // Bloco 1 (Base Vermelha)
    ctx.fillStyle = '#EF4444'; ctx.beginPath(); ctx.roundRect(10, 20, 46, 46, 6); ctx.fill();
    ctx.strokeStyle = '#991B1B'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#FFFFFF'; ctx.font = '800 24px system-ui'; ctx.textAlign = 'center'; ctx.fillText('1', 33, 50);

    // Bloco 2 (Topo Amarelo)
    ctx.fillStyle = '#FACC15'; ctx.beginPath(); ctx.roundRect(34, -22, 46, 46, 6); ctx.fill();
    ctx.strokeStyle = '#854D0E'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#78350F'; ctx.fillText('2', 57, 8);

    // Bloco 3 (Ao lado Azul)
    ctx.fillStyle = '#3B82F6'; ctx.beginPath(); ctx.roundRect(60, 20, 46, 46, 6); ctx.fill();
    ctx.strokeStyle = '#1E40AF'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#FFFFFF'; ctx.fillText('A', 83, 50);
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

    this.adicionar(new Background({ largura: L, altura: A, tema: 'construcao' }));

    // ---------------------------------------------------------------- título
    this.placaTitulo = new PlacaTituloMadeira(
      config.titulo ?? 'JOGO DOS BLOCOS',
      config.subtitulo ?? 'EMPILHE OS BLOCOS NA ORDEM CERTA!',
      { x: L / 2, y: A * 0.16 },
    );
    this.adicionar(this.placaTitulo);

    // --------------------------------------------------------------- mascote
    // Mover mais para o centro junto com o grupo de botões
    this.mascote = new Mascot({
      tamanho: 340,
      x: L * 0.28,
      y: A * 0.58,
      expressao: 'feliz',
      imagem: this.loader.imagem(config.mascote?.asset),
    });
    this.adicionar(this.mascote);

    // Blocos decorativos no chão do canteiro
    const blocosDeco = new BlocosDecorativos({ x: L * 0.12, y: A * 0.72 });
    this.adicionar(blocosDeco);

    // ---------------------------------------------------------------- botões
    // Movidos mais para o centro (xBotoes = L * 0.58) mantendo a proximidade com o mascote
    const larguraBotao = 390;
    const xBotoes = L * 0.58;

    this.botaoJogar = new Button({
      rotulo: 'JOGAR',
      icone: 'jogar',
      largura: larguraBotao,
      altura: 104,
      tamanhoTexto: tipografia.subtitulo,
      variante: 'sucesso', // Verde Educativo Vibrante
      pulse: true,
      x: xBotoes,
      y: A * 0.46,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this._jogar(),
    });

    this.botaoTutorial = new Button({
      rotulo: 'COMO JOGAR',
      icone: 'tutorial',
      largura: larguraBotao,
      altura: 92,
      tamanhoTexto: tipografia.corpo,
      variante: 'dourado', // Amarelo/Dourado Educativo
      x: xBotoes,
      y: A * 0.46 + 132,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.irPara('tutorial', { voltarPara: 'menu' }),
    });

    this.adicionar(this.botaoJogar, this.botaoTutorial);

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
    if (config.audio?.musica) this.audio.musica(config.audio.musica);
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

  aoSair() {
    this.audio.calar();
  }
}
