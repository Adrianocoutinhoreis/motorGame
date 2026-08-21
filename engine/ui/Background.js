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

    this.tema = opcoes.tema ?? 'campo'; // 'campo' | 'construcao'
    this.corCeuTopo = opcoes.corCeuTopo ?? (this.tema === 'construcao' ? '#38BDF8' : cores.ceuProfundo);
    this.corCeuBase = opcoes.corCeuBase ?? (this.tema === 'construcao' ? '#BAE6FD' : cores.ceu);
    this.corColina = opcoes.corColina ?? '#86EFAC';
    this.corColinaFundo = opcoes.corColinaFundo ?? '#BBF7D0';
    this.mostrarSol = opcoes.mostrarSol ?? true;
    this.mostrarColinas = opcoes.mostrarColinas ?? true;

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
  }

  desenhar(ctx) {
    const l = this.largura;
    const a = this.altura;

    // Céu em degradê
    const ceu = ctx.createLinearGradient(0, 0, 0, a * 0.85);
    ceu.addColorStop(0, this.corCeuTopo);
    ceu.addColorStop(1, this.corCeuBase);
    ctx.fillStyle = ceu;
    ctx.fillRect(0, 0, l, a);

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

    if (this.tema === 'construcao') {
      this._desenharCanteiroConstrucao(ctx, l, a);
    } else if (this.mostrarColinas) {
      this._colina(ctx, a * 0.78, this.corColinaFundo, 0.9);
      this._colina(ctx, a * 0.86, this.corColina, 1.15);
      ctx.fillStyle = this.corColina;
      ctx.fillRect(0, a * 0.92, l, a * 0.08);
    }
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

    // 4. Chão do Canteiro de Obras
    ctx.fillStyle = '#F59E0B'; // terra/areia ensolarada
    ctx.fillRect(0, topoChao, l, a - topoChao);
    ctx.fillStyle = '#D97706';
    ctx.fillRect(0, topoChao, l, 12); // faixa de destaque do piso
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

  _colina(ctx, baseY, cor, amplitude) {
    const l = this.largura;
    const a = this.altura;
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.moveTo(0, a);
    ctx.lineTo(0, baseY);
    ctx.quadraticCurveTo(l * 0.25, baseY - 60 * amplitude, l * 0.5, baseY - 10 * amplitude);
    ctx.quadraticCurveTo(l * 0.75, baseY + 40 * amplitude, l, baseY - 30 * amplitude);
    ctx.lineTo(l, a);
    ctx.closePath();
    ctx.fill();
  }
}
