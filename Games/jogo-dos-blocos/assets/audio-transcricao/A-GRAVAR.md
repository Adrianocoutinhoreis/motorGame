# A-GRAVAR.md — as locuções que faltam

Faltam **3 locuções de tela**. Eram 6; as 3 do tutorial chegaram em 21/08/2026 e já estão
ligadas no jogo.

Enquanto as 3 restantes não existirem, essas telas ficam em **silêncio**.

**Por que silêncio e não voz do navegador.** O motor já teve `speechSynthesis` cobrindo essas
falas. Foi removido, e a decisão está travada por teste (`tools/testes.mjs`, grupo *"o motor
não gera som, só toca arquivo"*, mais uma verificação em execução no `teste-navegador.mjs`).
O problema não é voz sintética — **toda** a locução deste jogo é sintética, a de 2014 e a de
2026. O problema é voz sintetizada **em tempo de execução**: o timbre muda a cada navegador,
não existe em parte dos tablets escolares, e ninguém consegue revisar o que ela vai dizer.
Um arquivo é fixo, revisável, transcrito numa ficha e igual em todo aparelho. É essa a
diferença, e é ela que a regra protege.

**O que o jogo faz enquanto falta.** Fica calado e escreve no console qual gravação falta e o
que ela deveria dizer — uma vez por lacuna. Abrir o jogo com o console aberto é a forma mais
rápida de ver esta lista viva.

---

## O que falta

| Id do arquivo | O que a voz diz | Onde toca | Onde declarar |
|---|---|---|---|
| `escolhaNivel` | «Escolha um nível.» | Tela de seleção de nível, na entrada | `audio.escolhaNivel` |
| `falaVitoria` | «Muito bem! Você conseguiu!» | Tela de resultado, ao vencer | `audio.falaVitoria` |
| `falaDerrota` | «Quase! Vamos tentar de novo?» | Tela de resultado, ao perder | `audio.falaDerrota` |

## O que já chegou

| Id do arquivo | O que diz | Onde toca | Duração |
|---|---|---|---|
| `gancho_vai_vem` | «O gancho vai e vem. Um bloco fica pendurado…» | Tutorial, passo 1 | 6,16 s |
| `toque_soltar` | «Toque para soltar. Toque na tela quando…» | Tutorial, passo 2 | 5,38 s |
| `cinblocos_venceu` | «Cinco blocos e você venceu. Se o bloco cair fora…» | Tutorial, passo 3 | 7,00 s |

Os três estão com transcrição **inferida**, não confirmada: ninguém os ouviu ainda. Ver as
fichas e a seção 3 do [`CHECKLIST-AUDIO.md`](../../CHECKLIST-AUDIO.md).

---

## Como pedir

O texto das três é o que o jogo **já exibe escrito** nessas telas, e é o mesmo que ele passa
ao motor no parâmetro `texto` — que serve à legenda e ao aviso de console, nunca a voz de
tempo de execução. Gravar outra coisa não quebra nada, mas então **corrija o texto no
`config.js` junto**, senão a legenda futura vai contradizer o áudio.

### Direção

- Voz adulta, calma, **ritmo lento**. A criança tem 4 a 7 anos.
- **A #3 sem repreensão.** `docs/DESIGN.md` traz a diretriz "errar não pode humilhar": é um
  convite a tentar de novo, não um "você errou".
- Frases curtas, com pausa audível entre ideias.

> **Aprendizado do lote anterior:** os 3 arquivos do tutorial saíram a **2,6–2,9 palavras por
> segundo**, que é fala adulta normal — não fala lenta. Se o pedido for feito na mesma
> ferramenta e no mesmo ajuste, estas três sairão no mesmo ritmo. Vale reduzir a velocidade
> explicitamente no pedido.

### Formato — casar com um dos lotes, de propósito

O jogo já tem **dois** lotes de locução, e as três novas vão soar junto de um deles:

| | Lote de 2014 (17 arquivos) | Lote de 2026 (4 arquivos) |
|---|---|---|
| Voz | TextAloud / ScanSoft Raquel22 | ElevenLabs |
| Codec | MP3 MPEG2 Layer III | MP3 MPEG1 Layer III |
| Bitrate | 40 kbps CBR | 128 kbps CBR |
| Amostragem | 22 050 Hz | 44 100 Hz |
| Canais | mono | mono |
| Tamanho típico | 6–8 KB | 100–205 KB |

**Recomendação:** gerar na voz do lote de 2026 (é a mesma que narra o tutorial e a abertura, as
outras falas de tela) e **reencodar para 40 kbps / 22 050 Hz / mono**. Assim a voz fica
coerente com as outras telas e o peso fica coerente com o resto do pacote — 128 kbps a
44 100 Hz é três vezes mais do que voz precisa, e este jogo já tem 2,9 MB de áudio em 3,4 MB
de pacote.

Confira o resultado com `node tools/audio-info.mjs jogo-dos-blocos`: os arquivos novos devem
cair no mesmo lote dos demais, não abrir um terceiro.

---

## O que **não** reaproveitar

Três arquivos já estão em `assets/audio/` e **não** servem para preencher a tabela:

| Arquivo | Diz | Por que não serve |
|---|---|---|
| `facil.mp3` | «fácil» | Rótulo de dificuldade do jogo de 2013. Este jogo tem 3 níveis por **habilidade** (contar 1–5, contar 6–10, vogais), não por dificuldade — usá-lo reintroduziria a confusão que a refação desfez |
| `dificil.mp3` | «difícil» | Idem |
| `sim.wav` | «sim» | Palavra solta; não é nenhuma das três falas. Poderia virar efeito de acerto, mas hoje o retorno de acerto **é** a narração do símbolo, de propósito |

Estão no pacote porque vieram da pasta original e podem virar úteis; não porque estejam
pendentes de uso.

---

## Depois de gravar

1. Ponha os arquivos em `assets/audio/`. **O nome do arquivo é o `id`** — sem extensão, é ele
   que amarra config, ficha e motor. Escolha com cuidado: renomear depois exige mudar em
   quatro lugares ao mesmo tempo.
2. Declare cada um em `src/config.js`, na lista `assets`:
   `{ id: 'escolhaNivel', src: './assets/audio/escolhaNivel.mp3' }`.
3. Troque o `null` pelo id em `audio: { … }`.
4. Meça: `node tools/audio-info.mjs jogo-dos-blocos`. Ele diz o formato real, o lote, a duração
   e o SHA-256 — os números que vão na ficha — e reprova se faltar ficha ou se um hash não bater.
5. Crie a ficha em `audio-transcricao/<id>/transcricao.md` com esses números. Aqui ela já nasce
   **confirmada**, porque quem gerou sabe o que foi dito.
6. Atualize o índice e a contagem em [`LEIA-ME.md`](LEIA-ME.md).
7. Confirme jogando, com o console aberto: percorra menu → tutorial → níveis → partida →
   resultado. **Nenhum `[motor] narração ausente` deve aparecer.** Esse é o teste de pronto —
   nenhum script o substitui, porque só o ouvido confere que o áudio certo tocou na tela certa.
8. Marque os itens nas seções 2 e 10 do [`CHECKLIST-AUDIO.md`](../../CHECKLIST-AUDIO.md).

Nenhuma linha de código do motor precisa mudar em nenhum desses passos.
