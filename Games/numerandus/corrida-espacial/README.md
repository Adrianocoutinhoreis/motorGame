# Corrida Espacial

Atividade educativa da coleção **Numerandus**, construída com o **Motor Educandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `corrida-espacial`
- **Faixa etária:** 4 a 7 anos
- **Criado em:** 2026-10-14
- **Status:** 🚧 jogável, [pendências declaradas](#pendências-conhecidas)
- **Especificação:** [`docs/REGRAS-CORRIDA-ESPACIAL.md`](../../../docs/REGRAS-CORRIDA-ESPACIAL.md)

## O que é

Dois foguetes, cada um numa pista de 1 a 20. A criança toca em **ROLAR**, leva o
próprio foguete até a casa certa — **tocando nele** (uma casa por toque, contando) ou
**arrastando** direto — e confirma em **PRONTO**. O foguete laranja do computador rola
dados honestos e anda contando em voz alta. Quem passar primeiro da chegada vence.

Ela pratica a **reta numérica de 1 a 20**: contar a partir de uma casa, somar a partir
de uma casa e calcular a diferença entre dois dados.

Baseado no brinquedo físico do vídeo `Videos_Numerandus/corrida_espacial`, que mostra
três jeitos de brincar — os três níveis:

| Nível | Dados | O foguete anda |
|---|---|---|
| Fácil | 1 dado | o valor do dado (1 a 6) |
| Médio | 2 dados | a soma (2 a 12) |
| Difícil | 2 dados | o maior menos o menor (0 a 5; zero não sai do lugar) |

## A jogada, em detalhe

- **Acertou** (PRONTO na casa certa): o foguete dá um impulso, a casa é narrada, e a vez
  passa ao computador. Na chegada, o foguete desliza até a faixa quadriculada — mesmo
  quando a conta cai exatamente no 20, que já vence.
- **Errou**: o foguete volta para onde a jogada começou, aparece "TENTE DE NOVO" e conta
  um erro. Os dados continuam na tela.
- **Ajuda no 2º erro da mesma jogada**: as casas acendem uma a uma, contadas, até a certa
  (com um anel amarelo). A criança ainda leva o foguete e confirma — nenhuma jogada trava.
- **Andança zero** (Difícil): a jogada certa é tocar PRONTO sem mexer o foguete.
- **Passar do 20 vale** (`regras.chegada: 'passar'`, como no vídeo): o foguete vai para a
  faixa da chegada.

As regras ajustáveis ficam em `src/config.js` → `regras` (chegada, erro que liga a
ajuda, ritmo do computador, balão de casas andadas, algarismo no dado).

## Como rodar localmente

```
node tools/serve.mjs
```

e abra `http://localhost:8080/Games/numerandus/corrida-espacial/`.
Para ver a mensagem do AVA saindo de verdade: `http://localhost:8080/tools/ava-teste.html`.

## Registro no AVA

Ao terminar uma partida (vitória **ou** derrota):

```js
{
  type: "JOGO_CONCLUIDO", jogo: "corrida-espacial", nivel,
  acertos,          // vitória: 20 − erros (RE-02) · derrota: a casa alcançada
  erros,            // PRONTO em casa errada
  totalPerguntas: 20,
  vitoria,          // o foguete azul chegou primeiro?
  modo, casaAlcancada, casaComputador, jogadas, certasDePrimeira, jogadasComAjuda,
  venceuCorrida, tempoSegundos, ajuda
}
```

Conferido em navegador em 14/10/2026: vitória com 1 erro → `acertos: 19`, tela
"19 CASAS" e 4 estrelas; derrota com o azul na casa 11 → tela "11 CASAS", 2 estrelas.

## Estrutura

```
corrida-espacial/
├── index.html
├── engine/              CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js        identidade, níveis, regras, tutorial (com o desenho), assets
│   ├── regras.js        as regras puras (dados, andança, casa-alvo) — sem motor
│   ├── desenho.js       foguete, dado, pista, dedinho — usados pela cena e pelo tutorial
│   ├── main.js
│   └── scenes/GameScene.js
├── assets/audio/        efeitos reaproveitados da coleção
└── assets/audio-transcricao/   uma ficha por áudio
```

## Assets

| Arquivo | `id` | Uso | Origem / licença |
|---|---|---|---|
| `audio/acertoSOS.wav` | `acertoSOS` | vitória (tela final) | coleção Numerandus (mesmo SHA-256) |
| `audio/erroSOS.wav` | `erroSOS` | derrota (tela final) — o mesmo do Jogo dos Blocos | aula original 870294, copiado do Jogo dos Blocos — **não ouvido** (ficha 🔴; pode conter fala, conferir se não é repreensiva) |
| `audio/error.MP3` | `somErro` | PRONTO errado | coleção Numerandus — **não ouvido** (ficha 🔴) |
| `audio/progresso.mp3` | `somProgresso` | jogada certa | coleção Numerandus (Jogo da Memória → Material Dourado) |
| `audio/soltar_peca.mp3` | `pouso` | o foguete laranja pousa | coleção Numerandus — **origem/licença a confirmar** |
| `audio/tutorial/tela01.wav` | `tutorialTela1` | narração do passo 1 (tutorial e ajuda) | gravação fornecida em 14/10/2026 — **origem/licença a confirmar** |
| `audio/tutorial/tela002.wav` | `tutorialTela2` | narração do passo 2 (tutorial e ajuda) | gravação fornecida em 14/10/2026 — **origem/licença a confirmar** |
| `audio/tutorial/tela003.wav` | `tutorialTela3` | narração do passo 3 (tutorial e ajuda) | gravação fornecida em 14/10/2026 — **origem/licença a confirmar** |
| `audio/tutorial/tela04.wav` | `tutorialTela4` | narração do passo 4 (tutorial e ajuda) | gravação fornecida em 14/10/2026 — **origem/licença a confirmar** |
| `img/foguete.png` | `foguete` | os dois foguetes (pista, painel e tutorial) | arte fornecida em 14/10/2026 — **origem/licença a confirmar**. Recortada e reduzida (269 × 440) de `fontes/corrida-espacial/foguete-original.png` (988 × 1591), que fica fora do pacote |

**O foguete** é a arte do PNG, desenhada deitada (bico para a direita). A janelinha da arte
é um furo transparente, como no brinquedo; o jogo põe nela um disco branco com o número da
casa e o aro na cor do time — **azul** para a criança, **laranja** para o computador —, que é
o que distingue os dois foguetes, já que a arte é a mesma. Se a imagem não carregar, o jogo
cai num foguete vetorial (`src/desenho.js`) em vez de ficar sem foguete. O resto da arte
(pista, dados, botões, planetas) é desenhado em canvas.

## Pendências conhecidas

- **Narração do tutorial gravada, ainda não ouvida** — os quatro arquivos em
  `assets/audio/tutorial/` (14/10/2026) estão declarados em `config.assets`, com ficha em
  `assets/audio-transcricao/` em status 🔴: **confirme ouvindo** antes de fechar o jogo.
  O restante da narração continua não gravado — o jogo funciona mudo nesses pontos, e o
  console diz o que falta. Ids já usados pela cena — basta declarar os arquivos em
  `config.assets`:

  | id | Deve dizer |
  |---|---|
  | `numero1` … `numero20` | "um" … "vinte" — serve à contagem casa a casa E ao nome da casa de chegada |
  | `mais`, `menos` | "mais", "menos" (leitura dos dados no Médio e no Difícil) |
  | `tenteDeNovo` | "Tente de novo!" |
  | `zeroFicaNoLugar` | "Zero, fica no lugar!" |
  | `passouFicaNoLugar` | "Passou do vinte, fica no lugar!" (só com `chegada: 'exata'`) |
  | `chegou` | "Chegou!" |
  | `chegouLaranja` | "O foguete laranja chegou!" |
  | `suaVez`, `vezDoComputador` | "Sua vez!", "Vez do computador!" |

- **`error.MP3` não foi ouvido** e **`soltar_peca.mp3` tem origem a confirmar** — as mesmas
  pendências dos outros jogos da coleção que usam essas cópias.
- **`node tools/audio-info.mjs` reprova** os três arquivos cujo nome difere do `id`
  (`error.MP3`/`somErro`, `progresso.mp3`/`somProgresso`, `soltar_peca.mp3`/`pouso`): a
  ferramenta casa ficha e config pelo NOME do arquivo. É o mesmo resultado do Caminho das
  Cores, que usa os mesmos arquivos — limitação da ferramenta, não deste jogo.
- **Não jogado por uma criança.** As decisões em aberto da especificação (seção 9) —
  Médio curto, "18 CASAS" numa vitória com 2 erros — esperam esse teste.
- **Sem teste em tablet real.** Toque e arrasto foram verificados com eventos de ponteiro
  reais em navegador headless, não num aparelho.

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/corrida-espacial
node tools/verificar-independencia.mjs numerandus/corrida-espacial
```
