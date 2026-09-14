# Encaixe Certo

Atividade educativa construída com o **Motor Educandus**, na coleção **Numerandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `encaixe-certo`
- **Faixa etária:** 4 a 7 anos
- **Criado em:** 2026-09-11
- **Pasta:** `Games/numerandus/encaixe-certo/` — dentro da coleção Numerandus.

## O que é

Um jogo de correspondência número↔quantidade, com peças de quebra-cabeça de
verdade. Cada rodada sorteia alguns números (1 a 5 no Fácil, 1 a 9 nos outros
dois) e mostra duas metades separadas: a **peça-quantidade** (fixa no
tabuleiro, mostra `N` marcadores — sempre o mesmo bichinho ou fruta para
aquele número, nunca o algarismo) e a **peça-número** (solta numa bandeja
embaralhada, com o algarismo grande). O aluno **arrasta** o número certo até
perto da peça-quantidade certa; perto o bastante e com o valor batendo, a
peça é puxada pro lugar e **trava** — como um encaixe de quebra-cabeça de
verdade, sem folga. Perto do soquete errado, ou longe de todos, a peça só
volta para o próprio lugar na bandeja — nunca conta contra o aluno.

Baseado no vídeo de referência (`numerandus/finalizados/1ano/encaixe_certo`) e
no projeto-fonte `Videos_Numerandus/encaixe_certo/src/EncaixeCerto.tsx`, que
documentam a mecânica original (peças com entalhe/nó, ilustração de um lado,
numeral do outro). O **layout, a paleta, o elenco temático de emojis e a
curva do encaixe foram desenhados e aprovados num plano visual** (mockup
interativo) antes desta implementação começar.

**Elenco temático fixo, 1 a 9** — cada número tem sempre a mesma figura, pra
criança aprender a reconhecer o número pela figura, não só contar:

🍓 morango · 🍎 maçã · 🍊 laranja · 🍋 limão · 🍇 uva · 🍒 cereja · ⚽ bola ·
🐱 gato · ⭐ estrela — maioria frutinha/objeto redondo, de propósito: um rosto
de bicho tem silhueta mais irregular que uma fruta ou bola, mais difícil de
diferenciar rápido numa peça pequena (era 5 bichos pra 3 frutas; agora é 1
bicho pra 6 frutas + 1 bola).

**Três níveis**, mesma mecânica em todos — a dificuldade cresce em três eixos
(quantos pares por rodada, até que número vai, e como os marcadores de
quantidade aparecem dentro da peça):

- **Nível 1 (Fácil):** 3 pares, números 1 a 5, marcadores em fileira arrumada.
- **Nível 2 (Médio):** 5 pares, números 1 a 9, marcadores em grade arrumada.
- **Nível 3 (Difícil):** 7 pares, números 1 a 9, marcadores **espalhados**
  dentro da peça — exige contar um a um, não só reconhecer o padrão de
  relance.

**Os pares aparecem em ONDAS de no máximo 3 por vez** (`GameScene.MAX_PARES_POR_ONDA`),
nunca todos de uma vez — mesmo num nível com 7 pares no total. Achado jogando
(print do humano): caber 7-9 pares na tela ao mesmo tempo força cada peça
pequena, e caber 7-9 marcadores DENTRO de uma peça pequena força cada
marcador a ficar minúsculo (chegou a 17px lógicos medidos, ~5px reais num
celular comum) — péssimo para o público neurodivergente da coleção. Limitar
quantos pares aparecem por vez resolve isso de raiz: a meta do nível continua
valendo para a pontuação (`nivel.meta`), só não aparece de uma vez só. Quando
a onda visível termina, ela comemora e a próxima aparece — até completar a
meta do nível.

**As ondas são DISTRIBUÍDAS por igual, nunca cortadas em fatias fixas**
(`dividirEmOndas`): 7 pares no Difícil viravam `3, 3, 1` — a última onda
sobrava com um par SÓ, e com um par só na tela não existe escolha nenhuma
(um soquete, uma ficha, sempre o par certo, sem alternativa pra comparar ou
errar). Agora vira `3, 2, 2`: toda onda, em qualquer nível, tem pelo menos 2
pares — uma escolha de verdade entre pelo menos duas fichas.

**É um quebra-cabeça solo — nunca há derrota.** Um encaixe errado nunca é
"erro" no placar: só não trava. Não existe cronômetro regressivo nem "game
over". Quando uma onda termina, cada quantidade e seu número saltam juntos (a
peça já está fundida); se era a última onda do nível, vai para a tela de
resultado — senão, a próxima onda aparece.

## O encaixe — a peça de verdade

O entalhe da peça-quantidade e o nó da peça-número nascem da **mesma curva
bezier** (`GameScene.js`: `noParaCima`/`noParaBaixo`), só percorrida em
sentidos opostos — uma vez cortando pra dentro, outra vez sobrando pra fora.
É isso que garante o encaixe **sem folga nem sobreposição**: não são duas
formas parecidas desenhadas cada uma por conta própria, é uma forma só.

## Layout da partida

Tabuleiro (peças-quantidade) em cima, bandeja (fichas-número) embaixo, cada
um no seu próprio cartão (`PainelZona` creme para o tabuleiro, âmbar mais
enxuto para a bandeja) — os dois centralizados verticalmente entre o HUD e a
prateleira do tema `'quarto'`. O tamanho da peça (`w`/`h` em `_construirOnda`)
respeita a largura disponível E a altura que tabuleiro e bandeja precisam,
então nunca estoura pra fora do cartão nem encolhe além do piso de 135px.

## Como rodar localmente

```bash
node tools/serve.mjs
```

Abra: `http://localhost:8080/Games/numerandus/encaixe-certo/`

Para ver a mensagem do AVA saindo de verdade, use o host de teste:
`http://localhost:8080/tools/ava-teste.html`

## Registro no AVA

Ao completar todos os pares (sempre vitória), o jogo emite:

```js
{
  type: "JOGO_CONCLUIDO",
  acertos: 5,             // pares encaixados — igual à meta do nível jogado
  erros: 0,               // este jogo não penaliza tentativa nenhuma
  totalPerguntas: 5,      // pares da rodada (3, 5 ou 7, conforme o nível)
  nivel: 2,
  jogo: "encaixe-certo",
  vitoria: true,          // sempre — este jogo não tem derrota
  tempoSegundos: 38,
  ajuda: 0,
}
```

A tela final mostra "N PARES" (não "N pontos") via `config.unidadePlacar`, e
também o **tempo da partida** (mm:ss) — campo opcional em `ResultScreen`
(`config.mostrarTempo: true`).

O mesmo tempo já aparece AO VIVO durante a partida: um cronômetro no HUD
(topo-centro, ícone de relógio + "mm:ss"), puramente informativo — sem prazo,
sem cor de alerta. Lê `this.game.tempoJogando` (getter público do motor), o
mesmo contador que já existia por trás do `tempoSegundos` do AVA — por isso
congela sozinho durante Pausa e Ajuda, sem lógica de pausa própria do jogo.

Esse relógio ao vivo é opcional: `config.mostrarCronometro: false` tira o
badge do HUD por completo (junto com o "X/Y" de progresso entre ondas, que
mora no mesmo indicador) — pra quem preferir não incentivar pressa em quem
ainda está aprendendo a contar. Independente de `mostrarTempo` (a linha na
tela de RESULTADO), que continua existindo mesmo com o relógio ao vivo
desligado.

**Sobre `erros`: este jogo não conta nenhum.** Tentar encaixar um número no
soquete errado nunca vira erro — a peça só não trava e volta pro próprio
lugar na bandeja. É a mesma correção (RE-02) já aplicada no Jogo da
Ordenação: um quebra-cabeça não pune tentativa, só não premia a errada.

## Estrutura

```
encaixe-certo/
├── index.html      página do jogo
├── engine/         CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js   identidade, níveis, tutorial, assets, contrato
│   ├── main.js     ponto de entrada
│   └── scenes/
│       └── GameScene.js   as peças, o arrastar, o encaixe e a pontuação
├── assets/         áudio (tudo local)
├── CHECKLIST.md    passos para concluir o jogo
└── README.md       este arquivo
```

## Assets

| Arquivo | Tipo | Origem / licença |
|---|---|---|
| `assets/audio/acertoSOS.wav` | efeito de fim de partida — vitória (id `acertoSOS`) | Aula original 870298 — Educandus. Mesmo arquivo (mesmo SHA-256) do Jogo das Formas/Blocos/Cores/Bingo/Jogo da Velha/Jogo da Ordenação. Ficha: `assets/audio-transcricao/acertoSOS/transcricao.md`. Não há `erroSOS`: este jogo nunca tem derrota. |

Sem som de clique (`config.audio.clique: null`): botões de HUD (pausa, ajuda,
som), menu, níveis, tutorial e resultado ficam silenciosos ao tocar — mesma
decisão do Jogo da Ordenação, som só onde é gesto de jogo de verdade.

**O som de encaixe (`config.audio.soltar`) ainda não foi gravado** — fica
`null` de propósito. O jogo funciona inteiro sem ele (feedback visual: a peça
é puxada pro lugar e trava), só falta o efeito sonoro.

Nenhuma imagem: peças, entalhe/nó, contorno e os marcadores de quantidade são
desenhados no canvas — os marcadores usam **emoji nativo** (`ctx.fillText`),
não path vetorial nem PNG. O tema de cenário é `'quarto'`, com
`corCeuTopo`/`corCeuBase` próprios (azul-marinho escuro) e
`mostrarDecoracoes: false` — uma variante do quarto sem a prateleira/enfeite
padrão do tema, criada com os parâmetros que o `Background` já expõe, sem
nenhuma cor nova no motor.

## Ajustes de qualidade (sessão de 2026-09-14)

- **Tolerância de encaixe recalibrada.** O raio de aceite do soquete chegou a
  1,35× a altura da peça (~90% da largura dela) — soltar a ficha bem longe do
  soquete certo ainda contava como acerto e "teleportava" pro lugar, sem
  parecer um encaixe de verdade. Medido e ajustado para 0,7× a altura
  (~65% da largura): ainda generoso pra motricidade de 4-7 anos, mas exige
  soltar de fato perto do soquete (ver `GameScene._dentroDaTolerancia`).
- **Tutorial sincronizado com o visual atual do jogo.** O passo 2 (arrastar)
  só anima na horizontal agora — antes também descia e vazava da caixa da
  ilustração, cobrindo o título/texto do passo. Corpo das peças, soquete
  fantasma (agora com "?", igual ao jogo real) e disposição dos marcadores
  (padrão canônico dado/dominó, sem sobreposição) também foram alinhados ao
  que `GameScene.js` desenha de verdade.
- **Tela de resultado mais equilibrada e um bug corrigido no motor**
  (`engine/screens/ResultScreen.js`, afeta todos os jogos ao rebuildar): o
  bloco painel+botões centraliza como uma unidade só agora (antes só o painel
  se centralizava, empurrando os botões quase pro chão); e uma variável
  `temaInterior` que tinha ficado sem declarar foi restaurada — não quebrava
  este jogo (que sempre define `corCeuTopo`/`corCeuBase`), mas quebraria
  qualquer jogo que não defina essas cores.
- **Ondas do Difícil nunca mais sobram com 1 par sozinho.** 7 pares em ondas
  de até 3 viravam `3, 3, 1` — a última onda, sem opção nenhuma pra comparar,
  não ensinava nem deixava errar. `dividirEmOndas` agora distribui por igual
  (`3, 2, 2`): toda onda, em qualquer nível, tem pelo menos 2 pares.
- **Cronômetro ao vivo agora é opcional** (`config.mostrarCronometro`, padrão
  `true`) — ver a seção "Registro no AVA", acima.
- **Elenco de emoji rebalanceado**: era 5 bichos pra 3 frutas; agora é 1
  bicho (gato) pra 6 frutas/objetos redondos + 1 bola — ver "O que é", acima.

## Pendências conhecidas

> Liste aqui, com honestidade, o que ainda falta.

- **Som de encaixe (`audio.soltar`) ainda não gravado** — o jogo funciona
  silencioso nesse gesto específico; falta produzir/gravar o efeito.
- **Narração do tutorial ainda não gravada** (`tutorial[].fala: null` nos 3
  passos) — o tutorial funciona só com texto e ilustração; falta gravar
  `tutorialTela1/2/3` (mesmo padrão de outros jogos da coleção).
- **Sem música de fundo** e sem locução de abertura, escolha de nível, etc. —
  mesma regra do motor: som só de arquivo gravado, nunca sintetizado.
- **Renderização de emoji varia entre sistemas** (Segoe UI Emoji no Windows,
  Noto Color Emoji no Android/Chrome OS, Apple Color Emoji no iOS/macOS) — o
  desenho do bichinho/fruta muda um pouco entre aparelhos, mas o significado
  se mantém. Vale testar no(s) tablet(s) reais da escola antes de considerar
  fechado.
- **Numeração dos cartões de nível** (`LevelSelectScreen`, motor
  compartilhado) tem o número do círculo visivelmente fora do centro do
  emblema — identificado em outros jogos da coleção, afeta todos os jogos que
  usam a tela padrão, não é específico deste.

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/encaixe-certo
node tools/verificar-independencia.mjs numerandus/encaixe-certo
```
