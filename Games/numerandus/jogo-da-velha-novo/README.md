# Jogo da Velha

Atividade educativa construída com o **Motor Educandus**, na coleção **Numerandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `jogo-da-velha-novo`
- **Faixa etária:** 4 a 7 anos
- **Criado em:** 2026-09-03
- **Pasta:** `Games/numerandus/jogo-da-velha-novo/` — dentro da coleção Numerandus,
  não direto em `Games/`. O caminho da pasta não entra na mensagem do AVA (quem entra é
  o `slug` acima).

## O que é

Jogo da velha 3x3 contra o computador, refeito a partir do protótipo original
(`Aulas para Refazer/Jogo_da_velha`, que era dois jogadores humanos no mesmo aparelho, sem
CPU e sem registro no AVA). O jogo não usa X e O: as marcas são **cores** (dois rostinhos
redondos, vermelho e azul), e o aluno **escolhe a própria cor** numa tela dedicada
(`EscolhaCorScreen`) logo antes de cada partida nova — a CPU sempre fica com a outra cor. Isso
também simplificou o tutorial, que fala em "sua cor"/"a cor do computador" sem nunca cravar qual
é qual.

Três **níveis de dificuldade** (Fácil, Médio, Difícil) mudam só a força do adversário — não há
conteúdo numérico ou de letras neste jogo, então "nível" aqui é "quanto a CPU erra o bloqueio da
jogada do aluno", não uma progressão de conteúdo. Em nenhum nível a CPU deixa de fechar uma
vitória própria, e mesmo no Difícil ela não é imbatível: um "garfo" (duas ameaças ao mesmo
tempo) ainda vence, porque ela só reage a UMA ameaça por vez. A partida termina em vitória,
derrota ou empate; o que cada um significa está na seção 5 do `CHECKLIST.md`. Uma vitória vale
**10 pontos** (não "1 ponto" — lia mal numa tela de resultado único).

Tema visual **'quadro'** (quadro-negro de sala de aula) — próprio deste jogo, com placa de
título e cenário dedicados em `engine/ui/Background.js` e `engine/screens/MenuScreen.js`. Sem
mascote em nenhuma tela (`mascote: { telas: [] }` no `config.js`).

## Como rodar localmente

O motor usa módulos ES, então abrir o `index.html` por `file://` **não funciona**
(o navegador bloqueia os módulos). Sirva por HTTP:

```
node tools/serve.mjs
```

e abra `http://localhost:8080/Games/numerandus/jogo-da-velha-novo/`.

Para ver a mensagem do AVA saindo de verdade, use o host de teste:
`http://localhost:8080/tools/ava-teste.html`

## Registro no AVA

Ao terminar uma partida (vitória, derrota **ou empate**), o jogo emite:

```js
{ type: "JOGO_CONCLUIDO", acertos, erros, totalPerguntas, nivel, jogo: "jogo-da-velha-novo",
  vitoria, tempoSegundos, ajuda }
```

Empate é o único desfecho sem evento próprio no contrato: vai como `vitoria: false` mais um
sinalizador em `payload.extras.empate` (é esse campo que a tela de resultado lê para mostrar
"EMPATOU!" em vez de "QUASE LÁ!" — ver `engine/screens/ResultScreen.js`).

O significado de cada campo neste jogo está na seção 5 do `CHECKLIST.md`.
O jogo não conhece aluno, `lo_id`, `activity_id`, XP ou nota — isso é do AVA.

## Estrutura

```
jogo-da-velha-novo/
├── index.html      página do jogo
├── engine/         CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js   identidade, níveis, tutorial, assets, contrato
│   ├── main.js     ponto de entrada
│   └── scenes/
│       ├── GameScene.js         a partida
│       └── EscolhaCorScreen.js  "escolha sua cor", antes de cada partida nova
├── assets/         imagens e áudio (tudo local)
├── CHECKLIST.md    passos para concluir o jogo
└── README.md       este arquivo
```

## Assets

| Arquivo | Tipo | Origem / licença |
|---|---|---|
| `assets/img/x.png` | imagem (marca vermelha, id `pecaVermelha`) | Reaproveitado sem alteração de `Aulas para Refazer/Jogo_da_velha/assets/x.png` — arte original do protótipo de 2013, acervo interno Educandus. |
| `assets/img/o.png` | imagem (marca azul, id `pecaAzul`) | Reaproveitado sem alteração de `Aulas para Refazer/Jogo_da_velha/assets/0.png` — arte original do protótipo de 2013, acervo interno Educandus. |

Os nomes de ARQUIVO continuam `x.png`/`o.png` (não vale renomear um arquivo só porque o jogo
mudou de vocabulário), mas os **ids** que o jogo usa para pedi-los ao `Loader` já são pela cor
(`pecaVermelha`/`pecaAzul`) — o código não fala mais em X/O em lugar nenhum.

O tabuleiro, as casas e o cenário (`Background`, tema `quadro` — ver "Tema visual" acima) são
desenhados no canvas pelo próprio motor — nenhum outro arquivo de imagem.

## Pendências conhecidas

> Liste aqui, com honestidade, o que ainda falta — narração não gravada, arte
> provisória, mecânica a confirmar. É melhor uma entrega com pendência declarada
> do que uma que aparenta estar pronta.

- **Nenhum áudio gravado.** Todos os campos de `config.audio` (música, cliques,
  vitória/derrota/empate, narração do tutorial) estão `null` nesta entrega — o jogo abre em
  silêncio, e o console nomeia o que falta. A regra do motor é todo som vir de arquivo
  gravado, nunca sintetizado; falta produzir e revisar essas gravações.

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/jogo-da-velha-novo
node tools/verificar-independencia.mjs numerandus/jogo-da-velha-novo
```
