# nao.mp3

**Status:** 🟡 INFERIDA — não foi ouvida

> **Este arquivo substituiu `nao.wav`, que foi removido** (21/08/2026). A troca mudou a
> **extensão**, e por isso quebrou o `config.js`, que apontava para `./assets/audio/nao.wav`:
> o Loader falhava e o jogo ficava **sem som de erro**. Corrigido no mesmo dia.
>
> Lição para as próximas trocas: mudar o formato de um áudio exige mudar o `src` no
> `config.js`. Trocar só o conteúdo, mantendo a extensão, não exige nada.
> `node tools/audio-info.mjs jogo-dos-blocos` acusa os dois casos.

| | |
|---|---|
| Arquivo | `assets/audio/nao.mp3` |
| `id` no motor | `nao` |
| Tipo | Feedback — resposta negativa, usada como som de erro |
| Formato | MP3 MPEG1 Layer III, **320 kbps, 48 000 Hz, joint stereo** |
| Duração | **0,84 s** (35 frames) |
| SHA-256 (16 primeiros) | `46f13a29bad8cc61` |
| Origem | **Desconhecida.** Sem tag ID3 e sem manifesto C2PA — não veio do lote ElevenLabs, que assina todos os seus arquivos |

## Transcrição

> _**A PREENCHER.** Ouça o arquivo e escreva aqui exatamente o que é dito — ou registre que
> não há fala, se for um efeito._

## Como este status foi definido

**Este áudio não foi ouvido**, e desta vez a inferência é mais fraca que a do arquivo anterior.
O que se tem:

1. o nome do arquivo é `nao.mp3`, e o arquivo que ele substituiu dizia (provavelmente) «não»;
2. duração de 0,84 s — compatível com uma palavra curta, mas também com um efeito curto;
3. **nada mais.** Sem tag ID3, sem manifesto de proveniência, sem código de origem.

O arquivo anterior tinha três indícios convergentes; este tem um. Pode ser a mesma palavra
regerada, pode ser um efeito neutro de queda — que é justamente o que a observação abaixo
sugeria trocar. **Não dá para saber sem ouvir**, e escrever «não» aqui seria repetir a
transcrição do arquivo velho sobre um arquivo que talvez diga outra coisa.

## Onde é usado no jogo

Som de erro (`config.audio.erro`), tocado no canal `sfx` quando um bloco cai fora da torre —
até três vezes por partida, porque três erros encerram a partida.

## Observações

- ⚠️ **Decisão ainda aberta.** Se este arquivo é uma voz dizendo "não", ele diz "não" para a
  criança a cada bloco derrubado. Isso contraria a diretriz "errar não pode humilhar"
  (`docs/DESIGN.md`). Se a troca já foi por um efeito neutro, a questão está resolvida — e é
  só registrar isso aqui ao ouvir.
- Alternativas, caso continue sendo fala: um efeito neutro de queda, ou nenhum som de erro,
  deixando o retorno visual (o bloco tombando e o coração perdido), que já comunica bem.
- ⚠️ **Formato fora do padrão.** 320 kbps a 48 000 Hz em *joint stereo* é o maior bitrate do
  pacote inteiro, para o segundo som mais curto dele. São 33 KB onde ~5 KB bastariam, e é o
  único arquivo em estéreo conjunto — os outros 18 do lote novo são mono a 128 kbps. Vale
  reencodar junto com o resto (ver §6 do `CHECKLIST-AUDIO.md`).

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
