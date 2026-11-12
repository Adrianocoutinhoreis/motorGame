# Cubra Nove

Jogo da coleção **Numerandus** (2º ano), refeito do vídeo `numerandus\finalizados\2ano\Cubra_Nove`.
Especificação completa, com a transcrição do vídeo e as medidas: [`docs/REGRAS-CUBRA-NOVE.md`](../../../docs/REGRAS-CUBRA-NOVE.md).

- **Slug:** `cubra-nove` (vai no campo `jogo` do AVA — não mudar depois de publicar)
- **Público:** 7 a 8 anos (2º ano)
- **Tema do motor:** `'madeira'` (o tampo de uma mesa de madeira clara) (novo no motor 1.4.0)
- **Status:** 🚧 jogável, [pendências declaradas](#pendências-conhecidas)
- **Planejamento:** artifact "Plano Cubra Nove" (protótipo jogável, 12/11/2026)

## O que é

Cada jogador tem uma fileira de casas de 1 a 9. A criança toca nos dois dados e cobre, com cubinhos de
madeira, tudo o que estiver livre entre os dois números, a soma (até 9) e a diferença (não 0). O
computador joga igual, mas esquece um número 1 vez em 4 — fica sem ele — e a criança confere (COBRIU
TUDO / FALTOU UM). Em três rodadas, vence quem cobrir mais; cobrir as 9 vence na hora; empate vai a
rodadas extras.

## A jogada, em detalhe

- **Os dados**, à esquerda: um toque joga. Na hora de jogar ganham um contorno azul e o dedinho branco
  aponta para eles (na 1ª rodada na hora; depois, só se a criança demorar 2,5 s). Depois de rolar, cada
  dado é a "conta" dele: fica verde quando o número dele é coberto.
- **Cobrir**: arrastar um cubinho do monte (à direita) até a casa, ou tocar na casa e o cubinho voa
  sozinho. Acerto e erro aparecem **no tabuleiro, sem frase**: anel verde que se apaga (acerto), a casa
  balançando com anel coral e o cubinho voltando (erro, conta 1). Casa já coberta ou fora da fileira: a
  peça volta, sem erro. Só o dedo que pegou a peça a move (um segundo toque não a solta).
- **As contas** no centro, conforme o nível: prontas (Fácil, sem a diferença), com "?" (Médio) ou
  escondidas (Difícil).
- **PRONTO** confere. Sobrou número, é 1 erro a cada toque: no 1º, a bolinha no monte com quantos faltam e
  a conta (ou o dado) que falta brilhando em âmbar; no 2º, o jogo **mostra**: o cubinho vai até cada casa
  que falta e volta ao monte, e as casas ficam marcadas em âmbar para a criança levar a peça.
- **Três erros na mesma vez** (casas erradas e PRONTOs cedo, em qualquer nível): **a vez passa** e ela
  fica sem os números que faltavam, com o fantasma mostrando onde iriam. O jogo nunca cobre por ela.
- Fim da vez limpa: "MUITO BEM!" / "ISSO AÍ!" / "MANDOU BEM!"; com erro ou dica: "CONSEGUIU!".
- **O computador**: os cubinhos voam até a fileira dele, um por um. Na vez dele nada fica verde: a
  criança compara os dados com a fileira e confere. Se ele esqueceu, fica sem o número e o cubinho
  fantasma tracejado mostra onde a peça poderia estar, até a criança jogar de novo.
- **Sem placar escrito, sem rótulo de vez, sem instrução na tela**: as fileiras são o placar, o contorno
  azul é a vez, o tutorial (botão de ajuda) é a instrução. A rodada é anunciada só com letras ("RODADA
  **2** DE 3") e pela voz.

## Como rodar

```bash
node tools/serve.mjs 8099
# abra http://127.0.0.1:8099/Games/numerandus/cubra-nove/
```

## Como testar

```bash
node tools/build.mjs numerandus/cubra-nove                # copia o motor para dentro
node tools/testes.mjs                                     # lógica do motor (157, com o "um dedo por vez")
node tools/teste-regras-cubra-nove.mjs                    # regras puras, jogada a jogada contra o vídeo, e simulação (22)
node tools/verificar-independencia.mjs numerandus/cubra-nove
node tools/teste-entrega-avulsa.mjs numerandus/cubra-nove
node tools/teste-jogabilidade-cubra-nove.mjs              # gesto real (60 verificações), com o servidor na 8099
```

`teste-jogabilidade-cubra-nove.mjs` só usa ponteiro (mouse e toque emulado; os ganchos `dadosDeTeste` e
`esqueceDeTeste` só escolhem os próximos sorteios): menu → níveis → partida; os dados; o **arrasto** do
monte até a casa; tocar na casa certa e na errada; os três degraus da ajuda; o elogio; o computador
esquecendo e o fantasma; a pausa congelando o voo; a ajuda devolvendo a partida; **dois dedos** (a
palma não solta a peça); as contas do Médio e do Difícil; e o AVA num iframe (vitória e derrota, os
números batendo, sem duplicata). Último passe completo em 12/11/2026: jogabilidade 60, regras 22, motor 157.

## Registro no AVA

```js
{ type: "JOGO_CONCLUIDO", acertos, erros, totalPerguntas: 9, nivel, vitoria, jogo: "cubra-nove",
  cobertasCrianca, cobertasComputador, cobertasPorOrigem: { dado, soma, dif }, toquesErrados, prontoCedo,
  dicasNaConta, demonstracoes, vezesPerdidas, numerosPerdidos, vezesSemNada, conferencias, conferenciasCertas,
  esquecimentosDoComputador, rodadas, rodadasExtras, empateNoTeto, cobriuOsNove, tempoSegundos, ajuda }
```

| Campo | Valor |
|---|---|
| `totalPerguntas` | 9 (as casas da fileira) |
| `acertos` | vitória: casas cobertas − erros (mínimo 0); derrota: casas cobertas (RE-02) |
| `erros` | cubinhos em casa que os dados não dão + PRONTO com número por cobrir (conferir mal não conta) |
| `cobertasPorOrigem` | quantas casas a criança cobriu pelo dado, pela soma e pela diferença |
| `demonstracoes` | vezes em que o jogo mostrou onde iam as peças (2º PRONTO cedo) |
| `vezesPerdidas` / `numerosPerdidos` | vezes em que a vez passou pelos três erros, e quantos números ela perdeu nelas |

Conferido no `ava-teste.html` em 12/11/2026: vitória no Fácil sem erro → `acertos` = casas cobertas (8),
`erros: 0`; derrota no Médio → `acertos: 1` (só o 6), computador 8; o host valida as mensagens e ficar
parado no resultado não duplica.

## Estrutura

```
cubra-nove/
├── index.html
├── engine/              CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js        identidade, níveis, regras, tutorial (5 passos desenhados), áudio
│   ├── regras.js        regras puras: as contas, o que cobrir, a dica, as rodadas, a nota
│   ├── desenho.js       prancha, casas, cubinho, fantasma, dados, contas, monte, dedinho (partida e tutorial)
│   ├── main.js
│   └── scenes/GameScene.js
├── assets/audio/        efeitos e falas reaproveitados do Cabo de Guerra
├── assets/audio-transcricao/   uma ficha por áudio
├── CHECKLIST.md
└── README.md
```

## Assets

| Arquivo | id | Origem |
|---|---|---|
| `audio/acertoSOS.wav` | `acertoSOS` | coleção (mesmo SHA-256 do Cabo de Guerra) |
| `audio/erroSOS.wav` | `erroSOS` | coleção |
| `audio/error.MP3` | `somErro` | coleção — **não ouvido** |
| `audio/progresso.mp3` | `somProgresso` | coleção |
| `audio/soltar_peca.mp3` | `somConta` | coleção — **origem/licença a confirmar** |
| `audio/falas/muitoBem.wav` | `muitoBem` | coleção (Jogo dos Blocos, 22/10/2026) — **não ouvido** |
| `audio/falas/suaVez.wav` | `suaVez` | coleção (mesmo SHA-256 do Cabo de Guerra) — **não ouvido**; toca no começo da vez da criança, depois do anúncio da rodada |
| `audio/falas/vezDoComputador.wav` | `vezDoComputador` | coleção — **não ouvido** |

Toda a arte é desenhada no canvas. As fichas de transcrição foram copiadas do Cabo de Guerra; só a seção
"Onde é usado no jogo" foi reescrita.

## Pendências conhecidas

- **Narração própria não gravada.** A cena já pede cada id; sem o arquivo, fica muda nesse ponto:
  - a rodada: `rodada1`, `rodada2`, `rodada3`, `rodadaExtra`;
  - os elogios: `issoAi`, `mandouBem`, `conseguiu` (`muitoBem` já existe);
  - a ajuda: `aindaDaParaCobrir`, `olheOndeVai`, `aVezPassa`;
  - a conferência: `isso`, `olheDeNovo`;
  - o tutorial: `tutorialTela1` a `tutorialTela5`.
- **Áudios reaproveitados não ouvidos** e **origem/licença** do `soltar_peca.mp3` — a pendência de toda a coleção.
- **Não jogado por criança nem em tablet de verdade.** Toque e arrasto verificados com mouse e toque
  emulados via CDP (inclusive dois dedos); falta o dedo real, o celular em pé e o iframe do AVA real.
- **A nota carrega um pouco da sorte**: as casas cobertas dependem dos dados (seção 6 da especificação).
  A habilidade aparece mais limpa nos extras (`toquesErrados`, `prontoCedo`, `numerosPerdidos`,
  `conferenciasCertas`). Rever com o professor se a nota deve medir outra coisa.
- **O computador que esquece deixa a criança vencer 63% das partidas** (simulação; 51% se ele não
  esquecesse). Conferir com criança se o equilíbrio está bom.
- **Zip da entrega ainda não gerado.** Usar `tar -a -c -f x.zip .` (o `Compress-Archive` do PowerShell
  5.1 grava barra invertida nos caminhos).

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/cubra-nove
node tools/verificar-independencia.mjs numerandus/cubra-nove
```
