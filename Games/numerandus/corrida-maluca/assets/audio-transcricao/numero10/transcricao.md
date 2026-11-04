# numero10 (dez.mp3)

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/numeros/dez.mp3` |
| `id` no motor | `numero10` |
| Tipo | Narração — nome de número |
| Formato | MP3 MPEG2 Layer III, 40 kbps, 22 050 Hz, mono |
| Duração | **0,78 s** (30 frames; medido com `ffprobe -count_frames` em 04/11/2026 — a ficha dizia 0,47 s) |
| SHA-256 (16 primeiros) | `c9de84c52023d2f2` |
| Origem | Mesmo arquivo (mesmo SHA-256) do Jogo dos Blocos — `assets/audio/dez.mp3`, id `dez` —, copiado de lá porque cada jogo é publicado sozinho. Aula original 870294 — Educandus (locução de 2013). |

## Transcrição

> «dez»

## Como este status foi definido

**Este áudio não foi ouvido.** A transcrição é a da ficha do Jogo dos Blocos (`assets/audio-transcricao/dez/`
naquele jogo), que também é uma inferência: nome do arquivo, código da aula e duração curta apontam
para a mesma palavra. **Inferência não é verificação**: ao ouvir, confirme e troque o status para
`✅ CONFIRMADA`.

## Onde é usado no jogo

Canal `speech`, pelo id `numero10`, em dois momentos:

- **a contagem dos passos** (`GameScene._passo`): a ficha anda casa a casa e a voz diz quantas já andou (o dado vai até 6, então este número não sai na contagem);
- **a resposta do computador** (`GameScene._abrirCartaComputador`): quando ele responde 10, a voz diz o número.

As perguntas das cartas ainda não têm gravação (`qualODobroDe`, `qualOTriploDe`…, ver o README do jogo); só os números de 1 a 10 existem.

> Ficha copiada do Subtraindo o Dominó (mesmo arquivo, mesmo SHA-256); só esta seção foi reescrita para a Corrida Maluca.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
