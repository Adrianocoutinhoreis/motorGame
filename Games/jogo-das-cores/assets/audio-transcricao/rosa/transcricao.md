# rosa.mp3

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/rosa.mp3` |
| `id` no motor | `rosa` |
| Tipo | Narração — nome da cor |
| Formato | MP3 MPEG1 Layer III, 128 kbps, 44 100 Hz, mono |
| Duração | **0,86 s** |
| SHA-256 (16 primeiros) | `ff5ec3544678` |
| Origem | Gravação nova, entregue em 02/09/2026 — **NÃO** é o arquivo da aula 870296 de 2013 |

## Transcrição

> «rosa»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em indícios
convergentes:

1. o nome do arquivo é `rosa.mp3`, e é o próprio `id` declarado em `config.cores.rosa.som`;
2. a duração de 0,86 s é compatível com a palavra "rosa" (duas sílabas);
3. o lote inteiro (as 8 cores) chegou junto, com o mesmo formato (MPEG1 128 kbps mono) — um
   padrão de gravação único, não arquivos avulsos de origens diferentes.

**Isto não é o arquivo de 2013.** O `rosa.mp3` da aula original tem outro formato (bitrate
menor, ~7 KB) e outro hash. Este é maior e mais nítido — dá para supor que é uma regravação,
mas **é suposição**: ninguém confirmou ainda que a palavra dita é "rosa" e não "roxo" — as duas
começam parecido e o script não distingue som de som, só uma pessoa ouvindo distingue. O hash
deste arquivo (`ff5ec3544678`) e a duração (0,86 s) diferem dos de `roxo.mp3` (`d28105af8237`,
0,91 s), então pelo menos NÃO são o mesmo arquivo repetido — mas isso não prova qual é qual.

Os indícios apontam para a mesma palavra, o que dá confiança alta — mas **inferência não é
verificação**. Ao ouvir, confirme e troque o status para `✅ CONFIRMADA`.

## Onde é usado no jogo

Tocado no canal `speech`, no instante em que a criança fecha um caminho de três ou mais peças
desta cor (`GameScene._fecharCaminho`). É o conteúdo pedagógico da atividade: nomear a cor no
momento em que ela é reconhecida é o que transforma discriminação visual em vocabulário.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
