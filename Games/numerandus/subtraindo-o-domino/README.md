# Subtraindo o Dominó

Atividade educativa da coleção **Numerandus**, construída com o **Motor Educandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `subtraindo-o-domino`
- **Faixa etária:** 7 a 8 anos (2º ano)
- **Criado em:** 2026-10-26
- **Status:** 🚧 jogável, [pendências declaradas](#pendências-conhecidas)
- **Especificação:** [`docs/REGRAS-SUBTRAINDO-O-DOMINO.md`](../../../docs/REGRAS-SUBTRAINDO-O-DOMINO.md)
- **Refaz:** o vídeo `numerandus\finalizados\2ano\Subtraindo_o_domino` (um dominó de verdade)

## O que é

Uma mesa com as pedras de um dominó **sem as de 0**, dois dados e um computador. **Os dois jogam em
toda rodada.** A criança toca nos **dados**, acha uma **pedra cujos pontos somam o total** (para 9
serve 6+3 ou 5+4) e toca **PRONTO**; depois o computador joga os dados dele e leva a pedra dele.
**Vence quem junta mais pedras** (a regra do vídeo): as bandejas são o placar. Cada pedra levada
deixa um contorno apagado na mesa: a mesa se esvazia, daí o nome. Se as pedras empatarem, uma
**rodadas extras** desempatam.

| Nível | Pedras | Rodadas | Nas pedras | Ajuda |
|---|---|---|---|---|
| Fácil | 10 (faces 1 a 4, totais até 8) | 3 | pontos; nomes VOCÊ / COMPUTADOR | no 2º erro, uma pedra certa acende; **a vez passa no 4º** |
| Médio | 21 (faces 1 a 6, totais até 12) | 3 | pontos | nenhuma; **a vez passa no 3º** |
| Difícil | 21 | 5 | **algarismos** no lugar dos pontos | nenhuma; **a vez passa no 2º erro** |

## A jogada, em detalhe

- **Dados**: ficam num quadro só deles, com a borda dourada (vez da criança) ou azul (vez do computador);
  o dedinho aponta os dados e um toque rola os dois. O total aparece na pergunta
  **"QUAL PEDRA SOMA [9]?"**, a única frase escrita da partida, e a narração diz o número.
- **Marcar**: tocar numa pedra a marca (contorno dourado), tocar de novo desmarca, uma por vez.
  **Nada vale antes do PRONTO**: ele só liga com uma pedra marcada.
- **PRONTO errado**: a pedra balança com um ✕ vermelho e o som de erro; nada é tirado e a criança
  marca outra. Errar abaixo do limite não custa pedra (só a dica da pedra, que existe apenas no Fácil, e o relatório).
- **A vez que passa**: no limite de erros do nível (Fácil 4º, Médio 3º, Difícil 2º) a pedra certa acende
  com a **conta revelada** (6 + 3 = 9) e as outras escurecem; a pedra continua na mesa e a **vaga da
  criança na bandeja fica vazia (✕)**: ela fica sem pedra nessa rodada. O computador joga a vez dele.
- **PRONTO certo**: ✓ verde e a pedra voa para a vaga da rodada, na bandeja da criança.
- **Vez do computador (em TODA rodada)**: o anel passa para a bandeja dele, os dados rolam e param
  no total dele (selo **azul**), ele marca uma pedra que soma esse total (anel azul) e a leva. Ele
  nunca erra, e joga mesmo quando a criança não errou nada. **O total dele só aparece na vez dele**: não
  há prévia do dado do computador em nenhum nível.
- **Quem vence**: **mais pedras**. As bandejas são o placar, sem número; no alto há só marcadores de
  rodada, sem dono. Os dados da criança sempre caem num total com pedra: ela nunca perde por azar.
- **Rodadas extras (empate)**: aparece uma **estrela dourada** no alto e cada bandeja ganha uma vaga
  extra. A extra é **igual a uma rodada normal**: a criança joga com os dados dela (sempre com pedra) e
  depois o computador joga com os dele, que são honestos e podem cair num total que já acabou (ele fica
  sem pedra), mas na **1ª extra** os dados dele são protegidos como os da criança (ele leva a pedra); só da
  2ª em diante ele pode ficar sem. Termina quando
  um leva a pedra e o outro não; senão joga-se outra extra. A partir da 3ª extra os dados dele caem num
  total esgotado que existe no nível, se houver, para não virar maratona (as extras duram de 2 a 3; o teto é 5, e empatado nele a criança leva). Como cada lado leva uma pedra por rodada, **quase
  toda partida chega empatada às extras**: elas são o clímax do jogo.
- **Fim**: sem tela intermediária, vai direto ao resultado da série ("MUITO BEM!" / "QUASE LÁ!").
  Não há cronômetro.
- **Nota**: vitória = nota cheia (todas as rodadas combinadas); derrota = as pedras da criança. Os erros
  ficam no relatório (`erros`, `rodadasComFalha`, `errosPronto`, `vezesPerdidas`, `pedrasCrianca`,
  `pedrasComputador`, `rodadasExtras`).

## Como rodar

```bash
node tools/serve.mjs 8099
# abra http://127.0.0.1:8099/Games/numerandus/subtraindo-o-domino/
```

## Como testar

```bash
node tools/build.mjs numerandus/subtraindo-o-domino                  # copia o motor para dentro
node tools/testes.mjs                                                # lógica do motor (154)
node tools/verificar-independencia.mjs numerandus/subtraindo-o-domino
node tools/teste-entrega-avulsa.mjs numerandus/subtraindo-o-domino
node tools/teste-jogabilidade-subtraindo-o-domino.mjs               # gesto real (149 verificações)
```

`teste-jogabilidade-subtraindo-o-domino.mjs` só usa ponteiro e toque (nada é chamado por dentro):
regras puras, menu → níveis → partida, dados, marcar, erro, a vez que passa, as rodadas extras, a
ausência de prévia do computador, pausa, ajuda, os três níveis, celular em pé, o AVA num
`<iframe>` e o `Watchdog`. As extras têm aleatoriedade (o computador pode ou não ficar sem pedra),
então o teste confere o que vale sempre e prepara o caso do computador sem pedra com a mesa forçada.

## Estrutura

```
src/config.js            níveis, tutorial (3 passos desenhados em canvas), áudio, AVA
src/regras.js            regras puras: pedras, sorteio dos dados, mesa (conferidas em Node)
src/desenho.js           pedras, dados, ✓/✕, marcadores de rodada, ícones, dedinho
src/scenes/GameScene.js  a partida (rodadas, vez que passa, computador, rodadas extras)
assets/audio/            efeitos e falas (ver abaixo)
assets/audio-transcricao/  uma ficha por áudio
engine/                  cópia do motor (gerada; não editar)
```

O tema visual `'feltro'` (fundo verde-azulado escuro, pedras de dominó apagadas nas telas de
vitrine) é do motor: `engine/ui/Background.js`.

## Assets e origem

Toda a arte é desenhada em canvas. Nenhum recurso externo.

| Arquivo | `id` | Uso | Origem |
|---|---|---|---|
| `audio/acertoSOS.wav` | `acertoSOS` | vitória (tela de resultado) | mesmo arquivo (SHA-256) da coleção Numerandus |
| `audio/erroSOS.wav` | `erroSOS` | derrota | idem |
| `audio/error.MP3` | `somErro` | PRONTO errado | idem |
| `audio/progresso.mp3` | `somProgresso` | rodada limpa | idem |
| `audio/soltar_peca.mp3` | `somConta` | dados parando, pedra pousando, pedra marcada | idem — origem/licença a confirmar |
| `audio/numeros/dois.mp3` … `nove.mp3` | `numero2` … `numero9` | o total dos dados, em voz alta | Jogo dos Blocos (mesmo SHA-256), aula original 870294, locução de 2013 — **não ouvidos** (fichas 🟡 "inferida") |
| `audio/falas/suaVez.wav` | `suaVez` | "Sua vez!", começo da rodada | Jogo dos Blocos (arquivo fornecido em 22/10/2026), gravação de 2026 (24 kHz, mono) — **não ouvido**, origem/licença **a confirmar** |
| `audio/falas/vezDoComputador.wav` | `vezDoComputador` | "Vez do computador!", começo da vez dele | idem |
| `audio/falas/muitoBem.wav` | `muitoBem` | "Muito bem!", rodada limpa | idem |
| `audio/falas/tenteDeNovo.wav` | `tenteDeNovo` | "Tente de novo!", PRONTO errado | idem |

Cada jogo é publicado sozinho, por isso os arquivos são **copiados** (idênticos, mesmo SHA-256)
em vez de apontados para a pasta de outro jogo.

## Pendências conhecidas

1. **Narração a gravar (6 arquivos).** A cena já pede cada fala pelo id definitivo; sem o arquivo
   o motor fica em silêncio e avisa no console. Faltam:
   - `numero10`, `numero11`, `numero12` — o total dos dados do "dez" ao "doze" (hoje só há o
     "dois" ao "nove");
   - `tutorialTela1`, `tutorialTela2`, `tutorialTela3` — o motor fala `titulo + '. ' + texto` de
     cada passo: "Toque nos dados. Eles mostram um total. Some os pontos: 6 e 3 dão 9." / "Ache a
     pedra. Toque numa pedra que soma o mesmo total, como 5 e 4, e em PRONTO." / "Junte pedras.
     Depois o computador joga. Quem juntar mais pedras ganha!".
2. **Sem teste com criança nem em tablet.** O teste de gestos passa (inclusive toque emulado em
   celular em pé), mas ninguém tocou de verdade num aparelho. Dificuldade dos níveis, se o Médio
   com 21 pedras pesa para o 2º ano e se perder a pedra para o computador soa duro são perguntas
   para a criança.
3. **O conjunto de pedras do vídeo.** A transcrição fala em "tirar o 0 e o 1"; o jogo usa 21
   pedras (sem as de 0). A confirmar com o autor do vídeo (REGRAS §3 e §9).
4. **Áudios não ouvidos.** Os números e as quatro falas estão com a ficha "não verificada"; a origem e a
   licença das falas e do `somConta` estão a confirmar.
5. **A regra do vídeo ainda não foi jogada por criança** (revisada em 28/10/2026). Duas perguntas para
   ela: as extras, que decidem quase toda partida, são emocionantes ou as 3 primeiras rodadas parecem
   aquecimento? Perder a pedra quando a vez passa
   (e, nas 3 rodadas, quase sempre a partida) soa duro? Nenhuma fala anuncia as extras: só a estrela
   dourada no alto.
6. **Contraste do PRONTO.** Aqui o rótulo é escuro sobre o verde (6,5:1); a série inteira usa
   branco (2,3:1). Decisão da série.
