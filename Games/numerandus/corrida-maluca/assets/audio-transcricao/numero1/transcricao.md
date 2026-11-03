# numero1 (um.mp3)

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/numeros/um.mp3` |
| `id` no motor | `numero1` |
| Tipo | Narração — nome de número |
| Formato | MP3 MPEG2 Layer III, 40 kbps, 22050 Hz, mono — **outro lote** que o "dois" a "dez" (128 kbps, 44100 Hz): a voz pode soar diferente |
| Duração | **0,39 s** |
| SHA-256 (16 primeiros) | `723c12cbb71a9785` |
| Origem | Copiado do Jogo dos Blocos — `assets/audio/um.mp3`, que lá não tem ficha própria (só a lista `A-GRAVAR.md`). Aula original 870294 — Educandus (locução de 2013). |

## Transcrição

> «um»

## Como este status foi definido

**Este áudio não foi ouvido.** O Jogo dos Blocos não tem ficha para ele; a transcrição é uma inferência: o
nome do arquivo, o código da aula original e a duração curta apontam para a palavra "um". **Inferência não é verificação**: ao ouvir, confirme e
troque o status para `✅ CONFIRMADA`.

## Onde é usado no jogo

Canal `speech`, pelo id `numero1`, em dois momentos:

- **a contagem dos passos** (`GameScene._passo`): a ficha anda casa a casa e a voz diz quantas já andou;
- **a resposta do computador** (`GameScene._abrirCartaComputador`): quando ele responde 1, a voz diz o número.

As perguntas das cartas ainda não têm gravação (`qualODobroDe`, `qualOTriploDe`…, ver o README do jogo); só os números de 1 a 10 existem.
