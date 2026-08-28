# REGRAS-JOGO-DAS-CORES.md — especificação da refação da aula 870296

Especificação pedagógica, mecânica e de contrato do **Jogo das Cores**. Este documento
descreve **o jogo que vai existir**, não o de 2013 — as diferenças estão declaradas na
seção 2, cada uma com o motivo.

- Aula original: **870296** (`Aulas para Refazer/Jogo das Cores/js/JogoCores.js`, 370 linhas)
- Slug: `jogo-das-cores`
- Público: Educação Infantil / 1º ano (4 a 7 anos)
- Objetivo pedagógico: **discriminar cores e nomeá-las** — encontrar iguais entre diferentes,
  ouvir o nome da cor no momento em que ela é conquistada, e planejar um percurso.

---

## 1. O jogo em uma frase

Um tabuleiro cheio de peças coloridas. A criança **desenha um caminho** com o dedo por peças
vizinhas **da mesma cor** — três ou mais — e ao soltar elas desaparecem, o nome da cor é
narrado, e peças novas caem de cima. Ganha quem atinge a meta de pontos antes de o tempo
acabar.

**O caminho é a mecânica, e é o que diferencia este jogo dos outros dois.** No Jogo das Formas
a criança move peças e o motor descobre os grupos; aqui **ela mesma traça o grupo**, peça por
peça, e vê o caminho crescer sob o dedo. É uma tarefa de discriminação ativa: para o caminho
crescer, é preciso comparar cada peça vizinha com a cor que se está seguindo.

---

## 2. O que muda em relação ao original de 2013

| O que muda | Por quê |
|---|---|
| **Três níveis** (4 → 6 → 8 cores) em vez de dois | Os oito áudios de cor **já existem** na pasta original e o original usava todos, mas em dois conjuntos que se **substituíam**: o nível 2 trocava as quatro cores em vez de acrescentar. Acrescentar é progressão; trocar é outro jogo. Mesmo raciocínio que rendeu 3 níveis ao Jogo dos Blocos |
| **Cada cor tem uma TEXTURA própria** | Num jogo cujo conteúdo É a cor, cor sozinha exclui cerca de 1 em 12 meninos (daltonismo vermelho-verde) — e a WCAG 1.4.1 é explícita: cor nunca pode ser o único canal. A textura é redundante: quem vê cor usa a cor e nem repara nela. Ver seção 3 |
| **Toque sequencial vale, além do arrasto** | O arrasto é o gesto principal e continua fiel. Mas no celular a célula tem cerca de 40 px físicos, e soltar o dedo sem querer no meio do caminho perde tudo. Aos 4 anos isso acontece muito. Ver seção 4 |
| Toque funciona | O original só ouvia mouse: injogável em tablet |
| Tempo por delta | O original usava `setInterval`, que corre com a aba em segundo plano, e comparava `tempoAtual == maxTempo` com igualdade exata — um tique perdido e a partida nunca terminava |
| Menu, tutorial navegável, seleção de nível, pausa, resultado | O original abria numa tela de instrução com dois botões e não tinha pausa |
| **Registro no AVA** | Não existia |
| Tabuleiro retangular cheio | O original deixava os **quatro cantos vazios** (31 peças em vez de 35). O efeito é decorativo — arredondar o tabuleiro —, e a arte nova faz isso com uma moldura, sem o motor precisar do conceito de "célula bloqueada". Ver seção 3 |
| Arte nova, obrigatoriamente | Único dos três originais **sem nenhum PNG de peça**: as peças eram vetor dentro de `JogoCores_visual.js` (344 KB) |
| `window.close()` no botão voltar | Não faz nada dentro do iframe do AVA |
| Áudio de fundo em laço | O original tocava `somFundo.mp3` continuamente. Fica **desligado por padrão**: música de fundo compete com a narração, que aqui é o conteúdo |

---

## 3. O tabuleiro e as cores

### 3.1 O tabuleiro

**5 linhas × 7 colunas = 35 peças**, linha 0 no topo, gravidade para baixo.

O original tinha os quatro cantos `null`, o que dava 31 peças e deixava as colunas 0 e 6 com
apenas 3 células. Não reproduzimos isso, e a razão é de engenharia: o `GridBoard` distingue
"ocupada" de "vazia", e vazia significa **cai peça aqui**. Célula permanentemente bloqueada
seria um conceito novo no motor, com efeito sobre gravidade e reposição, para um ganho que é
puramente visual. A moldura arredondada da arte entrega o mesmo desenho.

Se algum dia um jogo precisar de tabuleiro não retangular de verdade, aí o motor ganha o
conceito — e não antes.

### 3.2 As cores e as texturas

**Cada cor tem uma textura própria, e a textura é redundante com a cor.** Quem vê cor
normalmente joga pela cor e não repara na textura; quem não vê joga pela textura. Ninguém
perde informação, e ninguém é obrigado a usar o canal que não tem.

| Cor | Token | Textura | Nível |
|---|---|---|---|
| vermelho | `cores.erro` | xadrez | 1 |
| azul | `cores.ludica.azul` | bolinhas | 1 |
| verde | `cores.ludica.verde` | liso | 1 |
| amarelo | `cores.atencao` | listras horizontais | 1 |
| laranja | `cores.ludica.laranja` | listras diagonais | 2 |
| roxo | `cores.ludica.roxo` | ondas | 2 |
| rosa | a definir | estrelinhas | 3 |
| marrom | a definir | grade | 3 |

**Por que textura e não forma.** Forma por cor (círculo = azul, quadrado = vermelho) também
seria acessível, e foi recusada: no **Jogo das Formas** a mesma criança aprende que uma forma
pode ser de qualquer cor — que forma e cor são atributos independentes. Amarrar as duas aqui
faria as duas aulas se contradizerem.

**As texturas precisam ser distinguíveis entre si em escala de cinza.** É o teste: uma captura
do tabuleiro dessaturada tem de continuar jogável. Vai para a seção 9 (o que só o olho
verifica) como item obrigatório.

**Rosa e marrom não têm token** e entram só no nível 3. Quando entrarem, é decisão de design
se viram token da paleta lúdica ou ficam locais ao jogo.

---

## 4. A mecânica: o caminho

### 4.1 A regra do caminho

O caminho é uma **lista ordenada** de peças, e cresce por duas regras, as duas do original:

1. a peça nova tem de ser **vizinha da última** do caminho — vizinhança de **8**, diagonais
   valem;
2. a peça nova tem de ser da **mesma cor** que a primeira.

**Não é grupo conectado por flood-fill.** Duas peças da mesma cor que se toquem podem estar
fora do caminho se a criança não passou por elas, e isso é intencional: o caminho é escolha
dela. `GridBoard.grupoConectado` é o primitivo errado aqui.

**Voltar sobre o caminho corta o rabo dele.** Arrastar de volta sobre uma peça já selecionada
descarta tudo o que veio depois dela. É desfazer sem soltar o dedo, e é o que faz o gesto
tolerar exploração — a criança pode tentar um caminho, ver que não vai dar, e recuar.

**Não é possível errar a cor.** A checagem acontece **na seleção**: uma peça de outra cor
simplesmente não entra no caminho. A criança não consegue montar um caminho inválido. Isso é
central para a seção 7.

### 4.2 Os dois gestos

Arrastar é o gesto principal. Tocar peça por peça monta o **mesmo** caminho, com as **mesmas**
regras de vizinhança e cor.

| | Arrastar | Tocar |
|---|---|---|
| Começar | apertar numa peça | tocar numa peça |
| Crescer | deslizar para a vizinha | tocar na vizinha |
| Encurtar | voltar sobre uma peça do caminho | tocar na última selecionada |
| Confirmar | **soltar o dedo** | automático ao chegar a 3 |
| Cancelar | soltar com menos de 3 | tocar fora do tabuleiro |

**Por que o toque confirma sozinho a partir de 3.** Um botão "confirmar" seria mais um alvo
para acertar e mais uma coisa para explicar sem texto. Chegando a 3 o caminho é válido, e
válido no toque significa feito. Quem quiser um caminho mais longo continua tocando — a
confirmação acontece quando a criança **para** de tocar, não no terceiro toque; o detalhe está
na seção 4.3.

**A dupla de gestos não é escolha de modo.** Não há botão para trocar: os dois funcionam
sempre, e a criança usa o que sair naturalmente do dedo dela.

### 4.3 Quando o caminho vale

Um caminho de **3 ou mais** vale. Ao valer:

1. o nome da cor é **narrado**;
2. as peças desaparecem (escala + alfa, como no Jogo das Formas);
3. o placar soma **o tamanho do caminho** — 5 peças = 5 pontos;
4. gravidade para baixo, peças novas nascem acima e caem;
5. o tabuleiro volta a aceitar gesto.

No arrasto, "valer" é soltar o dedo. No toque, é a criança parar de tocar — resolvido por uma
espera curta depois do último toque, para um caminho de 4 não ser cortado no terceiro. O valor
dessa espera é o único número desta seção que precisa ser medido jogando, e está declarado
como pendência na seção 10.

### 4.4 Tamanho do caminho e recompensa

O original pontuava o tamanho do caminho e nada mais. **Mantido**, e sem bloco-estrela: aqui a
recompensa por um caminho longo já é proporcional, porque cada peça vale um ponto. Um caminho
de 7 vale 7 — mais que dois caminhos de 3.

---

## 5. A pressão: só o relógio

**120 segundos.** Não há linha nova subindo, não há vidas, e o tabuleiro nunca fica sem jogada
(a reposição é aleatória e o tabuleiro é grande). A única pressão é o tempo.

Isso é diferente do Jogo das Formas de propósito. Lá a pilha subindo cria risco de derrota por
descuido; aqui a tarefa é discriminar cor, e a criança precisa poder **olhar o tabuleiro com
calma** para comparar. Uma pressão espacial atrapalharia justamente a comparação que é o
conteúdo.

---

## 6. Os três níveis

| | 1 — Conhecer | 2 — Ampliar | 3 — Desafio |
|---|---|---|---|
| Cores | verde, amarelo, azul, vermelho | + laranja, roxo | + rosa, marrom |
| Quantas | 4 | 6 | 8 |
| Meta | 30 pontos | 36 pontos | 45 pontos |
| Duração | 120 s | 120 s | 120 s |

**Mais cores é mais difícil, e por uma razão mecânica além da perceptiva:** com 4 cores num
tabuleiro de 35 peças, cada cor tem cerca de 9 peças e caminhos longos aparecem sozinhos; com
8, cerca de 4 — os caminhos ficam curtos e a criança tem de procurar.

As metas 30 e 45 são as do original (`maxPontos = 15 + 15 × (nivel + 1)`). A do nível 2 novo é
36, entre as duas, proporcional ao aumento de dificuldade.

**As quatro cores do nível 1 são as de maior contraste entre si** — e o nível 3 é o único que
junta rosa, marrom, roxo e laranja, que era o nível "difícil" inteiro do original. Ali a
textura deixa de ser redundância e passa a ser o canal principal para muita gente.

---

## 7. Pontuação, erros e o contrato com o AVA

Mapeamento do projeto (`CONTRATO-AVA.md`, seção 3): `totalPerguntas` = a meta ·
`acertos` = a pontuação · `erros` = as falhas.

- **Pontos:** cada peça de um caminho válido vale **1**. A meta é em pontos.
- **`erros` é sempre 0, e isto é uma afirmação, não uma omissão.**

  **Este jogo não tem resposta errada possível.** A checagem de cor acontece na seleção: a
  criança não consegue selecionar uma peça de cor diferente (seção 4.1). Soltar com menos de
  três peças não é erro — é uma **tentativa cancelada**, e a criança estava explorando o
  tabuleiro, que é o comportamento que a atividade quer. Contar isso como erro ensinaria a não
  explorar, o mesmo raciocínio pelo qual mover blocos sem formar combo não é erro no Jogo das
  Formas.

  Então `erros: 0` em toda partida, ganha ou perdida. O que distingue as duas no relatório é
  `acertos` contra `totalPerguntas`.

- **Vitória:** pontuação alcança a meta. **Derrota:** o tempo acaba antes.
- Como `erros` é sempre 0, o desconto da regra **RE-02** não tem efeito aqui — `pontuacao` é
  igual ao acerto bruto. A regra continua valendo; é o jogo que não a exercita.
- A fileira de estrelas da tela de resultado tem **cinco**, preenchidas pelo percentual da
  meta (regra **RE-04**), e a cena não passa nota nenhuma.

```js
this.irPara('resultado', {
  nivel: this.nivel,
  resultado: this.placar.paraAva(venceu, { caminhosFeitos: this.caminhos }),
});
```

`caminhosFeitos` vai nos extras: quantos caminhos válidos a criança fechou. Não é a pontuação
(um caminho pode valer de 3 a muitos pontos), e é o número que diz ao professor se ela fez
poucos caminhos longos ou muitos curtos.

---

## 8. Áudio

**A narração é o conteúdo.** Nomear a cor no instante em que ela é conquistada é o que
transforma discriminação visual em vocabulário.

| Id | Arquivo | Quando toca |
|---|---|---|
| `verde` … `marrom` | as 8 locuções de 2013 | ao fechar um caminho daquela cor |
| `instrucao` | `instrucao.mp3` | tutorial |
| `facil` / `dificil` | `facil.mp3`, `dificil.mp3` | cartões de nível — **ver pendência** |
| `acertoSOS` / `erroSOS` | os dois `.wav` | vitória / derrota |
| `somFundo` | `somFundo.mp3` | **não usado por padrão** (compete com a narração) |

**Pendência declarada:** os áudios de nível dizem "fácil" e "difícil", e agora há **três**
níveis com nomes diferentes (Conhecer, Ampliar, Desafio). Os dois arquivos não servem sem
regravar. Até lá os cartões ficam **sem locução** — o motor avisa a lacuna no console e a tela
segue muda, que é o comportamento honesto (`AudioBus.falar` sem arquivo).

Toda locução precisa de ficha em `assets/audio-transcricao/<id>/transcricao.md`, conferida por
`node tools/audio-info.mjs jogo-das-cores`.

---

## 9. O que o motor já tem, e o que falta

| Peça | Estado |
|---|---|
| Arrasto contínuo (`Input` emite `arrastar` no nó pressionado) | **Pronto**, e já usado pelo Jogo das Formas. O `CHECKLIST-AULAS.md` dizia que faltava — estava errado |
| `GridBoard` com vizinhança de 8 e gravidade `'baixo'` | **Pronto**, e escrito prevendo este jogo (os comentários dizem "(Cores)") |
| `ScoreSystem`, `TimerBar`, `Panel`, `Button`, `PauseScreen`, telas padrão | Prontos |
| `Watchdog` para a fase travada | Pronto — **este jogo precisa**, porque tem fase de resolução com cadeia de tweens |
| **O caminho** (lista ordenada, vizinho-da-última, mesma cor, cortar o rabo) | **A escrever.** É lógica pura e vai para `engine/gameplay/PathSelector.js`, com teste de unidade — não para dentro da cena |
| Textura dentro da peça | **A escrever na cena** (padrão de canvas), não no motor: é arte deste jogo |
| Célula bloqueada no `GridBoard` | **Não vamos precisar** (seção 3.1) |

---

## 10. Bugs do original, para não reproduzir

1. **`comecaCombo` mata o jogo de vez.** Faz `getObjectUnderPoint(...).parent.parent` sem
   checar `null`, e já removeu o próprio ouvinte de `mousedown` antes. Apertar num vão do
   tabuleiro lança `TypeError` e **nenhum clique volta a funcionar** — a partida fica viva e
   surda até o tempo acabar.
2. **`tempoAtual == maxTempo` com igualdade exata.** Um tique perdido pelo `setInterval` e a
   partida nunca termina.
3. **`comboAtual` nunca é limpo** depois de um caminho válido. Funciona por sorte, porque o
   `comecaCombo` seguinte o sobrescreve.
4. **`setFPS(12)`** — o jogo inteiro a 12 quadros por segundo.
5. **`console.log(comboAtual[0])`** ficou no código de produção, a cada caminho fechado.
6. **Somente mouse**, `enableMouseOver` inclusive: o nível era escolhido por `mouseover`, que
   não existe em tela de toque.

---

## 11. Decisões em aberto

- **A espera do toque sequencial** (seção 4.3): quanto tempo depois do último toque o caminho
  se fecha. Precisa ser medido jogando com criança; um valor cedo corta caminhos longos, um
  valor tarde faz o jogo parecer travado.
- **Tokens de rosa e marrom** (seção 3.2): entram na paleta lúdica ou ficam locais ao jogo.
- **Locução dos cartões de nível** (seção 8): depende de regravar, e são três nomes novos.
- **Alvo tocável em celular:** a célula do tabuleiro herda o mesmo problema medido no Jogo das
  Formas — o mínimo de 64 px lógicos vira 32 físicos num celular de 360 px de altura. Aqui é
  pior, porque o gesto é arrasto por células vizinhas e não toque isolado. O tabuleiro é 7×5:
  há mais folga horizontal que no Jogo das Formas, e o `PLANO-VISUAL` deste jogo precisa medir
  isso antes de escolher o tamanho da célula.
