# CHECKLIST-AULAS.md — inventário das aulas a refazer

Estado da refação das aulas de `Aulas para Refazer/`. Documento vivo: atualizar a cada
entrega.

Legenda: ✅ concluído · 🚧 em andamento · 📋 planejado

---

## Visão geral

| # | Aula | ID | Novo slug | Status |
|---|---|---|---|---|
| 1 | Jogo dos Blocos | `870294` | `jogo-dos-blocos` | ✅ **refeito** (piloto) |
| 2 | Jogo das Formas | `870298` | `jogo-das-formas` | 🚧 **jogável**, com pendências declaradas |
| 3 | Jogo das Cores | `870296` | `jogo-das-cores` | 🚧 **especificado** — regras fechadas, mecânica central no motor e testada |

---

## Diagnóstico comum aos três originais

Os três são exports de Flash de ~2013 e compartilham exatamente os mesmos defeitos:

- **CreateJS/EaselJS + SoundJS 0.5.2 + jQuery 2.0.3 carregados por `http://` de
  `classes.educandus.com.br`** — bloqueado em qualquer página HTTPS moderna. Na prática, os
  três **não abrem** hoje em um AVA servido por HTTPS.
- `<canvas width="800" height="600">` fixo — cortado ou minúsculo em tablet e em iframe.
- `<meta charset="iso-8859-1">` — acentuação quebrada.
- `createjs.Ticker.setFPS(12)` e `setInterval` para o tempo — a partida corre com a aba em
  segundo plano.
- **Somente eventos de mouse** — injogáveis em tablet.
- `window.close()` como botão "voltar" — não faz nada dentro do iframe do AVA.
- Arquivo `*_visual.js` de 250 a 344 KB com a arte vetorial exportada em código.
- **Nenhum `postMessage`** — nenhuma das três aulas registra qualquer coisa no AVA hoje.
- `textos/*.json` presentes mas com conteúdo de exemplo, não usados.
- Os `.txt` na raiz de cada pasta estão vazios: são apenas marcadores do ID da aula.

---

## 1. Jogo dos Blocos — `870294` ✅

**Original:** `js/BlocosNumericos.js`. Gancho oscilante levando um bloco; clique solta;
empilhar 5 na ordem; 3 vidas. Nível "fácil" = números 1–5, "difícil" = vogais A-E-I-O-U.

**Refeito em:** `Games/jogo-dos-blocos/`

| O que mudou | Por quê |
|---|---|
| **3 níveis** (1–5, 6–10, vogais) em vez de 2 | Os áudios `seis.mp3`…`dez.mp3` **já existiam** na pasta original e nunca eram carregados. E contagem × vogais são habilidades diferentes, não graus de dificuldade |
| Toque funciona | O original só ouvia mouse |
| Tempo por delta | Não desanda ao trocar de aba |
| Menu, tutorial navegável, seleção de nível, pausa, resultado | O original abria direto numa tela de instrução e não tinha pausa |
| Base larga e tolerância generosa | Errar por milímetro aos 5 anos ensina a desistir |
| Erro **não avança** o símbolo | O aluno repete o mesmo número/letra: o jogo ensina, não só mede |
| **Registro no AVA** | Não existia |
| Arte nova em SVG + áudio original | `bloco.svg`, `base.svg`, `gancho.svg`; toda a locução pt-BR reaproveitada |

**Contrato:** `totalPerguntas: 5` · `acertos` = blocos encaixados · `erros` = blocos
derrubados · `nivel` = 1 \| 2 \| 3 · `jogo: "jogo-dos-blocos"` · derrota também registra.

**Validação:** a suíte de lógica e a de navegador headless passam inteiras (inclusive o
`postMessage` cruzando um `<iframe>` real, em três tamanhos). Falta a validação humana
descrita no `CHECKLIST.md` do jogo — jogar com o som ligado, em toque, e conferir os números.

---

## 2. Jogo das Formas — `870298` 🚧

**Original:** `js/JogoFormas.js` (+ `animacao.js`). Garra por coluna pega e solta pilhas de
blocos; a cada 15 s sobe uma linha nova (estilo *Tetris Attack*); junte 3 formas iguais.
Meta 20 pontos em 120 s; perde se a pilha alcançar o topo. Áudio nomeia a forma
(quadrado, retângulo, círculo, triângulo). **Nível único.**

**Refeito em:** `Games/jogo-das-formas/` — jogável de ponta a ponta em 24/08/2026.

| O que mudou | Por quê |
|---|---|
| **3 níveis** em vez de nenhum, e o **Nível 3 é o jogo de 2013** número por número | O original entregava tudo de uma vez a quem nunca o viu: 4 formas, grade cheia, linha nova a cada 15 s. Para 4 anos é uma parede |
| Toque em vez de `mousemove` | Em tablet não existe hover: a coluna destacada só aparecia com cursor, e o original é injogável no toque |
| Tempo por delta | `setInterval` deixava a partida correr com a aba em segundo plano |
| Painel "AS FORMAS" na tela durante a partida | A criança que esqueceu qual é o triângulo olha para o lado; tocar na linha narra o nome |
| Bloco-estrela é o **último depositado**, não um sorteado | O sorteio do original fazia a recompensa parecer sem relação com a jogada |
| Cascata elimina **todos** os grupos por passe | O original só olhava o grupo do bloco depositado e os dos que caíram, e podia deixar grupo válido de pé — o `console.log('ERRO')` do `VALIDA()` era sintoma disso |
| **Registro no AVA** | Não existia |

**Contrato:** `totalPerguntas` = a meta em pontos (12 \| 16 \| 20) · `acertos` = a pontuação,
descontando as falhas na vitória (RE-02) · `erros` = **ciclos de linha nova fechados sem
nenhum combo** · `nivel` = 1 \| 2 \| 3 · `jogo: "jogo-das-formas"` · derrota também registra.
Detalhes em [`REGRAS-JOGO-DAS-FORMAS.md`](REGRAS-JOGO-DAS-FORMAS.md), seção 7.

**Correções de rumo na especificação** — a versão anterior deste documento e do de regras
descrevia um jogo diferente do que existiu:
- combo é **conectividade de 4 vizinhos**, não "três em linha": a `sequencia()` do original é
  flood-fill, e o `GridBoard` é a extração fiel dela;
- grade **6×7**, não 5 colunas; **4 formas**, não 5;
- a **linha nova a cada N segundos** voltou. É a pressão do jogo: sem ela mover peças é ação
  neutra, não há vidas, e a partida não tem risco nenhum;
- `erros: 0` deixaria a RE-02 inerte neste jogo, com toda vitória valendo 100%.

**O que o motor ganhou com este jogo:**
- `GridBoard` estreou em jogo real (era só teste de unidade);
- `TimerBar` estreou;
- modo `colunas` do `CraneController` estreou;
- `Loader.imagem(null)` parou de avisar sobre nada — todo jogo com `mascote: null` (o padrão
  de um jogo novo) imprimia `imagem "undefined" não foi carregada` em toda partida. Travado
  por teste.

**Pendências declaradas** — lista completa no `README.md` do jogo:
- a arte dos blocos é **andaime**: os PNG de 50×50 de 2013, que num notebook retina são
  ampliados 3,00×. A peça vetorial está especificada e a costura para trocá-la é um método só;
- **nenhuma das 8 transcrições de áudio foi confirmada ouvindo**;
- quatro locuções não existem (abertura e os três passos do tutorial) e ficam em silêncio, com
  o console nomeando cada uma;
- o losango ficou fora: não tem locução, e o `Blocolosango.png` do original é o retângulo
  repintado — visualmente indistinguível dele;
- sem suíte de ponta a ponta própria: validado por checagem de fumaça em Chrome headless.

**Decisão pedagógica registrada:** mover blocos sem formar combo **não** é erro; é
planejamento, e punir isso ensinaria a criança a não pensar. A falha do jogo é deixar a pilha
crescer, e é isso que `erros` conta.

---

## 3. Jogo das Cores — `870296` 🚧

**Especificação completa:** [`REGRAS-JOGO-DAS-CORES.md`](REGRAS-JOGO-DAS-CORES.md) ·
**plano visual:** [`PLANO-VISUAL-JOGO-DAS-CORES.md`](PLANO-VISUAL-JOGO-DAS-CORES.md).

**Original:** `js/JogoCores.js` (370 linhas). **Não é match-3** — é **desenhar um caminho**:
aperta numa peça e arrasta; cada peça nova entra se for vizinha da ÚLTIMA do caminho
(vizinhança de 8, diagonais valem) e da mesma cor. Arrastar de volta sobre uma peça já
selecionada **corta o rabo do caminho**. Solta com 3 ou mais: pontua o **tamanho** do caminho e
o áudio fala o nome da cor. Grade 5×7 com os quatro cantos vazios (31 peças). Fácil =
verde/amarelo/azul/vermelho (meta 30); difícil = rosa/marrom/roxo/laranja (meta 45). 120 s.

> **Arte:** este é o único dos três **sem nenhum PNG de bloco** — as peças coloridas eram vetor
> dentro do `JogoCores_visual.js` (344 KB). A arte nova já existe: **oito SVG, 17 KB somados**,
> com a textura assada dentro de cada um.

**Assets aproveitáveis:** só o áudio (nomes das 8 cores, instrução, fundo, feedback).

### Três correções a este inventário, achadas lendo a fonte

1. **"Match-3" estava errado.** É caminho ordenado, não grupo conectado — a criança traça o
   grupo, e `GridBoard.grupoConectado` (flood-fill) é o primitivo errado. Ver seção 4.1 das
   regras.
2. **"arrasto contínuo no `Input` hoje não existe" estava errado.** Existe: o `Input` emite
   `arrastar` continuamente no nó pressionado, e o Jogo das Formas já usa, com teste de
   ponteiro real.
3. **Não há erro possível neste jogo.** A checagem de cor é na SELEÇÃO: a criança não consegue
   selecionar peça de cor diferente. Soltar com menos de 3 é tentativa cancelada. Respondendo à
   pergunta que estava aberta aqui: **`erros` é sempre 0**, e as regras afirmam isso na
   seção 7, em vez de omitir.

### Decisões tomadas (as três que estavam abertas)

| Questão | Decisão |
|---|---|
| Acessibilidade num jogo cuja matéria é a cor | **Textura por cor**, redundante com ela (liso, listrado, bolinhas, xadrez…). Forma por cor foi recusada: colidiria com o Jogo das Formas, onde a criança aprende que forma e cor são independentes |
| Quais cores em cada nível | **Três níveis, 4 → 6 → 8 cores**, acrescentando em vez de substituir. Metas 30 / 36 / 45. As oito locuções de 2013 entram em uso |
| Gesto no celular | **Arrasto e toque sequencial**, os dois sempre válidos, com as mesmas regras. Arrastar por células de ~40 px físicos é exigente aos 4 anos |

**Contrato:** `totalPerguntas` = 30 \| 36 \| 45 · `acertos` = pontos feitos · `erros` = **0
sempre** · `nivel` = 1 \| 2 \| 3 · `jogo: "jogo-das-cores"` · derrota também registra.

### Estado do motor para este jogo

| Peça | Estado |
|---|---|
| `PathSelector` — o caminho (vizinho-da-última, mesma cor, cortar o rabo, os dois gestos) | ✅ **no motor, 18 testes de unidade** |
| `Input` com `arrastar` contínuo | ✅ pronto, já em uso |
| `GridBoard` vizinhança de 8 + gravidade `'baixo'` | ✅ pronto, e escrito prevendo este jogo |
| `Watchdog`, `ScoreSystem`, `TimerBar`, telas padrão | ✅ prontos |
| Célula bloqueada (os 4 cantos do original) | ❌ **não vamos precisar** — tabuleiro retangular cheio, cantos arredondados pela arte |
| As oito peças | ✅ **SVG prontos** em `assets/img/cor-*.svg`, 2,1 KB cada, textura assada dentro. Conferidos a 112, 64 e 34 px e em escala de cinza |
| Pasta do jogo | ✅ criada por `new-game.mjs` (jogo de andaime, ainda o do template) |
| Célula de 128 px | ✅ **medida**: 64 px físicos no pior celular, 45% acima do piso do WCAG 2.5.5 — o primeiro jogo do motor a passar sem ressalva |
| Cena, arte, tutorial, fichas de áudio | 📋 a fazer |

---

## Ordem sugerida

1. ~~**Formas** antes de **Cores**~~ — **feito.** Estreou o `GridBoard`, a `TimerBar` e o modo
   `colunas` do `CraneController`, e reaproveitou os PNG existentes como andaime.
2. **Cores** por último: exige recurso novo no motor (arrasto contínuo), arte 100% nova e
   uma decisão de acessibilidade que muda o design das peças.

O que a experiência de Formas adianta para Cores:

- **A regra de combo já está provada em jogo real.** `GridBoard.grupoConectado` roda numa
  partida de verdade, agora com vizinhança de 4; Cores usa a de 8, que é a mesma função com
  outra tabela de deltas.
- **`GridBoard.desfazerCombosIniciais` tem um limite conhecido:** resolve peça por peça num
  passe só e nunca reconfere as que já passaram, então consertar uma peça pode criar um grupo
  com outra anterior — e no nível 1 de Formas (5 colunas, 3 formas) ele esgotava as 40
  tentativas. Formas resolveu na cena, com passes que reconferem o conjunto. Cores vai precisar
  do mesmo: vale promover essa versão ao `GridBoard` antes, e não depois.
- **Cores tem o mesmo problema de "o que conta como erro"** que Formas teve, e a saída de
  Formas (contar as janelas de tempo sem progresso) é um precedente a considerar antes de
  aceitar "erro = combo com menos de 3".
