# Cabo de Guerra

Atividade educativa da coleção **Numerandus**, construída com o **Motor Educandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `cabo-de-guerra`
- **Faixa etária:** 7 a 8 anos (2º ano)
- **Criado em:** 2026-11-09
- **Status:** 🚧 jogável, [pendências declaradas](#pendências-conhecidas)
- **Especificação:** [`docs/REGRAS-CABO-DE-GUERRA.md`](../../../docs/REGRAS-CABO-DE-GUERRA.md)
- **Refaz:** o vídeo `Desktop\cabo_de_guerra\Cabo_De_Guerra.mp4` (uma tira de bolinhas de verdade)

## O que é

Uma tira branca de borda azul com uma fileira de bolinhas, uma **ponta** de cada lado e um **nó** no
meio. A criança (ponta **vermelha**, à esquerda) joga contra o computador (ponta de **madeira**, à
direita). Na sua vez ela toca o dado e uma **carta** abre: multiplicação, antecessor ou sucessor,
capacidade (litros) ou massa (quilogramas). **Acertou, a ficha vem tantas casas quanto o dado, para a
ponta dela; errou, a ficha fica parada.** O computador joga do mesmo jeito, responde em voz alta e **erra
de propósito 1 vez em 4**: a criança **confere** com CERTO ou ERRADO (a "mesa que confere" do vídeo).
Vence quem leva a ficha até a própria ponta: chegou, venceu, sem carta.

| Nível | Trilha | Cartas |
|---|---|---|
| Fácil | 7 passos até a ponta (15 bolinhas) | 7 tipos: tabuada do 2 ao 5 por 1 a 5; antecessor e sucessor de 11 a 50; unidade (24 cartas de litro ou quilograma); dobro de 2 a 10; metade de 4 a 20; sequência de 2, 5 ou 10 em 10 |
| Médio | 8 passos (17 bolinhas) | 10 tipos: tabuada do 2 ao 6 por 2 a 8; antecessor e sucessor de 20 a 100; unidade; soma de litros e quilos (1 a 6); dobro, triplo e metade; sequência (de 2, 3, 5 ou 10 em 10); adição repetida (2 a 4 parcelas) |
| Difícil | 9 passos (19 bolinhas) | 11 tipos: tabuada do 2 ao 9; antecessor e sucessor de 90 a 999; unidade; soma (1 a 9); recipientes (garrafas, jarras, baldes, sacos, caixas); dobro até 99, triplo, metade até 200; sequência crescente e decrescente; adição repetida (3 a 6 parcelas) |

## A jogada, em detalhe

- **Dado**: o botão **JOGAR O DADO** (ou o próprio dado) rola um dado de 1 a 6. O dedinho aponta o
  botão na vez da criança.
- **A carta** abre por baixo da tira (que continua à vista), com o dado do lance ("PUXA 3 CASAS"), a
  pergunta narrada e **três respostas grandes**. Uma das erradas é sempre a confusão típica (o sucessor
  no lugar do antecessor, um grupo a mais na tabuada). **A ficha só anda se ela acertar.**
- **Certo**: a resposta acende verde, "ACERTOU! A FICHA VEM 3 CASAS PARA VOCÊ!" e, no **CONTINUAR**, a ficha
  desliza casa a casa, com um selo contando e a voz contando junto. **A ficha anda no ritmo da voz**: cada
  passo espera o número terminar (`regras.falaMaxMs` é o teto da espera).
- **Errado**: a certa acende, o jogo mostra a conta ("7 × 6 = 42") e a ficha **fica parada**; a vez passa.
- **Vez do computador**: a faixa fica cor de madeira, ele joga o dado sozinho e responde: "O COMPUTADOR
  DIZ: 42". A criança toca **CERTO** ou **ERRADO**; o jogo diz se ela conferiu bem e mostra a conta.
  Se ele acertou, a ficha vai para o lado dele. **Conferir mal não é erro na nota.**
- **Layout**: a tira grande no meio é a protagonista; embaixo de cada ponta, discretos, o nome e "FALTAM N"; uma barra baixa reúne o dado, de quem é a vez e JOGAR O DADO. Com a carta aberta, a tira sobe e encolhe e continua à vista.
- **Nenhuma carta repete** na partida ("essa já saiu", como no vídeo).
- **Fim**: a ficha **chegou a uma ponta**: vence quem a puxou, na hora, sem carta (passar da ponta vale). A
  ponta brilha por um instante e o jogo vai direto ao resultado da série. Não há cronômetro.
- **Nota** (RE-02): a meta são os passos do nível (7, 8 ou 9). Vitória = meta − cartas erradas;
  derrota = as casas que a criança puxou do centro. A tela diz "N CASAS" (RE-03).

## Como rodar

```bash
node tools/serve.mjs 8099
# abra http://127.0.0.1:8099/Games/numerandus/cabo-de-guerra/
```

## Como testar

```bash
node tools/build.mjs numerandus/cabo-de-guerra                  # copia o motor para dentro
node tools/testes.mjs                                           # lógica do motor (154)
node tools/verificar-independencia.mjs numerandus/cabo-de-guerra
node tools/teste-entrega-avulsa.mjs numerandus/cabo-de-guerra
node tools/teste-jogabilidade-cabo-de-guerra.mjs               # gesto real (75 verificações)
```

`teste-jogabilidade-cabo-de-guerra.mjs` só usa ponteiro (nada é chamado por dentro; os ganchos
`dadoDeTeste` e `computadorErraDeTeste` só escolhem o próximo sorteio): as regras puras (60 000 cartas),
menu → níveis → partida, o dado e a carta com a ficha parada, a carta certa (a ficha puxando, a contagem em
voz), a vez do computador e a conferência, a carta errada, o computador puxando, pausa no meio da ficha
andando, ajuda por cima da carta, a chegada da criança e a do computador, e o AVA num iframe (vitória
e derrota, os números batendo, sem duplicata). Rodado 3 vezes seguidas sem falha em 09/11/2026.

## Registro no AVA

```js
{ type: "JOGO_CONCLUIDO", acertos, erros, totalPerguntas, nivel, vitoria, jogo: "cabo-de-guerra",
  casasPuxadas, cartasRespondidas, cartasCertas, cartasPorTipo, conferencias, conferenciasCertas,
  maiorPuxada, jogadas, venceuCabo }
```

| Campo | Valor |
|---|---|
| `totalPerguntas` | a meta: 7, 8 ou 9 |
| `acertos` | vitória: meta − cartas erradas (mínimo 0); derrota: as casas puxadas |
| `erros` | cartas respondidas erradas pela criança |
| `cartasPorTipo` | `{ multiplicacao: "certas/respondidas", … }` |
| `conferencias` / `conferenciasCertas` | quantas respostas do computador ela conferiu, e quantas bem |

Conferido no `ava-teste.html` em 09/11/2026: vitória no Fácil sem erro → `acertos: 7`, `casasPuxadas: 7`;
derrota no Médio errando tudo → `acertos: 0`, `erros` = as cartas erradas; o host valida as mensagens e
ficar parado no resultado não duplica.

## Estrutura

```
cabo-de-guerra/
├── index.html
├── engine/              CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js        identidade, níveis, regras, tutorial (5 passos desenhados), áudio
│   ├── regras.js        regras puras: a trilha, a puxada, as cartas, o computador, a nota
│   ├── desenho.js       tira, nó, dado, carta, dedinho (partida e tutorial)
│   ├── main.js
│   └── scenes/GameScene.js
├── assets/audio/        efeitos, números e falas reaproveitados da coleção
├── assets/audio-transcricao/   uma ficha por áudio
├── CHECKLIST.md
└── README.md
```

## Assets

Os áudios são **reaproveitados** de jogos irmãos (mesmo arquivo, mesmo SHA-256), vindos da Corrida
Maluca. Cada um tem ficha em `assets/audio-transcricao/<id>/`. Não há imagem: tudo é desenhado em canvas.

| Arquivo | `id` | Uso | Origem |
|---|---|---|---|
| `acertoSOS.wav`, `erroSOS.wav` | `acertoSOS`, `erroSOS` | vitória, derrota | coleção Numerandus (Subtraindo o Dominó) |
| `progresso.mp3`, `error.MP3` | `somProgresso`, `somErro` | carta certa / conferiu bem; carta errada / conferiu mal | coleção — origem/licença **a confirmar**, a mesma pendência da coleção |
| `soltar_peca.mp3` | `somConta` | o dado parando e a ficha pousando em cada casa | coleção — origem/licença **a confirmar** |
| `numeros/um.mp3` | `numero1` | contagem | Jogo dos Blocos (locução de 2013, **outro lote**: 40 kbps, 22 kHz) |
| `numeros/dois.mp3` … `dez.mp3` | `numero2`–`numero10` | contagem (até 6) e a resposta do computador | Jogo dos Blocos via Subtraindo o Dominó (locução de 2013) |
| `falas/suaVez.wav`, `vezDoComputador.wav`, `muitoBem.wav` | os mesmos | troca de vez, carta certa | Jogo dos Blocos via Subtraindo o Dominó (gravação de 2026) |

## Pendências conhecidas

- **Narração própria não gravada, inclusive a do tutorial.** A cena e o tutorial já pedem cada id
  definitivo; sem o arquivo ficam mudos nesse ponto e o console diz o texto. As frases em pedaços (a
  pergunta da carta, a resposta do computador) **tocam inteiras ou não tocam**: enquanto faltar um
  pedaço, nem o número gravado toca sozinho. Falta gravar:
  - perguntas: `quantoE`, `vezes`, `qualOAntecessorDe`, `qualOSucessorDe`, `qualODobroDe`, `qualOTriploDe`,
    `qualAMetadeDe`; as de unidade, uma por carta (`unidade_<id>`, 24 no total: suco, balde, leite,
    piscina, refrigerante, sopa, aquario, tanque, cafe, oleo, vitamina, chuva, arroz, melancia, feijao,
    acucar, farinha, batata, abobora, carne, laranja, cachorro, queijo, mochila) e os problemas
    (`problema`: soma de medidas, recipientes, sequência e adição repetida; formato em aberto, frase inteira ou em pedaços);
  - números de **11 em diante** (as cartas de número vão até 999: ao menos 11 a 100 e os que as cartas pedem);
  - respostas em palavras do computador: `resposta_litros`, `resposta_quilogramas`, `resposta_metros`,
    `resposta_centímetros`;
  - falas: `quaseLa`, `oComputadorDiz`, `eleAcertou`, `isso`, `olheDeNovo`;
  - o tutorial: `tutorialTela1` a `tutorialTela5` (os textos estão no `config.js`; o arquivo vai em
    `assets/audio/tutorial/01..05.wav` e entra em `assets`).
- **As cartas de litros e quilogramas são proposta.** O vídeo só cita os temas; se o baralho físico tem
  outros formatos, o banco muda (`UNIDADES` e as fábricas em `src/regras.js`).
- **Nenhum áudio foi ouvido por um humano**: as fichas são inferidas (status 🟡), herdadas dos jogos de
  origem.
- **`tools/audio-info.mjs` reprova este jogo** como reprova a Corrida Maluca e o Subtraindo o Dominó: a
  ferramenta supõe nome de arquivo igual ao `id` e não lê subpastas. É defeito da ferramenta, não do
  jogo: os áudios carregam (`teste-entrega-avulsa.mjs`) e têm ficha.
- **Sem teste com criança nem em tablet de verdade.** Em aberto (especificação §9): se o erro do
  computador 1 em 4 faz a criança desconfiar de tudo, se o Difícil (~9 cartas) fica longo e qual ponta
  é de quem (o vídeo não diz).
- **Sem teste de toque em celular em pé** no teste de jogabilidade.

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/cabo-de-guerra
node tools/verificar-independencia.mjs numerandus/cabo-de-guerra
```
