# Material Dourado

Atividade educativa construída com o **Motor Educandus**, na coleção **Numerandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `material-dourado`
- **Faixa etária:** 6 a 8 anos (1º ano)
- **Criado em:** 2026-09-17
- **Pasta:** `Games/numerandus/material-dourado/` — dentro da coleção Numerandus.

## O que é

Um jogo de valor posicional (unidade, dezena, centena) com a mecânica **"contar e trocar"**: a
criança só tem UM jeito de começar — tocar "+1" soma um cubinho na mesa. Quando 10 cubinhos se
juntam, eles se transformam **sozinhos** numa barrinha (dezena); quando 10 barrinhas se juntam,
viram uma placa (centena) — sem a criança escolher ou decompor nada de antemão. Os botões "+10" e
"+100" só aparecem depois que a própria criança **já viu** essa troca acontecer nesta partida
(o total já passou de 10, depois de 100).

Essa mecânica é uma decisão de design deliberada, tomada com o humano **depois** de analisar o
vídeo de referência (`numerandus/finalizados/1ano/JOGO_MATERIAL_DOURADO`) e perceber que ele é só
uma animação passiva de 37s — mostra "132 = 1 placa + 3 barrinhas + 2 cubinhos" já pronto, nunca
descoberto. Um jogo que pedisse pra criança decompor um número de cabeça antes de jogar repetiria
esse problema. "Contar e trocar" resolve isso: a base 10 é descoberta contando, não decorada.

**Três níveis**, mesma mecânica em todos:

| Nível | Números | O que muda |
|---|---|---|
| Fácil | 11 a 99 | Só cubinho/barrinha — a centena nunca é necessária |
| Médio | 100 a 999 | As 3 peças |
| Difícil | uma conta de + ou − | O desafio mostra `"58 − 42"` em vez de um número pronto; a criança monta o **resultado** com a mesma mecânica. As contas são sorteadas **sem reagrupamento** (nunca "vai um"/"empresta um"), mesmo espírito do vídeo de referência |

Cada nível tem 5 rodadas (`meta: 5` em `config.niveis`). A mesa (CENTENA/DEZENA/UNIDADE) mostra as
peças já formadas em **leque lateral**: cada peça nova nasce um pouco à direita da anterior, na
frente — e o passo entre elas encolhe sozinho conforme a quantidade cresce, então de 1 a 9 peças
sempre cabem na coluna, nunca escondidas nem empurrando a tela pra baixo. Um selo numérico ao lado
de cada rótulo (CENTENA/DEZENA/UNIDADE) sempre mostra a contagem exata — não depende de contar a
pilha sobreposta.

Confirmar dá sempre **feedback em texto**, nunca só cor: "MUITO BEM! VOCÊ FORMOU CERTINHO." (verde),
"AINDA FALTA UM POUCO..." ou "PASSOU DO NÚMERO..." (âmbar — nunca vermelho: errar ao confirmar só
demora mais, a mesa continua do jeito que estava e a criança ajusta e tenta de novo).

## Como rodar localmente

O motor usa módulos ES, então abrir o `index.html` por `file://` **não funciona**
(o navegador bloqueia os módulos). Sirva por HTTP:

```
node tools/serve.mjs
```

e abra `http://localhost:8080/Games/numerandus/material-dourado/`.

Para ver a mensagem do AVA saindo de verdade, use o host de teste:
`http://localhost:8080/tools/ava-teste.html`

## Registro no AVA

Ao completar as 5 rodadas do nível (sempre vitória — não existe derrota neste jogo), a cena emite:

```js
{
  type: "JOGO_CONCLUIDO",
  acertos: 5,              // números formados e confirmados certos — SEMPRE cheio, igual à meta
  erros: 1,                // vezes que confirmou com o número errado, só demonstrativo
  totalPerguntas: 5,       // rodadas do nível
  nivel: 2,
  jogo: "material-dourado",
  vitoria: true,
  tempoSegundos: 96,
  ajuda: 0
}
```

`erros` conta cada vez que a criança toca em "Confirmar" com o número errado — uma tentativa normal
(ajustar e tentar de novo é o próprio mecanismo de aprendizagem). **Decisão explícita, mesmo padrão
do Encaixe Certo e do Jogo da Memória: `erros` é só demonstrativo, sem desconto na nota.**
`GameScene` nunca chama `placar.errar()` (que acionaria o desconto de RE-02) — a contagem vive num
contador próprio da cena (`GameScene._tentativasErradas`) e só é escrita no campo `erros` da
mensagem final, por fora do `ScoreSystem`.

A tela final mostra "N ACERTOS" via `config.unidadePlacar: { singular: 'acerto', plural: 'acertos' }`,
e também o **tempo da partida** (mm:ss, `config.mostrarTempo: true`). O mesmo tempo aparece AO VIVO
durante a partida, junto do progresso das rodadas, num badge no HUD — puramente informativo, sem
prazo nem cor de alerta. O progresso é uma fileira de **estrelas** (uma por rodada da meta do
nível): cada estrela acende de dourada conforme a criança avança, e uma nova estrela acendendo
toca `config.audio.progresso` — pedido do humano, no lugar da fração "X/Y" que havia antes (mais
fácil de "ler de relance").

O jogo não conhece aluno, `lo_id`, `activity_id`, XP ou nota — isso é do AVA.

## Estrutura

```
material-dourado/
├── index.html      página do jogo
├── engine/         CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js   identidade, níveis, tutorial, assets, contrato
│   ├── main.js     ponto de entrada
│   └── scenes/
│       └── GameScene.js   mecânica de contar/trocar, leque lateral, sorteio de rodadas
├── assets/         imagens (áudio ainda não gravado)
├── CHECKLIST.md    passos para concluir o jogo
└── README.md       este arquivo
```

## Assets

| Arquivo | Tipo | Origem / licença |
|---|---|---|
| `assets/img/unidade-flat-v2.png` | Cubinho (unidade = 1) — isométrico, fundo transparente | Fornecido pelo humano nesta sessão. |
| `assets/img/dezena-flat-v2.png` | Barrinha (dezena = 10) — coluna vertical de 10 cubos, isométrica, fundo transparente | Fornecido pelo humano nesta sessão. |
| `assets/img/centena-flat-esquerda-v3.png` | Placa (centena = 100) — grade 10×10, isométrica, fundo transparente | Fornecido pelo humano nesta sessão. Versão "esquerda": a face lateral do bloco fica à esquerda, pra empilhar certo no leque lateral (peças mais novas na frente e à direita mostram profundidade de verdade na costura com a anterior). |
| `assets/img/centena-flat-v2.png` | Versão anterior da placa (face lateral à direita) | Não usada no jogo final — mantida na pasta, não referenciada em `config.js`. |
| `assets/audio/progresso.mp3` | Efeito de "estrela acendeu" (progresso de rodada, HUD) | **Cópia** de `assets/audio/carta-correta.mp3` do Jogo da Memória — mesmo arquivo, sem fala, serve pra qualquer "avançou um passo". Cada pasta de jogo precisa ser autossuficiente, então o arquivo físico foi copiado, não referenciado entre pastas. |
| `assets/audio/tela1.wav` … `tela5.wav` | Narração dos 5 passos do tutorial | Fornecido pelo humano nesta sessão. `id` de cada asset (`tutorialTela1-5`) bate com o `fala` de cada passo em `config.tutorial` — mesmo padrão do Jogo da Memória. |
| `assets/audio/acertoSOS.wav` | Efeito de vitória (tela de resultado) | **Cópia** do mesmo `acertoSOS.wav` já usado no resto da coleção (Jogo da Memória, Encaixe Certo, Bingo, etc.) — sem fala, serve a qualquer jogo. Cada pasta precisa ser autossuficiente, então o arquivo físico foi copiado, não referenciado entre pastas. |
| `assets/audio/soltar_peca.mp3` | Clique universal (tocar peça pra somar/tirar, botões de pausa/ajuda/som) | **Cópia** do `soltar_peca.mp3` do Jogo da Ordenação — lá é o som de "peça encaixou", reaproveitado aqui como o clique genérico (`somClique`). Cada pasta precisa ser autossuficiente, então o arquivo físico foi copiado, não referenciado entre pastas. |
| `assets/audio/error.MP3` | Efeito de confirmar errado | **Cópia** do `error.MP3` do Jogo da Memória (`somErro`) — **não verificado por humano nenhum ainda** (o próprio Jogo da Memória documenta essa ficha como "não verificada"). Risco real: se soar reprovador, contraria o princípio deste jogo ("errar só demora mais, nunca perde nada") — ouvir com atenção antes de considerar definitivo. |

Resto do áudio ainda falta: ver "Pendências conhecidas" abaixo.

## Pendências conhecidas

> Liste aqui, com honestidade, o que ainda falta.

- **`error.MP3` (efeito de erro) ainda não foi ouvido por um humano nesta sessão** — copiado do Jogo
  da Memória, que já documenta essa mesma ficha como "não verificada". Se ao ouvir soar como um
  "errou!" áspero ou reprovador, precisa ser trocado: este jogo não pode punir nem humilhar quem
  erra, é o oposto do que "contar e trocar" tenta ensinar.
- **Narração do tutorial (5/5), clique, erro e efeito de vitória gravados, resto do áudio ainda
  não.** `config.audio` tem `progresso` (`somProgresso`), `clique` (`somClique`), `erro` (`somErro`)
  e `vitoria` (`acertoSOS`) ligados — falta efeito de acerto (número formado certo, diferente do
  `progresso` que já toca nesse instante) e a fala do resultado (`falaVitoria`, texto "Muito bem!
  Você conseguiu!" ainda sem áudio — a tela mostra o efeito sonoro, mas fica muda na locução). O
  motor abre e joga normalmente em silêncio nesses casos (regra do motor: som só de arquivo
  gravado, nunca sintetizado).
- **Testado só em navegador headless** (`tools/captura-cena.mjs`, `tools/teste-entrega-avulsa.mjs`),
  simulando toques via chamada direta aos métodos da cena (`_adicionar`, `_confirmar`, etc.) — ainda
  não testado com toque de verdade em tablet, nem em iframe pequeno/médio/grande, nem o fluxo de
  replay/duplicata de mensagem no `tools/ava-teste.html`.
- **Sorteio do nível Difícil pode repetir a mesma conta** entre rodadas (não há controle de
  "não repetir a última") — se incomodar na prática, é fácil adicionar.
- **`centena-flat-v2.png`** (a versão original, com a face lateral à direita) ficou na pasta de
  assets mas não é mais referenciada — pode ser removida numa limpeza futura, ou mantida como
  histórico da decisão de trocar para a versão "esquerda".

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/material-dourado
node tools/verificar-independencia.mjs numerandus/material-dourado
```
