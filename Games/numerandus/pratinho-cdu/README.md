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
- **Qual é o maior?** A pergunta "QUAL NÚMERO É O MAIOR?" no alto do cartão (o único texto de
  instrução da partida, com MAIOR em âmbar) e os dois números lado a lado com um **?** no meio;
  a criança marca um e toca PRONTO. A **estrela da rodada flutua sobre o ?**: está em jogo e é da
  criança se ela acertar sem tentativa extra. Os dois números pulsam e o **dedinho** toca em um
  e no outro, em laço; com um número marcado, o dedinho passa para o PRONTO. Certo: o **?** vira
  **>**, **<** ou **=** em verde (o sinal pode virar uma boca de jacaré aberta para o maior:
  `SINAL_COMPARACAO` no `config.js`, hoje desligado), e o número **maior** ganha um contorno
  dourado enquanto o outro apaga. Números iguais: **=** e a rodada segue.
- **Estrelas = rodadas limpas.** A estrela de cada rodada é da criança se ela leu e comparou
  **sem nenhum PRONTO errado**; se precisou de outra tentativa, é do computador (que nunca erra).
  Dourada ou âmbar escura, acende na trilha do alto. O quadro embaixo do cartão mostra só os
  números.
- **Quadro**: embaixo do cartão, deitado como a folha do caderno do vídeo, com os números de
  cada rodada (as estrelas ficam só na trilha do alto).
- **Fim**: depois que a 5ª estrela acende na trilha e de uma pausa curta, vai direto para a tela
  de resultado da série ("MUITO BEM!" ou "QUASE LÁ!"), sem tela intermediária.

**Retorno sem frase na tela** (pedido do humano, 20/10/2026): acerto, erro e ajuda são cor,
símbolo, movimento e som. As frases existem só como **fala**, pedidas pelos ids definitivos.

## Como rodar localmente

```
node tools/serve.mjs
```

e abra `http://localhost:8080/Games/numerandus/pratinho-cdu/`.
Para ver a mensagem do AVA saindo de verdade: `http://localhost:8080/tools/ava-teste.html`.

## Como testar

```
node tools/serve.mjs 8099                          # em um terminal
node tools/teste-jogabilidade-pratinho-cdu.mjs     # em outro: 89 verificações com gesto real (~5 min)
node tools/verificar-independencia.mjs numerandus/pratinho-cdu
node tools/teste-entrega-avulsa.mjs numerandus/pratinho-cdu
```

O teste de jogabilidade só usa ponteiro e toque nas coordenadas reais (nada é chamado por dentro da
cena) e cobre menu, partida, erros, comparação, pausa, ajuda, os três níveis, celular em pé, o AVA em
iframe (vitória, derrota, replay, sem duplicata, 4 tamanhos), troca de aba e o resgate do `Watchdog`.
As capturas ficam em `.capturas/pratinho-cdu/`. O que ele não faz: ouvir, nem ter criança ou tablet.

## Registro no AVA

Ao terminar as 5 rodadas:

```js
{
  type: "JOGO_CONCLUIDO", jogo: "pratinho-cdu", nivel,
  acertos,          // vitória: sempre 5 · derrota: rodadas limpas (0 a 2)
  erros,            // PRONTOs errados na partida inteira, contagem crua
  totalPerguntas: 5,
  vitoria,          // true com mais rodadas limpas que o computador (3 ou mais); senão false
  desfecho,         // 'vitoria' | 'derrota'
  leiturasDePrimeira, errosLeitura, errosComparacao, rodadasComFalha, rodadasComAjuda,
  estrelasCrianca, estrelasComputador, ganhouDoComputador,
  numeros,          // [{ crianca, computador }] das 5 rodadas
  tempoSegundos, ajuda
}
```

**Vitória e derrota** (22/10/2026): a criança vence com mais estrelas que o computador, ou seja, com
3 ou mais rodadas limpas ("MUITO BEM!", sempre 5 estrelas); com menos é derrota ("QUASE LÁ!", com as
rodadas limpas como estrelas). A vitória depende só de a criança ler e comparar sem errar, não da
sorte dos grãos. Não há empate. Detalhes e tabela de testes: REGRAS §6. A mensagem dentro de um
iframe (`tools/ava-teste.html`) **ainda não foi conferida**.

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
├── assets/audio/        efeitos reaproveitados da coleção; tutorial/ = narração dos 4 passos
└── assets/audio-transcricao/   uma ficha por áudio
```

## Assets

| Arquivo | `id` | Uso | Origem / licença |
|---|---|---|---|
| `audio/acertoSOS.wav` | `acertoSOS` | tela de resultado | coleção Numerandus (mesmo SHA-256) |
| `audio/error.MP3` | `somErro` | PRONTO errado | coleção Numerandus — **não ouvido** (ficha 🔴) |
| `audio/progresso.mp3` | `somProgresso` | número certo, comparação certa, estrela da criança | coleção Numerandus (Jogo da Memória → Material Dourado) |
| `audio/soltar_peca.mp3` | `somConta` | grãos caindo e cada grão contado | coleção Numerandus — **origem/licença a confirmar** |
| `audio/tutorial/tut001.wav` | `tutorialTela1` | narração do passo 1 (tutorial e ajuda) | gravação fornecida em 21/10/2026 — **origem/licença a confirmar**; **não ouvida** (ficha 🔴) |
| `audio/tutorial/tut002.wav` | `tutorialTela2` | narração do passo 2 (tutorial e ajuda) | gravação fornecida em 21/10/2026 — **origem/licença a confirmar**; **não ouvida** (ficha 🔴) |
| `audio/tutorial/tut003.wav` | `tutorialTela3` | narração do passo 3 (tutorial e ajuda) | gravação fornecida em 21/10/2026 — **origem/licença a confirmar**; **não ouvida** (ficha 🔴) |
| `audio/tutorial/tut04.wav` | `tutorialTela4` | narração do passo 4 (tutorial e ajuda) | regravada em 22/10/2026 (texto novo, 9,72 s) — **origem/licença a confirmar**; **não ouvida** (ficha 🔴) |
| `audio/numeros/um.mp3` … `nove.mp3` | `numero1` … `numero9` | a contagem em voz alta: o número da fatia a cada grão marcado | Jogo dos Blocos (mesmo SHA-256), aula original 870294, locução de 2013 — **não ouvidos** (fichas 🟡 "inferida"); `um` tem qualidade menor (22 kHz, 40 kbps) que os outros oito |
| `audio/falas/suaVez.wav` | `suaVez` | "Sua vez!", começo de cada rodada | Jogo dos Blocos (arquivo fornecido em 22/10/2026), gravação de 2026 (24 kHz, mono) — **não ouvido**, origem/licença **a confirmar** |
| `audio/falas/vezDoComputador.wav` | `vezDoComputador` | "Vez do computador!" | idem |
| `audio/falas/muitoBem.wav` | `muitoBem` | "Muito bem!", leitura certa e comparação certa | idem |
| `audio/falas/qualEMaior.wav` | `qualEMaior` | "Qual número é o maior?", abre a comparação | idem |
| `audio/falas/tenteDeNovo.wav` | `tenteDeNovo` | "Tente de novo!", PRONTO errado | idem — **não estava na lista passada** (que repetia `vezDoComputador`); trazido da mesma pasta, a confirmar |
| `audio/falas/voceFezOMaior.wav` | `voceFezOMaior` | "Você fez o maior número!", comparação certa quando o maior é o da criança | idem |
| `audio/falas/computadorFezOMaior.wav` | `computadorFezOMaior` | "O computador fez o maior número.", quando o maior é o do computador | idem |

Toda a arte é desenhada em canvas (`src/desenho.js`): nenhuma imagem é carregada.

## Pendências conhecidas

1. **Narração da partida a gravar (6 falas).**
   - **A contagem já fala**: `numero1` a `numero9` vêm do Jogo dos Blocos (22/10/2026). A voz é a de 2013
     e a do tutorial é a de 2026, então os dois lotes se alternam na contagem.
   - **O tutorial e a ajuda** falam (`tutorialTela1` a `tutorialTela4`, de 21 e 22/10/2026, ainda não ouvidos). O passo 4 foi regravado em 22/10/2026 com o texto novo ("Escolha o maior. Toque no número maior e em PRONTO. Sem errar, a estrela é sua. Quem juntar mais estrelas ganha!"), 9,72 s; a duração é longa para 21 palavras, então confirmar ouvindo que não há trecho extra.
   - **Já falam também** (22/10/2026): `suaVez`, `vezDoComputador`, `muitoBem`, `qualEMaior`,
     `tenteDeNovo`, `voceFezOMaior` e `computadorFezOMaior`, vindas da pasta de áudio do Jogo dos Blocos (gravação de 2026, mesma voz do tutorial).
   - **Ainda sem gravação** (a cena já pede cada fala pelo id definitivo; sem o arquivo o motor fica em
     silêncio e avisa no console), por prioridade para quem não lê: `confiraACasaAcesa`,
     `vamosContarJuntos`, `nenhumGraoZero`; depois `olheACentena`, `olheADezena`, `empate`
     (6 falas).
   - Ainda não pedido: **ler o número formado em voz alta** ("duzentos e trinta e cinco").
     Precisa de ~40 gravações combináveis (unidades 1–19, dezenas 20–90, "cem/cento",
     centenas 200–900, "e") — decisão em aberto, ver REGRAS §9.
2. **Sem teste com criança nem em tablet.** O teste de jogabilidade (gesto real, toque emulado em celular
   em pé, AVA em iframe) passa, mas ninguém tocou de verdade num aparelho.
3. **Áudios não ouvidos**: a narração do tutorial e o `somErro` (fichas 🔴), os nove números, as sete falas novas e o `erroSOS`; `somConta`, a narração e as falas com origem/licença a confirmar. Se o texto de um passo do tutorial mudar, a gravação precisa ser refeita.
4. **Grãos próximos**: com 9 grãos numa fatia (Difícil), em cerca de 6% das jogadas dois
   grãos ficam a menos de um diâmetro de halo um do outro. Os alvos de toque se sobrepõem e
   vale o grão mais perto do dedo; conferir em tablet se a criança acerta o grão que quer.

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/pratinho-cdu
node tools/verificar-independencia.mjs numerandus/pratinho-cdu
```
