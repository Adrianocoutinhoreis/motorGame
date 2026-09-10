# erroCartela (error.mp3)

**Status:** ✅ CONFIRMADA — não há fala a transcrever

| | |
|---|---|
| Arquivo | `assets/audio/error.mp3` |
| `id` no motor | `erroCartela` |
| Tipo | Efeito curto de toque errado — sem fala |
| Formato | MP3 MPEG1 Layer III, 256 kbps, 44 100 Hz, joint stereo |
| Duração | **1,62 s** |
| SHA-256 (16 primeiros) | `b4882e3941ca496b` |
| Origem | **A confirmar** — o humano forneceu o arquivo já pronto nesta sessão, com o
  nome original `error.mp3`. Nome genérico, sem procedência registrada — mesma
  pendência já anotada em `cliqueCartela`. |

## Transcrição

> *(sem fala)*

Não é locução. Nada a transcrever — mas a ORIGEM/licença ainda precisa ser
confirmada (ver acima), diferente dos efeitos de fim de partida (`acertoSOS`/
`erroSOS`), cuja origem já está documentada.

## Como este status foi definido

O arquivo não contém fala: é um efeito curto de aviso. O status de transcrição
é confirmado por natureza — não há palavra que possa estar errada. Isso NÃO
cobre a pendência de origem/licença, que é uma questão separada.

## Onde é usado no jogo

Canal `sfx`, via `config.audio.erro`: toca quando o aluno toca num número
ERRADO na própria cartela — a marca fica provisória (âmbar, reversível), e o
som acompanha só essa PRIMEIRA tentativa errada em cada número novo. NÃO toca
junto com o som de acerto (`cliqueCartela`) — são mutuamente exclusivos, cada
toque dispara no máximo um (`GameScene._aoTocarCelula`). Também não toca ao
desfazer (tocar de novo na mesma célula errada pra cancelar) nem em nenhuma
célula da cartela do computador. Não é punitivo — é um aviso curto e claro
de "esse não é o número certo", não uma reprimenda.

---

<!-- Ao confirmar origem/licença: preencha abaixo. -->
<!-- Origem confirmada por: ________________________  em ____/____/______ -->
