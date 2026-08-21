# cinblocos_venceu.mp3

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/cinblocos_venceu.mp3` |
| `id` no motor | `cinblocos_venceu` |
| Tipo | Narração — instrução de tutorial (passo 3 de 3) |
| Formato | MP3 MPEG1 Layer III, 128 kbps, 44 100 Hz, mono |
| Duração | **7,00 s** (268 frames) |
| SHA-256 (16 primeiros) | `b1071b9d5cc8e998` |
| Origem | **Voz sintética gerada por ElevenLabs**, 2026 — encomendada para esta refação |
| Content Credentials | C2PA embutido (16 648 bytes de tag ID3v2.4): autor `Eleven Labs Inc.`, `digitalSourceType: trainedAlgorithmicMedia` |

## Transcrição

> «Cinco blocos e você venceu. Se o bloco cair fora, você perde um coração. São três corações.»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em três indícios
convergentes:

1. o nome do arquivo (`cinblocos_venceu`) corresponde ao passo 3 do tutorial;
2. o texto é exatamente o que `A-GRAVAR.md` especificou para este passo, e é o mesmo que a
   tela exibe escrito (`config.tutorial[2]`);
3. duração de 7,00 s para 18 palavras = **2,6 palavras/s**, alinhado aos outros dois arquivos
   do lote (2,9 e 2,8) — mesmo pedido, mesmo texto de origem.

Confiança alta, mas **inferência não é verificação**. Ao ouvir, confirme e troque o status
para `✅ CONFIRMADA`.

**Ponto a conferir junto:** este passo carrega **duas ideias** — a meta (cinco blocos) e o
custo do erro (três corações). Confira se há pausa audível entre elas; sem pausa, aos 4 anos
a segunda ideia se perde. É o passo mais longo do tutorial justamente por isso.

## Observação sobre o nome do arquivo

`cinblocos_venceu` parece ser `cin[co]blocos_venceu` com uma letra faltando. O nome não afeta
o jogo — o `id` no motor é literalmente este, e está declarado assim no `config.js`. Renomear
é possível, mas exige mudar em três lugares ao mesmo tempo: o arquivo, o `id` em
`config.assets`, o `fala` do passo, e o nome desta pasta. Enquanto não for renomeado, este
parágrafo existe para que ninguém tome o nome por erro de digitação **do config**.

## Onde é usado no jogo

Tela de tutorial, passo 3 de 3 (`config.tutorial[2].fala`). Tocado no canal `speech` na
entrada do passo, e renarrado se o aluno voltar a ele.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
