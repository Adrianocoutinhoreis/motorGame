/**
 * config.js — o "formulário" do jogo Jogo das Cores.
 *
 * Este arquivo declara TUDO que o motor precisa saber. Preencher isto (e a
 * cena de partida) é o trabalho de criar um jogo novo — telas, carregamento,
 * som, navegação e registro no AVA vêm prontos.
 *
 * Leia junto: docs/CRIAR-JOGO.md e docs/CONTRATO-AVA.md
 */
export default {
  // ------------------------------------------------------------- identidade
  /** Slug ESTÁVEL. Vai no campo `jogo` da mensagem do AVA — não mude depois de publicar. */
  slug: 'jogo-das-cores',
  titulo: 'Jogo das Cores',
  subtitulo: 'Toque nas estrelas!',

  /** Contexto pedagógico — aparece na documentação e ajuda o professor. */
  objetivo: 'Descreva aqui o que a criança aprende ou treina nesta atividade.',
  faixaEtaria: '4 a 7 anos',

  // -------------------------------------------------------------- exibição
  /** Resolução lógica. O Stage escala para qualquer tamanho de iframe. */
  largura: 1280,
  altura: 720,
  corLetterbox: '#0B1220',

  /**
   * Regra RE-01 (docs/REGRAS-EDUCACIONAIS.md): todo texto exibido em CAIXA ALTA.
   * Aos 4–7 anos a criança lê letra bastão maiúscula. Só desligue (`false`) se
   * este jogo for para leitores já fluentes — e registre o motivo no CHECKLIST.
   */
  textoEmCaixaAlta: true,

  // ----------------------------------------------------------------- níveis
  /**
   * Um item por nível. Com MAIS DE UM item o motor mostra a tela de seleção;
   * com um só, JOGAR vai direto à partida.
   * `id` é o que vai no campo `nivel` do contrato — sempre um número.
   */
  niveis: [
    {
      id: 1,
      nome: 'Fácil',
      descricao: '5 estrelas',
      amostra: '★ ★ ★',
      cor: '#2563EB',
      meta: 5,      // vira `totalPerguntas`
      vidas: 3,
    },
  ],

  // --------------------------------------------------------------- tutorial
  /**
   * Passos do "como jogar". Cada passo é narrado; `desenho` recebe
   * (ctx, largura, altura, tempo) e pode animar o gesto do jogo.
   */
  tutorial: [
    {
      titulo: 'Toque na estrela',
      texto: 'Uma estrela aparece na tela. Toque nela antes que ela suma!',
      desenho: (ctx, l, a, t) => {
        const x = l / 2;
        const y = a / 2;
        const pulso = 1 + Math.sin(t * 3) * 0.08;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(pulso, pulso);
        ctx.fillStyle = '#FACC15';
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const raio = i % 2 === 0 ? 58 : 24;
          const ang = (i / 10) * Math.PI * 2 - Math.PI / 2;
          const px = Math.cos(ang) * raio;
          const py = Math.sin(ang) * raio;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      },
    },
    {
      titulo: 'Cuidado com os erros',
      texto: 'Se tocar fora da estrela, você perde um coração. São só três!',
      desenho: (ctx, l, a) => {
        ctx.fillStyle = '#DC2626';
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(l / 2 - 90 + i * 90, a / 2, 26, 0, Math.PI * 2);
          ctx.fill();
        }
      },
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * Manifesto de recursos. Todos os caminhos são RELATIVOS a index.html.
   * Um recurso que falhar não impede o jogo de abrir (o motor avisa no console).
   */
  assets: [
    // { id: 'clique', src: './assets/audio/clique.mp3' },
  ],

  /**
   * Mascote: aponta para um id de imagem declarado em `assets` acima.
   * Omitido (ou null), o motor desenha a coruja vetorial padrão — o jogo já
   * nasce com um mascote, sem depender de nenhum arquivo de arte.
   * A imagem é escalada pela ALTURA, preservando a proporção.
   */
  mascote: null,

  /** Mapa de sons usados pelas telas padrão. Deixe null o que não existir. */
  audio: {
    musica: null,
    clique: null,
    acerto: null,
    erro: null,
    vitoria: null,
    derrota: null,
    abertura: null,
  },

  // -------------------------------------------------------------------- AVA
  /** Decisão do projeto: derrota também é uma tentativa e também é registrada. */
  registrarDerrota: true,
};
