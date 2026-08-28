# PLANO-VISUAL-JOGO-DAS-CORES.md — o desenho da aula 870296

Plano visual do **Jogo das Cores**. Regras e contrato estão em
[`REGRAS-JOGO-DAS-CORES.md`](REGRAS-JOGO-DAS-CORES.md); aqui está **como a tela fica**, com os
números medidos e o motivo de cada um.

Duas diretrizes governam este documento, e as duas vieram do humano:

1. **O maior espaço possível para o jogo**, porque o alvo tocável no celular é o que decide se
   a criança consegue jogar.
2. **Arte desenhada em código**, até ficar decidido se será trocada por imagem. A costura para
   a troca é declarada na seção 3.3 e não muda nada fora dela.

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
 │ [  ⏸  ]  [  🔊  ]  │                                                  │  │
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
| `SoundToggle` | 96 × 96, ao lado | 20 px de folga entre os dois |
| Painel "AS CORES" | 324 de largura, de `y: 284` até `y: 680` | Legenda: amostra + nome. Seção 4.3 |

Nada disso é escrito à mão na cena: a largura do HUD sai de `tabuleiroX`, que sai da célula e do
número de colunas — que muda entre os níveis? **Não neste jogo.** O tabuleiro é 7 × 5 nos três
níveis; o que muda é quantas cores circulam nele. Mesmo assim a geometria é derivada, porque
cravar 364 num arquivo é o tipo de número que sobrevive à mudança que o invalida.

---

## 3. As peças

### 3.1 A peça

**112 × 112 px dentro da célula de 128** — 88% dela, deixando 16 px de vão entre vizinhas.

A proporção é maior que a do Jogo das Formas (62/80 = 78%) de propósito: ali a peça é um alvo
isolado e o vão ajuda a separar as colunas; aqui as peças formam um **campo contínuo** por onde
o dedo passa, e vão grande faria o tabuleiro parecer uma grade de botões em vez de um lugar.

Cinco passes, na ordem:

1. **sombra** — `rgba(17,24,39,0.28)`, blur 10, deslocada 4 px para baixo;
2. **preenchimento** — a cor da paleta lúdica, canto `22`;
3. **textura** — recortada no retângulo da peça (`clip`), seção 3.2;
4. **brilho** — degradê branco de cima, 30% a 0% na metade, que dá volume sem trocar a cor;
5. **aro de seleção**, só quando está no caminho — anel branco de 7 px e contorno escuro de 2,5.

### 3.2 As oito texturas — e por que elas não são enfeite

Cada cor tem um padrão próprio, **redundante** com ela: quem vê cor joga pela cor e não repara
na textura; quem não vê joga pela textura.

**A medição que fecha o assunto.** Luminância das oito cores da paleta lúdica, em 0–255:

| marrom | vermelho | azul | roxo | rosa | verde | laranja | amarelo |
|---|---|---|---|---|---|---|---|
| 106 | 119 | 122 | 124 | 130 | 137 | 144 | 197 |

Sete das oito caem numa faixa de 38 unidades, e **vermelho, azul e roxo ficam a 5 unidades um
do outro** — em escala de cinza são o mesmo cinza. Pior: **vermelho e azul estão os dois no
nível 1**, separados por 3 unidades. Sem textura, o nível mais fácil já é impossível para quem
não distingue essas duas.

| Cor | Token | Textura | Como é desenhada |
|---|---|---|---|
| verde | `ludica.verde` | **liso** | nada. É a única lisa, e é isso que a identifica |
| amarelo | `ludica.amarelo` | listras horizontais | 4 linhas, preto a 28%, espessura 8% do lado |
| azul | `ludica.azul` | bolinhas | 3 × 3 círculos, branco a 62%, raio 7,5% |
| vermelho | `ludica.vermelho` | xadrez | 4 × 4, preto a 24% nas casas alternadas |
| laranja | `ludica.laranja` | listras diagonais | 6 linhas a 45°, preto a 26% |
| roxo | `ludica.roxo` | ondas | 3 senoides, branco a 66% |
| rosa | `ludica.rosa` | estrelinhas | 2 × 2 estrelas de 5 pontas, branco a 75% |
| marrom | `ludica.marrom` | grade | 3 + 3 linhas, branco a 55% |

**Uma consequência a respeitar:** só uma cor pode ser lisa. Se um nono for adicionado, ele
precisa de padrão próprio — e "liso" já está tomado pelo verde.

**O teste obrigatório** é uma captura do tabuleiro em escala de cinza, e ela tem de continuar
jogável. Está feita e passa: os oito padrões se distinguem, o caminho se lê e a legenda também.
Vai para a seção 6 como item de olho, porque nenhum teste automático julga isso.

### 3.3 A costura para trocar por imagem

A arte é desenhada em código **até ficar decidido** se vira imagem. A troca precisa ser barata,
e por isso a peça obedece à mesma regra do Jogo das Formas: **o único método que muda é
`desenhar()`**.

```js
// A textura é uma FUNÇÃO por cor, e a tabela vive num lugar só.
const TEXTURAS = { verde: () => {}, amarelo: (ctx, x, y, lado) => { … }, … };

class Peca extends Node {
  desenhar(ctx) {
    const img = this.arte.imagens[this.cor];   // se um dia existir…
    if (img) { ctx.drawImage(img, 0, 0, this.lado, this.lado); return; }
    // …senão, os cinco passes da seção 3.1
  }
}
```

Nada mais na cena sabe se a peça é imagem ou desenho — nem o `PathSelector`, que só compara
`peca.cor`. Se a arte chegar como PNG, entra em `config.assets` com o id igual ao nome da cor e
o `if` acima passa a valer sozinho.

**O que a imagem terá de trazer:** a textura assada dentro dela. Trocar por PNG lisos
reintroduziria o problema da seção 3.2 sem nada avisar — e por isso o teste de escala de cinza
é permanente, não uma conferência de uma vez.

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

Amostra da peça — **com a textura** — mais o nome em caixa alta, uma linha por cor do nível.

É o lugar onde textura, cor e nome se encontram, e é conteúdo, não legenda: a criança que ainda
não lê associa a amostra ao padrão do tabuleiro, e a que já lê ganha a palavra escrita junto do
nome que ouve ao fechar o caminho.

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
  vermelho: { cor: cores.ludica.vermelho, textura: 'xadrez', som: 'vermelho' },
  …
},
```

`Background` ganha um quarto tema, `'cores'`. É a terceira vez que um jogo pede tema próprio, e
por isso ele continua sendo `switch` no `Background` e não invenção de sistema de temas.

---

## 6. O que só o olho verifica

Há um protótipo para isto: **`tools/mock-cores.html`**, que desenha o layout desta seção 2 no
tamanho lógico real, com um caminho selecionado, e uma segunda cópia em escala de cinza. Ele
tem prazo de validade — quando a cena existir, deve ser apagado, porque duas cópias da mesma
textura é como as duas divergem sem ninguém notar.


Os testes provam que a tela abre, que o caminho obedece às regras e que o gesto funciona.
Não provam nada disto:

- [ ] **O tabuleiro em escala de cinza continua jogável** — as oito texturas se distinguem, e as
      quatro do nível 1 em particular
- [ ] A linha do caminho se lê sobre as oito cores, inclusive amarelo (o mais claro)
- [ ] A ponta numerada não cobre informação de que a criança precisa
- [ ] Arrastar por células vizinhas num celular de verdade, com dedo de criança, sem escorregar
- [ ] O toque sequencial não parece travado esperando a confirmação (ver pendência da espera)
- [ ] A textura não polui a peça em tela grande, onde ela é desenhada a 112 px de verdade
- [ ] A narração da cor começa antes de a peça desaparecer, não depois
- [ ] O painel "AS CORES" com 8 linhas não fica apertado

---

## 7. Viabilidade, peça por peça

| O que a tela precisa | Existe? |
|---|---|
| Fundo em degradê | `Background` — **falta o tema `'cores'`**, um `case` |
| Peça com textura | `Node` com `desenhar` próprio — **a escrever** (seção 3.1) |
| Tabuleiro, vizinhança de 8, gravidade | `GridBoard` — **pronto**, escrito prevendo este jogo |
| O caminho | `PathSelector` — **pronto, 18 testes** |
| Arrasto contínuo | `Input` emite `arrastar` no nó pressionado — **pronto** |
| Barra de pontos, cronômetro, pausa, som | `ScoreBar`, `TimerBar`, `IconButton`, `SoundToggle` — **prontos** |
| Painel lateral | `Panel` + `TextNode` — **pronto** |
| Rede contra jogada travada | `Watchdog` — **pronto**, e este jogo precisa |
| Linha do caminho e ponta numerada | desenho na cena — **a escrever** |

**Nenhuma mudança no motor é pré-requisito**, além do `case` do tema no `Background`. O que falta
é a `GameScene`, a arte da peça e o `config.js`.

O risco visual mora num lugar só: **a textura em tamanho pequeno**. A 112 px lógicos ela é
confortável, mas num iframe apertado do AVA a peça pode cair para 60 px de tela, e aí bolinha de
7,5% vira ruído. Se apertar, a saída é textura com menos repetições — e não textura mais fina.
