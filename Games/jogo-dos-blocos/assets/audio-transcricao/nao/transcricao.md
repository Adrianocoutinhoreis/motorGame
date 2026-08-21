# nao.wav

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/nao.wav` |
| `id` no motor | `nao` |
| Tipo | Narração — resposta negativa |
| Formato | WAV PCM, 1411 kbps, 44 100 Hz, estéreo, 16 bits |
| Duração | **0,63 s** |
| SHA-256 (16 primeiros) | `442e8ec3e540b7a1` |
| Origem | Aula original 870294 — Educandus |

## Transcrição

> «não»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é uma inferência, apoiada em
três indícios convergentes:

1. o nome do arquivo é `nao.wav`;
2. na aula original tocava ao passar o mouse sobre o botão **NÃO** da caixa de feedback;
3. duração de 0,63 s, exatamente igual à de `sim.wav` — compatível com duas palavras curtas gravadas na mesma sessão (os arquivos são distintos: hashes diferentes);

Os três apontam para a mesma palavra, o que dá confiança alta — mas **inferência não
é verificação**. Ao ouvir, confirme e troque o status para `✅ CONFIRMADA`.

## Onde é usado no jogo

Som de erro do jogo refeito (`config.audio.erro`), tocado quando um bloco cai fora da torre.

## Observações

- ⚠️ **Decisão a revisar.** Se este arquivo é uma voz dizendo "não", ele toca a cada bloco derrubado — o jogo diz "não" para a criança até três vezes por partida.
- Isso contraria a diretriz de design "errar não pode humilhar" (`docs/DESIGN.md`).
- Alternativas: um efeito neutro de queda, ou nenhum som de erro — deixando o retorno visual (o bloco tombando e o coração perdido), que já comunica bem.
- Como não pude ouvir o arquivo, registro a questão em vez de trocar por conta própria.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
