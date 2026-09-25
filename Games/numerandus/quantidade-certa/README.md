# Quantidade Certa

Atividade educativa construída com o **Motor Educandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `quantidade-certa`
- **Faixa etária:** 6 a 7 anos (1º ano)
- **Criado em:** 2026-09-25

## O que é

Um jogo de correspondência em duas etapas: cada número (1 a 10) tem uma peça de
quebra-cabeça própria, com furos vazios em quantidade igual a ele. A criança
**arrasta** a peça de quantidade certa até o número fixo (etapa 1, encaixe de
verdade — só "gruda" se a quantidade bater com o número). Quando **todas** as
peças da rodada já estão encaixadas, uma chuva de continhas coloridas aparece
na trilha, uma de cada vez, e a criança **conta e arrasta** cada continha até
um furo vazio (etapa 2), até a peça ficar cheia. Pratica reconhecimento de
numeral, correspondência um-a-um e contagem — a etapa que falta na maioria das
atividades de "reconhecer quantidade pronta".

## Como os dados do jogo foram definidos

Referência única: um vídeo de celular (`numerandus/finalizados/1ano/quantidade-certa`,
159s, gravado na vertical) mostrando o brinquedo físico — cartelas com furos e
continhas coloridas soltas. Não existe protótipo de código nem projeto Remotion
para este jogo. A leitura do vídeo, o layout e a mecânica em duas etapas foram
discutidos e ajustados num artefato de planejamento antes desta implementação
começar, incluindo duas correções feitas pelo humano depois da primeira
leitura:

1. Cada "cartela" do vídeo não é uma peça só — são **duas peças separadas**
   (número + quantidade) encaixadas, no mesmo estilo de quebra-cabeça já usado
   pelo **Encaixe Certo**.
2. A interação é de **arrasto de verdade**: a criança arrasta a peça de
   quantidade até o número (não o contrário), e as continhas só aparecem
   depois que **todas** as peças da rodada já encaixaram — as duas etapas
   ficam separadas, ao contrário do vídeo original (que mistura as duas o
   tempo todo). Decisão explícita do humano, registrada no planejamento.

A mecânica de encaixe (peça com entalhe recebendo peça com nó saliente, curvas
de `Path2D`, ímã de arrasto, tolerância generosa para motricidade fina) é
**reaproveitada do Encaixe Certo**, com os dois papéis trocados: lá a
quantidade fica fixa (com o ícone já pronto) e o número é arrastado; aqui o
número fica fixo e a peça de quantidade (com furos vazios, não com ícone
pronto) é arrastada. Os layouts canônicos de furos (dado/dominó/grade, função
`obterLayoutFuros`) também são portados do Encaixe Certo (`obterLayoutMarcadores`),
com um padrão a mais — o quadro de dez (2 fileiras de 5) — que o Encaixe Certo
nunca precisou desenhar (`numeroMax` não passa de 9 lá).

**Tema visual — decisão explícita do humano:** fundo **liso**, sem gradiente e
sem decoração nenhuma (ao contrário do resto da coleção), mantendo as peças de
quebra-cabeça com o mesmo visual já estabelecido do Encaixe Certo.

## Como rodar localmente

O motor usa módulos ES, então abrir o `index.html` por `file://` **não funciona**
(o navegador bloqueia os módulos). Sirva por HTTP:

```
node tools/serve.mjs
```

e abra `http://localhost:8080/Games/numerandus/quantidade-certa/`.

Para ver a mensagem do AVA saindo de verdade, use o host de teste:
`http://localhost:8080/tools/ava-teste.html`

## Registro no AVA

Ao terminar uma partida (este jogo nunca tem derrota — ver seção 5 do
`CHECKLIST.md`), o jogo emite:

```js
{ type: "JOGO_CONCLUIDO", acertos, erros, totalPerguntas, nivel, jogo: "quantidade-certa" }
```

`totalPerguntas` é o total de números da rodada (`meta`: 3, 5 ou 7).
`acertos` conta cada NÚMERO completado por inteiro — peça encaixada **e**
todos os furos preenchidos, não só a metade do encaixe. `erros` conta
tentativas de encaixar a peça de quantidade num número que não bate — cada
uma só demora mais, nunca desconta acertos nem estrelas (RE-02). A etapa das
continhas não tem "errado" nenhum: qualquer continha cabe em qualquer furo
vazio de qualquer peça já encaixada.

O jogo não conhece aluno, `lo_id`, `activity_id`, XP ou nota — isso é do AVA.

## Estrutura

```
quantidade-certa/
├── index.html      página do jogo
├── engine/         CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js   identidade, 3 níveis, tutorial (com desenho auxiliar), contrato
│   ├── main.js     ponto de entrada
│   └── scenes/     GameScene.js — peças, encaixe, chuva de continhas, ondas
├── assets/         só áudio (as peças são desenhadas por código, sem imagem)
├── CHECKLIST.md    passos para concluir o jogo
└── README.md       este arquivo
```

Assim como o Encaixe Certo e o Chave Mágica, as peças aqui **não usam imagem**
— cabeça, furos e continhas são desenhados via `Path2D`/arcos direto no
canvas.

## Assets

| Arquivo | Tipo | Origem / licença |
|---|---|---|
| `acertoSOS.wav` | Áudio, vitória | Mesmo arquivo já usado pelo Encaixe Certo/Jogo da Velha/coleção Numerandus |
| `soltar_peca.mp3` | Áudio, encaixe (peça no número **e** continha no furo) | Mesmo arquivo já usado pelo Encaixe Certo/Material Dourado/Dino/Chave Mágica — origem/licença a confirmar, pendência compartilhada com os outros jogos que usam este arquivo |

## Pendências conhecidas

- **Um só efeito sonoro para dois gestos diferentes** — `soltar_peca.mp3` toca
  tanto quando a peça de quantidade encaixa no número quanto quando uma
  continha entra num furo. Funciona (mesmo gesto central: "encaixar"), mas um
  som dedicado para a etapa das continhas poderia diferenciar melhor as duas
  conquistas.
- **Sem narração do tutorial** — os 3 passos têm `fala:` apontando pra ids
  (`tutorialTela1/2/3`) que ainda não têm arquivo em `config.assets`.
- **Sem áudio de clique genérico** (`config.audio.clique` continua `null`) —
  mesma decisão já usada no Encaixe Certo/Jogo da Ordenação.
- **Origem/licença de `soltar_peca.mp3` e `acertoSOS.wav`** — mesma pendência
  já registrada nos outros jogos que usam esses arquivos.
- **Testado com chamada direta aos métodos da cena E com toque sintético via
  `PointerEvent`/CDP** — nenhum evento de toque disparado por um dedo de
  verdade num tablet ainda.
- **Não testado em tablet real, nem em iframe pequeno/médio/grande, nem
  `tools/ava-teste.html`, nem replay/duplicata de mensagem AVA** — mesma
  bateria de testes ainda pendente do resto da coleção.
- **Faixas de número por nível são uma proposta do planejamento** (Fácil 1–5,
  Médio 1–8, Difícil 1–10), não uma calibração com crianças de verdade jogando.

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/quantidade-certa
node tools/verificar-independencia.mjs numerandus/quantidade-certa
```
