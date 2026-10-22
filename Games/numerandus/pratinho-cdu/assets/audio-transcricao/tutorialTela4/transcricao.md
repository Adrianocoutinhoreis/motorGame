# tutorialTela4 (tut04.wav)

**Status:** 🔴 NÃO VERIFICADA — não foi ouvido

| | |
|---|---|
| Arquivo | `assets/audio/tutorial/tut04.wav` |
| `id` no motor | `tutorialTela4` |
| Tipo | Narração — instrução de tutorial (passo 4 de 4) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **9,72 s** |
| SHA-256 (16 primeiros) | `e34d577b0fa4026a` |
| Origem | Arquivo fornecido pelo humano em 22/10/2026 como `tutnovo4.wav`, 3ª versão do dia (antes `MAIORNUMERO.wav` e `tutorial4.wav`, idênticos entre si e de 8,64 s, descartados) (regravação do passo 4, com o texto novo), renomeado para `tut04.wav` como os demais, em `assets/audio/tutorial/` — quem gravou/gerou e a licença **a confirmar**. |

## Texto esperado (o que a tela exibe)

> «Escolha o maior. Toque no número maior e em PRONTO. Sem errar, a estrela é sua. Quem juntar mais estrelas ganha!»

Assim `TutorialScreen.mostrarPasso()` monta a fala: `titulo + '. ' + texto`. São 21 palavras em 9,72 s.

## Regravação (22/10/2026)

O texto do passo 4 mudou quando a estrela passou a ser de quem faz a rodada limpa (antes: "Maior ou
menor? O computador também joga…"). O `tut04.wav` antigo (8,12 s, SHA `d2dc8e5b0c15b57c`) foi substituído
pela gravação `tutnovo4.wav` (9,72 s) do texto acima. Conferir ouvindo que o arquivo diz mesmo o texto novo.

## Transcrição

> _**A PREENCHER.** Ouça o arquivo e escreva aqui exatamente o que é dito — ou registre que não há fala, se o arquivo não for esta narração._

## Como este status foi definido

Este áudio **não foi ouvido** — o texto acima é o texto EXIBIDO pela tela de tutorial, não a transcrição do que o arquivo diz. O mapeamento arquivo → passo é inferência, apoiada no nome (`tut04` corresponde ao passo 4, `config.tutorial[3].fala`) e no formato, igual ao dos outros quatro do lote. Se o texto do passo mudar, a gravação precisa ser refeita.

## Onde é usado no jogo

Canal `voice`, pela `fala` do passo 4 de `config.tutorial`: tocada pelo `TutorialScreen` no "COMO JOGAR" do menu e pelo `HelpScreen` (o botão de ajuda dentro da partida, regra RE-05).

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha a transcrição acima. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
