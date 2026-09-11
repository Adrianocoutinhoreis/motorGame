# Jogo da Ordenação

Atividade educativa construída com o **Motor Educandus**, na coleção **Numerandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `jogo-da-ordenacao`
- **Faixa etária:** 5 a 8 anos
- **Criado em:** 2026-09-10
- **Pasta:** `Games/numerandus/jogo-da-ordenacao/` — dentro da coleção Numerandus.

## O que é

Um quebra-cabeça deslizante (15-puzzle) de números: o tabuleiro tem 12 células
(3 colunas × 4 linhas), 10 delas com uma ficha numerada (0 a 9) e 2 sempre
vazias. O aluno **clica e arrasta** uma ficha para uma célula **vizinha**
(lado, cima ou baixo) que esteja vazia — nunca para qualquer lugar à distância,
e nunca por cima de outra ficha. O objetivo é deixar as 10 fichas em ordem:
crescente (0 a 9) ou decrescente (9 a 0), conforme o nível.

Baseado no vídeo de referência (`numerandus/finalizados/1ano/Jogo_da_ordenacao`)
e no projeto-fonte `Videos_Numerandus/jogo_ordenacao/src/PuzzleBoard.tsx`, que
documentam a mecânica original. O **layout, a paleta e o comportamento de cada
tela foram desenhados e aprovados num plano visual** (mockup interativo)
antes desta implementação começar — o tabuleiro e as fichas são os mesmos do
vídeo (cores fixas por célula, círculo branco com o número), e o tema
"quarto de leitura" (parede + prateleira de madeira) entra só no CENÁRIO ao
redor, nunca nas peças.

**Três níveis**, mesma mecânica em todos — só muda o quanto o embaralhamento
inicial mistura as fichas e a direção:

- **Nível 1 (Fácil):** crescente, poucas trocas (o tabuleiro nasce quase resolvido).
- **Nível 2 (Médio):** crescente, tabuleiro totalmente embaralhado.
- **Nível 3 (Difícil):** decrescente, tabuleiro totalmente embaralhado.

**É um quebra-cabeça solo — nunca há derrota.** A partida só demora mais se o
aluno fizer trocas que não ajudam; não existe cronômetro regressivo nem
"game over". Quando as 10 fichas ficam certas ao mesmo tempo, o tabuleiro
inteiro comemora (moldura dourada + uma onda leve nas peças) antes de ir para
a tela de resultado.

O embaralhamento **nunca é sorteado livre**: ele parte do tabuleiro resolvido e
"anda para trás" aplicando só movimentos legais (o mesmo que o aluno pode
fazer, ao contrário) — ver `GameScene._embaralharNivel`. Um sorteio livre
poderia gerar um arranjo impossível de resolver sob a regra "só para a
vizinha vazia", o que travaria a criança para sempre.

## Como rodar localmente

```bash
node tools/serve.mjs
```

Abra: `http://localhost:8080/Games/numerandus/jogo-da-ordenacao/`

Para ver a mensagem do AVA saindo de verdade, use o host de teste:
`http://localhost:8080/tools/ava-teste.html`

## Registro no AVA

Ao completar o tabuleiro (sempre vitória), o jogo emite:

```js
{
  type: "JOGO_CONCLUIDO",
  acertos: 10,            // pontuação: sempre as 10 fichas — ver "Sobre erros" abaixo
  erros: 0,               // este jogo não penaliza jogada legal nenhuma
  totalPerguntas: 10,     // as 10 fichas (0 a 9)
  nivel: 2,
  jogo: "jogo-da-ordenacao",
  vitoria: true,          // sempre — este jogo não tem derrota
  tempoSegundos: 47,
  ajuda: 0,
  extras: { direcao: "crescente" }  // ou "decrescente", no nível 3
}
```

A tela final mostra "N ACERTOS" (não "N pontos") via `config.unidadePlacar`, e
também o **tempo da partida** (mm:ss) — campo opcional e aditivo em
`ResultScreen` (`config.mostrarTempo: true`), que nenhum outro jogo da coleção
precisa ligar.

O mesmo tempo já aparece AO VIVO durante a partida: um cronômetro no HUD
(topo-centro, ícone de relógio + "mm:ss" escritos em branco na parede),
puramente informativo — sem prazo, sem cor de alerta, sem pressão. Lê
`this.game.tempoJogando`, um getter público adicionado ao motor
(`engine/core/Game.js`) que expõe o mesmo contador que já existia por trás do
`tempoSegundos` do AVA — por isso o relógio congela sozinho durante Pausa e
Ajuda (RE-05), sem nenhuma lógica de pausa própria do jogo.

**Sobre `erros`: este jogo não conta nenhum.** A primeira versão contava 1 erro
a cada troca LEGAL que não aumentava na hora quantas fichas ficam no lugar
certo, para a pontuação descontar na vitória (RE-02). Bug real, encontrado
jogando: simulando o próprio embaralhamento resolvido pelo caminho ÓTIMO (o
jeito mais eficiente possível, zero jogada desperdiçada), o nível Médio (60
passos) ainda somava umas 40 dessas "faltas" — num quebra-cabeça deslizante,
destravar uma peça quase sempre exige afastar outra que já estava certa, e
isso é inerente ao mecanismo, não deslize do aluno. Com meta 10, isso zerava a
pontuação em qualquer resolução real dos níveis Médio/Difícil (e, jogando sem
otimizar, também no Fácil) — a criança terminava certinho e via "0 ACERTOS" e
zero estrelas. Corrigido: uma troca inválida (célula ocupada, não vizinha, ou
a mesma de onde saiu) continua sem pontuar nada — a ficha só volta pro
lugar — mas nenhuma troca LEGAL é penalizada. Toda vitória vale as 10 fichas.
Ver o comentário em `GameScene._tentarMover`.

## Estrutura

```
jogo-da-ordenacao/
├── index.html      página do jogo
├── engine/         CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js   identidade, níveis, tutorial, assets, contrato
│   ├── main.js     ponto de entrada
│   └── scenes/
│       └── GameScene.js   o tabuleiro, o arrastar e a pontuação
├── assets/         áudio (tudo local)
├── CHECKLIST.md    passos para concluir o jogo
└── README.md       este arquivo
```

## Assets

| Arquivo | Tipo | Origem / licença |
|---|---|---|
| `assets/audio/acertoSOS.wav` | efeito de fim de partida — vitória (id `acertoSOS`) | Aula original 870298 — Educandus. Mesmo arquivo (mesmo SHA-256) do Jogo das Formas/Blocos/Cores/Bingo/Jogo da Velha. Ficha: `assets/audio-transcricao/acertoSOS/transcricao.md`. Não há `erroSOS`: este jogo nunca tem derrota. |
| `assets/audio/soltar_peca.mp3` | encaixe ao mover uma ficha com sucesso (id `soltarPeca`) | **A confirmar** — arquivo próprio deste jogo, fornecido pronto, origem/licença não documentada ainda. Ficha: `assets/audio-transcricao/soltarPeca/transcricao.md`. |
| `assets/audio/tela1.wav` | narração do tutorial, passo 1 de 3 (id `tutorialTela1`) | **A confirmar** — arquivo próprio deste jogo, fornecido pronto, origem/licença não documentada ainda. Ficha: `assets/audio-transcricao/tutorialTela1/transcricao.md` (transcrição INFERIDA, não ouvida). |
| `assets/audio/tela2.wav` | narração do tutorial, passo 2 de 3 (id `tutorialTela2`) | **A confirmar** — mesma origem do `tela1.wav`. Ficha: `assets/audio-transcricao/tutorialTela2/transcricao.md` (transcrição INFERIDA, não ouvida). |
| `assets/audio/tela3.wav` | narração do tutorial, passo 3 de 3 (id `tutorialTela3`) | **A confirmar** — mesma origem do `tela1.wav`. Ficha: `assets/audio-transcricao/tutorialTela3/transcricao.md` (transcrição INFERIDA, não ouvida). |

Sem som de clique: `config.audio.clique` é `null` de propósito — botões de HUD
(pausa, ajuda, som), menu, níveis, tutorial e resultado ficam silenciosos ao
tocar. Pedido do humano: som só onde é gesto de jogo de verdade. O arquivo que
fazia esse clique (`discord_ping_sound_effect.mp3`, id `cliqueFicha`) foi
removido deste jogo — ainda existe no Bingo e no Jogo da Velha, que continuam
usando som de clique.

O tabuleiro, as células e as fichas (círculos brancos com o número) são
desenhados no canvas pelo próprio motor — nenhum arquivo de imagem. As 12 cores
das células e as cores do cenário já existem em `engine/theme/tokens.js`
(`cores.ludica`, os pares `*Claro`, e a paleta do tema `'quarto'` em
`engine/ui/Background.js`) — nenhuma cor nova foi criada para o tabuleiro em si.

## Pendências conhecidas

> Liste aqui, com honestidade, o que ainda falta.

- **Origem/licença do `soltarPeca`, `tutorialTela1`, `tutorialTela2` e
  `tutorialTela3` a confirmar** — ver tabela acima; todos arquivos próprios
  deste jogo.
- **Transcrição da narração do tutorial ainda não foi OUVIDA** — as 3 fichas
  em `assets/audio-transcricao/tutorialTelaN/` estão como INFERIDA (o texto do
  próprio passo, não uma transcrição de ouvido). Confirmar ouvindo antes de
  publicar para alunos.
- **Sem música de fundo** (`config.audio.musica: null`) e sem locução de
  abertura, escolha de nível, etc. — mesma regra do motor de todo jogo da
  coleção: som só de arquivo gravado, nunca sintetizado; falta produzir essas
  gravações.
- **Numeração dos cartões de nível** (`LevelSelectScreen`, motor compartilhado)
  tem o número do círculo visivelmente fora do centro do emblema —
  identificado em outros jogos da coleção (ex.: Bingo), afeta todos os jogos
  que usam a tela padrão, não é específico deste.

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/jogo-da-ordenacao
node tools/verificar-independencia.mjs numerandus/jogo-da-ordenacao
```
