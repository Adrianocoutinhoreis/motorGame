# Jogo da Memória

Atividade educativa construída com o **Motor Educandus**, na coleção **Numerandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `jogo-da-memoria`
- **Faixa etária:** 4 a 7 anos
- **Criado em:** 2026-09-15
- **Pasta:** `Games/numerandus/jogo-da-memoria/` — dentro da coleção Numerandus.

## O que é

Um jogo de memória (cartas viradas para baixo) onde o par não é "duas cartas iguais":
é **associação**. Cada rodada sorteia algumas categorias de **grandezas e medidas** (peso,
comprimento, capacidade, tempo, quantidade agrupada, forma) e monta duas cartas por
categoria — uma **carta-item** concreta (ex.: 🥛 LEITE) e a **carta-unidade**
correspondente (ex.: LITRO). O aluno vira duas cartas por vez; se combinarem pela mesma
categoria, ficam reveladas com destaque verde estável. Se não combinarem, voltam a ficar
de costas sozinhas depois de um instante — sem punir, sem travar, só demora mais.

Baseado no vídeo de referência (`numerandus/finalizados/1ano/jOGO_DA_MEMORIA`) e no
projeto-fonte `Videos_Numerandus/Jogo_da_memoria/src/JogoDaMemoria/index.tsx`, que mostra
uma demo parcial (2 pares completos: arroz↔kilo, quadrado↔geométrico) com pareação
inconsistente (mistura item↔unidade com item↔categoria). **O conjunto de pares usado
aqui foi desenhado para ser coerente** (sempre item↔unidade) e cobrir os 6 pares que o
nível Difícil precisa — decisão de conteúdo (grandezas e medidas, fiel ao espírito do
vídeo, e não memória clássica de números nem numeral↔quantidade, que já é o tema do
Encaixe Certo) confirmada com o humano antes desta implementação, junto com a semântica
de erro (não-punitiva) e o tema visual (reaproveita a estrutura `'quadro'` do Jogo da
Velha — bandeja de giz, rabiscos brancos — mas em roxo-ardósia, não verde, via
`config.corCeuTopo`/`corCeuBase`, pra não ficar visualmente idêntico).

**Pool de 6 categorias**, cada uma com carta-unidade fixa e 1–3 cartas-item alternativas
(sorteia 1 por partida, pra a mesma dificuldade não repetir sempre a mesma dupla):

| Categoria | Carta-unidade | Cartas-item (sorteia 1) |
|---|---|---|
| Peso/massa | QUILO | 🍚 ARROZ · 🍉 MELANCIA · 🫘 FEIJÃO |
| Comprimento | METRO | 🧶 BARBANTE · 🛣️ RUA · 🧣 CACHECOL |
| Capacidade | LITRO | 🥛 LEITE · 💧 ÁGUA · 🧃 SUCO |
| Tempo | HORA | ⏰ RELÓGIO · 📅 DIA |
| Quantidade agrupada | DÚZIA | 🥚 OVOS |
| Forma | FORMA | 🟦 QUADRADO · 🔺 TRIÂNGULO · ⚪ CÍRCULO |

**Três níveis**, mesma mecânica em todos — a dificuldade cresce em pares por rodada
(`meta`), e cada `meta` corresponde a uma grade de tabuleiro fixa:

| Nível | Pares | Cartas | Grade | Categorias sorteadas |
|---|---|---|---|---|
| Fácil | 3 | 6 | 2×3 | 3 das 6, sem repetir |
| Médio | 4 | 8 | 2×4 (igual ao vídeo de referência) | 4 das 6 |
| Difícil | 6 | 12 | 3×4 | as 6 |

## Como rodar localmente

O motor usa módulos ES, então abrir o `index.html` por `file://` **não funciona**
(o navegador bloqueia os módulos). Sirva por HTTP:

```
node tools/serve.mjs
```

e abra `http://localhost:8080/Games/numerandus/jogo-da-memoria/`.

Para ver a mensagem do AVA saindo de verdade, use o host de teste:
`http://localhost:8080/tools/ava-teste.html`

## Registro no AVA

Ao completar todos os pares (sempre vitória), o jogo emite:

```js
{
  type: "JOGO_CONCLUIDO",
  acertos: 4,              // pares encontrados — SEMPRE cheio, igual à meta do nível
  erros: 1,                // tentativas com par ERRADO, só demonstrativo (ver abaixo)
  totalPerguntas: 4,       // pares da rodada (3, 4 ou 6, conforme o nível)
  nivel: 2,
  jogo: "jogo-da-memoria",
  vitoria: true,
  tempoSegundos: 38,
  ajuda: 0
}
```

`erros` conta cada vez que o aluno vira duas cartas que NÃO combinam — uma tentativa
normal de um jogo da memória (errar é literalmente o que se está treinando: lembrar onde
cada carta estava). **Decisão explícita confirmada com o humano: mesmo assim, `erros` é
só demonstrativo, sem desconto nenhum na nota.** `GameScene` nunca chama `placar.errar()`
(que acionaria o desconto de RE-02) — a contagem vive num contador próprio da cena
(`GameScene._tentativasErradas`) e só é escrita no campo `erros` da mensagem final, por
fora do `ScoreSystem`. Assim `acertos` sai sempre CHEIO, igual à meta: mesmo padrão
não-punitivo já usado no Encaixe Certo e no Jogo da Ordenação, aplicado aqui porque um
jogo da memória sem essa garantia desestimularia exatamente a tentativa-e-erro que é o
próprio mecanismo de aprendizagem do jogo.

A tela final mostra "N PARES" (não "N pontos" nem "N acertos") via
`config.unidadePlacar: { singular: 'par', plural: 'pares' }` — aqui é literal, é um jogo
de pares —, e também o **tempo da partida** (mm:ss, `config.mostrarTempo: true`).

O mesmo tempo já aparece AO VIVO durante a partida: um cronômetro no HUD
(`config.mostrarCronometro`, `GameScene._relogioBadge`), junto com o progresso "X/Y
pares" no mesmo indicador — puramente informativo, sem prazo nem cor de alerta (RE de
"ambiente não punitivo": nunca cronômetro regressivo estressante). `mostrarCronometro:
false` tira só o relógio de vista; `mostrarTempo` (linha na tela de RESULTADO) é
independente.

O jogo não conhece aluno, `lo_id`, `activity_id`, XP ou nota — isso é do AVA.

## Estrutura

```
jogo-da-memoria/
├── index.html      página do jogo
├── engine/         CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js   identidade, níveis, tutorial, assets, contrato
│   ├── main.js     ponto de entrada
│   └── scenes/
│       └── GameScene.js   pool de categorias, tabuleiro, flip, avaliação de pares
├── assets/         imagens e áudio (tudo local)
├── CHECKLIST.md    passos para concluir o jogo
└── README.md       este arquivo
```

## Assets

| Arquivo | Tipo | Origem / licença |
|---|---|---|
| `assets/audio/acertoSOS.wav` | Efeito de vitória (`audio.vitoria`) — sem fala | Aula original 870298 — Educandus. Mesmo arquivo já usado em toda a coleção. |
| `assets/audio/carta-correta.mp3` | Efeito de "par encontrado" (`audio.acerto`) — sem fala | Criado pelo humano especificamente para este jogo, nesta sessão. Arquivo próprio, não reaproveitado. |
| `assets/audio/error.MP3` | Som de erro (`audio.erro`) — par que não combina | **A confirmar** — fornecido pelo humano nesta sessão, ainda não ouvido (ver ficha em `assets/audio-transcricao/erro/`). |
| `assets/audio/tela1.wav` | Narração do tutorial, passo 1 (`config.tutorial[0].fala`) | **A confirmar** — fornecido pelo humano nesta sessão, ainda não ouvido (ver ficha em `assets/audio-transcricao/tutorialTela1/`). |
| `assets/audio/tela2.wav` | Narração do tutorial, passo 2 (`config.tutorial[1].fala`) | **A confirmar** — mesma origem do `tela1.wav` (ver ficha em `.../tutorialTela2/`). |
| `assets/audio/tela3.wav` | Narração do tutorial, passo 3 (`config.tutorial[2].fala`) | **A confirmar** — mesma origem do `tela1.wav` (ver ficha em `.../tutorialTela3/`). |

Nenhum outro asset de imagem: todo o tabuleiro (verso das cartas, emoji, texto) é
desenhado em canvas por `GameScene.js` — sem depender de `center_back.png`/`back.png` do
projeto-fonte Remotion, consistente com o resto do motor.

## Pendências conhecidas

> Liste aqui, com honestidade, o que ainda falta.

- **Narração do tutorial ligada, mas não confirmada por ouvido.** O humano entregou
  `tela1.wav`/`tela2.wav`/`tela3.wav` já nomeados na ordem dos passos — mesma convenção do
  Jogo da Velha/Ordenação/Encaixe Certo/Bingo — então `config.tutorial[*].fala` já aponta
  pra eles (`tutorialTela1/2/3`). As 3 fichas em `assets/audio-transcricao/` inferem a
  transcrição do próprio texto da tela (mesmo método dos outros jogos), status 🟡 INFERIDA.
  Falta: ouvir os 3 e confirmar — o passo 3 ("Errou? Sem problema!") é prioridade, por causa
  da regra "errar não pode humilhar" (`docs/DESIGN.md`).
- **Sem `escolhaNivel`/`falaVitoria`** — esses dois áudios específicos não foram fornecidos
  (só os 3 do tutorial vieram), narrações opcionais do motor compartilhado.
- **`error.MP3` (som de erro) ainda não foi ouvido.** Ficha 🔴 NÃO VERIFICADA em
  `assets/audio-transcricao/erro/`. Se for uma voz reprovadora (não um efeito neutro),
  contraria "errar não pode humilhar" (`docs/DESIGN.md`) — e pesa mais aqui, porque o jogo
  inteiro é desenhado para nunca punir o erro. Falta: ouvir e atualizar a ficha.
- **Sem música de fundo** — mesma regra do motor: som só de arquivo gravado, nunca
  sintetizado.
- **Renderização de emoji varia entre sistemas** (Segoe UI Emoji no Windows, Noto Color
  Emoji no Android/Chrome OS, Apple Color Emoji no iOS/macOS) — o desenho de cada
  item/carta muda um pouco entre aparelhos, mas o significado se mantém. Vale testar
  no(s) tablet(s) reais da escola antes de considerar fechado.

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/jogo-da-memoria
node tools/verificar-independencia.mjs numerandus/jogo-da-memoria
```
