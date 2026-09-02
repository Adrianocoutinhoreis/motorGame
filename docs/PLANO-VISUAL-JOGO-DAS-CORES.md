# PLANO-VISUAL-JOGO-DAS-CORES.md — o desenho da aula 870296

Plano visual do **Jogo das Cores**. Regras e contrato estão em
[`REGRAS-JOGO-DAS-CORES.md`](REGRAS-JOGO-DAS-CORES.md); aqui está **como a tela fica**, com os
números medidos e o motivo de cada um.

Duas diretrizes governam este documento, e as duas vieram do humano:

1. **O maior espaço possível para o jogo**, porque o alvo tocável no celular é o que decide se
   a criança consegue jogar.
2. **A peça é chapada — cor sólida, sem textura, sem SVG.** Não foi sempre assim: até
   02/09/2026 cada cor tinha um arquivo SVG com uma textura própria assada dentro (esta seção
   dizia isso). Foi trocado numa decisão de acessibilidade do humano — "menos poluição visual"
   — e a reversão tem consequência real, medida e registrada na seção 3. Ver seção 3.

---

## 1. A afirmação central: o tabuleiro caber grande aqui é geometria, não sorte

**Célula de 128 px, contra 80 px do Jogo das Formas.** Não é generosidade: é que **o que limita
a célula é o número de LINHAS**, e este jogo tem 5 onde o outro tem 7.

| | Jogo das Formas | Jogo das Cores |
|---|---|---|
| Grade | 5–6 colunas × **7 linhas** | **7 colunas × 5 linhas** |
| Célula | 80 px | **128 px** |
| Altura do tabuleiro | 7 × 80 = 560 | 5 × 128 = 640 |
| Célula física num Android 20:9 | 40,0 px | **64,0 px** |

Sete linhas de 128 seriam 896 px — mais que os 720 lógicos de altura. É por isso que o Jogo das
Formas não pode ter esta célula, e por isso que aqui **não repetimos o layout dele**: lá a
altura era o recurso escasso e a tira lateral estava sobrando; aqui é o contrário.

O tamanho físico do alvo é **(célula ÷ 720) × altura do aparelho** — só a fração da altura
importa, e alargar a tela não muda nada (medido no Jogo das Formas, seção 4.2 do plano dele).

| Aparelho (deitado) | Escala | Célula física |
|---|---|---|
| Android 20:9 (800×360) | 0,500 | **64,0 px** |
| iPhone SE / 8 (667×375) | 0,521 | 66,7 px |
| iPhone 14 Pro (852×393) | 0,546 | 69,9 px |
| iframe médio do AVA (900×600) | 0,703 | 90,0 px |
| iPad (1024×768) | 0,800 | 102,4 px |

**64 px físicos no pior caso — 45% acima do piso de 44 px do WCAG 2.5.5.** É o primeiro jogo do
motor a passar desse piso sem ressalva, e a folga importa mais aqui que nos outros dois: o
gesto é **arrastar por células vizinhas**, não tocar num alvo isolado, então o dedo precisa
atravessar a célula sem escorregar para a errada.

### Por que 128, e não mais

Duas restrições se cruzam exatamente em 128:

- **vertical:** 5 × 128 = 640, e sobram 40 px de margem em cima e embaixo;
- **horizontal:** 7 × 128 = 896, e sobram 324 px para a coluna do HUD.

| Célula | Tabuleiro | Margem vertical | Largura máx. do HUD | Físico 20:9 |
|---|---|---|---|---|
| 112 | 784 × 560 | 80 px | 436 | 56 px |
| 120 | 840 × 600 | 60 px | 380 | 60 px |
| **128** | **896 × 640** | **40 px** | **324** | **64 px** |
| 136 | 952 × 680 | 20 px | 268 | 68 px |
| 144 | 1008 × 720 | 0 — encosta na borda | 212 | — |

136 ainda caberia e daria 68 px físicos. Ficou em 128 por dois motivos somados: 20 px lógicos
de margem são **10 px físicos** no celular, e é ali que os dedos de quem segura o aparelho
descansam; e um HUD de 268 aperta a legenda das cores (seção 4.3), que é conteúdo pedagógico e
não decoração. Os 4 px físicos a mais não pagam as duas coisas.

---

## 2. O layout, medido

```
 0                                                                        1280
 ┌──────────────────────────────────────────────────────────────────────────┐ 0
 │                    ┌──────────────────────────────────────────────────┐  │ 28
 │ [★ 14/30        ]  │ ▨  ▨  ▨  ▨  ▨  ▨  ▨                              │  │ 40
 │ [⏱ ▓▓▓▓▓▓░░░░   ]  │                                                  │  │
 │                    │ ▨  ▨  ▨  ▨  ▨  ▨  ▨                              │  │
 │ [⏸] [💡] [🔊]      │                                                  │  │
 │                    │ ▨  ▨  ▨  ▨  ▨  ▨  ▨      7 × 5, célula 128       │  │
 │ ┌────────────────┐ │                                                  │  │
 │ │ AS CORES       │ │ ▨  ▨  ▨  ▨  ▨  ▨  ▨                              │  │
 │ │ ▨ VERMELHO     │ │                                                  │  │
 │ │ ▨ AZUL         │ │ ▨  ▨  ▨  ▨  ▨  ▨  ▨                              │  │
 │ │ ▨ VERDE     …  │ └──────────────────────────────────────────────────┘  │ 680
 │ └────────────────┘                                                       │
 └──────────────────────────────────────────────────────────────────────────┘ 720
  20 ─── 344          364 ──────────────────────────────────────── 1260
  └─ HUD (324) ─┘     └────────── tabuleiro (896) ──────────┘
```

| Peça | Geometria | Observação |
|---|---|---|
| Tabuleiro | 896 × 640, em `x: 364, y: 40` | Empurrado para a direita, com 20 px de margem. Não é centrado: a coluna do HUD equilibra a composição |
| Moldura | o retângulo do tabuleiro + 12 px, canto `44` | **É ela que arredonda os cantos** que o original deixava vazios — ver seção 3.2 |
| Coluna do HUD | `x: 20`, largura 324 | Mesma solução do Jogo das Formas, para os dois jogos não parecerem de coleções diferentes |
| `ScoreBar` | 324 × 44, `y: 40` | `icone: 'estrela'`, `mostrarNumeros: true` — "14/30" |
| `TimerBar` | 324 × 44, `y: 104` | `icone: 'relogio'`, sem números |
| `IconButton` pausa | 96 × 96, `y: 168` | 96 lógicos = 48 físicos, acima do piso |
| `IconButton` ajuda | 96 × 96, ao lado | `icone: 'tutorial'`, o mesmo do "COMO JOGAR" do menu. Abre o tutorial POR CIMA da partida (regra RE-05) |
| `SoundToggle` | 96 × 96, ao lado | **16 px** de vão entre os três: 96×3 + 16×2 = 320, e a coluna tem 324. Era 20 quando eram dois botões; 16 é o piso de `acessibilidade.espacoEntreAlvos`, e a alternativa era roubar altura do painel "AS CORES", que é conteúdo |
| Painel "AS CORES" | 324 de largura, de `y: 284` até `y: 680` | Legenda: amostra + nome. Seção 4.3 |

Nada disso é escrito à mão na cena: a largura do HUD sai de `tabuleiroX`, que sai da célula e do
número de colunas — que muda entre os níveis? **Não neste jogo.** O tabuleiro é 7 × 5 nos três
níveis; o que muda é quantas cores circulam nele. Mesmo assim a geometria é derivada, porque
cravar 364 num arquivo é o tipo de número que sobrevive à mudança que o invalida.

---

## 3. As peças

### 3.1 A peça, hoje: chapada, sem arquivo

**112 × 112 px dentro da célula de 128** — 88% dela, deixando 16 px de vão entre vizinhas. Isto
não mudou com a decisão de 02/09/2026 — é geometria, não arte.

A proporção é maior que a do Jogo das Formas (62/80 = 78%) de propósito: ali a peça é um alvo
isolado e o vão ajuda a separar as colunas; aqui as peças formam um **campo contínuo** por onde
o dedo passa, e vão grande faria o tabuleiro parecer uma grade de botões em vez de um lugar.

**A peça é desenhada em `Peca.desenhar()` (`src/scenes/GameScene.js`), sem arquivo.** Duas
camadas:

1. **corpo** — a cor da paleta lúdica, canto `raio.md`, uma sombra suave (`sombras.suave`);
2. **contorno interno** — preto a 16%, 3 px, para uma peça se separar da vizinha da MESMA cor.
   Sem ele, três azuis lado a lado viram um bloco azul só e o caminho fica ilegível.

Fica de fora, de propósito: o **aro de seleção** do caminho, que é **estado** e não arte — muda
a cada movimento do dedo.

**Isto substitui o que existia até 02/09/2026** — um arquivo SVG por cor com quatro camadas
(corpo, TEXTURA redundante com a cor, um degradê de brilho, e o mesmo contorno interno). A
seção 3.2 conta por quê, e o que essa troca custa.

### 3.2 A textura que saiu — a decisão, o motivo, o preço

**Até 02/09/2026 cada cor tinha uma textura própria, redundante com ela** (xadrez no vermelho,
bolinhas no azul, ondas no roxo…): quem vê cor jogava pela cor e não reparava na textura; quem
não vê jogava pela textura. Ninguém perdia informação, e ninguém era obrigado a usar o canal
que não tinha — a WCAG 1.4.1 chama isso de canal redundante, e é o padrão certo quando cor é
conteúdo.

**A medição que sustentava a textura, e continua verdadeira hoje.** Luminância das oito cores
da paleta lúdica, em 0–255:

| marrom | vermelho | azul | roxo | rosa | verde | laranja | amarelo |
|---|---|---|---|---|---|---|---|
| 106 | 119 | 122 | 124 | 130 | 137 | 144 | 197 |

Sete das oito caem numa faixa de 38 unidades, e **vermelho, azul e roxo ficam a 5 unidades um
do outro** — em escala de cinza são o mesmo cinza. Pior: **vermelho e azul estão os dois no
nível 1**, separados por 3 unidades.

**Decisão de acessibilidade do humano, em 02/09/2026: cor chapada, sem textura e sem símbolo.**
Considerou-se substituir a textura por um ÍCONE DE FORMA por cor (círculo dentro do azul,
quadrado dentro do vermelho…) — o mesmo tratamento aplicado ao Jogo das Formas nesse dia — e foi
recusado de propósito: no Jogo das Formas a mesma criança aprende que forma e cor são atributos
**independentes** (um triângulo pode ser de qualquer cor); fixar "azul = círculo" aqui
contradiria essa lição entre as duas aulas da mesma coleção. Entre manter a contradição
curricular e abrir mão do canal redundante, a escolha foi abrir mão dele.

**O preço é exatamente o que a medição acima diz, e agora ele se paga de verdade: sem
textura, o nível mais fácil (vermelho e azul, separados por 3 unidades de luminância) não é
jogável para quem não distingue essas duas cores.** Não é um efeito colateral descoberto depois
— é a mesma medição que justificava a textura, agora lida ao contrário. Fica registrado aqui
para quem revisitar o assunto não precisar remedir, e para não reabrir a discussão como se
fosse descoberta nova.

**Histórico — as oito texturas que existiram** (para quem for ler versões antigas do jogo ou
comparar screenshots antigos):

| Cor | Token | Textura (até 02/09/2026) |
|---|---|---|
| verde | `ludica.verde` | liso (nada — era a única lisa, e era isso que a identificava) |
| amarelo | `ludica.amarelo` | listras horizontais |
| azul | `ludica.azul` | bolinhas |
| vermelho | `ludica.vermelho` | xadrez |
| laranja | `ludica.laranja` | listras diagonais |
| roxo | `ludica.roxo` | ondas |
| rosa | `ludica.rosa` | estrelinhas |
| marrom | `ludica.marrom` | grade |

### 3.3 Histórico — por que era SVG, e por que deixou de ser

Até 02/09/2026 a peça era um arquivo SVG (`assets/img/cor-<nome>.svg`, oito arquivos, 17 KB
somados) em vez de desenhada em código, por três razões que continuam válidas em geral — só
deixaram de se aplicar aqui porque não há mais textura para proteger:

- **escala sem perder nitidez**, relevante para arte com detalhe fino (a textura);
- **texto de arte legível** — comentário no arquivo explicando o padrão e a luminância;
- **um designer editava sem tocar em JavaScript**.

Uma peça chapada (cor sólida + canto arredondado) não tem nada disso para proteger — é mais
simples e mais direto desenhar direto no canvas, o mesmo vocabulário que `Panel`/`Button`/
`Shape` já usam no resto do motor, sem arquivo, sem `Loader`, sem oito arquivos para manter
consistentes entre si.

---

## 4. A `GameScene` — a única tela a desenhar

Menu, tutorial, seleção de nível, pausa e resultado vêm do motor. O que este jogo escreve é a
partida.

### 4.1 O caminho — o desenho mais importante da tela

É ele que mostra à criança o que ela está montando. Três elementos:

1. **o aro de seleção** em cada peça do caminho (seção 3.1, passe 5);
2. **a linha** ligando os centros — branca de 12 px com contorno escuro de 20 px, junta e ponta
   redondas;
3. **a ponta numerada**: um disco branco de raio 20 na última peça, com o **tamanho do caminho**
   escrito dentro.

**A linha vai POR CIMA das peças, e isso foi descoberto no protótipo.** Desenhada antes, ela
ficava inteiramente escondida: com peça de 112 numa célula de 128 sobram 16 px entre vizinhas, e
a linha inteira cabia embaixo delas. Aumentar o vão para a linha aparecer encolheria a peça —
então a linha subiu, e ganhou contorno escuro para se ler sobre qualquer uma das oito cores.

**A ponta numerada faz dois trabalhos.** Marca de onde o caminho pode crescer, que é a regra do
jogo ("vizinha da ÚLTIMA" — sem isso a criança vê o conjunto mas não sabe qual peça está viva);
e **conta**, em voz de número, quantas peças já entraram — o que diz sozinho quando o caminho
passou de 3 e virou pontos.

### 4.2 O que acontece ao fechar um caminho

| Momento | Movimento | Token |
|---|---|---|
| Caminho válido | as peças crescem 15% e somem em alfa | `movimento.rapido` + `movimento.padrao` |
| Nome da cor | narração começa junto com o desaparecer | — |
| Gravidade | as de cima caem para o lugar | `movimento.padrao`, `quicarSaida` |
| Peças novas | nascem acima da moldura e caem | `movimento.padrao` |
| Caminho curto | os aros somem, sem som e sem penalidade | `movimento.rapido` |

**O caminho curto não faz barulho de erro.** É tentativa cancelada (regra, seção 7), e um som de
negativa ali ensinaria a não explorar o tabuleiro.

### 4.3 O painel "AS CORES"

Amostra da peça — chapada, mesmo desenho da peça no tabuleiro — mais o nome em caixa alta, uma
linha por cor do nível.

É o lugar onde cor e nome se encontram, e é conteúdo, não legenda: a criança que ainda não lê
associa a amostra à cor do tabuleiro, e a que já lê ganha a palavra escrita junto do nome que
ouve ao fechar o caminho. Até 02/09/2026 a amostra também carregava a textura da peça — ver
seção 3.2 para o porquê de não carregar mais.

Altura disponível: de `y: 284` a `y: 680`, 396 px. Com 8 cores, 44 px por linha e a amostra em
34 px. Nos níveis 1 e 2 o painel tem 4 e 6 linhas e sobra folga; a altura da linha é derivada do
número de cores, não fixa.

### 4.4 O fundo

Degradê diagonal em três paradas — `#1E3A8A` → `#4338CA` → `#0E7490` —, o mesmo idioma do céu
geométrico do Jogo das Formas, sem repetir as peças flutuantes dele.

**Sem formas soltas no fundo, e sem nuvens.** Aqui o conteúdo é a cor, e qualquer mancha
colorida atrás do tabuleiro compete com a comparação que a criança está fazendo. O fundo é a
única superfície da tela que não pode ter cor interessante.

---

## 5. O que preencher no `config.js`

```js
tema: 'cores',          // Background: degradê frio, sem peças, sem sol
grade: {
  celula: 128,          // ver seção 1: 64 px físicos no pior celular
  peca: 112,            // 88% da célula
  colunas: 7,
  linhas: 5,
},
niveis: [ /* 4 → 6 → 8 cores, metas 30 / 36 / 45 — regras, seção 6 */ ],
cores: {
  // Sem `imagem`: a peça é chapada, desenhada em `Peca.desenhar()`. `cor` é o
  // token usado ali, na linha do caminho e no painel lateral.
  vermelho: { cor: cores.ludica.vermelho, som: 'vermelho' },
  …
},
```

`Background` ganha um quarto tema, `'cores'`. É a terceira vez que um jogo pede tema próprio, e
por isso ele continua sendo `switch` no `Background` e não invenção de sistema de temas.

---

## 6. O que só o olho verifica

Havia um protótipo para isto, `tools/mock-cores.html`. **Foi apagado quando a cena passou a
existir**, como o próprio arquivo declarava: duas cópias da mesma textura é como as duas
divergem sem ninguém notar.

O que ele fazia de mais valioso — a **vista em escala de cinza** — não se perdeu: mudou para
`tools/teste-jogabilidade-cores.mjs`, que a captura a cada rodada em
`.capturas/cores/08-escala-de-cinza.png`, **sobre o jogo de verdade** e não sobre um protótipo.
O teste não julga a imagem; ele garante que ela exista para uma pessoa julgar.

**Desde 02/09/2026 esta captura NÃO prova mais acessibilidade** — só documenta o estado. Sem
textura, a escala de cinza é a própria luminância medida na seção 3.2: vermelho e azul, no
nível 1, são praticamente o mesmo cinza. A captura vai continuar sendo gerada porque é
diagnóstico honesto do que existe, não porque o jogo passe no teste que ela antes ajudava a
fazer.

Os testes provam que a tela abre, que o caminho obedece às regras e que o gesto funciona.
Não provam nada disto:

- [x] **A captura em escala de cinza é gerada a cada rodada** — é diagnóstico, não aprovação
      (ver acima: sem textura, ela mostra o problema, não a solução).
- [ ] A linha do caminho se lê sobre as oito cores, inclusive amarelo (o mais claro)
- [ ] A ponta numerada não cobre informação de que a criança precisa
- [ ] Arrastar por células vizinhas num celular de verdade, com dedo de criança, sem escorregar
- [ ] O toque sequencial não parece travado esperando a confirmação (ver pendência da espera)
- [ ] A narração da cor começa antes de a peça desaparecer, não depois
- [ ] O painel "AS CORES" com 8 linhas não fica apertado

---

## 7. Viabilidade, peça por peça

| O que a tela precisa | Existe? |
|---|---|
| Fundo em degradê | `Background` — **falta o tema `'cores'`**, um `case` |
| Peça | chapada, desenhada em `Peca.desenhar()` — **pronta**, sem arquivo (ver seção 3) |
| Tabuleiro, vizinhança de 8, gravidade | `GridBoard` — **pronto**, escrito prevendo este jogo |
| O caminho | `PathSelector` — **pronto, 18 testes** |
| Arrasto contínuo | `Input` emite `arrastar` no nó pressionado — **pronto** |
| Barra de pontos, cronômetro, pausa, ajuda, som | `ScoreBar`, `TimerBar`, `IconButton`, `SoundToggle`, `HelpScreen` — **prontos** |
| Painel lateral | `Panel` + `TextNode` — **pronto** |
| Rede contra jogada travada | `Watchdog` — **pronto**, e este jogo precisa |
| Linha do caminho e ponta numerada | desenho na cena — **a escrever** |

**Nenhuma mudança no motor é pré-requisito**, além do `case` do tema no `Background`. O que falta
é a `GameScene`, a arte da peça e o `config.js`.

**Não há mais risco de tamanho a medir** — a peça é cor sólida, legível em qualquer tamanho por
construção. O risco que existe hoje não é de tela pequena: é o registrado na seção 3.2, e vale
em qualquer tamanho — vermelho e azul, sem textura, ficam indistinguíveis para quem não vê cor,
a 112 px ou a 34 px.
