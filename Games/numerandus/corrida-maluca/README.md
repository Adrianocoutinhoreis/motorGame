# Corrida Maluca

Atividade educativa da coleção **Numerandus**, construída com o **Motor Educandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `corrida-maluca`
- **Faixa etária:** 7 a 8 anos (2º ano)
- **Criado em:** 2026-11-03
- **Status:** 🚧 jogável, [pendências declaradas](#pendências-conhecidas)
- **Especificação:** [`docs/REGRAS-CORRIDA-MALUCA.md`](../../../docs/REGRAS-CORRIDA-MALUCA.md)
- **Refaz:** o vídeo `Desktop\corrida maluca\Corrida_Maluca.mp4` (um tabuleiro de verdade)

## O que é

Um tabuleiro branco de borda azul, com uma trilha em serpentina da **ENTRADA** à **SAÍDA**, um dado
e um baralho de cartas de **dobro, triplo e números ordinais**. A criança (ficha **vermelha**) joga
contra o computador (ficha de **madeira**). Na sua vez ela toca o dado, a ficha anda sozinha contando
as casas e uma **carta** abre: **acertou, fica; errou, volta para onde partiu**. Quem **fica numa casa
verde joga o dado de novo**. O computador joga do mesmo jeito, responde em voz alta e **erra de
propósito 1 vez em 4**: a criança **confere** com CERTO ou ERRADO (a "mesa que confere" do vídeo).
Vence quem chega primeiro na SAÍDA: chegou, venceu, sem carta.

| Nível | Trilha | Verdes | Cartas |
|---|---|---|---|
| Fácil | 15 passos, casas grandes | 5, 8, 12 | dobro de 1 a 5, ordinais 1º a 5º |
| Médio | 21 passos | 7, 12, 17 | dobro de 1 a 10, triplo de 1 a 5, ordinais 1º a 10º |
| Difícil | 27 passos (o tabuleiro do vídeo) | 9, 15, 22 | dobro e triplo de 1 a 10, ordinais 1º a 10º, problemas de preço |

## A jogada, em detalhe

- **Dado**: o botão **JOGAR O DADO** (ou o próprio dado) rola um dado de 1 a 6. O dedinho aponta o
  botão na vez da criança. A ficha anda casa a casa com um selo contando os passos ("1", "2", "3"…),
  e a voz conta junto. **A ficha anda no ritmo da voz**: cada passo espera o número terminar de ser
  falado, e a carta só abre depois do último (`regras.falaMaxMs` é o teto da espera). Passar da SAÍDA
  para nela.
- **A carta** abre por cima do tabuleiro: o tipo (DOBRO, TRIPLO, ORDINAIS, PROBLEMA), a pergunta
  narrada e **três respostas grandes**. Uma das erradas é sempre a confusão típica (o triplo no lugar
  do dobro). Nos ordinais a resposta vem com o símbolo embaixo (DÉCIMO · 10º).
- **Certo**: a resposta acende verde, "ACERTOU!", e a ficha fica. **Errado**: a certa acende, o jogo
  mostra a conta em parcelas ("O TRIPLO DE 4 É 4 + 4 + 4 = 12") e, depois do **CONTINUAR**, a ficha
  volta casa a casa para onde a jogada começou. A carta só fecha no CONTINUAR: a criança lê no ritmo dela.
- **Casa verde**: quem **fica** nela (acertou a carta) joga de novo: a faixa diz "SUA VEZ DE NOVO!" e a
  verde ganha um **anel amarelo estável**. Errar a carta da jogada extra devolve a ficha **à verde**.
- **Vez do computador**: a faixa fica cor de madeira, ele joga o dado sozinho, anda contando e
  responde: "O COMPUTADOR DIZ: 12". A criança toca **CERTO** ou **ERRADO**; o jogo diz se ela conferiu
  bem ("ISSO! ELE ERROU.") e mostra a conta. Se ele errou, a ficha dele volta. **Conferir mal não é
  erro na nota.**
- **Fim**: quem **chega** na SAÍDA vence na hora, sem carta (a criança ou o computador; passar dela
  vale). A ficha brilha na chegada por um instante e o jogo vai direto ao resultado da série.
  Não há cronômetro.
- **Nota** (RE-02): a meta é a trilha do nível (15, 21 ou 27). Vitória = meta − cartas erradas;
  derrota = a casa alcançada. A tela diz "N CASAS" (RE-03).

## Como rodar

```bash
node tools/serve.mjs 8099
# abra http://127.0.0.1:8099/Games/numerandus/corrida-maluca/
```

## Como testar

```bash
node tools/build.mjs numerandus/corrida-maluca                  # copia o motor para dentro
node tools/testes.mjs                                           # lógica do motor (154)
node tools/verificar-independencia.mjs numerandus/corrida-maluca
node tools/teste-entrega-avulsa.mjs numerandus/corrida-maluca
node tools/teste-jogabilidade-corrida-maluca.mjs               # gesto real (76 verificações)
```

`teste-jogabilidade-corrida-maluca.mjs` só usa ponteiro (nada é chamado por dentro; os ganchos
`dadoDeTeste` e `computadorErraDeTeste` só escolhem o próximo sorteio): as regras puras, menu → níveis
→ partida, o dado e a ficha andando, a carta certa e a errada (a volta), a vez do computador e a
conferência, a casa verde da criança e a do computador (e a volta para a verde), pausa no meio da ficha andando, ajuda por cima da
carta, e o AVA num iframe (vitória e derrota, os números batendo, sem duplicata). Rodado 6 vezes
seguidas sem falha em 03/11/2026.

## Registro no AVA

```js
{ type: "JOGO_CONCLUIDO", acertos, erros, totalPerguntas, nivel, vitoria, jogo: "corrida-maluca",
  casaAlcancada, casaComputador, cartasRespondidas, cartasCertas, cartasPorTipo,
  conferencias, conferenciasCertas, jogadasExtras, jogadas, venceuCorrida }
```

| Campo | Valor |
|---|---|
| `totalPerguntas` | a meta: 15, 21 ou 27 |
| `acertos` | vitória: meta − cartas erradas (mínimo 0); derrota: a casa alcançada |
| `erros` | cartas respondidas erradas pela criança |
| `cartasPorTipo` | `{ dobro: "certas/respondidas", … }` |
| `conferencias` / `conferenciasCertas` | quantas respostas do computador ela conferiu, e quantas bem |

Conferido no `ava-teste.html` em 03/11/2026: vitória no Fácil sem erro → `acertos: 15`, "15 CASAS",
5 estrelas; derrota no Médio errando tudo → `acertos: 0`, `erros` = as cartas erradas; o host valida
as mensagens e ficar parado no resultado não duplica.

## Estrutura

```
corrida-maluca/
├── index.html
├── engine/              CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js        identidade, níveis, regras, tutorial (4 passos desenhados), áudio
│   ├── regras.js        regras puras: a trilha, as verdes, as cartas, o computador, a nota
│   ├── desenho.js       tabuleiro, fichas, dado, carta, dedinho (partida e tutorial)
│   ├── main.js
│   └── scenes/GameScene.js
├── assets/audio/        efeitos, números e falas reaproveitados da coleção
├── assets/audio-transcricao/   uma ficha por áudio
├── CHECKLIST.md
└── README.md
```

## Assets

Todos os áudios são **reaproveitados** de jogos irmãos (mesmo arquivo, mesmo SHA-256); cada um tem
ficha em `assets/audio-transcricao/<id>/`. Não há imagem: tudo é desenhado em canvas.

| Arquivo | `id` | Uso | Origem |
|---|---|---|---|
| `acertoSOS.wav`, `erroSOS.wav` | `acertoSOS`, `erroSOS` | vitória, derrota | coleção Numerandus (Subtraindo o Dominó) |
| `progresso.mp3`, `error.MP3` | `somProgresso`, `somErro` | carta certa / conferiu bem; carta errada / conferiu mal | coleção (Subtraindo o Dominó) — origem/licença **a confirmar**, a mesma pendência da coleção |
| `soltar_peca.mp3` | `somConta` | o dado parando e a ficha pousando em cada casa | coleção — origem/licença **a confirmar** |
| `numeros/um.mp3` | `numero1` | contagem | Jogo dos Blocos (locução de 2013, **outro lote**: 40 kbps, 22 kHz) |
| `numeros/dois.mp3` … `dez.mp3` | `numero2`–`numero10` | contagem (até 6) e a resposta do computador | Jogo dos Blocos via Subtraindo o Dominó (locução de 2013) |
| `falas/suaVez.wav`, `vezDoComputador.wav`, `muitoBem.wav` | os mesmos | troca de vez, carta certa | Jogo dos Blocos via Subtraindo o Dominó (gravação de 2026) |

## Pendências conhecidas

- **Narração própria não gravada.** A cena já pede cada id definitivo; sem o arquivo fica muda nesse
  ponto e o console diz o texto. As frases em pedaços (a pergunta da carta, a resposta do computador)
  **tocam inteiras ou não tocam**: enquanto faltar um pedaço, nem o número gravado toca sozinho
  (pedido do humano, 03/11/2026: a carta falava só "três"). Falta gravar:
  - tutorial: `tutorialTela1`–`4` (o texto de cada passo está em `config.js`);
  - perguntas: `qualODobroDe`, `qualOTriploDe`, `comoSeChamaONumero`, `deFormaOrdinal`, e os
    problemas (`problema`, formato em aberto: frase inteira ou em pedaços);
  - números de **11 a 30** (`numero11`–`numero30`: a resposta do computador no dobro e no triplo);
  - ordinais: `ordinal1`–`ordinal10` (a resposta do computador nas cartas de ordinal);
  - falas: `casaVerde`, `casaVerdeComputador`, `volteDeOndePartiu`, `oComputadorDiz`, `eleAcertou`,
    `isso`, `olheDeNovo`.
- **Nenhum áudio foi ouvido**: as fichas dos números e das falas são inferidas (status 🟡), herdadas
  dos jogos de origem. O `um.mp3` é de outro lote que o "dois" a "dez" e pode soar diferente.
- **`tools/audio-info.mjs` reprova este jogo, e reprova o Subtraindo o Dominó do mesmo jeito**: a
  ferramenta supõe nome de arquivo igual ao `id` e não lê subpastas (`numeros/`, `falas/`). É defeito
  da ferramenta, não do jogo: os 18 áudios carregam (`teste-entrega-avulsa.mjs`) e têm ficha.
- **Sem teste com criança nem em tablet de verdade.** Em aberto (especificação §9): se o erro do
  computador 1 em 4 faz a criança desconfiar de tudo, se o Difícil (~10 cartas) fica longo, e qual
  ficha é de quem (o vídeo não diz).
- **Sem teste de toque em celular em pé** no teste de jogabilidade (o do Dominó tem; este ainda não).

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/corrida-maluca
node tools/verificar-independencia.mjs numerandus/corrida-maluca
```
