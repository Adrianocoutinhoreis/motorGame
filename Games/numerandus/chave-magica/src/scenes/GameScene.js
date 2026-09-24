import {
  Scene, Node, TextNode, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Panel, ScoreBar, Lives, TimerBar, Tween, Easing, ScoreSystem,
  ParticleSystem, ESTADOS, rand, espaco, alvoAcessivel,
} from '../../engine/index.js';

/**
 * Sistema de identidade das peças — cabeça (bow) + dentes — portado do
 * protótipo `Aulas para Refazer/Jogo_da_chave_magica/Game/script.js`
 * (`gerarBowPath`/`gerarDentesPath`), só que em `Path2D` puro (sem SVG/DOM).
 * `Path2D` entende sintaxe de path SVG direto, então a geometria é a MESMA
 * já validada ali — só o jeito de desenhar mudou.
 *
 * Cada peça (chave OU fechadura) nasce de uma combinação bow+dentes ÚNICA
 * na rodada: é isso, e não a cor, que decide o encaixe (ver README, seção
 * "Por que a cor não decide").
 */
const BOWS = ['circulo', 'quadrado', 'losango', 'oval'];

/** 4 perfis de 1 dente só (nível Fácil). */
const DENTES_1 = [[8], [12], [17], [22]];

/** 8 perfis de 2 dentes — todas as combinações de altura do protótipo (nível Médio/Difícil). */
const DENTES_2 = [[8, 15], [15, 8], [8, 22], [22, 8], [15, 22], [22, 15], [15, 15], [8, 8]];

/**
 * 8 cores bem distintas — nunca decidem o encaixe sozinhas, só ajudam a
 * diferenciar. De propósito, NENHUMA cai na faixa amarelo/dourado/laranja: o
 * tabuleiro e o rebaixo entalhado são madeira e oliva, então uma chave
 * dourada quase sumia dentro do próprio buraco onde ela encaixa. Girando
 * pelo resto da roda de cores (vermelho → rosa → roxo → azul → verde) toda
 * chave sempre contrasta com o fundo, em vez de só ALGUMAS.
 */
const CORES = ['#DC2626', '#DB2777', '#9333EA', '#4F46E5', '#2563EB', '#0891B2', '#0D9488', '#16A34A'];

/** Mistura um hex com branco (`fator>0`) ou com preto (`fator<0`) — base do brilho metálico da chave. */
function misturarTom(hex, fator) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const alvo = fator >= 0 ? 255 : 0;
  const f = Math.abs(fator);
  const mix = (c) => Math.round(c + (alvo - c) * f);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function bowPathD(estilo) {
  switch (estilo) {
    case 'quadrado':
      return 'M 4 6 L 44 6 L 44 48 L 4 48 Z M 15 17 L 33 17 L 33 37 L 15 37 Z';
    case 'losango':
      return 'M 24 4 L 46 27 L 24 50 L 2 27 Z M 24 16 L 34 27 L 24 38 L 14 27 Z';
    case 'oval':
      return 'M 24 6 C 44 6 48 18 48 27 C 48 36 44 48 24 48 C 4 48 0 36 0 27 C 0 18 4 6 24 6 Z '
        + 'M 24 16 C 34 16 36 21 36 27 C 36 33 34 38 24 38 C 14 38 12 33 12 27 C 12 21 14 16 24 16 Z';
    case 'circulo':
    default:
      return 'M 24 4 A 23 23 0 1 1 24 50 A 23 23 0 1 1 24 4 Z M 24 15 A 12 12 0 1 1 24 39 A 12 12 0 1 1 24 15 Z';
  }
}

function dentesPathD(dentes) {
  const startX = 76;
  const gap = 24;
  const baseY = 32;
  const w = 12;
  let d = '';
  dentes.forEach((h, i) => {
    const x = startX + i * gap;
    d += `M${x} ${baseY} L${x + w} ${baseY} L${x + w} ${baseY + h} L${x} ${baseY + h} Z `;
  });
  return d;
}

/** Os 4 caminhos de cabeça só existem em 4 variações — cacheados uma vez, reaproveitados por toda peça. */
const BOW_PATHS = Object.fromEntries(BOWS.map((b) => [b, new Path2D(bowPathD(b))]));

/** A alça do cadeado (nível Difícil) — mesma curva do protótipo, também cacheada. */
const ALCA_PATH = new Path2D('M 42 60 L 42 40 A 38 38 0 0 1 118 40 L 118 60');

/**
 * Cache de `Path2D` dos dentes, por combinação (`"8,15"`, `"22,8"`...). Sem
 * isto, `desenhar()` montava a string do path e fazia o parse de um `Path2D`
 * NOVO a cada quadro, em até 5 pontos do arquivo (chave da bandeja, chave
 * encaixada, dica escura da fechadura...) — puro lixo de memória 60x/s por
 * peça, medido como uma das causas do engasgo em celular (junto do
 * `shadowBlur` contínuo, ver `_gerarSombraRebaixo`/pulso ambiente). O pool de
 * combinações é pequeno e fixo (`DENTES_1`/`DENTES_2`), então o cache nunca
 * cresce sem limite.
 */
const DENTES_PATHS = new Map();
function dentesPath(dentes) {
  const chave = dentes.join(',');
  let p = DENTES_PATHS.get(chave);
  if (!p) {
    p = new Path2D(dentesPathD(dentes));
    DENTES_PATHS.set(chave, p);
  }
  return p;
}

/**
 * Sorteia `n` combinações ÚNICAS de bow+dentes+cor para a rodada. A
 * unicidade vem dos DENTES (o pool tem exatamente `n` perfis para `n`
 * peças, nunca sobra nem repete) — é o suficiente para nenhuma peça
 * encontrar duas fechaduras possíveis, mesmo que a cabeça se repita.
 */
function gerarPecas(nivel) {
  const cores = embaralhar(CORES).slice(0, nivel.pecas);
  const bowsPool = [];
  while (bowsPool.length < nivel.pecas) bowsPool.push(...BOWS);
  const bows = embaralhar(bowsPool).slice(0, nivel.pecas);
  const dentesPool = nivel.dentesMax === 1 ? DENTES_1 : DENTES_2;
  const dentes = embaralhar(dentesPool.slice()).slice(0, nivel.pecas);

  const pecas = [];
  for (let i = 0; i < nivel.pecas; i++) {
    pecas.push({ id: i, cor: cores[i], bow: bows[i], dentes: dentes[i] });
  }
  return pecas;
}

/** Fisher-Yates — mesmo idiom usado no resto da coleção (`rand.inteiro`). */
function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = rand.inteiro(0, i);
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Mais colunas cabendo sem cortar nem rolar, célula máxima — mesmo método do Geométrico/Ordenação. */
function melhorGradeColunas(areaW, areaH, total, gap) {
  let melhorColunas = 1;
  let melhorPontuacao = -Infinity;
  for (let colunas = 1; colunas <= total; colunas++) {
    const linhas = Math.ceil(total / colunas);
    const cellW = (areaW - gap * (colunas - 1)) / colunas;
    const cellH = (areaH - gap * (linhas - 1)) / linhas;
    if (cellW <= 0 || cellH <= 0) continue;
    const pontuacao = Math.min(cellW, cellH);
    if (pontuacao > melhorPontuacao) { melhorPontuacao = pontuacao; melhorColunas = colunas; }
  }
  return melhorColunas;
}

/**
 * Silhuetas gigantes e quase invisíveis espalhadas pelo céu do cenário — só
 * identidade visual ("isto é um jogo de chaves"), nunca conteúdo: por isso
 * ficam BEM apagadas e fixas (sem animação, sem disputar atenção com o
 * tabuleiro). Posições/ângulos fixos, não aleatórios — evita uma composição
 * ruim (duas silhuetas coladas) sortear em algum carregamento.
 */
const DECORACOES_FUNDO = [
  { x: 150, y: 130, escala: 2.3, rotacao: -18 },
  { x: 1120, y: 110, escala: 1.7, rotacao: 24 },
  { x: 90, y: 560, escala: 1.9, rotacao: 12 },
  { x: 1180, y: 590, escala: 2.4, rotacao: -30 },
];

class FundoDecorativo extends Node {
  desenhar(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = '#F5EAD6';
    for (const d of DECORACOES_FUNDO) {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate((d.rotacao * Math.PI) / 180);
      ctx.scale(d.escala, d.escala);
      ctx.translate(-65, -27);
      ctx.fill(BOW_PATHS.circulo, 'evenodd');
      ctx.fillRect(44, 22, 74, 10);
      ctx.fill(dentesPath([15, 22]));
      ctx.restore();
    }
    ctx.restore();
  }
}

/**
 * PainelMadeira — o cartão do tabuleiro, texturizado como a tábua de madeira
 * de verdade do brinquedo físico (ver README, seção "Como os dados foram
 * definidos"). Substitui o `Panel` branco genérico só aqui: a bandeja (as
 * chaves soltas) continua no cartão branco padrão, porque são elas — coloridas,
 * de plástico — que contrastam com a madeira, não o contrário.
 */
/** Folga em volta da textura cacheada da tábua — cobre a sombra externa (blur 18 + offsetY 7), que senão seria cortada na borda do canvas fora de tela. */
const PAD_TEXTURA_PAINEL = 40;

class PainelMadeira extends Node {
  constructor(opcoes = {}) {
    super({ ...opcoes });
    // Canvas fora de tela com a textura pronta — ver `_gerarTextura`.
    this._textura = null;
  }

  /**
   * Hachurado (~80 traços), verniz em gradiente e sombra externa: nada disso
   * muda quadro a quadro, só o tamanho do painel muda — e esse é fixo durante
   * toda a partida (definido uma vez em `aoEntrar`). Redesenhar isso à mão
   * todo frame, pra sempre, media como uma das causas do engasgo em celular
   * (junto do `shadowBlur` das fechaduras e do pulso ambiente da chave); agora
   * é pintado UMA VEZ aqui e colado (`drawImage`) depois — custo de um blit.
   */
  _gerarTextura() {
    const { largura: l, altura: a } = this;
    const p = PAD_TEXTURA_PAINEL;
    // Fator 2 fixo (não o DPR do aparelho): a textura é ruído sutil (12% de
    // alpha), então nitidez extra não se nota, e usar o DPR real faria o
    // canvas fora de tela variar de tamanho a cada troca de aparelho/zoom.
    const escala = 2;
    const off = document.createElement('canvas');
    off.width = Math.max(1, Math.round((l + p * 2) * escala));
    off.height = Math.max(1, Math.round((a + p * 2) * escala));
    const ctx = off.getContext('2d');
    ctx.scale(escala, escala);
    ctx.translate(p, p);
    this._pintarTextura(ctx, l, a);
    this._textura = off;
  }

  _pintarTextura(ctx, l, a) {
    const r = 22;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.32)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 7;
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, r);
    ctx.fillStyle = '#6B4023';
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Veio da madeira: listras diagonais bem sutis, recortadas na forma do cartão.
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, r);
    ctx.clip();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.lineWidth = 9;
    for (let x = -a; x < l + a; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + a, a);
      ctx.stroke();
    }
    // Sombra suave embaixo, luz suave em cima — dá volume sem precisar de imagem.
    const verniz = ctx.createLinearGradient(0, 0, 0, a);
    verniz.addColorStop(0, 'rgba(255,255,255,0.10)');
    verniz.addColorStop(0.5, 'rgba(0,0,0,0)');
    verniz.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = verniz;
    ctx.fillRect(0, 0, l, a);
    ctx.restore();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(r, 2);
    ctx.lineTo(l - r, 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(1.5, 1.5, l - 3, a - 3, r);
    ctx.stroke();
    ctx.restore();
  }

  desenhar(ctx) {
    if (!this._textura) this._gerarTextura();
    const p = PAD_TEXTURA_PAINEL;
    ctx.drawImage(this._textura, -p, -p, this.largura + p * 2, this.altura + p * 2);
  }
}

/**
 * Chave — a peça arrastável da bandeja. Desenha cabeça + haste + dentes
 * dentro de uma caixa de toque de no mínimo 64×64 px lógicos
 * (`alvoAcessivel`), mesmo a arte sendo bem mais larga que alta.
 */
class Chave extends Node {
  constructor(opcoes = {}) {
    const tamanho = opcoes.tamanho ?? 1;
    super({ ...opcoes, largura: 1, altura: 1, interativo: opcoes.interativo ?? false });
    this.pecaId = opcoes.pecaId;
    this.cor = opcoes.cor;
    this.bow = opcoes.bow;
    this.dentes = opcoes.dentes;
    this.brilho = 0;
    this.colocada = false;
    // Liga só DEPOIS do flourish do encaixe terminar (`_encaixar`) — enquanto
    // o tween ainda está animando `brilho` de 1 a 0, o pulso ambiente não
    // pode escrever na mesma propriedade ao mesmo tempo.
    this._pulsoAmbiente = false;
    // Fase própria (não `0`): as peças não pulsam todas em uníssono, senão o
    // tabuleiro inteiro pisca junto e cansa a vista — mesma ideia do `Button.pulse`.
    this._tPulso = rand.entre(0, 10);
    this.definirTamanho(tamanho);
  }

  /**
   * Redefine o tamanho da arte mantendo o CENTRO no lugar (`regX`/`regY`
   * acompanham). Usada em `_encaixar` pra a chave da bandeja (maior) assumir
   * o tamanho exato do rebaixo da fechadura (menor) ao encaixar — sem isto a
   * peça colorida ficava um pouco maior que o próprio buraco que ela preenche.
   */
  definirTamanho(tamanho) {
    const largura = alvoAcessivel(130 * tamanho);
    const altura = alvoAcessivel(54 * tamanho);
    this.largura = largura;
    this.altura = altura;
    this.regX = largura / 2;
    this.regY = altura / 2;
    this.escalaChave = tamanho;
  }

  atualizar(dt) {
    super.atualizar(dt);
    if (!this._pulsoAmbiente) return;
    this._tPulso += dt;
    // Respiração suave e contínua — prova visual PERMANENTE de "essa aqui já
    // está certa" (o pulinho de `_encaixar` é só o instante do encaixe, some
    // rápido demais pra servir de lembrete depois). Reaproveita o MESMO
    // desenho do brilho de encaixe (abaixo) em vez de um contorno traçado à
    // parte: traçar cabeça+haste+dente como três formas separadas deixava
    // uma mancha grossa nas juntas entre elas (visto no print) — o brilho por
    // sombra/preenchimento não tem essa costura, porque é a MESMA silhueta
    // preenchida, só usada como fonte de sombra em vez de cor sólida.
    this.brilho = 0.16 + 0.14 * (Math.sin(this._tPulso * 2.2) * 0.5 + 0.5);
  }

  desenhar(ctx) {
    const cx = this.largura / 2;
    const cy = this.altura / 2;
    ctx.save();
    if (this.brilho > 0) {
      ctx.save();
      ctx.translate(cx - 65 * this.escalaChave, cy - 27 * this.escalaChave);
      ctx.scale(this.escalaChave, this.escalaChave);
      // `shadowBlur` só entra no INSTANTE do encaixe (`brilho` alto, tween
      // breve, ver `_encaixar`) — o pulso ambiente (`atualizar`, permanente,
      // teto de 0.3) usava a mesma sombra, e isso rodava sem parar até o fim
      // da partida: o gasto mais caro do canvas 2D, repetido a troco de um
      // brilho quase imperceptível a mais. Acima do limiar, sombra normal;
      // abaixo, só alpha no preenchimento — o pulso continua visível, sem o
      // blur ligado pra sempre.
      if (this.brilho > 0.4) {
        ctx.shadowColor = `rgba(255, 247, 214, ${0.9 * this.brilho})`;
        ctx.shadowBlur = 26 * this.brilho;
      } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = `rgba(255, 247, 214, ${0.55 * this.brilho})`;
      ctx.fill(BOW_PATHS[this.bow], 'evenodd');
      ctx.fillRect(44, 22, 74, 10);
      ctx.fill(dentesPath(this.dentes));
      ctx.restore();
    }
    ctx.translate(cx - 65 * this.escalaChave, cy - 27 * this.escalaChave);
    ctx.scale(this.escalaChave, this.escalaChave);
    // Gradiente de cima pra baixo em vez de cor chapada — o mesmo truque de
    // "brilho biselado" que o Botão/IconButton do motor já usam, só que numa
    // silhueta em vez de um retângulo: sugere metal sem precisar de imagem.
    // Recriado a cada quadro (não cacheado): um `CanvasGradient` fica preso
    // ao sistema de coordenadas de quando foi criado — cachear ele sobrevivendo
    // a um novo `translate` (a peça arrastando, por exemplo) deixaria o
    // brilho "grudado" numa posição de tela antiga em vez de acompanhar a peça.
    const grad = ctx.createLinearGradient(0, 0, 0, 54);
    grad.addColorStop(0, misturarTom(this.cor, 0.4));
    grad.addColorStop(0.45, this.cor);
    grad.addColorStop(1, misturarTom(this.cor, -0.18));
    ctx.fillStyle = grad;
    ctx.fill(BOW_PATHS[this.bow], 'evenodd');
    ctx.fillRect(44, 22, 74, 10);
    ctx.fill(dentesPath(this.dentes));
    ctx.restore();
  }
}

/**
 * Fechadura — o alvo fixo no tabuleiro. Dois visuais, conforme o nível:
 *
 *   `cadeado: false` (Fácil/Médio) — a MESMA silhueta da chave, numa cor
 *   única sem relação com nenhuma chave: só o formato conta.
 *
 *   `cadeado: true` (Difícil) — um cadeado cinza neutro, igual em todos (a
 *   cor não é pista nenhuma aqui, só o formato decide), com a chave certa
 *   entalhada bem de leve lá dentro; ao resolver, a alça sobe e um "✓" aparece.
 */
class Fechadura extends Node {
  constructor(opcoes = {}) {
    const tamanho = opcoes.tamanho ?? 1;
    const cadeado = opcoes.cadeado ?? false;
    const largura = cadeado ? alvoAcessivel(96 * tamanho) : alvoAcessivel(130 * tamanho);
    const altura = cadeado ? alvoAcessivel(96 * tamanho) : alvoAcessivel(54 * tamanho);
    super({ ...opcoes, largura, altura });
    this.regX = largura / 2;
    this.regY = altura / 2;
    this.escalaChave = tamanho;
    this.pecaId = opcoes.pecaId;
    this.cor = opcoes.cor;
    this.bow = opcoes.bow;
    this.dentes = opcoes.dentes;
    this.cadeado = cadeado;
    this.resolvida = false;
    this.destacado = false;
    // 0 = sem onda; sobe até 1 no instante do encaixe (ver `_encaixar`) e um
    // `.chamar()` no fim do tween zera de novo — não fica ligado pra sempre.
    this._anel = 0;
    // Alça (cadeado, nível Difícil): deslocamento vertical animado, 0 = travada,
    // -14 = destravada. Era um salto instantâneo (`if (resolvida) translate`) —
    // sem transição nenhuma, e disparado no INÍCIO do arrasto solto, quando o
    // olho ainda está seguindo a chave voando até aqui, não o cadeado. Agora
    // é uma propriedade animável (`Tween`, ver `_encaixar`), acionada só
    // quando a chave chega de verdade.
    this._alcaY = 0;
    /** Escala do "✓" do cadeado, 0 a 1 — cresce com salto (`Easing.costasSaida`) no instante em que a chave chega, em vez de aparecer pronto. */
    this._marca = 0;
    // Canvas fora de tela com a sombra entalhada do rebaixo, pronta — ver
    // `_gerarSombraRebaixo`. Não depende de `destacado`/`resolvida` (a sombra
    // é sempre a mesma; só a cor do preenchimento por baixo dela muda), então
    // uma única textura serve pra vida inteira da peça.
    this._sombra = null;
  }

  /**
   * Recusou uma chave errada — pisca lavanda uma vez (nunca vermelho, regra
   * da coleção) E treme de leve, mesmo idioma do `marcarErrado` do Bingo:
   * sempre relativo à posição de repouso (`this.x`, fixa — a fechadura nunca
   * se move sozinha), nunca ao `x` atual, pra um segundo erro no meio do
   * tremor não acumular deslocamento e "andar" a fechadura pro lado.
   */
  piscarErro() {
    this.destacado = true;
    const base = this.x;
    Tween.removerDe(this);
    Tween.de(this)
      .entao({ x: base - 7 }, 45)
      .entao({ x: base + 7 }, 45)
      .entao({ x: base - 4 }, 45)
      .entao({ x: base }, 45)
      .esperar(465)
      .chamar(() => { this.destacado = false; });
  }

  desenhar(ctx) {
    const cx = this.largura / 2;
    const cy = this.altura / 2;
    if (this.cadeado) this._desenharCadeado(ctx, cx, cy);
    else this._desenharSilhueta(ctx, cx, cy);
    if (this._anel > 0) this._desenharAnel(ctx, cx, cy);
  }

  /** Onda que nasce do tamanho do rebaixo e se abre, sumindo — o "clique" do encaixe. */
  _desenharAnel(ctx, cx, cy) {
    const raioBase = Math.min(this.largura, this.altura) * 0.4;
    const raio = raioBase * (0.7 + this._anel * 1.1);
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - this._anel);
    ctx.strokeStyle = '#FFF7E0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, raio, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * O "molde": um rebaixo entalhado na madeira, exatamente como a tábua de
   * verdade do brinquedo físico — não um ícone plano flutuando no ar. O
   * rebaixo (retângulo arredondado, tom oliva, com uma leve sombra interna)
   * é bem maior que a chave desenhada dentro dele, de propósito: mostra que
   * é um BURACO na madeira, não só um contorno.
   */
  _desenharSilhueta(ctx, cx, cy) {
    const w = 130 * this.escalaChave;
    const h = 54 * this.escalaChave;
    const padX = 20 * this.escalaChave;
    const padY = 30 * this.escalaChave;
    const slotW = w + padX * 2;
    const slotH = h + padY * 2;
    const slotR = Math.min(18, slotH / 2);

    ctx.save();
    ctx.translate(cx - slotW / 2, cy - slotH / 2);
    ctx.beginPath();
    ctx.roundRect(0, 0, slotW, slotH, slotR);
    // Rebaixo claro de propósito: precisa contrastar tanto com a chave
    // colorida (depois de encaixada) quanto com a silhueta escura (antes).
    // O erro usa LAVANDA, não um tom mais escuro de oliva — duas variações do
    // MESMO marrom ficavam parecidas demais (achado testando o flash de
    // erro); lavanda contra oliva é contraste de matiz, não só de claridade,
    // e reaproveita a cor de "vazio" que o resto da série já usa (Geométrico).
    ctx.fillStyle = this.destacado ? '#D9D0F5' : '#D9C696';
    ctx.fill();

    // Sombra entalhada de verdade — truque do "quadro com buraco": um
    // retângulo enorme com um buraco do tamanho do rebaixo (`fill('evenodd')`)
    // fica INVISÍVEL (tudo fora do buraco está fora do recorte abaixo), mas a
    // SOMBRA que ele projeta cai dentro do buraco. Zero pixel do quadro em si
    // aparece — só a sombra. A luz vem de cima-esquerda: a borda de
    // cima/esquerda projeta sombra escura pra dentro (`shadowOffset` positivo,
    // luz "empurra" a sombra pra baixo-direita); um segundo passe claro, com
    // deslocamento invertido, ilumina a parede oposta — sem os dois, o
    // retângulo lia como um adesivo colado em cima da tábua, não um buraco.
    //
    // O CÁLCULO da sombra (dois `fill('evenodd')` com `shadowBlur` sobre um
    // retângulo 3x o tamanho do rebaixo) é a parte cara de tudo isto — e o
    // resultado nunca muda depois de gerado (não depende de `destacado` nem
    // `resolvida`), então em vez de recalcular isso 60x por segundo pra
    // sempre, é feito UMA VEZ e colado (`drawImage`) daqui em diante. Medido
    // como uma das causas do engasgo em celular.
    if (!this._sombra) this._gerarSombraRebaixo(slotW, slotH, slotR);
    const pad = this._sombraPad;
    ctx.drawImage(this._sombra, -pad, -pad, slotW + pad * 2, slotH + pad * 2);

    // Borda tracejada — a mesma linguagem visual de "lugar vazio" do resto
    // da série (Geométrico usa o mesmo tracejado nos contornos do tabuleiro).
    // No erro, a borda também vira lavanda mais escura, reforçando o troca
    // de matiz do preenchimento acima.
    ctx.strokeStyle = this.destacado ? '#8577C2' : 'rgba(60, 42, 10, 0.32)';
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 6]);
    ctx.beginPath();
    ctx.roundRect(0, 0, slotW, slotH, slotR);
    ctx.stroke();

    ctx.restore();

    // A silhueta escura é só a DICA de qual formato cabe ali — some assim que
    // a peça de verdade encaixa, porque ela mesma passa a ocupar esse lugar.
    // O rebaixo (o "buraco" na madeira, acima) continua desenhado sempre: é
    // ele que faz a chave colorida parecer ENCAIXADA na tábua, não só
    // flutuando por cima dela.
    if (this.resolvida) return;

    ctx.save();
    ctx.translate(cx - 65 * this.escalaChave, cy - 27 * this.escalaChave);
    ctx.scale(this.escalaChave, this.escalaChave);
    ctx.fillStyle = this.destacado ? '#7C4A12' : '#2B1B0E';
    ctx.fill(BOW_PATHS[this.bow], 'evenodd');
    ctx.fillRect(44, 22, 74, 10);
    ctx.fill(dentesPath(this.dentes));
    ctx.restore();
  }

  /**
   * Gera, uma única vez, o canvas fora de tela com a sombra entalhada do
   * rebaixo (ver comentário em `_desenharSilhueta`). `slotW`/`slotH`/`slotR`
   * são fixos pra vida inteira desta peça (vêm só de `escalaChave`, definido
   * no construtor), então não há necessidade de invalidar o cache depois.
   */
  _gerarSombraRebaixo(slotW, slotH, slotR) {
    // Folga em volta: cobre o alcance dos dois `shadowBlur` (14 e 7, com
    // deslocamento de até 8px) — sem isto a sombra seria cortada na borda do
    // canvas fora de tela.
    const pad = 36;
    const escala = 2;
    const off = document.createElement('canvas');
    off.width = Math.max(1, Math.round((slotW + pad * 2) * escala));
    off.height = Math.max(1, Math.round((slotH + pad * 2) * escala));
    const ctx = off.getContext('2d');
    ctx.scale(escala, escala);
    ctx.translate(pad, pad);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, slotW, slotH, slotR);
    ctx.clip();

    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.rect(-slotW, -slotH, slotW * 3, slotH * 3);
    ctx.roundRect(0, 0, slotW, slotH, slotR);
    ctx.fill('evenodd');

    ctx.shadowColor = 'rgba(255,255,255,0.4)';
    ctx.shadowBlur = 7;
    ctx.shadowOffsetX = -4;
    ctx.shadowOffsetY = -5;
    ctx.beginPath();
    ctx.rect(-slotW, -slotH, slotW * 3, slotH * 3);
    ctx.roundRect(0, 0, slotW, slotH, slotR);
    ctx.fill('evenodd');

    ctx.restore();
    this._sombra = off;
    this._sombraPad = pad;
  }

  _desenharCadeado(ctx, cx, cy) {
    const e = (Math.min(this.largura, this.altura) / 160) * this.escalaChave * 1.6;
    ctx.save();
    ctx.translate(cx - 80 * e, cy - 80 * e);
    ctx.scale(e, e);

    // Alça — sobe (translada pra cima) quando resolvida, como se tivesse destravado.
    ctx.save();
    ctx.translate(0, this._alcaY);
    ctx.strokeStyle = '#B0B8C1';
    ctx.lineWidth = 13;
    ctx.lineCap = 'round';
    ctx.stroke(ALCA_PATH);
    ctx.strokeStyle = '#D8DDE2';
    ctx.lineWidth = 6;
    ctx.stroke(ALCA_PATH);
    ctx.restore();

    // Corpo — cinza neutro ENQUANTO fechado, não a cor da chave certa: se
    // toda cor aparecesse antes de resolver, o Difícil dava uma pista a mais
    // (bate a cor, já sabe qual chave é), deixando a discriminação de FORMA
    // opcional. Depois de resolvido não tem mais pista nenhuma a proteger —
    // o cadeado assume a cor da chave que acabou de sumir dentro dele, uma
    // lembrança do que foi encaixado ali, em vez de só ficar cinza pra sempre.
    ctx.fillStyle = this.resolvida ? this.cor : (this.destacado ? '#F59E0B' : '#7C8591');
    ctx.beginPath();
    ctx.roundRect(18, 58, 124, 92, 14);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath();
    ctx.roundRect(18, 58, 124, 28, 14);
    ctx.fill();

    if (this.resolvida) {
      // Cresce com salto (`_marca` vai de 0 a 1 via `Easing.costasSaida`, que
      // ultrapassa 1 antes de assentar) em vez de já nascer pronto — o "pulo"
      // de tamanho é o que faz o ✓ ser notado por cima da chave que acabou
      // de sumir no mesmo instante.
      ctx.save();
      ctx.translate(135, 138);
      ctx.scale(this._marca, this._marca);
      ctx.translate(-135, -138);
      ctx.fillStyle = '#00D2A0';
      ctx.beginPath();
      ctx.arc(135, 138, 13, 0, Math.PI * 2);
      ctx.fill();
      // Aro branco: o corpo agora pode ser QUALQUER uma das 8 cores das
      // chaves (ver acima) — em vez de sempre cinza, então o selo precisa de
      // um contorno próprio pra não se perder contra corpos verdes/teal
      // (perto do próprio tom do selo).
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(127, 138);
      ctx.lineTo(133, 144);
      ctx.lineTo(143, 132);
      ctx.stroke();
      ctx.restore();
    } else {
      // Escura e quase opaca de propósito — a 32% de antes lia bem só nos
      // cadeados mais claros; nos escuros (roxo, azul) a dica quase sumia,
      // perdendo o contraste que o resto do jogo (rebaixo/silhueta) já
      // garante. Escuro sólido contrasta com QUALQUER cor de corpo.
      ctx.save();
      ctx.translate(33, 90);
      ctx.scale(0.66, 0.66);
      ctx.globalAlpha = 0.88;
      ctx.fillStyle = '#1A0B05';
      ctx.fill(BOW_PATHS[this.bow], 'evenodd');
      ctx.fillRect(44, 22, 74, 10);
      ctx.fill(dentesPath(this.dentes));
      ctx.restore();
    }
    ctx.restore();
  }
}

/**
 * GameScene — a partida do Chave Mágica.
 *
 * Mecânica: N fechaduras fixas no tabuleiro (cada uma com um formato
 * único de cabeça+dentes) e as N chaves correspondentes na bandeja,
 * embaralhadas. A criança arrasta cada chave até a fechadura do MESMO
 * formato — a cor nunca decide sozinha. Errar o formato pisca âmbar,
 * devolve a chave à bandeja E custa uma vida; o cronômetro também corre.
 * Primeiro jogo da série Numerandus com derrota de verdade (decisão
 * registrada no artefato de planejamento) — zerar as vidas ou o tempo
 * antes de encaixar todas encerra a partida.
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.placar = new ScoreSystem({
      total: this.nivel.meta ?? this.nivel.pecas ?? 4,
      nivel: this.nivel.id ?? 1,
      vidas: this.nivel.vidas ?? 3,
    });

    this.adicionar(new Background({
      largura: L,
      altura: A,
      tema: config.tema ?? 'quarto',
      corCeuTopo: config.corCeuTopo,
      corCeuBase: config.corCeuBase,
      mostrarDecoracoes: config.mostrarDecoracoes ?? false,
    }));
    this.adicionar(new FundoDecorativo({ largura: L, altura: A }));

    this._arrastando = null;
    this._colocadas = 0;
    this._tentativasErradas = 0;

    // -------------------------------------------------------------- layout
    // Dois cartões lado a lado, do mesmo tamanho — tabuleiro (fechaduras
    // fixas) e bandeja (chaves arrastáveis), mesmo plano de dois painéis do
    // Quebra-Cabeça Geométrico/Dino, só que aqui os dois lados são GRADES
    // (sem flor nem ordem de pilha), então dividem a largura igualzinho.
    const margemLateral = 40;
    const topo = 108;
    const margemInferior = 40;
    const gapCartoes = 24;
    const areaLargura = L - margemLateral * 2;
    const areaAltura = A - topo - margemInferior;
    const larguraCartao = Math.round((areaLargura - gapCartoes) / 2);
    const padInterno = 26;
    const gapGrade = 16;

    this.area = new Node({ x: margemLateral, y: topo });
    this.adicionar(this.area);

    this.area.adicionar(new PainelMadeira({ largura: larguraCartao, altura: areaAltura }));
    const xBandeja = larguraCartao + gapCartoes;
    // Pergaminho quente, não o branco genérico do motor — a bandeja é onde as
    // chaves soltas "descansam" antes de ir pro tabuleiro, então merece um
    // tom que combine com a tábua de madeira ao lado, sem competir com as
    // 8 cores bem saturadas das chaves (que já dão conta do contraste).
    this.area.adicionar(new Panel({
      x: xBandeja, largura: larguraCartao, altura: areaAltura, raio: 22,
      preenchimento: '#F6EFDC', contorno: '#E4D6AE', espessura: 2,
    }));
    // Peças rejeitadas voltam pra cá — acima dos dois cartões, abaixo das chaves de verdade.
    this.indiceBasePecas = this.area.filhos.length;

    // ----------------------------------------------------------- as peças
    const pecas = gerarPecas(this.nivel);
    const larguraGrade = larguraCartao - padInterno * 2;
    const alturaGrade = areaAltura - padInterno * 2;
    const colunas = melhorGradeColunas(larguraGrade, alturaGrade, pecas.length, gapGrade);
    const linhas = Math.ceil(pecas.length / colunas);
    const cellW = (larguraGrade - gapGrade * (colunas - 1)) / colunas;
    const cellH = (alturaGrade - gapGrade * (linhas - 1)) / linhas;

    // Fator de preenchimento da CHAVE (bandeja) sobe com a quantidade de
    // peças: no Médio/Difícil a grade fica mais apertada (célula menor), e
    // reduzir a folga interna da célula (em vez de manter os mesmos 86% de
    // sempre) recupera tamanho de alvo de toque — importante em aparelho
    // pequeno, onde célula pequena + fator fixo dava uma chave franzina.
    const fatorChave = pecas.length <= 4 ? 0.86 : pecas.length <= 6 ? 0.94 : 0.99;
    const razaoChave = Math.min(cellW / 130, cellH / 54) * fatorChave;
    const razaoCadeado = Math.min(cellW, cellH) / 160 * 1.05;
    // A silhueta no tabuleiro não é só a chave: é a chave DENTRO do rebaixo
    // entalhado (`Fechadura._desenharSilhueta`, `padX`/`padY` somam 40×60 ao
    // redor dela). Sem contar essa folga aqui, `razaoChave` (calculada só
    // pela chave nua) deixava o rebaixo maior que a própria célula da grade —
    // os quatro rebaixos ficavam colados uns nos outros e nas bordas da tábua.
    const razaoFechadura = Math.min(cellW / (130 + 40), cellH / (54 + 60)) * 0.86;

    const centrosGrade = (offsetX) => pecas.map((_, i) => {
      const col = i % colunas;
      const lin = Math.floor(i / colunas);
      return {
        x: offsetX + padInterno + col * (cellW + gapGrade) + cellW / 2,
        y: padInterno + lin * (cellH + gapGrade) + cellH / 2,
      };
    });

    const ordemTabuleiro = embaralhar(pecas.map((_, i) => i));
    const ordemBandeja = embaralhar(pecas.map((_, i) => i));
    const centrosTabuleiro = centrosGrade(0);
    const centrosBandeja = centrosGrade(xBandeja);

    this.tabuleiro = new Node();
    this.area.adicionar(this.tabuleiro);

    this.fechaduras = ordemTabuleiro.map((pecaIndex, posicao) => {
      const peca = pecas[pecaIndex];
      const centro = centrosTabuleiro[posicao];
      const fechadura = new Fechadura({
        x: centro.x, y: centro.y,
        tamanho: this.nivel.cadeado ? razaoCadeado : razaoFechadura,
        cadeado: !!this.nivel.cadeado,
        pecaId: peca.id, cor: peca.cor, bow: peca.bow, dentes: peca.dentes,
      });
      this.tabuleiro.adicionar(fechadura);
      return fechadura;
    });

    this.pecas = [];
    ordemBandeja.forEach((pecaIndex, posicao) => {
      const peca = pecas[pecaIndex];
      const centro = centrosBandeja[posicao];
      const chave = new Chave({
        x: centro.x, y: centro.y, tamanho: razaoChave, interativo: true,
        pecaId: peca.id, cor: peca.cor, bow: peca.bow, dentes: peca.dentes,
      });
      chave.trayX = centro.x;
      chave.trayY = centro.y;
      chave.on('apertar', (ponto) => this._pegarPeca(chave, ponto));
      this.area.adicionar(chave);
      this.pecas.push(chave);
    });

    // Por cima de tudo em `this.area` (madeira, bandeja, peças): as estrelas
    // do encaixe não podem ficar escondidas atrás de nenhuma peça vizinha.
    this.particulas = new ParticleSystem();
    this.area.adicionar(this.particulas);

    // -------------------------------------------------------- entrada global
    this.aoDesmontar(this.input.on('arrastar', (ponto) => this._moverArrasto(ponto)));
    this.aoDesmontar(this.input.on('soltar', () => this._soltarArrasto()));
    this.aoDesmontar(this.input.on('cancelar', () => this._soltarArrasto()));

    // ------------------------------------------------------------------ HUD
    this.barra = new ScoreBar({
      largura: 250, altura: 36, x: espaco.md, y: espaco.md, icone: 'estrela',
    }).acompanhar(this.placar);

    this.vidas = new Lives({
      total: this.nivel.vidas ?? 3, x: espaco.md + 266, y: espaco.md + 1,
    }).acompanhar(this.placar);

    this.tempo = new TimerBar({
      largura: 190, altura: 36, x: espaco.md + 266 + 168, y: espaco.md,
    });
    this.adicionar(this.tempo);
    this.tempo.on('acabou', () => {
      if (!this.placar.encerrado) this.placar.encerrarPorTempo();
    });

    this.adicionar(this.barra, this.vidas);

    this.adicionar(new IconButton({
      icone: 'pausa', variante: 'suaveAzul', x: L - 96 - 72 - 72 - 32, y: espaco.md,
      audio: this.audio, somToque: config.audio?.clique, aoTocar: () => this._pausar(),
    }));
    this.adicionar(new IconButton({
      icone: 'tutorial', variante: 'suaveAzul', x: L - 96 - 72 - 16, y: espaco.md,
      audio: this.audio, somToque: config.audio?.clique, aoTocar: () => this._pedirAjuda(),
    }));
    this.adicionar(new SoundToggle({
      audio: this.audio, x: L - 96, y: espaco.md, somToque: config.audio?.clique,
    }));

    // ---------------------------------------------------------------- pausa
    this.pausa = new PauseScreen({
      largura: L, altura: A, audio: this.audio, config, mostrarSom: false,
      aoContinuar: () => { this.pausada = false; Tween.retomarTodos(); this.tempo.retomar(); },
      aoReiniciar: () => this.irPara('jogando', { nivel: this.nivel }),
      aoSair: () => this.irPara('menu'),
    });
    this.adicionar(this.pausa);

    this.ajuda = new HelpScreen({
      cena: this,
      aoFechar: () => { this.pausada = false; Tween.retomarTodos(); this.tempo.retomar(); },
    });
    this.adicionar(this.ajuda);

    this.placar.on('vitoria', () => {
      Tween.de(this).esperar(700).chamar(() => this._terminar(true));
    });
    this.placar.on('derrota', () => this._terminar(false));

    // O cronômetro só começa a correr depois de tudo montado.
    this.tempo.iniciar(this.nivel.tempoInicial ?? 30);
  }

  // --------------------------------------------------------------- arrasto

  _pegarPeca(chave, ponto) {
    if (this.pausada || this.placar.encerrado || this._arrastando || chave.colocada) return;
    const local = this.area.globalParaLocal(ponto.x, ponto.y);
    this._deslocX = chave.x - local.x;
    this._deslocY = chave.y - local.y;
    chave.paraFrente();
    Tween.removerDe(chave);
    this._arrastando = chave;
  }

  _raioTolerancia() {
    return this.nivel.cadeado ? 60 : 70;
  }

  _lugarMaisPerto(chave) {
    const raio = this._raioTolerancia();
    let melhor = null;
    let melhorDist = Infinity;
    for (const fechadura of this.fechaduras) {
      if (fechadura.resolvida) continue;
      const d = Math.hypot(chave.x - fechadura.x, chave.y - fechadura.y);
      if (d <= raio && d < melhorDist) { melhorDist = d; melhor = fechadura; }
    }
    return melhor;
  }

  _moverArrasto(ponto) {
    const chave = this._arrastando;
    if (!chave) return;
    const local = this.area.globalParaLocal(ponto.x, ponto.y);
    chave.x = local.x + this._deslocX;
    chave.y = local.y + this._deslocY;

    const fechadura = this._lugarMaisPerto(chave);
    if (fechadura) {
      const dx = fechadura.x - chave.x;
      const dy = fechadura.y - chave.y;
      const dist = Math.hypot(dx, dy);
      const raio = this._raioTolerancia();
      const forca = 1 - Math.min(1, dist / raio);
      chave.x += dx * forca * 0.3;
      chave.y += dy * forca * 0.3;
    }
  }

  _soltarArrasto() {
    const chave = this._arrastando;
    if (!chave) return;
    this._arrastando = null;
    Tween.removerDe(chave);

    const fechadura = this._lugarMaisPerto(chave);
    if (fechadura && fechadura.pecaId === chave.pecaId) {
      this._encaixar(chave, fechadura);
      return;
    }

    if (fechadura) {
      fechadura.piscarErro();
      this._tentativasErradas += 1;
      if (this.config.audio?.erro) this.audio.efeito(this.config.audio.erro);
      this.placar.errar(1);
      if (this.placar.encerrado) return; // 'derrota' já disparou _terminar
    }

    this.area.adicionarEm(this.indiceBasePecas, chave);
    Tween.removerDe(chave);
    Tween.para(chave, { x: chave.trayX, y: chave.trayY }, 220, Easing.suaveSaida);
  }

  _encaixar(chave, fechadura) {
    chave.colocada = true;
    chave.interativo = false;

    // A chave da bandeja nasce um pouco maior que o rebaixo da fechadura
    // (ver comentário do plano de layout). Redimensionar ANTES do tween
    // mascara o "pulo" de tamanho no movimento — mesmo truque do Geométrico.
    chave.definirTamanho(fechadura.escalaChave);

    // Efeito de encaixe: a chave GIRA pra travar (como virar mesmo numa
    // fechadura de verdade) em vez de só crescer e voltar — mais fiel ao
    // tema do jogo. Junto: uma onda se abre a partir do rebaixo (`_anel`,
    // na `Fechadura`) e um estouro de estrelas na cor da própria chave.
    Tween.removerDe(chave);
    const tween = Tween.para(chave, {
      x: fechadura.x, y: fechadura.y, brilho: 1,
    }, 180, Easing.suaveSaida)
      .chamar(() => {
        // Tudo que celebra o acerto na FECHADURA (onda, alça, ✓) só liga
        // AQUI — no instante em que a chave chega de verdade — e não no
        // início do arrasto solto. Antes, `resolvida`/`_anel` disparavam
        // 570ms mais cedo (junto do início deste tween), quando o olho ainda
        // está seguindo a chave voando, não o cadeado: pelo tempo dela
        // chegar, a onda já tinha murchado e a alça só "pulava" pronta, sem
        // transição — quase imperceptível. Sincronizado aqui, os quatro
        // efeitos (estrelas, onda, alça, ✓) explodem juntos no mesmo instante.
        fechadura.resolvida = true;
        Tween.removerDe(fechadura);
        Tween.para(fechadura, { _anel: 1 }, 480, Easing.suaveSaida)
          .chamar(() => { fechadura._anel = 0; });
        if (fechadura.cadeado) {
          // Alça com salto (ultrapassa -14 e volta) e ✓ crescendo com o
          // mesmo tipo de salto — `Easing.costasSaida` em ambos, igual ao
          // resto do motor usa pra "assentar" com uma mola, não um corte seco.
          Tween.para(fechadura, { _alcaY: -14 }, 260, Easing.costasSaida);
          Tween.para(fechadura, { _marca: 1 }, 320, Easing.costasSaida);
          // Depois de um instante parado — tempo pra criança REGISTRAR a cor
          // e o ✓ (a "lembrança" da chave certa, ver comentário do corpo) —
          // o cadeado inteiro encolhe e some. Limpa o tabuleiro conforme os 8
          // vão sendo resolvidos, em vez de ficar lotado até o fim; `regX`/
          // `regY` já centralizados (construtor) fazem o encolhimento mirar
          // o próprio meio do cadeado, não o canto.
          Tween.de(fechadura)
            .esperar(650)
            .entao({ scaleX: 0, scaleY: 0, alpha: 0 }, 260, Easing.suaveEntrada)
            .chamar(() => { fechadura.visible = false; });
        }
        // Amarelo sempre — cor de estrela/recompensa, igual ao resto do motor
        // (`criarEstrelaVoadora`), não a cor da própria chave: o estouro é
        // sobre TER acertado, não sobre qual chave era.
        this.particulas?.disparar({
          x: fechadura.x, y: fechadura.y, cor: '#FDE047',
          quantidade: 12, tamanhoMin: 6, tamanhoMax: 12, velocidade: 120, duracao: 0.55,
        });
      })
      .entao({ rotation: -26 }, 90, Easing.suaveSaida)
      .entao({ rotation: 12, brilho: 0 }, 140, Easing.suaveSaida)
      .entao({ rotation: 0 }, 160, Easing.costasSaida);

    // No cadeado (Difícil) o CADEADO já é o feedback de "resolvido" (alça
    // sobe + ✓, `Fechadura._desenharCadeado`) — a chave, depois de pousar,
    // some: sem isto ela ficava por cima do cadeado aberto pra sempre,
    // disputando espaço com o próprio ✓. Na silhueta (Fácil/Médio) a chave
    // É o feedback (fica visível dentro do rebaixo), então liga o brilho
    // ambiente contínuo — só DEPOIS do tween acima soltar a propriedade
    // `brilho`, senão os dois brigam pelo mesmo valor ao mesmo tempo.
    if (fechadura.cadeado) {
      tween.chamar(() => { chave.visible = false; });
    } else {
      tween.chamar(() => { chave._pulsoAmbiente = true; });
    }

    if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);
    this._colocadas += 1;
    this.placar.acertar(1);
  }

  // ------------------------------------------------------------------ HUD

  _cancelarArrastoEmCurso() {
    if (!this._arrastando) return;
    const chave = this._arrastando;
    this._arrastando = null;
    Tween.removerDe(chave);
    chave.x = chave.trayX;
    chave.y = chave.trayY;
  }

  _pausar() {
    if (this.placar.encerrado) return;
    this._cancelarArrastoEmCurso();
    Tween.pausarTodos();
    this.tempo.pausar();
    this.pausada = true;
    this.pausa.abrir();
  }

  _pedirAjuda() {
    if (this.placar.encerrado || this.pausada) return;
    this._cancelarArrastoEmCurso();
    Tween.pausarTodos();
    this.tempo.pausar();
    this.pausada = true;
    this.ajuda.abrir();
  }

  _terminar(venceu) {
    this.tempo.pausar();
    this.irPara('resultado', {
      nivel: this.nivel,
      resultado: this.placar.paraAva(venceu, { erros: this._tentativasErradas }),
    });
  }

  atualizar(dt) {
    if (this.pausada) {
      this.pausa.atualizar(dt);
      this.ajuda.atualizar(dt);
      return;
    }
    super.atualizar(dt);
  }
}
