# tutorial_tela3.mp3

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tutorial_tela3.mp3` |
| `id` no motor | `tutorial_tela3` |
| Tipo | Narração — passo 3 de 3 do tutorial |
| Formato | MP3 MPEG1 Layer III, 128 kbps, 44 100 Hz, mono |
| Duração | **9,46 s** |
| SHA-256 (16 primeiros) | `42607e6e6ec1` |
| Origem | Gravação nova, entregue em 03/09/2026 |

## Transcrição

> «Para desfazer, volte. Sem soltar o dedo, arraste de volta por onde veio. O caminho
> encurta e você tenta outro.»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada nos mesmos indícios
de `tutorial_tela1` (ver aquela ficha para o raciocínio completo):

1. `tutorial_tela3.mp3` é o terceiro e último de um lote de três, um por passo de
   `config.tutorial`;
2. o texto acima é `[passo.titulo, passo.texto].join('. ')` do passo 3 — 20 palavras; a 2,4
   palavras/s isso daria ~8,3 s, e o real é 9,46 s — a diferença é compatível com a pausa maior
   de quem fecha a explicação, mas é o passo com a estimativa MENOS precisa dos três, o que pesa
   contra a confiança neste em especial;
3. mesmo formato do lote inteiro (MPEG1 128 kbps mono).

Ao ouvir, confirme e troque o status para `✅ CONFIRMADA` — e preste atenção especial a este:
é o que menos bate com a estimativa de duração.

## Onde é usado no jogo

Tocado no canal `speech` ao mostrar o passo 3 do tutorial (`config.tutorial[2].fala`) — no
"COMO JOGAR" do menu e no botão de ajuda dentro da partida (mesma `TutorialScreen` hospedada,
ver `HelpScreen`).

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
