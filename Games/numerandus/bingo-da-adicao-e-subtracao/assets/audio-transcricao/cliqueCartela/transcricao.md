# cliqueCartela (discord_ping_sound_effect.mp3)

**Status:** ✅ CONFIRMADA — não há fala a transcrever

| | |
|---|---|
| Arquivo | `assets/audio/discord_ping_sound_effect.mp3` |
| `id` no motor | `cliqueCartela` |
| Tipo | Efeito curto de clique/seleção — sem fala |
| Formato | MP3 MPEG1 Layer III, 64 kbps, 44 100 Hz, estéreo |
| Duração | **0,68 s** |
| SHA-256 (16 primeiros) | `78b2688e045068ff` |
| Origem | **A confirmar** — o humano forneceu o arquivo já pronto nesta sessão, com o
  nome original `discord_ping_sound_effect.mp3`. O nome sugere um efeito de aviso
  genérico (tipo os usados pelo app Discord), possivelmente de um banco de sons
  gratuito — origem e licença de uso não foram registradas. Pendência: confirmar
  que o arquivo pode ser distribuído com o jogo antes de publicar para alunos. |

## Transcrição

> *(sem fala)*

Não é locução. Nada a transcrever — mas a ORIGEM/licença ainda precisa ser
confirmada (ver acima), diferente dos efeitos de fim de partida (`acertoSOS`/
`erroSOS`), cuja origem já está documentada.

## Como este status foi definido

O arquivo não contém fala: é um efeito curto (um "ping"). O status de transcrição
é confirmado por natureza — não há palavra que possa estar errada. Isso NÃO cobre
a pendência de origem/licença, que é uma questão separada.

## Onde é usado no jogo

Canal `sfx`, toca a cada toque numa célula da cartela do **aluno** (índice 0),
independente de acertar ou errar — é o feedback de "sua escolha foi registrada",
não um julgamento de certo/errado (isso já é feito pela cor da célula). A
cartela do computador (índice 1) não tem esse som: o jogador não pode tocar
nela, então não faz sentido nenhum som ali (ver `GameScene._construirCartelaVisual`).

---

<!-- Ao confirmar origem/licença: preencha abaixo. -->
<!-- Origem confirmada por: ________________________  em ____/____/______ -->
