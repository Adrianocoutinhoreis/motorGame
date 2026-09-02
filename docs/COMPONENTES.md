# COMPONENTES.md — catálogo do motor

Cada componente traz **o que faz**, **a API**, **um exemplo** e **de onde veio** nos jogos
originais. A rastreabilidade não é enfeite: quando alguém perguntar "por que a barra de
pontos funciona assim?", a resposta está no que a versão antiga fazia de errado.

Importe sempre de `./engine/index.js`.

---

## Núcleo

### `Node`
Nó do scene-graph: posição, escala, rotação, alpha, filhos e hit-test.
**Sucede:** o `MovieClip` do CreateJS. A diferença é que aqui não há timeline nem
`gotoAndStop` — animação é `Tween` e estado visual é propriedade explícita.

```js
const grupo = new Node({ x: 100, y: 50 });
grupo.adicionar(filho1, filho2);
grupo.noSobPonto(x, y);        // nó mais à frente sob o ponto global
grupo.globalParaLocal(x, y);
```

Sobrescreva `desenhar(ctx)` para pintar, `atualizar(dt)` para lógica e
`contemPontoLocal(x, y)` para área de toque não retangular.

---

### `Scene`
Uma tela. **É** um `Node`, então tudo que ela adiciona some junto quando ela sai.

```js
export class MinhaCena extends Scene {
  async preload() {}
  aoEntrar() { this.adicionar(new Background({ largura: this.largura, altura: this.altura })); }
  atualizar(dt) { super.atualizar(dt); }
  aoSair() { this.audio.calar(); }
}
```

`this.ouvirEntrada('toque', fn)` e `this.aoDesmontar(fn)` registram limpeza automática.
**Sucede:** o `resetaJogo()` manual dos originais, que percorria arrays removendo filhos na
mão — e às vezes deixava um para trás.

---

### `Tween` / `Easing`
Animação por tempo, encadeável.
**Sucede:** `createjs.Tween`. Avança por delta (não por quadro), então não desanda quando o
navegador engasga.

```js
Tween.para(bloco, { y: 400, alpha: 0 }, 700, Easing.suaveEntrada).chamar(() => bloco.removerDoPai());
Tween.de(alvo).esperar(400).entao({ scaleX: 1 }, 220, Easing.costasSaida).emLaco();
Tween.removerDe(bloco);   // cancela só os deste alvo
```

Curvas: `linear`, `suaveEntrada`, `suaveSaida`, **`suave`** (é o *ease-in-out*: acelera e
desacelera; não existe `suaveEntradaSaida`), `cubicaEntrada/Saida/cubica`, `costasSaida`,
`quicarSaida`, `elasticaSaida`.

#### `emCadaQuadro(fn)` — para valores DERIVADOS

`chamar` dispara uma vez, ao chegar numa etapa. `emCadaQuadro` dispara **a cada quadro**, e serve
para o que não se expressa como interpolação de propriedade: interpola-se um `t` de 0 a 1 e o
valor sai dele.

```js
const p = { t: 0 };
Tween.para(p, { t: 1 }, 650, Easing.suave)
  .emCadaQuadro((_alvo, dt) => {          // dt em segundos, já com Tween.escalaTempo
    const u = 1 - p.t;                    // curva de Bézier: x e y não são lineares
    no.x = u * u * x0 + 2 * u * p.t * xc + p.t * p.t * x1;
  })
  .chamar(() => no.removerDoPai());
```

Não é uma etapa: é propriedade do tween inteiro, então pode ser encadeada em qualquer ponto.
Dois detalhes de que quem usa depende:

- **dispara também no quadro em que o tween termina**, depois dos `chamar` desse quadro — uma
  callback que mexe num nó já removido precisa tolerar isso;
- **uma exceção aqui não derruba o quadro**: vai para o console e o tween segue, como em
  `chamar`. Isso é deliberado — um efeito com bug pode falhar sozinho, mas não pode matar a
  jogada em curso.

#### `Tween.temAtivo(alvo)` — para a cena checar a própria invariante

```js
Tween.temAtivo(this.garra);   // há tween vivo neste alvo?
```

Existe para o `Watchdog`: uma cena consegue afirmar "enquanto a jogada está em curso há sempre
tween vivo na garra ou em mim", e checar isso é muito melhor que cronometrar quanto tempo a
jogada "deveria" levar. Conta a espera pura também (`Tween.de(cena).esperar(380)`), que é o que
mantém a cascata em pé entre os passes.

**Cada tween é isolado no quadro.** Uma exceção num deles é logada, ele é descartado, e os
demais seguem — sem isso o primeiro que falhasse abortava o laço e todos os criados depois
perdiam o quadro, sempre os mesmos.

---

### `Input`
Ponteiro unificado (mouse, toque, caneta) sobre Pointer Events.
**Sucede:** `stage.addEventListener('mousedown')` + `$(document).mousemove` dos originais —
que simplesmente não funcionavam em tablet.

Eventos, sempre em coordenada lógica: `apertar`, `mover`, `soltar`, `arrastar`, `toque`,
e nos nós também `entrar` / `sair`.

> `toque` só dispara se apertar e soltar **no mesmo nó**. É o clique acessível: a criança
> pode desistir arrastando o dedo para fora.

#### A armadilha: sem nó interativo, não existe toque

`toque` exige um **nó interativo** sob o dedo. Se o ponto não cai em nenhum,
`noSobPonto` devolve `null`, e aí nem o nó nem o `Input` emitem `toque` —
o toque simplesmente não acontece. Blocos, tabuleiros e cenário nascem com
`interativo: false`, então uma cena que espera "tocar em qualquer lugar" precisa
dizer isso explicitamente:

```js
// Área de toque: cobre a tela e fica ATRÁS de tudo. O HUD, os botões e os
// painéis estão à frente, então ganham o toque; o resto da tela cai aqui.
this.areaToque = new Node({ largura: L, altura: A, interativo: true });
this.areaToque.on('toque', (ponto) => this.jogar(ponto));
this.adicionar(this.areaToque);   // logo depois do Background
```

**E não troque isso por `ouvirEntrada('toque', …)`.** Parece atalho e é pior: o
`Input` emite **primeiro no nó e depois em si mesmo**, então um ouvinte global
recebe o toque de **qualquer** botão da tela, já depois de o botão ter agido.

Os dois jogos existentes pagaram essa conta:

- **sem `areaToque`**, o Jogo das Formas não respondia a toque nenhum;
- **com ouvinte global**, o toque no CONTINUAR da pausa fechava a pausa (zerando
  `pausada`) e em seguida chegava à cena como jogada, no meio da tela — o único
  toque que "funcionava" era o de sair da pausa.

Pendurar no nó resolve os dois de uma vez. Para arrasto, também prefira o nó: o
motor emite `arrastar` no nó que foi **apertado**, então um gesto que começou na
área de jogo continua valendo se o dedo sair dela, e um que começou no painel
nunca mexe no jogo.

Coberto por `tools/teste-jogabilidade-formas.mjs`, que só usa ponteiro de verdade
— nenhum método da cena é chamado por dentro, porque foi assim que o bug passou
da primeira vez.

---

### `Stage`
Canvas, escala responsiva e letterbox.
**Sucede:** `<canvas width="800" height="600">` fixo. É o que permite publicar um jogo
sozinho sem saber o tamanho do iframe do AVA.

```js
stage.telaParaLogico(clientX, clientY);
stage.escala;      // lógico → CSS
stage.areaTotal(); // o canvas INTEIRO em px lógicos, barras incluídas
```

#### As barras do letterbox recebem o cenário

Num quadro que não seja 16:9 sobram duas faixas, e elas apareciam como tarjas escuras em
volta da tela. O `Stage` pinta essas faixas com o cenário da cena, num passe próprio antes de
desenhar a cena recortada:

```js
stage.sangria;   // quem tem `pintarSangria(ctx, area)` — o Background da cena
stage.sangriaX;  // a sobra de cada lado, em px LÓGICOS
```

Quem liga é o `Game`, a cada troca de tela, procurando entre os filhos diretos da cena **quem
tem o método** — não quem é da classe `Background`. Assim o `core` não importa `ui`, e um jogo
pode oferecer o próprio cenário sem herdar dele. Sem ninguém, as barras ficam na cor lisa de
`config.corLetterbox`.

**O que NÃO muda:** a área do jogo. A geometria lógica continua 1280×720, os alvos tocáveis
continuam do mesmo tamanho e nada é cortado — só a moldura deixou de ser uma tarja. Quem
procura ganhar espaço de jogo não vai achar aqui.

Duas armadilhas que isto já pagou:

- **o recorte é um ANEL** (`clip('evenodd')` com dois retângulos), e o buraco entra 1 px na
  área do jogo. Sem esse 1 px a borda antialiasada mistura com a cor lisa por baixo e desenha
  uma **linha escura de 1 px na junção** — medida em 20% do brilho do céu, e o teste em
  navegador reprova por ela;
- **só as camadas contínuas** vão para a barra (céu, colinas, piso). Sol, nuvens e peças são
  sprites: repetidos ali, seriam dois sóis.

#### O jogo é alinhado à grade de pixels do aparelho

`redimensionar()` arredonda a largura desenhada para baixo até um múltiplo de **16 px de
dispositivo** (16 porque 1280 e 720 são ambos múltiplos dele, então a altura também fecha em
inteiros e a escala continua única para os dois eixos), e o deslocamento para um número inteiro
de px de dispositivo.

Sem isso o jogo começa e termina no MEIO de um pixel físico, esse pixel recebe cobertura
parcial, e **qualquer camada semitransparente na borda vira linha visível**: a faixa de base do
tema `'formas'` tem 55% de opacidade e deixava a junção 7% mais clara. Custo do alinhamento: o
jogo pode ficar até 16 px de dispositivo menor que o máximo — 1% num monitor comum.

O teste verifica a **causa** (`bordaDev` inteiro), e não só o sintoma: medido, o desvio de cor
que o desalinhamento produz fica em 3 unidades, indistinguível do ruído do degradê, que mede 1
ou 2. Verificação de sintoma, ali, não reprovaria.

---

### `Loader`, `Storage`, `Rand`

```js
await loader.carregar([{ id: 'bloco', src: './assets/img/bloco.svg' }]);
loader.imagem('bloco'); loader.audio('um'); loader.falhas;

storage.gravar('mudo', true); storage.ler('mudo', false);

rand.inteiro(1, 5); rand.item(lista); rand.embaralhar(lista); new Rand(42); // com semente
```

`Loader` **não** derruba o jogo quando um recurso falha — nos originais, um MP3 ausente
travava a tela de carregamento para sempre, sem mensagem.

---

### `Watchdog`
Percebe que a partida **travou** e avisa quem sabe consertar.

**O defeito que ele existe para cobrir** aconteceu de verdade: um efeito visual novo do
bloco-estrela chamou um método inexistente do `Tween` de dentro da cascata de combos. Como a
cascata roda dentro de um `Tween.chamar`, que engole exceções e loga, a página não caiu — a
cascata abortou pela metade, `fase` nunca voltou a `'livre'` e a garra travou. O jogo seguiu
animando, contando o tempo e **ignorando todo toque**. Uma criança de cinco anos não lê console.

```js
this.guarda = new Watchdog({
  nome: 'ciclo da jogada',
  ocupado: () => this.fase !== 'livre' && !this.pausada && !this.placar.encerrado,
  vivo: () => Tween.temAtivo(this) || Tween.temAtivo(this.garra),
  graca: 0.5,        // segundos de "ocupado sem sinal de vida" antes de disparar
  limite: 12,        // segunda rede: ocupado contínuo, para o tween que nunca acaba
  aoTravar: ({ tentativa }) => { … },
});

// no atualizar(dt) da cena, DEPOIS do desvio da pausa:
this.guarda.atualizar(dt);
```

**Não é um cronômetro, e isso é o ponto.** "Se passar de N segundos, destrava" é ruim por dois
lados: N é um chute que envelhece (uma cascata longa é legítima e demora vários segundos) e N
segundos de jogo morto é exatamente o que se quer evitar. O caminho melhor é a **invariante da
cena**, que existe em todo jogo do motor: enquanto o ciclo está em curso há sempre um tween vivo
no alvo que vai disparar o `chamar` final. Ocupado **e** sem sinal de vida não é demora — é
cadeia perdida, e se percebe em meio segundo.

**Quem detecta e quem decide são separados.** O motor detecta; o que é um estado seguro para
voltar é decisão do jogo. Nos dois jogos o resgate escala: a primeira tentativa devolve a jogada,
e se travar de novo a partida vai para o resultado com os pontos já feitos — pior que jogar,
muito melhor que uma tela surda.

| | `ocupado` | `vivo` | Resgate |
|---|---|---|---|
| Jogo das Formas | `fase !== 'livre'` | tween na cena ou na garra | devolve a jogada e refaz a cascata → encerra |
| Jogo dos Blocos | `travado` | tween no bloco em queda ou na cena | devolve o gancho → encerra |

Ele grita em `console.error`, de propósito: os testes de navegador reprovam a sessão que produz
erro no console, então um disparo em falso aparece como teste vermelho. Verificado por injeção
de falha em `tools/teste-jogabilidade-formas.mjs` (seção 6c) — a cascata é quebrada de propósito
e o teste exige que o jogo volte.

---

## Tema

### `tokens.js`
`cores`, `tipografia`, `espaco`, `raio`, `sombras`, `movimento`, `acessibilidade`,
`aplicarTokensNoCSS()`, `alvoAcessivel(n)`.
Publicados também como variáveis CSS, para canvas e DOM nunca divergirem. Ver
[`DESIGN.md`](DESIGN.md).

### `icons.js`
`desenharIcone(ctx, nome, tamanho, cor)` e o nó `Icone`.
Ícones: `jogar`, `pausa`, `tutorial`, `som`, `semSom`, `casa`, `reiniciar`, `estrela`,
`coracao`, `setaEsquerda`, `setaDireita`, `fechar`, `certo`, `errado`, `pular`.

---

## Interface

### `Button` / `IconButton`
```js
new Button({
  rotulo: 'JOGAR', icone: 'jogar', variante: 'primario',
  largura: 380, altura: 104, x, y,
  audio: this.audio, somToque: config.audio?.clique,
  aoTocar: () => this.irPara('jogando'),
});
```
Variantes: `primario`, `secundario`, `suave`, `perigo`, `sucesso`.

> **Garantia estrutural:** o construtor força o tamanho mínimo acessível (64px). Não existe
> caminho para criar um botão pequeno demais por descuido.

`x`/`y` posicionam o canto; internamente o botão ancora no centro para a animação de
pressão escalar a partir do meio.

### `Panel`
Cartão do design system (superfície, raio, sombra). Base de menu, pausa e resultado.

### `ScoreBar`
Barra de progresso 0..1, com número `atual/total`.
**Sucede:** `barraPontosExterna` + `barraPontosInterna`, que era um MovieClip percorrido por
`gotoAndStop(pontos * scoreRatio)` — o progresso era um *quadro de animação*, e uma razão
que não fechasse travava a barra num frame inválido.

```js
new ScoreBar({ largura: 300, altura: 34, x: 20, y: 20 }).acompanhar(placar);
```

### `TimerBar`
Estende `ScoreBar`. Conta por delta, muda de cor (azul → âmbar → vermelho) e pulsa no fim.
**Sucede:** `tempo_mc` + `setInterval(…, 1000)`, que continuava correndo com a aba em
segundo plano — o aluno voltava e já tinha perdido.

```js
const t = new TimerBar({ duracao: 120, x, y }); t.iniciar(); t.on('acabou', () => …);
```

### `Lives`
Vidas em ícones, com animação ao perder e contorno permanente do total.
**Sucede:** `vidas_mc` + `folhaVida`, onde perder era `visible = false` — um elemento que
some sem aviso não comunica "você perdeu uma chance" para uma criança de 5 anos.

### `SoundToggle`
Liga/desliga o som, com preferência lembrada. **Sucede:** `botaoSom`.

### `Mascot`
O personagem-guia, com estados `neutro`, `feliz`, `triste`, `pensando`, `comemorando`.
**Sucede:** a coruja decorativa do Jogo das Formas, promovida a elemento pedagógico: num
público que ainda não lê, o personagem comunica o que o texto não pode.

Dois modos: **imagem** (arte do jogo) ou **coruja vetorial** (padrão do motor).

```js
// imagem: `tamanho` é a ALTURA; a largura vem da proporção da arte
new Mascot({ tamanho: 320, x, y, expressao: 'feliz',
             imagem: this.loader.imagem(config.mascote?.asset) });

// sem `imagem`: desenha a coruja em código, sem depender de arquivo
new Mascot({ tamanho: 180, x, y, expressao: 'pensando' });
```

Uma figura estática não troca de rosto: no modo imagem os estados aparecem como linguagem
corporal (pulo, inclinação, encolher). Para expressão facial, forneça `imagensPorExpressao`
com uma arte por estado.

### `Mascot` — em quais telas aparece
`config.mascote.telas` é a lista de cenas em que o mascote é criado
(`'menu'`, `'tutorial'`, `'niveis'`, `'jogando'`, `'resultado'`). **Ausente
significa "em todas"**, então um jogo que não declara nada não muda.

Existe porque "não quero mascote aqui" não tinha como ser dito: `mascote: null`
não apaga o mascote — faz o motor cair na coruja vetorial. O Jogo das Formas usa
`telas: ['menu']` — saiu da partida (a tira dele virou a coluna do HUD), do
tutorial (disputava atenção com a ilustração que ensina o gesto) e do resultado
(o que se lê ali é o bloco central, e a comemoração está nas estrelas acendendo).

O helper `mascoteVisivel(config, tela)` é exportado pelo `index.js`, e é ele que
a cena de partida de um jogo consulta — para "onde o mascote aparece" ter uma
fonte só.

---

### `Background`
O cenário das telas, todo vetorial. Três temas, escolhidos por `config.tema`:

| `tema` | O que desenha | Quem usa |
|---|---|---|
| `'campo'` | céu claro, sol, nuvens, colinas | o padrão |
| `'construcao'` | o mesmo céu + silhueta de prédios e andaimes | Jogo dos Blocos |
| `'formas'` | degradê indigo → ciano, halo, formas geométricas em camadas | Jogo das Formas |

O tema `'formas'` aceita **`mostrarPecas`**. Com `true` (padrão) as quatro peças do
jogo flutuam no céu nas cores delas; a cena de partida passa **`false`**, porque
atrás da grade elas competiriam com as peças que a criança precisa distinguir —
o cenário não pode ensaiar o exercício.

O desenho está partido em **camadas contínuas** (`_ceu`, `_chao` — degradês e faixas
horizontais) e **sprites** (sol, nuvens, peças, prédios). A divisão não é organização: só as
contínuas podem ser esticadas para dentro das barras do letterbox, e é o que `pintarSangria`
faz (ver `Stage`). As duas recebem a sangria em px lógicos, e os degradês continuam definidos
sobre a caixa LÓGICA — o canvas prolonga a última parada de cor, e é isso que faz a barra
receber a continuação exata da borda em vez de um segundo degradê recalculado.

Ao mexer aqui, o que precisa sobreviver: **a ordem**. As nuvens do tema `'campo'` passam
ATRÁS das colinas, então `_chao` vai depois dos sprites; no `'construcao'` o piso cobre a base
dos prédios pelo mesmo motivo.

**E a FASE.** Desenho periódico (a onda da faixa de base do tema `'formas'`, em passos de 60 px)
tem de ancorar os nós na grade da caixa LÓGICA, não no início da sangria. Ancorado em `-sx`, com
sangria de 80, os nós caíam em −80, −20, 40, 100… de um lado e em 0, 60, 120… do outro: duas
ondas de fase diferente, e **um degrau visível na silhueta exatamente na junção** — que foi como
o defeito chegou, olhado no jogo publicado.

Isso é verificado em `tools/testes.mjs`, sem navegador, com um `ctx` de mentira que anota as
chamadas: todo nó do desenho normal tem de existir no mesmo lugar no desenho com sangria. É
verificação de GEOMETRIA porque o defeito era geométrico — a medição de cor na junção passava.

**Sucede:** `fundo.jpg`, `BG.jpg`, `fd.jpg` (um JPEG de fundo por jogo).

---

## Telas padrão

Todas vêm registradas por `iniciarJogo()`; um jogo só fornece `jogando`.

| Tela | Nome da cena | Papel |
|---|---|---|
| `MenuScreen` | `menu` | JOGAR e COMO JOGAR |
| `TutorialScreen` | `tutorial` | Passos narrados de `config.tutorial` |
| `LevelSelectScreen` | `niveis` | Cartões; aparece só se houver mais de um nível |
| `ResultScreen` | `resultado` | Vitória/derrota — **o ponto de registro no AVA**. Desenha a fileira de estrelas (abaixo) |
| `PauseScreen` | — | Camada sobreposta, adicionada pela cena de jogo |
| `LoadingScreen` | — | HTML; existe antes do motor |

Sobrescrever uma delas é possível: `iniciarJogo({ cenas: { menu: MeuMenu, jogando: … } })`.

### A fileira de estrelas da `ResultScreen`

**Cinco estrelas, em qualquer jogo e qualquer meta**, preenchidas por *um quinto da meta por
estrela*. **O jogo não passa nota nenhuma** — a tela deriva a fileira dos mesmos campos que já
mostra e que vão para o AVA:

```js
import { estrelasDoResultado } from '../engine/screens/ResultScreen.js';
estrelasDoResultado({ acertos: 14, totalPerguntas: 20 });  // 3
estrelasDoResultado({ acertos: 15, totalPerguntas: 12 });  // 5 (passar da meta não estoura)
estrelasDoResultado({ acertos: 4,  totalPerguntas: 5  });  // 4 (meta 5: um ponto por estrela)
```

A função é exportada porque é a única regra desta tela que produz um número, e número se prova
sem navegador (`tools/testes.mjs`). `Math.floor`: a quinta estrela exige a meta INTEIRA.

Regra **RE-04** de `REGRAS-EDUCACIONAIS.md`, e é lá que está o porquê de ser fixa.

---

## Jogabilidade

### `ScoreSystem`
Placar e **fonte única** dos números do AVA.

```js
const placar = new ScoreSystem({ total: 5, nivel: 1, vidas: 3 });
placar.acertar(); placar.errar();
placar.progresso; placar.aproveitamento; placar.venceu; placar.perdeu;
placar.paraAva(venceu, { conteudo: 'Números 1 a 5' });
placar.on('vitoria', …); placar.on('derrota', …);
```

### `GridBoard`
Grade com adjacência (4 ou 8), grupo conectado por flood-fill **iterativo**, gravidade nos
dois sentidos e desfazer combos iniciais.
**Sucede:** os laços aninhados sobre `arrayBlocos[lin][col]` duplicados em `JogoCores.js` e
`JogoFormas.js` — com um `console.log('ERRO')` no meio do segundo, denunciando que o estado
divergia. O flood-fill do original era recursivo e estourava a pilha em tabuleiro grande.

```js
const grade = new GridBoard({
  linhas: 5, colunas: 7, diagonais: true,
  tipoDe: (p) => p.cor,        // o campo que decide se duas peças são iguais
});
grade.definir(0, 0, { cor: 'azul' });
grade.grupoConectado(peca); grade.gruposValidos(3);
grade.removerGrupo(grupo); grade.aplicarGravidade('baixo');
grade.paraTexto();   // ótimo para depurar
```

#### `tipoDe`: se o jogo não guarda `tipo`, DIGA

O padrão é `peca.tipo`. O Jogo das Cores guarda `peca.cor`, e antes de `tipoDe` existir a
grade comparava `undefined` com `undefined` — achava o tabuleiro inteiro de um tipo só e
`temJogada()` respondia **`true` sempre**. Verificação que nunca reprova é pior que verificação
nenhuma: ela faz o caso parecer coberto.

Sintoma para reconhecer: `grupoConectado` devolve o tabuleiro inteiro.

#### Tabuleiro sem jogada: `temJogada` e `garantirJogada`

```js
grade.temJogada(3);                       // existe alguma jogada?
const info = grade.garantirJogada({ minimo: 3 });
if (info) animar(info.movimentos);        // null = já havia jogada, nada a fazer
```

`garantirJogada` embaralha (`embaralhar()`, que permuta as peças entre as células ocupadas e
**preserva o censo**) e reconfere; se o sorteio insistir em não resolver, `_plantarGrupo`
junta peças de um mesmo tipo trocando-as de lugar. Devolve o **diferencial** entre antes e
depois — um movimento por peça, direto para o destino, para a cena animar sem ver as
tentativas — e `possivel: false` quando nem plantando dava (não existem `minimo` peças de um
mesmo tipo: é configuração impossível, não azar).

**Por que existe.** Medido por simulação no tabuleiro 7x5 do Jogo das Cores: com 8 cores, 1,6%
dos tabuleiros nascem sem jogada e **76% das partidas chegam a um tabuleiro morto antes da
meta**. Com 4 cores é 1 em 20 mil. Sem isso o jogo simplesmente para, e a criança fica
arrastando o dedo sem nada acontecer — foi um defeito relatado em jogo real.

**`temJogada` vale para o caminho também, e isso não é óbvio.** A jogada do Jogo das Cores é
um caminho simples, não um grupo conexo (é por isso que `PathSelector` existe). Mas para a
pergunta "existe ALGUMA jogada?" os dois coincidem: todo grafo conexo com 3+ vértices tem um
vértice de grau 2 ou mais, e ele com dois vizinhos já é um caminho de 3. Teste exato, não
aproximação.

**Quem anima é a cena**, e ela tem três obrigações que o motor não pode cumprir por ela:
travar o gesto enquanto as peças voam, manter um tween vivo no alvo que o `Watchdog` observa,
e **avisar a criança** — tela que se reorganiza sozinha e em silêncio assusta nesta idade.

### `PathSelector`
O **caminho** que a criança desenha por peças vizinhas iguais — a mecânica central do Jogo das
Cores.

```js
const caminho = new PathSelector({ grade, minimo: 3, corDe: (p) => p.cor });

caminho.comecar(peca);          // aperta / primeiro toque
caminho.oferecer(peca);         // arrasto: 'cresceu' | 'cortou' | 'ignorada'
caminho.alternar(peca);         // toque: idem, e tocar na última a remove
const ganhas = caminho.confirmar();   // [] se não chegou ao mínimo
caminho.candidatas();           // quais poderiam entrar agora (tutorial, ajuda)
```

**Não é `GridBoard.grupoConectado`.** Aquele é flood-fill e devolve todas as peças iguais que
se toquem; aqui o caminho é **escolha da criança** — duas peças da mesma cor podem se tocar e
ficar de fora, porque ela não passou por elas. A diferença é pedagógica: para o caminho
crescer é preciso comparar cada vizinha com a cor que se está seguindo, e essa comparação é o
conteúdo da atividade.

Três regras, as duas primeiras do original de 2013:

1. a peça nova é **vizinha da última** (a vizinhança vem da `grade`, então 4 ou 8 conforme
   `diagonais` — o seletor não duplica essa aritmética);
2. a peça nova é da **mesma cor** que a primeira;
3. voltar sobre uma peça do caminho **descarta tudo o que veio depois** — desfazer sem soltar
   o dedo.

**Não é possível montar um caminho inválido:** a checagem é na seleção, não na confirmação. É
por isso que o Jogo das Cores reporta `erros: 0` sempre — não há resposta errada possível, só
tentativa cancelada. Um caminho curto em `confirmar()` devolve `[]` em vez de lançar, pela
mesma razão.

`corDe` é função e não o nome de um campo, para o motor não supor como o jogo guarda o
atributo comparado.

---

### `CraneController`
Guindaste em dois modos: `oscilante` (vai e vem, o aluno escolhe o instante) e `colunas`
(alinha a colunas discretas, o aluno escolhe o lugar).
**Sucede:** o tween em laço + `$(document).mousemove` do gancho, que dependia de ser
pausado no instante exato e não respondia a toque.

```js
const g = new CraneController({ modo: 'oscilante', xMin, xMax, duracao: 2.6 });
g.carregar(bloco); g.atualizar(dt); const solto = g.soltar();
```

---

## Áudio

### `AudioBus`
Três canais: `music`, `sfx` e **`speech`**.

```js
audio.musica('somFundo');   // quem chama é o Game — a cena não mexe nisto
audio.efeito('nao');
await audio.falar('tres', { texto: '3' });   // fila serializada
audio.calar();          // corta a FALA (e esvazia a fila)
audio.pararEfeitos();   // corta os EFEITOS
audio.encerrarDaTela(); // os dois — o Game chama a cada troca de cena
audio.sonsTocando;      // { music, sfx, speech } — para depurar e testar
audio.alternarMudo();
```

#### Nenhum som sobrevive à sua tela — e quem garante é o `Game`

Em toda troca de cena o motor corta **fala e efeito**. Não é o `aoSair` de cada tela: regra
que depende de cada tela lembrar é regra que uma tela nova vai esquecer. Por isso os
`aoSair() { this.audio.calar(); }` que existiam em cinco telas foram REMOVIDOS — dois lugares
definindo a mesma regra é como eles divergem.

O defeito que trouxe isto: `acertoSOS.wav` (fim de partida do Jogo das Formas) tem **4,55 s**, o
de derrota 5,5 s, e a criança que tocava MENU antes do fim ouvia o som da tela final no menu.
`calar()` existia, mas silencia só a FALA — e o som de fim de partida é efeito. Com a correção
desligada, o teste mede **três** efeitos atravessando para o menu.

**A MÚSICA não é cortada, e isso é decisão, não esquecimento.** Ela é do jogo, não da tela.
Cortar aqui faria a música recomeçar do zero a cada botão tocado. Há verificação para os dois
lados — se alguém "consertar" cortando tudo, o teste reprova.

#### A música tem um dono só: o `Game`

Ela começa no **primeiro gesto** da criança (`Game` escuta `apertar`, destrava o contexto e
pede `config.audio.musica`) e não para mais. **Nenhuma cena a comanda.**

Antes eram quatro donos: o `MenuScreen` e a cena de partida de cada um dos três jogos pediam a
música, e o Jogo das Formas ainda a parava ao sair da partida — então só nele a música
recomeçava do zero ao voltar ao menu. Desigual entre jogos da mesma coleção.

Começar no gesto também conserta uma coisa sutil: pedida no `aoEntrar` do menu, a música era
iniciada sobre um contexto ainda suspenso e podia perder o próprio começo.

O teste não conta fontes — música parada e reiniciada também contaria 1. Ele marca a fonte antes
da troca e confere a **identidade** depois: tem de ser a mesma.

> Escrevendo uma cena nova: **não chame `musica()` nem `pararMusica()`.** Declare
> `config.audio.musica` e o motor faz o resto.

Ainda cabe chamar `calar()` **dentro** da tela, e duas telas o fazem: o `PauseScreen` ao abrir,
e o `TutorialScreen` ao virar de passo. Isso é silenciar no meio da tela, não na saída dela.

#### Som pedido antes do corte não nasce depois dele

`tocar()` é assíncrono — espera o contexto destravar e o arquivo decodificar — e nesse intervalo
a fonte ainda não existe para ser parada. Sair da tela exatamente aí deixava o som nascer órfão
já na tela seguinte, porque o corte não achou nada para cortar.

Cada canal tem uma **geração**, que o corte incrementa; `tocar` a fotografa antes dos `await` e
desiste se ela mudou. Gerações são por canal para `calar()` não matar um efeito que estava
carregando — o efeito não tem nada com a fala.

> **`falar()` é obrigatório para todo conteúdo narrado.** Os originais chamavam
> `createjs.Sound.play()` direto e as falas se atropelavam — num jogo cujo conteúdo
> pedagógico É a palavra falada, isso destrói a aula.

> **Todo som sai de arquivo.** O motor não sintetiza voz. Sem o arquivo, `falar()` resolve
> `false`, a tela fica em **silêncio** e o console diz qual gravação falta e o que ela
> deveria dizer — uma vez por lacuna. A lista da sessão fica em `audio.narracoesAusentes`.

`texto` **não** é lido por voz sintética: é o que a locução diz, escrito. Serve a duas
coisas — o evento `narracao` (`{ id, texto }`), base da legenda futura, e o aviso de
console, que sem ele não saberia nomear a gravação ausente. Registre a pendência no
`README.md` e no `CHECKLIST.md` do jogo.

---

## AVA

### `AvaBridge`
Implementa o contrato. **Um jogo nunca o instancia nem o chama** — quem faz isso é o `Game`,
nas bordas do estado `resultado`. Ver [`CONTRATO-AVA.md`](CONTRATO-AVA.md).
