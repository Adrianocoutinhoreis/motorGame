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
| `assets/audio/soltar_peca.mp3` | Efeito de "par encontrado" (`audio.acerto`) — sem fala | **A confirmar** — mesmo arquivo (mesmo SHA-256) já usado como `soltarPeca` no Jogo da Ordenação e no Encaixe Certo; arquivo fornecido pronto, sem procedência documentada (pendência compartilhada com os outros dois jogos). |

Nenhum outro asset de imagem: todo o tabuleiro (verso das cartas, emoji, texto) é
desenhado em canvas por `GameScene.js` — sem depender de `center_back.png`/`back.png` do
projeto-fonte Remotion, consistente com o resto do motor.

## Pendências conhecidas

> Liste aqui, com honestidade, o que ainda falta.

- **Sem narração de tutorial.** Os áudios brutos fornecidos em
  `Videos_Numerandus/jogo_memoria_assets/` (vários `.wav` "Generated Audio…") não estão
  identificados por passo — ao contrário do Jogo da Velha/Ordenação/Encaixe Certo, onde o
  humano entregou os arquivos já nomeados `tela1.wav`/`tela2.wav`/`tela3.wav` na ordem dos
  passos. Mapear um `.wav` sem rótulo a um passo do tutorial seria **chutar**, e o motor
  nunca sintetiza nem assume conteúdo pedagógico sem confirmação humana — por isso
  `config.tutorial[*].fala` fica de fora de propósito (tutorial 100% visual por enquanto,
  com texto e desenho animado, mas sem voz). Falta: ouvir os áudios brutos, identificar
  qual (se algum) corresponde a qual passo, renomear e mapear.
- **Sem `escolhaNivel`/`falaVitoria`** — mesma causa acima, narrações opcionais do motor
  compartilhado sem gravação identificada.
- **Origem/licença do `soltar_peca.mp3` ainda a confirmar** — mesma pendência já
  existente no Jogo da Ordenação e no Encaixe Certo (é o mesmo arquivo nos três).
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
