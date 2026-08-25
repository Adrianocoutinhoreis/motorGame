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

Curvas: `linear`, `suaveEntrada/Saida/suave`, `cubica*`, `costasSaida`, `quicarSaida`,
`elasticaSaida`.

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
stage.escala;  // lógico → CSS
```

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

**Sucede:** `fundo.jpg`, `BG.jpg`, `fd.jpg` (um JPEG de fundo por jogo).

---

## Telas padrão

Todas vêm registradas por `iniciarJogo()`; um jogo só fornece `jogando`.

| Tela | Nome da cena | Papel |
|---|---|---|
| `MenuScreen` | `menu` | JOGAR e COMO JOGAR |
| `TutorialScreen` | `tutorial` | Passos narrados de `config.tutorial` |
| `LevelSelectScreen` | `niveis` | Cartões; aparece só se houver mais de um nível |
| `ResultScreen` | `resultado` | Vitória/derrota — **o ponto de registro no AVA** |
| `PauseScreen` | — | Camada sobreposta, adicionada pela cena de jogo |
| `LoadingScreen` | — | HTML; existe antes do motor |

Sobrescrever uma delas é possível: `iniciarJogo({ cenas: { menu: MeuMenu, jogando: … } })`.

---

## Jogabilidade

### `ScoreSystem`
Placar e **fonte única** dos números do AVA.

```js
const placar = new ScoreSystem({ total: 5, nivel: 1, vidas: 3 });
placar.acertar(); placar.errar();
placar.progresso; placar.estrelas; placar.venceu; placar.perdeu;
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
const grade = new GridBoard({ linhas: 5, colunas: 7, diagonais: true });
grade.definir(0, 0, { tipo: 'azul' });
grade.grupoConectado(peca); grade.gruposValidos(3);
grade.removerGrupo(grupo); grade.aplicarGravidade('baixo');
grade.paraTexto();   // ótimo para depurar
```

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
audio.musica('somFundo');
audio.efeito('nao');
await audio.falar('tres', { texto: '3' });   // fila serializada
audio.calar();
audio.alternarMudo();
```

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
