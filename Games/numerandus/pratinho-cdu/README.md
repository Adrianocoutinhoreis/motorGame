# Pratinho CDU

Atividade educativa da coleção **Numerandus**, construída com o **Motor Educandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `pratinho-cdu`
- **Faixa etária:** 6 a 8 anos — o Fácil atende o 1º ano, o Médio e o Difícil o 2º
- **Criado em:** 2026-10-20
- **Status:** 🚧 jogável, [pendências declaradas](#pendências-conhecidas)
- **Especificação:** [`docs/REGRAS-PRATINHO-CDU.md`](../../../docs/REGRAS-PRATINHO-CDU.md)
- **Refaz:** o "Jogo do Pratinho CDU" antigo (`Aulas para Refazer/Jogo_CDU_1ano`), que fica
  como referência e não é publicado

## O que é

Um prato redondo dividido em três fatias — **C** (centena), **D** (dezena) e **U** (unidade) —
como o brinquedo do vídeo do 2º ano. A criança toca em **JOGAR**, um punhado de grãos cai no
prato, ela **conta cada fatia** e **forma o número** nos rolinhos C/D/U. O computador faz o
mesmo, e a criança diz **qual dos dois números é o maior**: quem formou o maior ganha a
estrela da rodada. São 5 rodadas.

| Nível | Prato | Grãos por fatia | Como responde |
|---|---|---|---|
| Fácil | só D e U (a fatia C fica apagada) | D de 1 a 9, U de 0 a 9 | escolhe 1 entre 3 números |
| Médio | C, D e U | 1 a 5 | rolinhos C/D/U |
| Difícil | C, D e U, com 1 a 3 grãos **fora do prato** | C de 1 a 9, D e U de 0 a 9, com **zero numa casa** em metade das jogadas | rolinhos C/D/U |

## A jogada, em detalhe

- **Contar é tocar no grão**: o grão tocado fica marcado com um **halo branco**, sem número
  (quem conta é a criança), e um toque de novo desmarca. O grão desenhado tem ~30 px; o alvo
  de toque é um círculo de pelo menos 64 px em volta dele, e onde dois alvos se sobrepõem vale
  o grão mais perto do dedo. Fatia vazia mostra um **0** grande que some; tocar no vazio de
  uma fatia com grãos só a faz piscar.
- **Nada vale antes do PRONTO.** Contar, girar rolinho e marcar opção são livres, e
  **DESFAZER** volta um passo por toque. Os rolinhos param no 0 e no 9 em vez de dar a volta.
- **PRONTO errado**: o cartão balança com um anel âmbar e o som de erro. No **2º** erro da
  rodada a fatia e o rolinho errados acendem em âmbar; no **4º** o jogo **conta junto**,
  grão por grão. No Fácil (sem rolinho) o 2º erro já conta junto.
- **PRONTO certo**: anel verde, a conta aparece por casa (**200 + 30 + 5 = 235**, em pílulas
  nas cores das fatias) com um visto verde, e passa a vez.
- **Vez do computador**: o ícone do cartão vira um monitor âmbar; os grãos dele caem, ele
  acende os halos fatia por fatia e põe cada quantidade no rolinho.
- **Qual é o maior (ou o menor)?** A pergunta "QUAL NÚMERO É O MAIOR?" no alto do cartão (o
  único texto de instrução da partida) e os dois números lado a lado com um **?** no meio; a
  criança marca um e toca PRONTO. No **Fácil** a pergunta é sorteada por rodada entre MAIOR e
  MENOR (a palavra vem em âmbar), e a estrela vai para o número que a pergunta pede. O gesto também é mostrado: a **estrela da rodada flutua sobre o ?**
  (ela está em jogo), os dois números pulsam e o **dedinho** toca em um e no outro, em laço;
  com um número marcado, o dedinho passa para o PRONTO. Certo: o **?** vira **>** ou **<** em verde, e **quem fez o maior** fica com
  contorno dourado e a estrela da rodada no canto, enquanto o outro número apaga. Empate:
  **=** e a rodada fecha sozinha.
- **Estrelas**: no alto, uma por rodada — dourada quando a criança formou o maior, âmbar
  escura quando foi o computador, cinza no empate. O quadro embaixo do cartão registra os
  números, como a folha do caderno do vídeo.
- **Fim**: troféu (se a criança ganhou mais estrelas) e o placar de estrelas com os dois
  ícones; a seta leva ao resultado.

**Retorno sem frase na tela** (pedido do humano, 20/10/2026): acerto, erro e ajuda são cor,
símbolo, movimento e som. As frases existem só como **fala**, pedidas pelos ids definitivos.

## Como rodar localmente

```
node tools/serve.mjs
```

e abra `http://localhost:8080/Games/numerandus/pratinho-cdu/`.
Para ver a mensagem do AVA saindo de verdade: `http://localhost:8080/tools/ava-teste.html`.

## Registro no AVA

Ao terminar as 5 rodadas:

```js
{
  type: "JOGO_CONCLUIDO", jogo: "pratinho-cdu", nivel,
  acertos,          // 5 − PRONTOs errados (leitura e comparação), mínimo 0 — RE-02
  erros,            // PRONTOs errados na partida inteira
  totalPerguntas: 5,
  vitoria: true,    // terminar as 5 rodadas; não existe derrota
  leiturasDePrimeira, errosLeitura, errosComparacao, rodadasComAjuda,
  estrelasCrianca, estrelasComputador, ganhouDoComputador,
  numeros,          // [{ crianca, computador }] das 5 rodadas
  tempoSegundos, ajuda
}
```

**Por que não há derrota**: quem forma o número maior depende de quantos grãos caíram — é
sorte. A nota é da leitura; o duelo com o computador viaja em `extras` e aparece só na tela
de fim da partida. Ver REGRAS §6.

Conferido em navegador em 20/10/2026 (robô pelos métodos da cena): partida com 1 comparação
errada → resultado "MUITO BEM!" com 4 estrelas. A mensagem dentro de um iframe
(`tools/ava-teste.html`) **ainda não foi conferida**.

## Estrutura

```
pratinho-cdu/
├── index.html
├── engine/              CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js        identidade, níveis, regras, tutorial (com o desenho), assets
│   ├── regras.js        as regras puras (sorteio, posição dos grãos, opções, comparação) — sem motor
│   ├── desenho.js       prato, grão, halo, rolinho, estrela, ícones, dedinho — partida e tutorial
│   ├── main.js
│   └── scenes/GameScene.js
├── assets/audio/        efeitos reaproveitados da coleção
└── assets/audio-transcricao/   uma ficha por áudio
```

## Assets

| Arquivo | `id` | Uso | Origem / licença |
|---|---|---|---|
| `audio/acertoSOS.wav` | `acertoSOS` | tela de resultado | coleção Numerandus (mesmo SHA-256) |
| `audio/error.MP3` | `somErro` | PRONTO errado | coleção Numerandus — **não ouvido** (ficha 🔴) |
| `audio/progresso.mp3` | `somProgresso` | número certo, comparação certa, estrela da criança, troféu | coleção Numerandus (Jogo da Memória → Material Dourado) |
| `audio/soltar_peca.mp3` | `somConta` | grãos caindo e cada grão contado | coleção Numerandus — **origem/licença a confirmar** |

Toda a arte é desenhada em canvas (`src/desenho.js`): nenhuma imagem é carregada.

## Pendências conhecidas

1. **Narração não gravada.** A cena já pede cada fala pelo id definitivo; sem o arquivo o
   motor fica em silêncio e avisa no console. Ids:
   - tutorial e ajuda: `tutorialTela1` a `tutorialTela4` (o texto de cada passo);
   - partida: `suaVez`, `vezDoComputador`, `numero1` a `numero9` (a contagem a cada toque),
     `nenhumGraoZero`, `muitoBem`, `tenteDeNovo`, `confiraACasaAcesa`, `vamosContarJuntos`,
     `qualEMaior`, `qualEMenor`, `voceFezOMaior`, `voceFezOMenor`, `computadorFezOMaior`, `computadorFezOMenor`, `olheACentena`, `olheADezena`, `empate`.
   - Ainda não pedido: **ler o número formado em voz alta** ("duzentos e trinta e cinco").
     Precisa de ~40 gravações combináveis (unidades 1–19, dezenas 20–90, "cem/cento",
     centenas 200–900, "e") — decisão em aberto, ver REGRAS §9.
2. **Sem teste com criança nem em tablet.** O robô percorreu as três dificuldades; ninguém
   tocou de verdade.
3. **Mensagem do AVA dentro de iframe** não conferida (`tools/ava-teste.html`, replay, sem duplicata).
4. **Áudios**: `somErro` não ouvido; `somConta` com origem a confirmar (mesmas pendências da coleção).
5. **Grãos próximos**: com 9 grãos numa fatia (Difícil), em cerca de 6% das jogadas dois
   grãos ficam a menos de um diâmetro de halo um do outro. Os alvos de toque se sobrepõem e
   vale o grão mais perto do dedo; conferir em tablet se a criança acerta o grão que quer.

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/pratinho-cdu
node tools/verificar-independencia.mjs numerandus/pratinho-cdu
```
