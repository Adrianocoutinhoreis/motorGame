/**
 * config.js — configuração do Bingo da Adição e Subtração.
 *
 * Jogo educativo do 1º/2º ano (Série Numerandus).
 * A criança calcula operações de adição e subtração de cabeça e compete
 * contra o computador para ver quem faz BINGO primeiro (4 em linha).
 */
export default {
  // ------------------------------------------------------------- identidade
  slug: 'bingo-da-adicao-e-subtracao',
  titulo: 'Bingo da Adição e Subtração',
  subtitulo: 'Resolva as operações e vença o computador!',

  objetivo: 'Calcular operações de adição e subtração mentalmente e marcar o resultado na sua cartela antes do computador fazer BINGO.',
  faixaEtaria: '5 a 8 anos',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#0F172A',
  tema: 'bingo',
  textoEmCaixaAlta: true,

  // ----------------------------------------------------------------- níveis
  /**
   * 3 níveis de progressão pedagógica:
   *   Nível 1 (Fácil): Adições simples até 15 (ex: 2+3, 4+1, 5+5, 7+4).
   *   Nível 2 (Médio): Adição e subtração misturadas até 20 (ex: 8+4, 15-6, 10-3).
   *   Nível 3 (Difícil): Operações misturadas com números até 30 (ex: 18+7, 28-9, 14+11).
   */
  niveis: [
    {
      id: 1,
      nome: 'Fácil',
      cor: '#16A34A',
      meta: 10,
      vidas: 0,
      maxNumero: 18,
      operacoes: ['+'],
      tempoPensarMs: 60000, // 60 segundos para pensar
    },
    {
      id: 2,
      nome: 'Médio',
      cor: '#F59E0B',
      meta: 10,
      vidas: 0,
      maxNumero: 24,
      operacoes: ['+', '-'],
      tempoPensarMs: 60000, // 60 segundos para pensar
    },
    {
      id: 3,
      nome: 'Difícil',
      cor: '#DC2626',
      meta: 10,
      vidas: 0,
      maxNumero: 30,
      operacoes: ['+', '-'],
      tempoPensarMs: 60000, // 60 segundos para pensar
    },
  ],

  // ------------------------------------------------------------ competição CPU
  competicao: {
    niveisCpu: {
      1: { chanceAcerto: 0.55, tempoReacaoMs: [2500, 4500] },
      2: { chanceAcerto: 0.70, tempoReacaoMs: [1800, 3200] },
      3: { chanceAcerto: 0.85, tempoReacaoMs: [1200, 2200] },
    },
  },

  // --------------------------------------------------------------- tutorial
  tutorial: [
    {
      titulo: 'Veja a conta sorteada',
      texto: 'A cada rodada, uma carta é sorteada com uma conta de adição ou subtração.',
      fala: 'tutorial_tela1',
      desenho: (ctx, l, a, t) => desenharPasso1Tutorial(ctx, l, a, t),
    },
    {
      titulo: 'Resolva e marque na sua cartela',
      texto: 'Calcule o resultado de cabeça e toque no número certo na sua cartela. Tocou errado? Toque de novo para desfazer, sem problema!',
      fala: 'tutorial_tela2',
      desenho: (ctx, l, a, t) => desenharPasso2Tutorial(ctx, l, a, t),
    },
    {
      titulo: 'Espie a cartela do computador',
      texto: 'A cartela do computador fica escondida. Depois de responder, toque em ESPIAR CARTELA para ver como ele está indo.',
      fala: 'tutorial_tela3',
      desenho: (ctx, l, a, t) => desenharPasso3Tutorial(ctx, l, a, t),
    },
    {
      titulo: 'Complete 4 em linha e vença!',
      texto: 'Marque 4 números seguidos — em linha, coluna ou diagonal — e faça BINGO! Quem conseguir primeiro, você ou o computador, vence o jogo.',
      fala: 'tutorial_tela4',
      desenho: (ctx, l, a, t) => desenharPasso4Tutorial(ctx, l, a, t),
    },
  ],

  // ------------------------------------------------------------------ assets
  assets: [
    // Narração do tutorial, um arquivo por passo (`config.tutorial[n].fala`),
    // tocada pelo `TutorialScreen` do motor — também serve à AJUDA dentro da
    // partida (regra RE-05), já que as duas telas reaproveitam os mesmos passos.
    // Ficha de transcrição em assets/audio-transcricao/tutorial_telaN/.
    { id: 'tutorial_tela1', src: './assets/audio/tutorial_tela1.wav' },
    { id: 'tutorial_tela2', src: './assets/audio/tutorial_tela2.wav' },
    { id: 'tutorial_tela3', src: './assets/audio/tutorial_tela3.wav' },
    { id: 'tutorial_tela4', src: './assets/audio/tutorial_tela4.wav' },
    // Efeitos de fim de partida — reaproveitados de Jogo das Formas/Blocos/Cores
    // (mesmo arquivo, mesmo SHA-256 nos três). Sem fala, então servem a qualquer
    // jogo da coleção. Ficha em assets/audio-transcricao/acertoSOS|erroSOS/.
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'erroSOS', src: './assets/audio/erroSOS.wav' },
    // Clique ao escolher um número na cartela — só a do ALUNO (a da CPU não é
    // tocável). Arquivo fornecido pelo humano. Ficha em
    // assets/audio-transcricao/cliqueCartela/.
    { id: 'cliqueCartela', src: './assets/audio/discord_ping_sound_effect.mp3' },
  ],

  mascote: { telas: [] },

  audio: {
    musica: null,
    clique: null,
    acerto: null,
    erro: null,
    // Ficam null DE PROPÓSITO: a ResultScreen tocaria este som de novo ao
    // entrar, dobrando com o que o próprio Bingo já toca no instante do BINGO
    // (ver GameScene._tocarSomFimEPersistirAteResultado). Os arquivos
    // continuam declarados em `assets`, só não plugados aqui.
    vitoria: null,
    derrota: null,
    abertura: null,
  },

  registrarDerrota: true,
};

// ---------------------------------------------------------------------------
// Desenhos auxiliares do tutorial
// ---------------------------------------------------------------------------

function desenharPasso1Tutorial(ctx, l, a, t) {
  ctx.save();
  const cx = l / 2;
  const cy = a / 2;

  // Carta do desafio com efeito 3D sutil
  const cw = 200;
  const ch = 230;
  ctx.shadowColor = 'rgba(2, 6, 23, 0.35)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(cx - cw / 2, cy - ch / 2, cw, ch, 18);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Friso superior da carta
  ctx.fillStyle = '#0284C7';
  ctx.beginPath();
  ctx.roundRect(cx - cw / 2, cy - ch / 2, cw, 10, [18, 18, 0, 0]);
  ctx.fill();

  // Etiqueta
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 14px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CARTA SORTEADA', cx, cy - 54);

  // Operação
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 38px Outfit, sans-serif';
  ctx.fillText('2 + 3 = ?', cx, cy + 6);

  ctx.restore();
}

function desenharPasso2Tutorial(ctx, l, a, t) {
  ctx.save();
  const cx = l / 2;
  const cy = a / 2;

  // 2 cartelas lado a lado (Jogador vs CPU)
  const cardW = 120;
  const cardH = 140;
  const gap = 40;

  // Cartela do Jogador (esquerda)
  const x1 = cx - cardW - gap / 2;
  const y1 = cy - cardH / 2;
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#0284C7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(x1, y1, cardW, cardH, 12);
  ctx.fill();
  ctx.stroke();

  // Friso azul
  ctx.fillStyle = '#0284C7';
  ctx.beginPath();
  ctx.roundRect(x1, y1, cardW, 8, [12, 12, 0, 0]);
  ctx.fill();

  // Label "VOCÊ"
  ctx.fillStyle = '#0284C7';
  ctx.font = 'bold 12px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('VOCÊ', x1 + cardW / 2, y1 + 20);

  // Mini grade 2x2
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      const mx = x1 + 20 + c * 44;
      const my = y1 + 32 + r * 44;
      const isHit = r === 1 && c === 0;
      ctx.fillStyle = isHit ? '#E0F2FE' : '#F8FAFC';
      ctx.strokeStyle = isHit ? '#0284C7' : '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(mx, my, 38, 38, 6);
      ctx.fill();
      ctx.stroke();
      if (isHit) {
        ctx.fillStyle = 'rgba(2, 132, 199, 0.35)';
        ctx.beginPath();
        ctx.arc(mx + 19, my + 19, 14, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = isHit ? '#0284C7' : '#475569';
      ctx.font = 'bold 14px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isHit ? '5' : `${r * 2 + c + 3}`, mx + 19, my + 19);
    }
  }

  // Cartela do CPU (direita) — sempre OCULTA, igual ao jogo de verdade
  const x2 = cx + gap / 2;
  const gradCpu = ctx.createLinearGradient(x2, y1, x2 + cardW, y1 + cardH);
  gradCpu.addColorStop(0, '#475569');
  gradCpu.addColorStop(1, '#64748B');
  ctx.fillStyle = gradCpu;
  ctx.beginPath();
  ctx.roundRect(x2, y1, cardW, cardH, 12);
  ctx.fill();

  // "?" central, como na cartela virada de verdade
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.beginPath();
  ctx.arc(x2 + cardW / 2, y1 + cardH * 0.42, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('?', x2 + cardW / 2, y1 + cardH * 0.42 + 2);

  // Label "CARTELA VIRADA"
  ctx.font = 'bold 11px Outfit, sans-serif';
  ctx.fillText('CARTELA', x2 + cardW / 2, y1 + cardH * 0.74);
  ctx.fillText('VIRADA', x2 + cardW / 2, y1 + cardH * 0.74 + 14);

  // Seta de competição
  ctx.fillStyle = '#FACC15';
  ctx.font = 'bold 28px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', cx, cy);

  ctx.restore();
}

function desenharPasso3Tutorial(ctx, l, a, t) {
  ctx.save();
  const cx = l / 2;
  const cy = a / 2;

  const cardW = 130;
  const cardH = 150;
  const x = cx - cardW / 2;
  const y = cy - cardH / 2 - 14;

  // Pisca entre oculta e revelada, pra mostrar a espiada acontecendo.
  const ciclo = (t % 3) / 3; // 0..1 a cada 3s
  const revelando = ciclo > 0.45 && ciclo < 0.85;

  if (!revelando) {
    const grad = ctx.createLinearGradient(x, y, x + cardW, y + cardH);
    grad.addColorStop(0, '#475569');
    grad.addColorStop(1, '#64748B');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, cardW, cardH, 12);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.beginPath();
    ctx.arc(cx, y + cardH * 0.4, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', cx, y + cardH * 0.4 + 2);
  } else {
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x, y, cardW, cardH, 12);
    ctx.fill();
    ctx.stroke();

    // Mini grade 2x2 revelada
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const mx = x + 14 + c * 52;
        const my = y + 20 + r * 52;
        ctx.fillStyle = '#F1F5F9';
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(mx, my, 44, 44, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 15px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${r * 2 + c + 8}`, mx + 22, my + 22);
      }
    }
  }

  // Botão "ESPIAR CARTELA" com barrinha de tempo
  const botW = 190;
  const botH = 48;
  const botX = cx - botW / 2;
  const botY = y + cardH + 26;
  ctx.fillStyle = 'rgba(100, 116, 139, 0.18)';
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(botX, botY, botW, botH, 12);
  ctx.fill();
  ctx.stroke();

  if (revelando) {
    // barra de progresso esvaziando (tempo acabando)
    const progresso = 1 - (ciclo - 0.45) / 0.4;
    const padX = 14;
    const barW = botW - padX * 2;
    const barY = botY + 10;
    ctx.fillStyle = 'rgba(100, 116, 139, 0.25)';
    ctx.beginPath();
    ctx.roundRect(botX + padX, barY, barW, 6, 3);
    ctx.fill();
    ctx.fillStyle = '#64748B';
    ctx.beginPath();
    ctx.roundRect(botX + padX, barY, barW * Math.max(0, progresso), 6, 3);
    ctx.fill();

    ctx.fillStyle = '#334155';
    ctx.font = 'bold 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TOQUE PRA ESCONDER', cx, botY + botH * 0.66);
  } else {
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ESPIAR CARTELA', cx, botY + botH / 2);
  }

  ctx.restore();
}

function desenharPasso4Tutorial(ctx, l, a, t) {
  ctx.save();
  const cx = l / 2;
  const cy = a / 2;

  // Cartela com linha de BINGO completa
  const cardW = 160;
  const cardH = 180;
  const x = cx - cardW / 2;
  const y = cy - cardH / 2;

  // Cartela
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#0284C7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(x, y, cardW, cardH, 12);
  ctx.fill();
  ctx.stroke();

  // Friso
  ctx.fillStyle = '#0284C7';
  ctx.beginPath();
  ctx.roundRect(x, y, cardW, 8, [12, 12, 0, 0]);
  ctx.fill();

  // Grade 4x4 com fichas
  const cellSize = 32;
  const gap = 6;
  const startX = x + 14;
  const startY = y + 20;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cx2 = startX + c * (cellSize + gap);
      const cy2 = startY + r * (cellSize + gap);
      const isLine = r === 1; // Linha horizontal completa

      ctx.fillStyle = isLine ? '#E0F2FE' : '#F8FAFC';
      ctx.strokeStyle = isLine ? '#0284C7' : '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cx2, cy2, cellSize, cellSize, 4);
      ctx.fill();
      ctx.stroke();

      if (isLine) {
        ctx.fillStyle = 'rgba(2, 132, 199, 0.35)';
        ctx.beginPath();
        ctx.arc(cx2 + cellSize / 2, cy2 + cellSize / 2, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = isLine ? '#0284C7' : '#475569';
      ctx.font = 'bold 12px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${r * 4 + c + 1}`, cx2 + cellSize / 2, cy2 + cellSize / 2);
    }
  }

  // Linha dourada de BINGO
  const lineY = startY + 1.5 * (cellSize + gap) + cellSize / 2;
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(250, 204, 21, 0.8)';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(startX, lineY);
  ctx.lineTo(startX + 3 * (cellSize + gap) + cellSize, lineY);
  ctx.stroke();
  ctx.shadowColor = 'transparent';

  // Texto BINGO! — dourado ESCURO (não o mesmo tom da linha): a linha brilha
  // sobre o branco do cartão, mas texto no mesmo amarelo-claro fica ilegível.
  ctx.fillStyle = '#92400E';
  ctx.font = 'bold 22px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BINGO! 4 EM LINHA!', cx, cy + cardH / 2 + 30);

  ctx.restore();
}
