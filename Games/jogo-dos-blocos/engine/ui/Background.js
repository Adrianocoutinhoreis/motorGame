import { Node } from '../core/Node.js';
import { cores } from '../theme/tokens.js';

/**
 * Background — o cenário padrão das telas do motor.
 *
 * Céu em degradê, sol, nuvens e colinas, tudo vetorial. Existe para que as
 * telas de menu, tutorial, níveis e resultado compartilhem um mesmo ambiente
 * sem que cada jogo precise produzir arte de fundo — e sem carregar um JPEG de
 * fundo por tela, como faziam os originais (`fundo.jpg`, `BG.jpg`, `fd.jpg`).
 *
 * As nuvens se movem devagar: sinal de que a tela está viva, sem competir com
 * o conteúdo pela atenção da criança.
 */
export class Background extends Node {
  constructor(opcoes = {}) {
    super({ largura: opcoes.largura ?? 1280, altura: opcoes.altura ?? 720, ...opcoes });

    this.tema = opcoes.tema ?? 'campo'; // 'campo' | 'construcao' | 'formas'
    this.corCeuTopo = opcoes.corCeuTopo ?? (this.tema === 'construcao' ? '#38BDF8' : cores.ceuProfundo);
    this.corCeuBase = opcoes.corCeuBase ?? (this.tema === 'construcao' ? '#BAE6FD' : cores.ceu);
    this.corColina = opcoes.corColina ?? '#86EFAC';
    this.corColinaFundo = opcoes.corColinaFundo ?? '#BBF7D0';
    this.mostrarSol = opcoes.mostrarSol ?? true;
    this.mostrarColinas = opcoes.mostrarColinas ?? true;

    /**
     * Tema 'formas': as PEÇAS aparecem só nas telas de vitrine.
     *
     * Na partida isto vem `false`, e não é economia de desenho: atrás da grade,
     * círculos e triângulos coloridos no céu competem com as peças que a criança
     * precisa distinguir de verdade. O cenário não pode ensaiar o exercício.
     */
    this.mostrarPecas = opcoes.mostrarPecas ?? true;

    /**
     * Camada distante: formas enormes, brancas, quase invisíveis. Dão volume ao
     * céu sem nomear forma nenhuma, então ficam mesmo na partida.
     */
    this.pecasDistantes = [
      { tipo: 'circulo', x: 0.16, y: 0.26, lado: 330, alfa: 0.10, giro: 0, velocidade: 0.004 },
      { tipo: 'triangulo', x: 0.79, y: 0.35, lado: 300, alfa: 0.09, giro: 18, velocidade: 0.003 },
      { tipo: 'quadrado', x: 0.50, y: 0.72, lado: 260, alfa: 0.07, giro: -12, velocidade: 0.005 },
    ];

    /**
     * As quatro peças do jogo, nas cores delas.
     *
     * **As posições saem do vão que a interface do menu deixa, medido — não de
     * "esquerda e direita".** A primeira tentativa punha duas peças em x 0,11 e
     * 0,23 por essa intuição, e renderizar mostrou as duas sumidas: a PLACA tem
     * 740 px e ocupa de 0,21 a 0,79 (bem mais que os botões, que vão de 0,29 a
     * 0,71), e o MASCOTE cobre de 0,015 a 0,31 abaixo de y 0,29.
     *
     * O que de fato sobra:
     *   coluna direita   x 0,72 a 1,00  ·  y 0,28 a 0,82   (menos o botão de som)
     *   canto alto-esq.  x 0,04 a 0,19  ·  y 0,10 a 0,26   (acima do mascote)
     *
     * O alfa é 0,90, e não 0,58: sobre o halo claro, meia opacidade transformava
     * o laranja em marrom desbotado. Peça que não se reconhece pela cor não está
     * cumprindo o papel de ser a peça do jogo.
     */
    /**
     * **As peças FLUTUAM no lugar; não derivam.** É a diferença entre um móbile e
     * um desfile, e aqui ela é funcional: a 0,008 por segundo uma peça caminha
     * 0,24 da tela em meio minuto, ou seja, o posicionamento medido acima se
     * desfaz enquanto a criança ainda está no menu — a peça vai parar atrás da
     * placa. Balanço vertical mantém a composição de pé para sempre.
     *
     * `periodo` em segundos e `balanco` em pixels; `fase` desencontra as peças
     * para não subirem e descerem em bloco.
     */
    this.pecas = [
      { tipo: 'circulo', x: 0.10, y: 0.19, lado: 110, alfa: 0.90, giro: 0, cor: 'azul', periodo: 6.5, balanco: 11, fase: 0.0 },
      { tipo: 'retangulo', x: 0.855, y: 0.32, lado: 140, alfa: 0.90, giro: -6, cor: 'roxo', periodo: 7.5, balanco: 13, fase: 1.7 },
      { tipo: 'quadrado', x: 0.775, y: 0.50, lado: 96, alfa: 0.90, giro: 14, cor: 'laranja', periodo: 5.5, balanco: 10, fase: 3.1 },
      { tipo: 'triangulo', x: 0.895, y: 0.65, lado: 112, alfa: 0.90, giro: -8, cor: 'verde', periodo: 8.0, balanco: 12, fase: 4.6 },
      { tipo: 'circulo', x: 0.845, y: 0.19, lado: 46, alfa: 0.40, giro: 0, periodo: 4.5, balanco: 8, fase: 2.2 },
      { tipo: 'triangulo', x: 0.965, y: 0.44, lado: 58, alfa: 0.30, giro: 25, periodo: 6.0, balanco: 9, fase: 5.3 },
    ];

    this._t = 0;
    this.nuvens = [
      { x: 0.10, y: 0.14, escala: 1.0, velocidade: 0.010 },
      { x: 0.45, y: 0.09, escala: 0.75, velocidade: 0.014 },
      { x: 0.78, y: 0.18, escala: 0.88, velocidade: 0.008 },
    ];
  }

  atualizar(dt) {
    super.atualizar(dt);
    this._t += dt;
    for (const nuvem of this.nuvens) {
      nuvem.x += nuvem.velocidade * dt;
      if (nuvem.x > 1.25) nuvem.x = -0.25;
    }
    // Só as DISTANTES derivam. Elas são enormes e sem forma reconhecível, então
    // atravessar a tela não desarruma nada — é o que dá a paralaxe. As peças da
    // frente flutuam no lugar (ver `this.pecas`), e por isso não aparecem aqui.
    for (const peca of this.pecasDistantes) {
      peca.x += peca.velocidade * dt;
      if (peca.x > 1.35) peca.x = -0.35;
    }
  }

  /**
   * Pinta o cenário PARA ALÉM da área lógica, cobrindo as barras do letterbox.
   *
   * O `Stage` chama isto num passe próprio, recortado só no anel de fora, antes
   * de desenhar a cena recortada na área lógica. É o que faz as barras laterais
   * desaparecerem sem cortar nada do jogo e sem mexer na geometria medida.
   *
   * **Só as camadas contínuas.** Céu e chão são degradê e faixa horizontal: não
   * têm posição própria, então continuam. Sol, nuvens, peças e guindaste ficam
   * de fora — um sol repetido na barra seriam dois sóis.
   *
   * **A costura não aparece porque os degradês continuam definidos sobre a caixa
   * LÓGICA.** O canvas prolonga a última parada de cor para fora dela, então a
   * barra recebe a continuação exata do que está na borda, e não uma segunda
   * versão do degradê recalculada num tamanho maior.
   *
   * @param {object} area retângulo em px lógicos que cobre o canvas inteiro
   */
  pintarSangria(ctx, area) {
    const sx = Math.max(0, -area.x);
    const sy = Math.max(0, -area.y);
    this._ceu(ctx, sx, sy);
    this._chao(ctx, sx, sy);
  }

  /**
   * O céu: degradê e, quando o tema tem, o halo de luz. Vai primeiro, sempre.
   *
   * `sx`/`sy` são a sangria em px lógicos de cada lado — 0 no desenho normal,
   * porque o recorte do `Stage` já limita e pintar fora seria trabalho jogado
   * fora a cada quadro.
   */
  _ceu(ctx, sx = 0, sy = 0) {
    const l = this.largura;
    const a = this.altura;
    const px = -sx;
    const py = -sy;
    const pl = l + sx * 2;
    const pa = a + sy * 2;

    if (this.tema === 'formas') {
      const ceu = ctx.createLinearGradient(0, 0, l * 0.4, a);
      ceu.addColorStop(0, '#4338CA');
      ceu.addColorStop(0.55, '#6366F1');
      ceu.addColorStop(1, '#22D3EE');
      ctx.fillStyle = ceu;
      ctx.fillRect(px, py, pl, pa);

      if (this.mostrarSol) {
        const hx = l * 0.84;
        const hy = a * 0.18;
        const halo = ctx.createRadialGradient(hx, hy, 20, hx, hy, a * 0.55);
        halo.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
        halo.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = halo;
        ctx.fillRect(px, py, pl, pa);
      }
      return;
    }

    const ceu = ctx.createLinearGradient(0, 0, 0, a * 0.85);
    ceu.addColorStop(0, this.corCeuTopo);
    ceu.addColorStop(1, this.corCeuBase);
    ctx.fillStyle = ceu;
    ctx.fillRect(px, py, pl, pa);
  }

  /**
   * O chão: colinas, faixa de base ou piso, conforme o tema. Vai por ÚLTIMO
   * entre as camadas contínuas — as nuvens do tema 'campo' passam ATRÁS das
   * colinas, e trocar essa ordem mudaria o cenário.
   */
  _chao(ctx, sx = 0, sy = 0) {
    const l = this.largura;
    const a = this.altura;

    if (this.tema === 'formas') {
      // Faixa de base: silhueta, para o chão existir sem virar colina.
      //
      // **Os nós da onda são ancorados na grade de 60 px da caixa lógica**, e não
      // no início da sangria. Foi o defeito que o humano viu como "uma pequena
      // quebra no background": com sangria de 80, começar em -80 punha os nós em
      // -80, -20, 40, 100…, enquanto a passada da cena os punha em 0, 60, 120… —
      // duas ondas de FASE diferente, e um degrau visível de 1 px na silhueta,
      // exatamente na junção. Ancorando, as duas passadas desenham a MESMA curva.
      const PASSO = 60;
      const inicio = Math.floor(-sx / PASSO) * PASSO;
      const limite = l + sx;
      let fim = inicio;

      ctx.save();
      ctx.fillStyle = 'rgba(30, 27, 75, 0.55)';
      ctx.beginPath();
      ctx.moveTo(inicio, a + sy);
      ctx.lineTo(inicio, a * 0.84);
      for (let x = inicio; x <= limite; x += PASSO) {
        ctx.quadraticCurveTo(
          x + PASSO / 2, a * 0.84 - 18 * Math.sin(x / 150),
          x + PASSO, a * 0.84,
        );
        fim = x + PASSO;
      }
      ctx.lineTo(fim, a + sy);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      return;
    }

    if (this.tema === 'construcao') {
      // Areia clara e dessaturada, não laranja — ver `_desenharCanteiroConstrucao`.
      const topoChao = a * 0.82;
      ctx.fillStyle = '#E8DDC7';
      ctx.fillRect(-sx, topoChao, l + sx * 2, a + sy - topoChao);
      ctx.fillStyle = '#CDBE9F'; // um passo mais escura, só para a borda do piso ler
      ctx.fillRect(-sx, topoChao, l + sx * 2, 12);
      return;
    }

    if (this.mostrarColinas) {
      this._colina(ctx, a * 0.78, this.corColinaFundo, 0.9, sx, sy);
      this._colina(ctx, a * 0.86, this.corColina, 1.15, sx, sy);
      ctx.fillStyle = this.corColina;
      ctx.fillRect(-sx, a * 0.92, l + sx * 2, a * 0.08 + sy);
    }
  }

  desenhar(ctx) {
    const l = this.largura;
    const a = this.altura;

    // O tema 'formas' desenha o céu INTEIRO por conta própria — degradê, halo e
    // camadas — em vez de herdar o céu claro com sol e nuvens fofas. Sai daqui
    // logo, para não pagar um desenho que seria coberto em seguida.
    if (this.tema === 'formas') {
      this._desenharCeuGeometrico(ctx, l, a);
      return;
    }

    this._ceu(ctx);

    // Sol radiante
    if (this.mostrarSol) {
      const sx = l * 0.88;
      const sy = a * 0.14;
      const brilho = ctx.createRadialGradient(sx, sy, 10, sx, sy, a * 0.28);
      brilho.addColorStop(0, 'rgba(253, 224, 71, 0.95)');
      brilho.addColorStop(0.5, 'rgba(254, 240, 138, 0.4)');
      brilho.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = brilho;
      ctx.beginPath();
      ctx.arc(sx, sy, a * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // Sol vetorial amigável
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(sx, sy, a * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nuvens dinâmicas
    for (const nuvem of this.nuvens) {
      this._nuvem(ctx, nuvem.x * l, nuvem.y * a, 90 * nuvem.escala);
    }

    if (this.tema === 'construcao') this._desenharCanteiroConstrucao(ctx, l, a);
    this._chao(ctx);
  }

  /**
   * Tema 'formas' — o céu geométrico do Jogo das Formas.
   *
   * Existe para as duas aulas refeitas pararem de ser a mesma tela. O Jogo dos
   * Blocos **é** um canteiro de obras: o original dele tinha guindaste, caixotes
   * e `cenario.jpg`. O Jogo das Formas herdou o canteiro por acidente, só porque
   * nasceu do template do piloto — o original DELE se passava numa clareira.
   *
   * De trás para frente: degradê diagonal indigo → ciano, um halo de luz no
   * lugar do sol vetorial, formas brancas gigantes quase invisíveis, as quatro
   * peças do jogo nas cores delas, e uma faixa de base escura com friso miúdo.
   *
   * **Nada de nuvem.** Nuvem fofa é o vocabulário do céu claro dos outros temas;
   * aqui ela empurraria a tela de volta para a aparência que este tema existe
   * para abandonar.
   */
  _desenharCeuGeometrico(ctx, l, a) {
    this._ceu(ctx);

    for (const peca of this.pecasDistantes) this._peca(ctx, l, a, peca, '#FFFFFF');

    if (this.mostrarPecas) {
      for (const peca of this.pecas) {
        this._peca(ctx, l, a, peca, peca.cor ? cores.ludica[peca.cor] : '#FFFFFF');
      }
    }

    this._chao(ctx);

    if (this.mostrarPecas) {
      const friso = ['circulo', 'quadrado', 'triangulo', 'retangulo'];
      for (let i = 0; i < 14; i++) {
        this._peca(ctx, l, a, {
          tipo: friso[i % 4],
          x: (60 + i * 92) / l,
          y: 0.935,
          lado: 34,
          alfa: 0.16,
          giro: i * 13,
        }, '#FFFFFF');
      }
    }
  }

  /**
   * Uma forma solta no céu. `x`/`y` são fração da caixa e `giro` é em graus.
   *
   * Quando a peça traz `periodo`, ela sobe e desce `balanco` pixels em torno do
   * próprio lugar, com um giro de meio grau acompanhando — o bastante para a tela
   * parecer viva e pouco o bastante para não puxar o olho da criança para longe
   * do botão JOGAR.
   */
  _peca(ctx, l, a, peca, cor) {
    const s = peca.lado;
    const bal = peca.periodo
      ? Math.sin((this._t / peca.periodo) * Math.PI * 2 + (peca.fase ?? 0)) * (peca.balanco ?? 10)
      : 0;
    ctx.save();
    ctx.globalAlpha = peca.alfa;
    ctx.fillStyle = cor;
    ctx.translate(peca.x * l, peca.y * a + bal);
    const giro = (peca.giro ?? 0) + (peca.periodo ? bal * 0.05 : 0);
    if (giro) ctx.rotate((giro * Math.PI) / 180);
    ctx.beginPath();
    if (peca.tipo === 'circulo') {
      ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
    } else if (peca.tipo === 'quadrado') {
      ctx.roundRect(-s / 2, -s / 2, s, s, s * 0.18);
    } else if (peca.tipo === 'triangulo') {
      ctx.moveTo(0, -s * 0.45);
      ctx.lineTo(s / 2, s * 0.45);
      ctx.lineTo(-s / 2, s * 0.45);
      ctx.closePath();
    } else {
      ctx.roundRect(-s / 2, -s / 4, s, s / 2, s * 0.1);
    }
    ctx.fill();
    ctx.restore();
  }

  _desenharCanteiroConstrucao(ctx, l, a) {
    // 1. Silhueta de Prédios ao Fundo (City Skyline)
    ctx.save();
    const predios = [
      { x: l * 0.04, w: l * 0.08, h: a * 0.35, cor: '#94A3B8' },
      { x: l * 0.11, w: l * 0.10, h: a * 0.45, cor: '#CBD5E1' },
      { x: l * 0.20, w: l * 0.07, h: a * 0.30, cor: '#94A3B8' },
      { x: l * 0.65, w: l * 0.09, h: a * 0.40, cor: '#CBD5E1' },
      { x: l * 0.73, w: l * 0.12, h: a * 0.50, cor: '#94A3B8' },
      { x: l * 0.84, w: l * 0.08, h: a * 0.32, cor: '#CBD5E1' },
    ];

    const topoChao = a * 0.82;

    for (const p of predios) {
      ctx.fillStyle = p.cor;
      const y = topoChao - p.h;
      ctx.beginPath();
      ctx.roundRect(p.x, y, p.w, p.h + 20, [8, 8, 0, 0]);
      ctx.fill();

      // Janelinhas dos prédios
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      const colunasJ = Math.floor(p.w / 20);
      const linhasJ = Math.floor(p.h / 28);
      for (let c = 0; c < colunasJ; c++) {
        for (let r = 0; r < linhasJ; r++) {
          ctx.fillRect(p.x + 6 + c * 16, y + 10 + r * 22, 9, 12);
        }
      }
    }
    ctx.restore();

    // 2. Colinas suaves no plano intermediário
    this._colina(ctx, a * 0.76, '#86EFAC', 0.6);

    // 3. Andaimes de Madeira de Construção (Lado Direito)
    ctx.save();
    const ax = l * 0.78;
    const ay = a * 0.42;
    const aw = l * 0.16;
    const ah = a * 0.40;

    // Estrutura de vigas de madeira
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 6;
    ctx.beginPath();
    // Colunas verticais
    ctx.moveTo(ax, ay); ctx.lineTo(ax, ay + ah);
    ctx.moveTo(ax + aw / 2, ay - 20); ctx.lineTo(ax + aw / 2, ay + ah);
    ctx.moveTo(ax + aw, ay); ctx.lineTo(ax + aw, ay + ah);
    // Travessas horizontais
    for (let i = 0; i <= 3; i++) {
      const hy = ay + (ah / 3) * i;
      ctx.moveTo(ax - 10, hy); ctx.lineTo(ax + aw + 10, hy);
    }
    // X de sustentação
    ctx.moveTo(ax, ay); ctx.lineTo(ax + aw / 2, ay + ah / 3);
    ctx.moveTo(ax + aw / 2, ay); ctx.lineTo(ax, ay + ah / 3);
    ctx.moveTo(ax + aw / 2, ay + ah / 3); ctx.lineTo(ax + aw, ay + (ah / 3) * 2);
    ctx.moveTo(ax + aw, ay + ah / 3); ctx.lineTo(ax + aw / 2, ay + (ah / 3) * 2);
    ctx.stroke();
    ctx.restore();

    // 4. O chão do canteiro NÃO é desenhado aqui.
    //
    // Mora em `_chao`, junto das colinas e da faixa de base dos outros temas,
    // porque é camada CONTÍNUA: precisa poder ser esticada para dentro das
    // barras do letterbox. `desenhar` o chama logo depois desta função, então a
    // ordem é a mesma de antes — o piso cobre a base dos prédios.
    //
    // A areia é clara e dessaturada, não laranja: o tom anterior (#F59E0B) era
    // o mesmo valor de `cores.atencao`, saturação de cor de alerta ocupando o
    // maior bloco de cor da tela e competindo com os botões e com os blocos
    // coloridos que o aluno precisa olhar.
  }

  _nuvem(ctx, x, y, r) {
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.94)';
    ctx.beginPath();
    ctx.arc(x, y, r * 0.42, 0, Math.PI * 2);
    ctx.arc(x + r * 0.38, y - r * 0.14, r * 0.32, 0, Math.PI * 2);
    ctx.arc(x + r * 0.72, y + r * 0.04, r * 0.26, 0, Math.PI * 2);
    ctx.arc(x + r * 0.32, y + r * 0.2, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _colina(ctx, baseY, cor, amplitude, sx = 0, sy = 0) {
    const l = this.largura;
    const a = this.altura;
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.moveTo(-sx, a + sy);
    ctx.lineTo(-sx, baseY);
    // As curvas continuam ancoradas na caixa LÓGICA; a sangria só estica as
    // pontas na horizontal, para a colina não terminar antes da barra.
    ctx.quadraticCurveTo(l * 0.25, baseY - 60 * amplitude, l * 0.5, baseY - 10 * amplitude);
    ctx.quadraticCurveTo(l * 0.75, baseY + 40 * amplitude, l, baseY - 30 * amplitude);
    ctx.lineTo(l + sx, baseY - 30 * amplitude);
    ctx.lineTo(l + sx, a + sy);
    ctx.closePath();
    ctx.fill();
  }
}
