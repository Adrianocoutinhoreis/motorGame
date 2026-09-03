# tutorial_tela2.mp3

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tutorial_tela2.mp3` |
| `id` no motor | `tutorial_tela2` |
| Tipo | Narração — passo 2 de 3 do tutorial |
| Formato | MP3 MPEG1 Layer III, 128 kbps, 44 100 Hz, mono |
| Duração | **8,02 s** |
| SHA-256 (16 primeiros) | `cffa480842cc` |
| Origem | Gravação nova, entregue em 03/09/2026 |

## Transcrição

> «Três ou mais. O caminho vale a partir de três peças. O número na ponta conta
> quantas você já ligou.»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada nos mesmos indícios
de `tutorial_tela1` (ver aquela ficha para o raciocínio completo):

1. `tutorial_tela2.mp3` é o segundo de um lote de três, um por passo de `config.tutorial`;
2. o texto acima é `[passo.titulo, passo.texto].join('. ')` do passo 2 — 20 palavras, ~8,3 s a
   2,4 palavras/s, batendo com a duração real (8,02 s);
3. mesmo formato do lote inteiro (MPEG1 128 kbps mono).

Ao ouvir, confirme e troque o status para `✅ CONFIRMADA`.

## Onde é usado no jogo

Tocado no canal `speech` ao mostrar o passo 2 do tutorial (`config.tutorial[1].fala`) — no
"COMO JOGAR" do menu e no botão de ajuda dentro da partida (mesma `TutorialScreen` hospedada,
ver `HelpScreen`).

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
