# somFundo.mp3

**Status:** ✅ CONFIRMADA — não há fala a transcrever

| | |
|---|---|
| Arquivo | `assets/audio/somFundo.mp3` |
| `id` no motor | `somFundo` |
| Tipo | Música de fundo — sem fala |
| Formato | MP3 MPEG1 Layer III, 56 kbps, 44 100 Hz, estéreo |
| Duração | **32,73 s** |
| SHA-256 (16 primeiros) | `5560676f9afabf0e` |
| Origem | Aula original 870296 — Educandus |

## Transcrição

> *(sem fala)*

Não é locução. Nada a transcrever, e nada a revisar por ouvido além de o arquivo tocar e o
volume ficar equilibrado com a narração **quando ela existir** (ver abaixo).

## Como este status foi definido

O arquivo não contém fala: é música. O status é confirmado por natureza — não há palavra que
possa estar errada.

## O mesmo arquivo nas três aulas

O SHA-256 é idêntico ao `somFundo.mp3` do Jogo das Formas e do Jogo dos Blocos, e os três
vieram cada um da sua própria pasta de 2013 (`Aulas para Refazer/Jogo das Cores/sons/`). Não é
duplicação por descuido: a coleção de 2013 tinha **uma** música, e é ela que faz as três aulas
soarem como a mesma coleção. Cada jogo carrega a sua cópia porque cada pasta tem de ser
publicável sozinha — é a regra da independência, conferida por
`tools/verificar-independencia.mjs`.

## Onde é usado no jogo

Canal `music`, em laço, comandado pelo `Game` a partir do primeiro gesto da criança (um só
dono da música — ver `docs/STATES.md`, seção Áudio). Atravessa a troca de telas de propósito:
a música é do jogo, não da tela. Silenciável pelo `SoundToggle`, com a preferência persistida.

**Hoje ela é o ÚNICO som deste jogo.** As 16 gravações de voz da aula 870296 — os oito nomes de
cor, a instrução, o feedback e os dois de nível — ainda não foram trazidas, e o equilíbrio de
volume entre música e narração é justamente o que **não** pode ser conferido antes disso. A
música entrou sozinha porque silêncio total numa atividade de 4 a 7 anos lê-se como jogo
quebrado; o ajuste de volume fica pendente e declarado.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
