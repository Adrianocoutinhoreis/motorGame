# tutorial_tela1.mp3

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tutorial_tela1.mp3` |
| `id` no motor | `tutorial_tela1` |
| Tipo | Narração — passo 1 de 3 do tutorial |
| Formato | MP3 MPEG1 Layer III, 128 kbps, 44 100 Hz, mono |
| Duração | **10,68 s** |
| SHA-256 (16 primeiros) | `f1bf4e630471` |
| Origem | Gravação nova, entregue em 03/09/2026 |

## Transcrição

> «Ligue as cores iguais. Aperte numa cor e arraste o dedo para as vizinhas iguais.
> Pode ir de lado, para cima, para baixo e na diagonal.»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em indícios
convergentes:

1. o nome do arquivo é `tutorial_tela1.mp3`, e chegou junto com `tutorial_tela2.mp3` e
   `tutorial_tela3.mp3` — três arquivos para os três passos de `config.tutorial`, na mesma ordem;
2. o texto acima é exatamente `[passo.titulo, passo.texto].join('. ')` do passo 1
   (`TutorialScreen.mostrarPasso`, a mesma junção que o motor usa para montar a legenda) — 26
   palavras, e a 2,4 palavras/s de uma narração pausada para 4–7 anos isso dá ~10,8 s, batendo
   com a duração real (10,68 s);
3. o mesmo lote (MPEG1 128 kbps mono) é o formato dos oito nomes de cor e do `acertoSOS`,
   entregues na mesma leva — um padrão de gravação único, não arquivos avulsos.

Os indícios convergem para o texto do passo 1, o que dá confiança alta — mas **inferência não é
verificação**. Ao ouvir, confirme e troque o status para `✅ CONFIRMADA`.

## Onde é usado no jogo

Tocado no canal `speech` ao mostrar o passo 1 do tutorial (`config.tutorial[0].fala`) — tanto no
"COMO JOGAR" do menu quanto no botão de ajuda dentro da partida, porque os dois hospedam a mesma
`TutorialScreen` (ver `HelpScreen`, `docs/COMPONENTES.md`).

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
