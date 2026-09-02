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
| Cor chapada, sem TEXTURA | **Revertido em 02/09/2026** — havia uma textura própria por cor (o canal redundante contra daltonismo). Removida por decisão de acessibilidade do humano ("menos poluição visual"), com a consequência medida e registrada. Ver seção 3.2 |
| **Toque sequencial vale, além do arrasto** | O arrasto é o gesto principal e continua fiel. Mas no celular a célula tem cerca de 40 px físicos, e soltar o dedo sem querer no meio do caminho perde tudo. Aos 4 anos isso acontece muito. Ver seção 4 |
| Toque funciona | O original só ouvia mouse: injogável em tablet |
| Tempo por delta | O original usava `setInterval`, que corre com a aba em segundo plano, e comparava `tempoAtual == maxTempo` com igualdade exata — um tique perdido e a partida nunca terminava |
| Menu, tutorial navegável, seleção de nível, pausa, resultado | O original abria numa tela de instrução com dois botões e não tinha pausa |
| **Ajuda durante a partida** | O original não tinha: reler a instrução exigia recarregar a página inteira, perdendo a partida. Aqui o tutorial abre por cima do jogo, que continua (regra RE-05) |
| **Registro no AVA** | Não existia |
| Tabuleiro retangular cheio | O original deixava os **quatro cantos vazios** (31 peças em vez de 35). O efeito é decorativo — arredondar o tabuleiro —, e a arte nova faz isso com uma moldura, sem o motor precisar do conceito de "célula bloqueada". Ver seção 3 |
| Arte nova, obrigatoriamente | Único dos três originais **sem nenhum PNG de peça**: as peças eram vetor dentro de `JogoCores_visual.js` (344 KB) |
| `window.close()` no botão voltar | Não faz nada dentro do iframe do AVA |
| Áudio de fundo em laço | **Mantido**, como no original — e isto REVERTE uma decisão que estava escrita aqui. Ver a nota na seção 8 |

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

### 3.2 As cores — chapadas desde 02/09/2026, e o que isso custou

**As oito cores já existem em `cores.ludica`** — nenhuma precisa ser inventada, e nenhuma sai
de `cores.erro`/`cores.atencao`, que são semânticas de interface e não peça de jogo.

**Até 02/09/2026 cada cor tinha uma textura própria, redundante com ela** (xadrez no vermelho,
bolinhas no azul, ondas no roxo, e assim por diante): quem via cor jogava pela cor e não
reparava na textura; quem não via jogava pela textura. Ninguém perdia informação, e ninguém era
obrigado a usar o canal que não tinha.

**A medição que sustentava a textura, e continua verdadeira hoje — só que agora sem remédio.**
Luminância das oito, em 0–255:

| marrom | vermelho | azul | roxo | rosa | verde | laranja | amarelo |
|---|---|---|---|---|---|---|---|
| 106 | 119 | 122 | 124 | 130 | 137 | 144 | 197 |

Sete das oito caem numa faixa de 38 unidades, e **vermelho, azul e roxo ficam a 5 unidades um do
outro**. Em escala de cinza são o mesmo cinza — e **vermelho e azul estão os dois no nível 1**,
separados por 3.

**Decisão de acessibilidade do humano, em 02/09/2026: cor chapada, sem textura e sem símbolo.**
Um ícone de forma por cor (círculo = azul, quadrado = vermelho) foi considerado — é o mesmo
tratamento que o Jogo das Formas recebeu nesse dia — e recusado de propósito: no **Jogo das
Formas** a mesma criança aprende que forma e cor são atributos **independentes** (um triângulo
pode ser de qualquer cor). Fixar "azul = círculo" aqui contradiria essa lição entre as duas
aulas da mesma coleção. Entre manter essa contradição curricular e abrir mão do canal
redundante contra daltonismo, a escolha foi abrir mão dele.

**A consequência, sem meias palavras: sem textura, o nível mais fácil (vermelho e azul,
separados por 3 unidades de luminância) não é jogável para quem não distingue essas duas
cores.** Não é um efeito colateral inesperado — é a mesma medição acima, lida ao contrário.
Fica escrito aqui para não precisar ser remedido nem redescoberto se o assunto voltar. Detalhe
da decisão e da peça em `PLANO-VISUAL-JOGO-DAS-CORES.md`, seção 3.

**A geometria do tabuleiro e o tamanho da célula estão no**
[`PLANO-VISUAL-JOGO-DAS-CORES.md`](PLANO-VISUAL-JOGO-DAS-CORES.md), medidos: célula de **128 px**,
que dá **64 px físicos** no pior celular — 45% acima do piso de 44 px do WCAG 2.5.5, e o
primeiro jogo do motor a passar desse piso sem ressalva. É possível porque este jogo tem **5
linhas** onde o Jogo das Formas tem 7, e é o número de linhas que limita a célula.

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
junta rosa, marrom, roxo e laranja, que era o nível "difícil" inteiro do original. Desde que a
textura saiu (seção 3.2), esse nível é onde a falta de canal além da cor mais pesa: mais cores
próximas em luminância, todas na mesma tela.

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
| `vermelho` … `marrom` | as 8 locuções — **narração NOVA**, entregue em 02/09/2026, não os arquivos de 2013. Ligadas, nenhuma confirmada ouvindo (🟡 INFERIDA) | ao fechar um caminho daquela cor |
| `instrucao` | `instrucao.mp3` — **ainda não trazido** | tutorial |
| `facil` / `dificil` | `facil.mp3`, `dificil.mp3` — **ainda não trazidos** | cartões de nível — **ver pendência** |
| `acertoSOS` / `erroSOS` | os dois `.wav` — **ainda não trazidos** | vitória / derrota |
| `somFundo` | `somFundo.mp3` | **em laço, durante todo o jogo** — volume 0,25 contra 1,0 da fala. Ver a nota abaixo |

### A música de fundo: decisão revertida em 02/09/2026

Estava escrito aqui que a música ficaria **desligada**, porque música de fundo compete com a
narração — e neste jogo a narração é o conteúdo. O raciocínio continua certo. O que ele não
previu é o estado em que o jogo ficou: **nenhuma das 16 gravações tinha chegado**, então
desligar a música deixava a atividade em **silêncio absoluto**, e silêncio total nesta faixa não
se lê como "sóbrio", se lê como jogo quebrado.

**Atualização de 02/09/2026:** os 8 nomes de cor chegaram e já tocam. O silêncio absoluto não
existe mais — sobra a pergunta de equilíbrio de volume que a seção "a rever" já previa.

Então a música voltou, como no original de 2013. Três coisas sustentam a troca, e é honesto
listar o que cada uma vale:

- o canal `music` toca a **0,25** e o `speech` a **1,0** — a fala tem quatro vezes o ganho da
  música, por construção do `AudioBus`, não por sorte;
- é **o mesmo arquivo** dos outros dois jogos (SHA-256 idêntico nos três originais), o que faz
  as três aulas soarem como a mesma coleção;
- a criança pode calar tudo pelo `SoundToggle`, e a preferência fica salva.

**A rever agora que a voz das cores chegou**, e a pergunta é de ouvido, não de código: com a
voz nomeando a cor em cima da música, os 0,25 bastam? Ninguém ouviu ainda para responder — as
fichas dos 8 arquivos estão 🟡 INFERIDA. Se não bastarem, há duas saídas antes de desligar a
música — abaixar `volumeMusica` no `Game`, ou abaixá-la só durante a fala. Trocar o campo
`config.audio.musica` para `null` devolve o estado anterior e é uma linha.

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

## 10-A. Tabuleiro sem jogada: o defeito relatado, medido e resolvido

Relatado em jogo real: **"apareceu um evento que não tinha como fazer ligações"**. Não havia
nada no código que conferisse isso — o tabuleiro nascia e era reposto por sorteio, e ninguém
perguntava se sobrara jogada.

### Quão frequente, de fato

Simulação da regra exata (7x5, vizinhança de 8, gravidade para baixo, reposição no topo):
200 mil tabuleiros e 20 mil partidas jogadas até a meta, por nível.

| Nível | Cores | Tabuleiro recém-sorteado | **Partidas que travam antes da meta** |
|---|---|---|---|
| 1 Conhecer | 4 | 0 em 200.000 | **0,005%** |
| 2 Ampliar | 6 | 0,11% | **10,4%** |
| 3 Desafio | 8 | 1,6% | **76,2%** |

Três de cada quatro partidas do nível 3 chegavam a um tabuleiro morto. **Não é canto raro: é o
caso comum**, e explica o relato ter vindo de uma partida de 8 cores.

### A regra

**O jogo nunca devolve o gesto à criança num tabuleiro sem jogada.** A conferência acontece em
dois pontos, e só nesses dois:

1. ao montar o tabuleiro (`GameScene.aoEntrar`) — correção **silenciosa e sem animação**,
   porque ninguém viu o tabuleiro ainda e uma mistura na entrada só assustaria;
2. no fim de toda reposição (`_liberarGesto`), que é o único lugar de onde a fase `'movendo'`
   volta para `'livre'`.

Quando falta jogada, o tabuleiro **mistura**: as mesmas peças, nos mesmos números, em outros
lugares (`GridBoard.garantirJogada`). Misturar e não repintar é a diferença que importa num
jogo de cores — a criança que estava olhando uma peça vermelha a reencontra em outro lugar, em
vez de vê-la virar azul onde estava.

A mistura é **anunciada** ("MISTUREI AS CORES!", com locução pendente), o **cronômetro para**
enquanto ela acontece — o travamento é falha do tabuleiro, não da criança — e as peças **voam
em onda, coluna por coluna**. A onda não é enfeite: partindo todas juntas, as 35 peças cruzam o
meio da tela ao mesmo tempo e se amontoam num bolo que lê como a tela desmoronando. Está numa
captura em `.capturas/cores/06-misturando.png`.

### Quantas interrupções isso custa

| Nível | Misturas por partida | Pior partida | Embaralhadas por mistura |
|---|---|---|---|
| 1 Conhecer (4 cores) | 0,00 | 1 | 1,00 |
| 2 Ampliar (6 cores) | 0,10 | 2 | 1,00 |
| 3 Desafio (8 cores) | **1,23** | 6 | 1,03 |

Em 20 mil partidas por nível, **nenhuma** deixou de ser resolvida no limite de 30 embaralhadas.

### O sinal de projeto que ficou, e é decisão humana

O nível 3 pede mais de uma mistura por partida. Medido no mesmo simulador: **7 cores dariam
0,57** e 5 cores dariam 0,01. Baixar o nível 3 de 8 para 7 cores cortaria as interrupções pela
metade — mas conhecer as **oito** cores parece ser justamente o ponto do nível Desafio, e essa
troca é pedagógica, não técnica. Fica registrada aqui, não decidida.

Para a decisão não depender de simulação, cada partida reporta `extras.misturas` ao AVA. É
**dado do nível, não desempenho da criança**: muitas misturas numa turma dizem que aquele
nível tem cores demais para o tabuleiro.

---

## 11. Decisões em aberto

- **A espera do toque sequencial** (seção 4.3): quanto tempo depois do último toque o caminho
  se fecha. Precisa ser medido jogando com criança; um valor cedo corta caminhos longos, um
  valor tarde faz o jogo parecer travado.
- **Locução dos cartões de nível** (seção 8): depende de regravar, e são três nomes novos.
- **Quantas cores no nível 3** (seção 10-A): 8 cores custam 1,23 misturas por partida, 7 cores
  custariam 0,57. Decisão pedagógica.
- **"Misturei as cores!" não existe na aula de 2013**, porque lá o travamento não era tratado —
  o jogo parava. É gravação nova, além das 16 originais.
- **~~Arte desenhada ou imagem~~ / ~~Textura em peça pequena~~ — decididas em 02/09/2026,
  não mais em aberto.** A peça é chapada, desenhada em código, sem textura e sem símbolo (ver
  seção 3.2). A pergunta que continua genuinamente aberta é a inversa: **se algum dia for
  reintroduzido um canal redundante contra daltonismo**, ele não pode ser um ícone de forma
  (contradiria o Jogo das Formas — seção 3.2 explica por quê) nem a textura antiga sem mais
  nada (voltaria o "ruído em peça pequena" que a seção 7 do plano visual media). Nenhuma
  alternativa foi avaliada.

**Resolvido, e por isso saiu desta lista:** o alvo tocável em celular. Estava aqui como risco
herdado do Jogo das Formas; a medição do plano visual mostrou que **este jogo passa o piso do
WCAG com folga** (64 px físicos), porque tem 5 linhas onde o outro tem 7.
