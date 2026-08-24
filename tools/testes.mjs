/**
 * testes.mjs — testes de lógica do motor, sem navegador.
 *
 * O que ESTE arquivo pode provar: matriz, tween, sorteio, grade, placar,
 * máquina de estados e — o mais importante — o formato exato da mensagem do
 * AVA e a guarda contra registro duplicado.
 *
 * O que ele NÃO pode provar: renderização, toque e jogabilidade. Isso exige
 * navegador e está no roteiro de validação manual do CHECKLIST de cada jogo.
 * Fingir cobertura aqui seria pior do que dizer isso claramente.
 *
 * Uso: node tools/testes.mjs
 */
import { Matrix2D } from '../engine/core/Matrix2D.js';
import { Tween, Easing } from '../engine/core/Tween.js';
import { Rand } from '../engine/core/Rand.js';
import { GridBoard } from '../engine/gameplay/GridBoard.js';
import { ScoreSystem } from '../engine/gameplay/ScoreSystem.js';
import { CraneController } from '../engine/gameplay/CraneController.js';
import { Stage } from '../engine/core/Stage.js';
import { AvaBridge } from '../engine/ava/AvaBridge.js';
import { AudioBus } from '../engine/audio/AudioBus.js';
import { ESTADOS, transicaoValida } from '../engine/core/Estados.js';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let passaram = 0;
let falharam = 0;
const falhas = [];

function teste(nome, fn) {
  try {
    fn();
    passaram++;
    console.log(`  ok   ${nome}`);
  } catch (err) {
    falharam++;
    falhas.push({ nome, err });
    console.log(`  FALHOU  ${nome}\n         ${err.message}`);
  }
}

function ok(condicao, mensagem = 'esperava verdadeiro') {
  if (!condicao) throw new Error(mensagem);
}

function igual(recebido, esperado, mensagem = '') {
  const a = JSON.stringify(recebido);
  const b = JSON.stringify(esperado);
  if (a !== b) throw new Error(`${mensagem} recebido ${a}, esperado ${b}`);
}

function perto(recebido, esperado, tolerancia = 0.001, mensagem = '') {
  if (Math.abs(recebido - esperado) > tolerancia) {
    throw new Error(`${mensagem} recebido ${recebido}, esperado ~${esperado}`);
  }
}

function grupo(titulo, fn) {
  console.log(`\n${titulo}`);
  fn();
}

/**
 * Versão assíncrona de `teste`. Existe porque `AudioBus.falar()` devolve
 * Promise: sem o await, um teste que falhasse passaria calado.
 */
async function testeAsync(nome, fn) {
  try {
    await fn();
    passaram++;
    console.log(`  ok   ${nome}`);
  } catch (err) {
    falharam++;
    falhas.push({ nome, err });
    console.log(`  FALHOU  ${nome}\n         ${err.message}`);
  }
}

/** Captura o que o código escreveu em console.warn durante `fn`. */
async function capturarAvisos(fn) {
  const original = console.warn;
  const avisos = [];
  console.warn = (...args) => avisos.push(args.join(' '));
  try {
    await fn();
  } finally {
    console.warn = original;
  }
  return avisos;
}

// ---------------------------------------------------------------- Matrix2D
grupo('Matrix2D', () => {
  teste('transforma ponto com translação e escala', () => {
    const m = new Matrix2D().anexarTransformacao(100, 50, 2, 2, 0);
    const p = m.transformarPonto(10, 10);
    igual([p.x, p.y], [120, 70]);
  });

  teste('inversa desfaz a transformação (base do hit-test)', () => {
    const m = new Matrix2D().anexarTransformacao(30, -20, 1.5, 2, 45);
    const p = m.transformarPonto(12, 7);
    const inv = m.clonar().inverter();
    const volta = inv.transformarPonto(p.x, p.y);
    perto(volta.x, 12, 0.0001, 'x:');
    perto(volta.y, 7, 0.0001, 'y:');
  });

  teste('matriz não inversível devolve null em vez de NaN', () => {
    ok(new Matrix2D(0, 0, 0, 0, 0, 0).inverter() === null);
  });

  teste('ponto de registro desloca a origem', () => {
    const m = new Matrix2D().anexarTransformacao(0, 0, 1, 1, 0, 10, 10);
    const p = m.transformarPonto(10, 10);
    igual([p.x, p.y], [0, 0]);
  });
});

// ------------------------------------------------------------------- Tween
grupo('Tween', () => {
  teste('anima até o valor final', () => {
    Tween.removerTodos();
    const alvo = { x: 0 };
    Tween.para(alvo, { x: 100 }, 1000, Easing.linear);
    Tween.atualizarTodos(0.5);
    perto(alvo.x, 50, 0.001, 'meio do caminho:');
    Tween.atualizarTodos(0.5);
    perto(alvo.x, 100, 0.001, 'fim:');
  });

  teste('não ultrapassa o valor final com dt grande', () => {
    Tween.removerTodos();
    const alvo = { x: 0 };
    Tween.para(alvo, { x: 10 }, 100, Easing.linear);
    Tween.atualizarTodos(5);
    igual(alvo.x, 10);
  });

  teste('encadeia etapas e chama a função no fim', () => {
    Tween.removerTodos();
    const alvo = { a: 0 };
    let chamou = false;
    Tween.para(alvo, { a: 1 }, 100, Easing.linear)
      .entao({ a: 2 }, 100, Easing.linear)
      .chamar(() => { chamou = true; });
    Tween.atualizarTodos(0.25);
    igual(alvo.a, 2, 'valor final:');
    ok(chamou, 'a função encadeada precisa ter sido chamada');
  });

  teste('esperar adia a etapa seguinte', () => {
    Tween.removerTodos();
    const alvo = { v: 0 };
    Tween.de(alvo).esperar(200).entao({ v: 5 }, 100, Easing.linear);
    Tween.atualizarTodos(0.1);
    igual(alvo.v, 0, 'ainda esperando:');
    Tween.atualizarTodos(0.2);
    igual(alvo.v, 5, 'depois da espera:');
  });

  teste('removerDe cancela só o alvo indicado', () => {
    Tween.removerTodos();
    const a = { x: 0 };
    const b = { x: 0 };
    Tween.para(a, { x: 10 }, 100, Easing.linear);
    Tween.para(b, { x: 10 }, 100, Easing.linear);
    Tween.removerDe(a);
    Tween.atualizarTodos(0.2);
    igual(a.x, 0, 'cancelado:');
    igual(b.x, 10, 'preservado:');
  });

  teste('tween concluído sai da lista de ativos', () => {
    Tween.removerTodos();
    Tween.para({ x: 0 }, { x: 1 }, 50, Easing.linear);
    Tween.atualizarTodos(0.2);
    igual(Tween.quantidadeAtiva, 0);
  });
});

// -------------------------------------------------------------------- Rand
grupo('Rand', () => {
  teste('a mesma semente gera a mesma sequência', () => {
    const a = new Rand(42);
    const b = new Rand(42);
    igual([a.float(), a.float(), a.float()], [b.float(), b.float(), b.float()]);
  });

  teste('inteiro respeita os limites, inclusive', () => {
    const r = new Rand(7);
    let min = 99;
    let max = -99;
    for (let i = 0; i < 5000; i++) {
      const v = r.inteiro(1, 5);
      ok(Number.isInteger(v), 'precisa ser inteiro');
      min = Math.min(min, v);
      max = Math.max(max, v);
    }
    igual([min, max], [1, 5]);
  });

  teste('embaralhar preserva os elementos e não altera o original', () => {
    const r = new Rand(3);
    const original = [1, 2, 3, 4, 5];
    const misturado = r.embaralhar(original);
    igual(original, [1, 2, 3, 4, 5], 'original intacto:');
    igual([...misturado].sort((x, y) => x - y), [1, 2, 3, 4, 5]);
  });
});

// --------------------------------------------------------------- GridBoard
grupo('GridBoard', () => {
  const montar = (mapa, diagonais = false) => {
    const linhas = mapa.length;
    const colunas = mapa[0].length;
    const grade = new GridBoard({ linhas, colunas, diagonais });
    mapa.forEach((linha, l) => {
      [...linha].forEach((c, col) => {
        if (c !== '.') grade.definir(l, col, { tipo: c });
      });
    });
    return grade;
  };

  teste('grupo conectado acha peças iguais vizinhas', () => {
    const grade = montar([
      'AAB',
      'ACB',
      'BBB',
    ]);
    const grupo = grade.grupoConectado(grade.obter(0, 0));
    igual(grupo.length, 3, 'trio de A:');
  });

  teste('não atravessa peça de outro tipo', () => {
    const grade = montar([
      'ABA',
      'BBB',
      'ABA',
    ]);
    igual(grade.grupoConectado(grade.obter(0, 0)).length, 1);
  });

  teste('modo diagonal conecta na diagonal', () => {
    const semDiagonal = montar(['A.', '.A'], false);
    const comDiagonal = montar(['A.', '.A'], true);
    igual(semDiagonal.grupoConectado(semDiagonal.obter(0, 0)).length, 1, 'sem diagonal:');
    igual(comDiagonal.grupoConectado(comDiagonal.obter(0, 0)).length, 2, 'com diagonal:');
  });

  teste('gruposValidos ignora grupos menores que o mínimo', () => {
    const grade = montar([
      'AAB',
      '..B',
      '..B',
    ]);
    const grupos = grade.gruposValidos(3);
    igual(grupos.length, 1, 'só o trio de B:');
    igual(grupos[0].length, 3);
  });

  teste('gravidade para baixo empilha na base sem furos', () => {
    const grade = montar([
      'A',
      '.',
      'B',
    ]);
    grade.aplicarGravidade('baixo');
    igual(grade.obter(2, 0).tipo, 'B', 'base:');
    igual(grade.obter(1, 0).tipo, 'A', 'acima da base:');
    ok(grade.obter(0, 0) === null, 'topo precisa ficar vazio');
  });

  teste('gravidade para cima empilha no topo', () => {
    const grade = montar([
      '.',
      'A',
      '.',
    ]);
    grade.aplicarGravidade('cima');
    igual(grade.obter(0, 0).tipo, 'A');
  });

  teste('removerGrupo esvazia as células certas', () => {
    const grade = montar(['AAA']);
    grade.removerGrupo(grade.grupoConectado(grade.obter(0, 0)));
    igual(grade.todas().length, 0);
  });

  teste('desfazerCombosIniciais elimina grupos de partida', () => {
    const grade = montar([
      'AAA',
      'AAA',
    ]);
    let contador = 0;
    // Sorteio determinístico: alterna tipos até não haver mais trio.
    grade.desfazerCombosIniciais(() => ['B', 'C', 'D', 'E'][contador++ % 4], 3);
    igual(grade.gruposValidos(3).length, 0, 'não pode sobrar combo:');
  });

  teste('flood-fill não estoura a pilha em tabuleiro grande de um tipo só', () => {
    const grade = new GridBoard({ linhas: 40, colunas: 40 });
    grade.paraCada((_, l, c) => grade.definir(l, c, { tipo: 'X' }));
    igual(grade.grupoConectado(grade.obter(0, 0)).length, 1600);
  });
});

// ------------------------------------------------------------- ScoreSystem
grupo('ScoreSystem', () => {
  teste('conta acertos e erros da partida inteira', () => {
    const placar = new ScoreSystem({ total: 5, nivel: 2 });
    placar.acertar().acertar().errar();
    igual([placar.acertos, placar.erros], [2, 1]);
  });

  teste('vitória ao alcançar a meta', () => {
    const placar = new ScoreSystem({ total: 3 });
    let venceu = false;
    placar.on('vitoria', () => { venceu = true; });
    placar.acertar().acertar().acertar();
    ok(venceu, 'evento de vitória precisa disparar');
    ok(placar.venceu);
  });

  teste('derrota ao perder todas as vidas', () => {
    const placar = new ScoreSystem({ total: 5, vidas: 3 });
    placar.errar().errar().errar();
    ok(placar.perdeu, 'precisa estar derrotado');
    igual(placar.vidas, 0);
  });

  teste('não conta nada depois de encerrada', () => {
    const placar = new ScoreSystem({ total: 2 });
    placar.acertar().acertar();
    placar.acertar();
    igual(placar.acertos, 2, 'acertos após o fim:');
  });

  teste('progresso e aproveitamento batem com o cálculo do AVA', () => {
    const placar = new ScoreSystem({ total: 8 });
    placar.acertar().acertar();
    perto(placar.progresso, 0.25);
    igual(placar.aproveitamento, 25);
  });

  teste('paraAva devolve exatamente os campos do contrato', () => {
    const placar = new ScoreSystem({ total: 5, nivel: 3, vidas: 3 });
    placar.acertar().acertar().acertar().errar();
    igual(placar.paraAva(false), {
      acertos: 3, erros: 1, totalPerguntas: 5, nivel: 3, vitoria: false,
    });
  });

  /*
   * Regra RE-02 (docs/REGRAS-EDUCACIONAIS.md): a nota desconta o erro na
   * vitória e nunca na derrota.
   *
   * O defeito que estes testes travam: enquanto a nota era o acerto BRUTO,
   * toda vitória valia o máximo. Vencer é atingir a meta, então o bruto de
   * qualquer vitória é igual à meta — a fileira de estrelas enchia sempre e
   * "5 de 5" com duas quedas era indistinguível de uma partida limpa.
   *
   * `jogar()` intercala acertos e erros como numa partida de verdade: a ordem
   * importa, porque três erros encerram a partida e nada conta depois disso.
   */
  const jogar = (sequencia, opcoes = { total: 5, vidas: 3 }) => {
    const placar = new ScoreSystem(opcoes);
    for (const passo of sequencia) (passo === 'a' ? placar.acertar() : placar.errar());
    return placar;
  };

  teste('vitória limpa vale a nota máxima', () => {
    const placar = jogar('aaaaa');
    ok(placar.venceu, 'precisa ter vencido');
    igual(placar.pontuacao, 5);
    igual(placar.paraAva().acertos, 5);
  });

  teste('vitória com 2 quedas vale 3 de 5, não 5 de 5', () => {
    // O caso relatado: a torre fica completa, dois blocos caíram no caminho.
    const placar = jogar('aeaaeaa');
    igual([placar.acertos, placar.erros], [5, 2], 'bruto e falhas:');
    ok(placar.venceu, 'a torre completa vence, mesmo com quedas');
    igual(placar.pontuacao, 3, 'pontuação:');
    igual(placar.aproveitamento, 60, 'aproveitamento:');
  });

  teste('cada queda custa exatamente uma estrela', () => {
    igual(jogar('aaaaa').pontuacao, 5, 'nenhuma queda:');
    igual(jogar('aeaaaa').pontuacao, 4, 'uma queda:');
    igual(jogar('aeaaeaa').pontuacao, 3, 'duas quedas:');
  });

  teste('a derrota preserva o progresso em vez de zerar', () => {
    // "Errar não pode humilhar" (docs/DESIGN.md): quem encaixou dois blocos
    // avançou dois, e a derrota já é a consequência do erro. Descontar aqui
    // seria castigo duplo, e reportaria 0 progresso para quem construiu algo.
    const placar = jogar('aeaee');
    ok(!placar.venceu, 'precisa ter perdido');
    igual([placar.acertos, placar.erros], [2, 3], 'bruto e falhas:');
    igual(placar.pontuacao, 2, 'pontuação na derrota:');
    igual(placar.paraAva(false).acertos, 2);
  });

  teste('a tela e o AVA recebem sempre o MESMO número', () => {
    // É a razão de existir desta classe: mostrar um número e reportar outro é
    // o defeito clássico de instrumentação.
    for (const sequencia of ['aaaaa', 'aeaaeaa', 'aeaee', 'eee', 'aeaeaae']) {
      const placar = jogar(sequencia);
      igual(placar.paraAva().acertos, placar.pontuacao, `sequência ${sequencia}:`);
    }
  });

  teste('a pontuação nunca fica negativa', () => {
    // Um jogo com muitas vidas pode acumular mais falhas do que acertos.
    const placar = jogar('aeeeeee', { total: 5, vidas: 99 });
    ok(placar.pontuacao >= 0, `pontuação: ${placar.pontuacao}`);
  });

  teste('a barra da partida NÃO anda para trás quando um bloco cai', () => {
    // A barra espelha a torre de pé, e a torre não encurta. Por isso
    // `progresso` usa o acerto bruto, e só o número do FIM desconta.
    const placar = new ScoreSystem({ total: 5, vidas: 3 });
    placar.acertar().acertar();
    const antes = placar.progresso;
    placar.errar();
    igual(placar.progresso, antes, 'progresso depois de uma queda:');
    perto(placar.progresso, 0.4);
  });

  teste('estrelas: 3 sem erro, menos com erros', () => {
    const perfeito = new ScoreSystem({ total: 4 });
    perfeito.acertar(4);
    igual(perfeito.estrelas, 3, 'partida perfeita:');

    const comErros = new ScoreSystem({ total: 4 });
    comErros.errar().errar().errar().acertar(4);
    ok(comErros.estrelas < 3, 'com erros precisa valer menos');
  });
});

// --------------------------------------------------------- CraneController
grupo('CraneController', () => {
  teste('oscila entre os limites sem sair deles', () => {
    const g = new CraneController({ xMin: 100, xMax: 500, duracao: 1 });
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < 600; i++) {
      g.atualizar(1 / 60);
      min = Math.min(min, g.x);
      max = Math.max(max, g.x);
    }
    ok(min >= 99.9, `mínimo saiu do limite: ${min}`);
    ok(max <= 500.1, `máximo saiu do limite: ${max}`);
    perto(max, 500, 1, 'precisa chegar perto do limite direito:');
  });

  teste('volta ao ponto de partida depois de uma volta completa', () => {
    const g = new CraneController({ xMin: 0, xMax: 200, duracao: 1 });
    for (let i = 0; i < 120; i++) g.atualizar(1 / 60); // 2s = ida + volta
    perto(g.x, 0, 1);
  });

  teste('soltar devolve a posição, para o guindaste e libera a carga', () => {
    const g = new CraneController({ xMin: 0, xMax: 100, duracao: 1 });
    g.carregar({ nome: 'bloco' });
    g.atualizar(0.25);
    const x = g.x;
    const solto = g.soltar();
    igual(solto.x, x, 'x do lançamento:');
    ok(!g.ativo, 'precisa parar ao soltar');
    ok(g.carga === null, 'a carga precisa sair do gancho');
  });

  teste('soltar sem carga não faz nada', () => {
    const g = new CraneController({});
    ok(g.soltar() === null);
  });

  teste('modo colunas escolhe a coluna mais próxima', () => {
    const g = new CraneController({ modo: 'colunas', colunas: [0, 100, 200, 300] });
    g.seguirX(180);
    igual(g.indiceColuna, 2);
    igual(g.x, 200);
  });
});

// -------------------------------------------------- Stage: giro do contêiner
grupo('Stage — giro do contêiner em aparelho de pé', () => {
  /*
   * Em celular de pé o CSS gira `#palco` um quarto de volta, para o jogo 16:9
   * usar a tela toda em vez de virar uma tira. O Stage não gira nada: ele lê o
   * giro e inverte o mapa tela→lógico.
   *
   * Os números abaixo são MEDIDOS, num celular emulado de 360×800 com dpr 3:
   * caixa de layout girada 800×360, escala 0,5, letterbox de 80 px em x, e o
   * centro do botão JOGAR em (640, 340) lógicos caindo no pixel (190, 400) da
   * tela. A caixa envolvente do canvas girado mede 360×800 — trocada em relação
   * à caixa de layout, e é justamente essa troca que quebra o toque.
   */
  const CAIXA = { largura: 360, altura: 800, escala: 0.5, deslocX: 80, deslocY: 0 };
  const JOGAR_LOGICO = { x: 640, y: 340 };
  const JOGAR_NA_TELA = { x: 190, y: 400 };

  /** A conta inteira de `telaParaLogico`, sem precisar de DOM. */
  const paraLogico = (sx, sy, giro) => {
    const p = Stage.desfazerGiro(sx, sy, CAIXA.largura, CAIXA.altura, giro);
    return {
      x: (p.x - CAIXA.deslocX) / CAIXA.escala,
      y: (p.y - CAIXA.deslocY) / CAIXA.escala,
    };
  };

  teste('sem giro, desfazerGiro devolve o ponto intacto', () => {
    igual(Stage.desfazerGiro(190, 400, 360, 800, 0), { x: 190, y: 400 });
  });

  teste('com 90°, o toque cai no centro do botão que a criança viu', () => {
    const p = paraLogico(JOGAR_NA_TELA.x, JOGAR_NA_TELA.y, 90);
    perto(p.x, JOGAR_LOGICO.x, 0.5, 'x lógico:');
    perto(p.y, JOGAR_LOGICO.y, 0.5, 'y lógico:');
  });

  teste('IGNORAR o giro é o defeito que este código existe para evitar', () => {
    // Este era o comportamento anterior: usar a caixa envolvente como se nada
    // tivesse girado. Medido num iPad, levava o toque em JOGAR para COMO JOGAR.
    const errado = paraLogico(JOGAR_NA_TELA.x, JOGAR_NA_TELA.y, 0);
    ok(Math.abs(errado.x - JOGAR_LOGICO.x) > 100,
      `esperava erro grande em x, deu ${errado.x}`);
    ok(Math.abs(errado.y - JOGAR_LOGICO.y) > 100,
      `esperava erro grande em y, deu ${errado.y}`);
  });

  teste('ida e volta fecha: lógico → tela → lógico', () => {
    for (const alvo of [{ x: 0, y: 0 }, { x: 1280, y: 720 }, { x: 640, y: 360 }, { x: 17, y: 703 }]) {
      // A ida é a conta que o teste de navegador usa para saber onde tocar.
      const tela = {
        x: CAIXA.largura - (CAIXA.deslocY + alvo.y * CAIXA.escala),
        y: CAIXA.deslocX + alvo.x * CAIXA.escala,
      };
      const volta = paraLogico(tela.x, tela.y, 90);
      perto(volta.x, alvo.x, 0.01, `x de ${JSON.stringify(alvo)}:`);
      perto(volta.y, alvo.y, 0.01, `y de ${JSON.stringify(alvo)}:`);
    }
  });

  teste('-90° é o espelho de 90°', () => {
    igual(Stage.desfazerGiro(190, 400, 360, 800, -90), { x: 400, y: 190 });
  });

  teste('giroDaMatriz reconhece o quarto de volta, nos dois sentidos', () => {
    igual(Stage.giroDaMatriz('matrix(0, 1, -1, 0, 360, 0)'), 90);
    igual(Stage.giroDaMatriz('matrix(0, -1, 1, 0, 0, 800)'), -90);
  });

  teste('giroDaMatriz não confunde escala, translação ou giro torto com giro', () => {
    igual(Stage.giroDaMatriz('none'), 0);
    igual(Stage.giroDaMatriz(''), 0);
    igual(Stage.giroDaMatriz(null), 0);
    igual(Stage.giroDaMatriz('matrix(1, 0, 0, 1, 0, 0)'), 0, 'identidade:');
    igual(Stage.giroDaMatriz('matrix(1, 0, 0, 1, 40, 90)'), 0, 'só translação:');
    igual(Stage.giroDaMatriz('matrix(2, 0, 0, 2, 0, 0)'), 0, 'só escala:');
    // 45°: não é um quarto de volta, e o motor não sabe corrigir — melhor
    // devolver 0 e deixar o toque cru do que aplicar a correção errada.
    igual(Stage.giroDaMatriz('matrix(0.7071, 0.7071, -0.7071, 0.7071, 0, 0)'), 0, '45 graus:');
  });
});

// ------------------------------------------------------------------ Estados
grupo('Estados', () => {
  teste('fluxo padrão do jogo é válido', () => {
    ok(transicaoValida(ESTADOS.MENU, ESTADOS.NIVEIS));
    ok(transicaoValida(ESTADOS.NIVEIS, ESTADOS.JOGANDO));
    ok(transicaoValida(ESTADOS.JOGANDO, ESTADOS.RESULTADO));
    ok(transicaoValida(ESTADOS.RESULTADO, ESTADOS.JOGANDO));
  });

  teste('pular do menu direto para o resultado é inválido', () => {
    ok(!transicaoValida(ESTADOS.MENU, ESTADOS.RESULTADO));
  });
});

// ---------------------------------------------------------------- AvaBridge
grupo('AvaBridge (o contrato do METODO.md)', () => {
  const capturar = () => {
    const enviadas = [];
    const ponte = new AvaBridge({ jogo: 'jogo-teste', aoEnviar: (m) => enviadas.push(m) });
    return { ponte, enviadas };
  };

  teste('a mensagem tem exatamente o formato do contrato', () => {
    const { ponte, enviadas } = capturar();
    ponte.concluir({ acertos: 5, erros: 2, totalPerguntas: 5, nivel: 3, vitoria: true });
    igual(enviadas[0], {
      type: 'JOGO_CONCLUIDO',
      acertos: 5,
      erros: 2,
      totalPerguntas: 5,
      nivel: 3,
      jogo: 'jogo-teste',
    });
  });

  teste('type é exatamente "JOGO_CONCLUIDO"', () => {
    const { ponte, enviadas } = capturar();
    ponte.concluir({ acertos: 1, erros: 0, totalPerguntas: 1, nivel: 1, vitoria: true });
    igual(enviadas[0].type, 'JOGO_CONCLUIDO');
  });

  teste('números vão como number, mesmo se chegarem como string', () => {
    const { ponte, enviadas } = capturar();
    ponte.concluir({ acertos: '4', erros: '1', totalPerguntas: '5', nivel: '2', vitoria: true });
    const m = enviadas[0];
    ok(typeof m.acertos === 'number' && typeof m.erros === 'number', 'acertos/erros:');
    ok(typeof m.totalPerguntas === 'number' && typeof m.nivel === 'number', 'total/nivel:');
    igual([m.acertos, m.erros, m.totalPerguntas, m.nivel], [4, 1, 5, 2]);
  });

  teste('nivel nunca vai null (convenção 6d)', () => {
    const { ponte, enviadas } = capturar();
    ponte.concluir({ acertos: 0, erros: 0, totalPerguntas: 3, nivel: null, vitoria: false });
    igual(enviadas[0].nivel, 1);
  });

  teste('não duplica a MESMA partida (borda de subida)', () => {
    const { ponte, enviadas } = capturar();
    const r = { acertos: 5, erros: 0, totalPerguntas: 5, nivel: 1, vitoria: true };
    ponte.concluir(r);
    ponte.concluir(r);
    ponte.concluir(r);
    igual(enviadas.length, 1);
  });

  teste('replay genuíno registra de novo (borda de descida)', () => {
    const { ponte, enviadas } = capturar();
    ponte.concluir({ acertos: 5, erros: 1, totalPerguntas: 5, nivel: 1, vitoria: true });
    ponte.rearmar();
    ponte.concluir({ acertos: 5, erros: 0, totalPerguntas: 5, nivel: 1, vitoria: true });
    igual(enviadas.length, 2, 'duas tentativas:');
    igual([enviadas[0].erros, enviadas[1].erros], [1, 0], 'cada uma com seus números:');
  });

  teste('derrota é registrada quando registrarDerrota=true', () => {
    const enviadas = [];
    const ponte = new AvaBridge({ jogo: 'x', registrarDerrota: true, aoEnviar: (m) => enviadas.push(m) });
    ponte.concluir({ acertos: 2, erros: 3, totalPerguntas: 5, nivel: 1, vitoria: false });
    igual(enviadas.length, 1);
    igual(enviadas[0].acertos, 2, 'progresso parcial preservado:');
  });

  teste('derrota é omitida quando registrarDerrota=false', () => {
    const enviadas = [];
    const ponte = new AvaBridge({ jogo: 'x', registrarDerrota: false, aoEnviar: (m) => enviadas.push(m) });
    ponte.concluir({ acertos: 2, erros: 3, totalPerguntas: 5, nivel: 1, vitoria: false });
    igual(enviadas.length, 0);
  });

  teste('campos extras viajam na mensagem (vão para o payload do AVA)', () => {
    const { ponte, enviadas } = capturar();
    ponte.concluir({
      acertos: 5, erros: 0, totalPerguntas: 5, nivel: 1, vitoria: true,
      extras: { tempoSegundos: 42, conteudo: 'numeros-1-5' },
    });
    igual(enviadas[0].tempoSegundos, 42);
    igual(enviadas[0].conteudo, 'numeros-1-5');
  });

  teste('sem resultado usa defaults honestos, sem inventar número', () => {
    const { ponte, enviadas } = capturar();
    ponte.concluir(null);
    igual([enviadas[0].acertos, enviadas[0].erros, enviadas[0].totalPerguntas], [0, 0, null]);
  });

  teste('não envia dado de aluno, lo_id, activity_id, turma, xp ou nota', () => {
    const { ponte, enviadas } = capturar();
    ponte.concluir({ acertos: 1, erros: 0, totalPerguntas: 1, nivel: 1, vitoria: true });
    const proibidos = ['aluno', 'aluno_id', 'lo_id', 'activity_id', 'turma', 'xp', 'nota', 'score_percent'];
    for (const chave of proibidos) {
      ok(!(chave in enviadas[0]), `a mensagem não pode conter "${chave}"`);
    }
  });
});

// ------------------------------------------------- áudio: todo som é arquivo
grupo('Áudio — o motor não gera som, só toca arquivo', () => {
  teste('nenhum arquivo do motor referencia API de síntese', () => {
    // Esta é a trava da regra. A voz sintética do navegador cobria a falta de
    // locução e foi removida: numa atividade cujo conteúdo pedagógico É a
    // palavra falada, entregar à criança uma pronúncia que ninguém revisou é
    // pior que o silêncio. Um teste guarda a decisão; um comentário, não.
    const PROIBIDAS = [
      'speechSynthesis',
      'SpeechSynthesisUtterance',
      'createOscillator',
      'OscillatorNode',
    ];
    const raiz = fileURLToPath(new URL('../engine/', import.meta.url));
    const arquivos = readdirSync(raiz, { recursive: true })
      .filter((f) => typeof f === 'string' && f.endsWith('.js'));

    ok(arquivos.length > 20, `esperava varrer o motor inteiro; achei ${arquivos.length} arquivos`);

    const achados = [];
    for (const rel of arquivos) {
      const fonte = readFileSync(path.join(raiz, rel), 'utf8');
      for (const api of PROIBIDAS) {
        if (fonte.includes(api)) achados.push(`${rel.split(path.sep).join('/')} → ${api}`);
      }
    }
    igual(achados, [], 'som gerado em código em vez de tocado de arquivo:');
  });
});

await (async () => {
  console.log('\nAudioBus — narração sem arquivo (silêncio, e o console denuncia)');

  await testeAsync('falar() sem arquivo resolve false, sem lançar', async () => {
    const audio = new AudioBus();
    let r;
    await capturarAvisos(async () => { r = await audio.falar('nao-existe', { texto: 'oi' }); });
    igual(r, false, 'uma fala sem arquivo não pode se dizer bem-sucedida:');
  });

  await testeAsync('uma lacuna não trava a fila: a fala seguinte também resolve', async () => {
    const audio = new AudioBus();
    let a; let b;
    await capturarAvisos(async () => {
      [a, b] = await Promise.all([
        audio.falar('sem-um', { texto: 'um' }),
        audio.falar('sem-dois', { texto: 'dois' }),
      ]);
    });
    igual([a, b], [false, false], 'as duas falas precisam resolver:');
  });

  await testeAsync('o aviso nomeia o id e o que a locução deveria dizer', async () => {
    const audio = new AudioBus();
    const avisos = await capturarAvisos(() => audio.falar('escolhaNivel', { texto: 'Escolha um nível' }));
    igual(avisos.length, 1, 'esperava exatamente um aviso:');
    ok(avisos[0].includes('escolhaNivel'), `o aviso precisa nomear o id: ${avisos[0]}`);
    ok(avisos[0].includes('Escolha um nível'), `o aviso precisa trazer o texto: ${avisos[0]}`);
    ok(avisos[0].includes('silêncio'), `o aviso precisa dizer que fica em silêncio: ${avisos[0]}`);
  });

  await testeAsync('avisa UMA vez por lacuna, não a cada repetição', async () => {
    // O tutorial renarra a cada ida e volta de passo; um aviso por vez afogaria
    // o console e esconderia as outras lacunas.
    const audio = new AudioBus();
    const avisos = await capturarAvisos(async () => {
      await audio.falar('passo-1', { texto: 'primeiro passo' });
      await audio.falar('passo-1', { texto: 'primeiro passo' });
      await audio.falar('passo-2', { texto: 'segundo passo' });
    });
    igual(avisos.length, 2, 'duas lacunas distintas, dois avisos:');
  });

  await testeAsync('falar(null) também é lacuna, e aponta o config', async () => {
    const audio = new AudioBus();
    const avisos = await capturarAvisos(() => audio.falar(null, { texto: 'Muito bem!' }));
    igual(avisos.length, 1, 'esperava um aviso:');
    ok(avisos[0].includes('config'), `deveria apontar o config: ${avisos[0]}`);
    ok(avisos[0].includes('Muito bem!'), `deveria trazer o texto: ${avisos[0]}`);
  });

  await testeAsync('as lacunas ficam listadas em narracoesAusentes', async () => {
    const audio = new AudioBus();
    await capturarAvisos(async () => {
      await audio.falar('falaVitoria', { texto: 'Muito bem!' });
      await audio.falar('falaDerrota', { texto: 'Quase!' });
    });
    igual(audio.narracoesAusentes, ['falaVitoria', 'falaDerrota'],
      'a lista serve para revisar o jogo depois de uma sessão:');
  });

  await testeAsync('o texto da legenda não é caminho alternativo de áudio', async () => {
    // Não há como "ouvir" num teste sem navegador. O que se prova aqui é que
    // texto não substitui arquivo: com texto e sem gravação, o resultado é
    // falso — silêncio. A ausência da API de síntese está no teste acima.
    const audio = new AudioBus();
    let r;
    await capturarAvisos(async () => { r = await audio.falar(null, { texto: 'texto longo e bonito' }); });
    igual(r, false, 'texto não substitui arquivo:');
  });
})();

// ------------------------------------------------------------------ resumo
console.log(`\n${'-'.repeat(56)}`);
console.log(`${passaram} passaram, ${falharam} falharam`);
if (falharam > 0) {
  console.log('\nFalhas:');
  for (const f of falhas) console.log(`  - ${f.nome}: ${f.err.message}`);
  process.exit(1);
}
console.log('Lógica do motor validada. Renderização e toque exigem navegador (ver CHECKLIST do jogo).');
