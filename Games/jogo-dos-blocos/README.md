# Jogo dos Blocos

Refação da aula **870294** com o **Motor Educandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `jogo-dos-blocos`
- **Faixa etária:** 4 a 7 anos (Educação Infantil / 1º ano)
- **Aula original:** `Aulas para Refazer/Jogo dos Blocos/` (CreateJS/Flash, 2013)
- **Motor:** a versão publicada nesta pasta está carimbada em `engine/MOTOR-COPIA.txt` (gerado pela build)

## O que é

Um gancho vai e vem no alto do cenário levando um bloco. O aluno toca na tela para soltar:
se o bloco cair sobre a torre, ele encaixa e uma voz diz o número ou a letra; se cair fora,
tomba e custa um coração. **Cinco blocos empilhados vencem a partida; três erros a encerram.**

São três níveis, cada um treinando uma sequência: **números de 1 a 5**, **números de 6 a 10**
e as **vogais A, E, I, O, U**. O aluno associa o símbolo escrito ao nome falado enquanto
treina a coordenação de soltar no momento certo.

## O que mudou em relação ao original

| Mudança | Motivo |
|---|---|
| **Três níveis** em vez de dois | Os áudios de "seis" a "dez" **já existiam** nos assets originais e nunca eram carregados. E contar × vogais são habilidades diferentes, não graus de dificuldade |
| Funciona com **toque** | O original só ouvia mouse: era injogável em tablet |
| Sem dependência externa | O original carregava jQuery e CreateJS de `http://classes.educandus.com.br`, hoje bloqueado em página HTTPS |
| Escala para qualquer iframe | O original era `<canvas>` fixo em 800×600 |
| Tempo por delta, com pausa automática | O original usava `setInterval`: a partida corria com a aba em segundo plano |
| Menu, tutorial navegável, seleção de nível, pausa | O original abria direto na instrução e não tinha pausa |
| Base larga e tolerância generosa | Perder por milímetro aos 5 anos ensina a desistir |
| Errar **não avança** o símbolo | O aluno repete o mesmo número/letra: o jogo ensina, não só mede |
| Saída sem `window.close()` | Dentro do iframe do AVA aquilo não faz nada |
| **Registro no AVA** | Não existia — a aula original não registrava nada |

## Como rodar localmente

O motor usa módulos ES, então abrir o `index.html` por `file://` **não funciona** (o
navegador bloqueia os módulos). Sirva por HTTP, a partir da raiz do projeto:

```
node tools/serve.mjs
```

e abra `http://localhost:8080/Games/jogo-dos-blocos/`.

Para ver a mensagem do AVA **saindo de verdade** (dentro de um iframe, como no AVA):
`http://localhost:8080/tools/ava-teste.html`

## Registro no AVA

Ao terminar uma partida — **vitória ou derrota** — o jogo emite:

```js
{
  type: "JOGO_CONCLUIDO",
  acertos: 5,            // blocos encaixados (0 a 5)
  erros: 2,              // blocos derrubados (0 a 3)
  totalPerguntas: 5,     // os blocos da torre = a meta da partida
  nivel: 1,              // 1 = números 1-5 · 2 = números 6-10 · 3 = vogais
  jogo: "jogo-dos-blocos",
  conteudo: "Números 1 a 5",   // extra: viaja no payload do AVA
  blocosEmpilhados: 5
}
```

O jogo não conhece aluno, `lo_id`, `activity_id`, turma, XP ou nota — isso é do AVA.
Contrato completo: `docs/CONTRATO-AVA.md` e a Parte A de `Aulas para Refazer/MD/METODO.md`.

## Estrutura

```
jogo-dos-blocos/
├── index.html          página do jogo
├── engine/             CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js       identidade, níveis, tutorial, assets, contrato
│   ├── main.js         ponto de entrada
│   └── scenes/GameScene.js   a mecânica do guindaste e da torre
├── assets/
│   ├── img/            bloco.svg, base.svg, gancho.svg
│   ├── audio/          narração e efeitos (originais da aula 870294)
│   └── audio-transcricao/   uma pasta por áudio, com a transcrição do que é falado
├── CHECKLIST.md        passos de conclusão deste jogo
└── README.md           este arquivo
```

## Assets

> **Nenhuma locução deste jogo é humana.** O áudio de 2013 é TTS da época
> (`TextAloud: ScanSoft Raquel22`, criado em 09/01/2014) e o novo é IA (ElevenLabs). Isso está
> registrado nas tags ID3 de cada arquivo e detalhado em
> [`assets/audio-transcricao/LEIA-ME.md`](assets/audio-transcricao/LEIA-ME.md).

| Arquivo | Tipo | Origem / licença |
|---|---|---|
| `img/bloco.svg`, `img/base.svg`, `img/gancho.svg` | Vetorial | **Criados para esta refação** — Educandus |
| `img/bob.webp` | Raster (WebP) | **Mascote em uso**: operário de obra, busto com a mão estendida, 1760×2000 / 195 KB, com alfa. Enquadramento já recortado na coxa — é o que permite apoiá-lo no rodapé do palco sem parecer flutuando |
| `img/worker.webp` | Raster (WebP) | Mascote **anterior**, hoje sem uso: figura inteira 408×700 / 46 KB, convertida do PNG em `fontes/mascote/worker.png`. Continua no pacote; pode sair (ver `CHECKLIST-AUDIO.md` §6 para o critério de peso) |
| `audio/um…cinco.mp3` | Narração | Aula original 870294 — Educandus |
| `audio/seis…dez.mp3` | Narração | Aula original 870294 (existiam, nunca usados) — Educandus |
| `audio/a, e, i, o, u.mp3` | Narração | Aula original 870294 — Educandus |
| `audio/abertura.mp3` | Narração | **Voz ElevenLabs (IA)** — substituiu o arquivo de 2013, que segue em `Aulas para Refazer/` |
| `audio/gancho_vai_vem.mp3`, `toque_soltar.mp3`, `cinblocos_venceu.mp3` | Narração | **Voz ElevenLabs (IA)**, 2026 — narração dos 3 passos do tutorial. Content Credentials C2PA embutidos |
| `audio/somFundo.mp3` | Música | Aula original 870294 — Educandus |
| `audio/acertoSOS.wav`, `erroSOS.wav`, `sim.wav`, `nao.wav` | Efeito | Aula original 870294 — Educandus |
| `audio/facil.mp3`, `dificil.mp3` | Narração | Aula original — **não usados** (os níveis foram renomeados) |

O cenário (céu, sol, nuvens, colinas) é desenhado vetorialmente pelo motor, sem arquivo de
imagem. O mascote é a única arte em raster do jogo — e por ser uma figura ilustrada, WebP
comprime melhor que SVG teria.

**Transcrições:** cada áudio tem uma ficha em `assets/audio-transcricao/<nome>/transcricao.md`
com o que é falado, o formato real do arquivo e onde ele é usado. Comece pelo
[índice](assets/audio-transcricao/LEIA-ME.md). Atenção: as fichas foram montadas **sem que os
áudios fossem ouvidos** — 19 têm transcrição inferida (a confirmar) e 3 estão em branco.

## Pendências conhecidas

- **Três locuções de tela faltando** ("Escolha um nível", vitória e derrota). Eram seis; as
  três do tutorial chegaram em 21/08/2026. Sem elas, a tela de níveis e o resultado ficam em
  **silêncio** — o motor não sintetiza voz, por decisão travada em teste. O texto exato de cada
  uma está em [`A-GRAVAR.md`](assets/audio-transcricao/A-GRAVAR.md); é só pôr o arquivo em
  `assets/audio/`, declará-lo em `config.js` e apontar a chave — sem alterar uma linha de código.
- **O áudio tem checklist próprio:** [`CHECKLIST-AUDIO.md`](CHECKLIST-AUDIO.md). Neste jogo o
  áudio *é* o conteúdo pedagógico (2,9 MB dos 3,4 MB do pacote), e quase tudo o que pode dar
  errado com ele não aparece na tela. Rode `node tools/audio-info.mjs jogo-dos-blocos` para o
  inventário medido.
- **Transcrições dos áudios a confirmar.** Nenhum dos 23 arquivos foi ouvido. Nas fichas de
  `assets/audio-transcricao/`, 19 trazem transcrição **inferida** (nome do arquivo + código da
  aula original + duração compatível) e 3 estão **em branco** por não ser possível deduzir:
  `abertura` (11,15 s de instrução falada), `acertoSOS` e `erroSOS`. Prioridade: ouvir
  `abertura`, porque se ela descrever o jogo antigo precisa ser regravada.
- **Som de erro a revisar.** `config.audio.erro` usa `nao.wav`. Se for uma voz dizendo "não",
  o jogo diz "não" à criança a cada bloco derrubado, o que contraria a diretriz "errar não pode
  humilhar" de `docs/DESIGN.md`. Decisão registrada em `assets/audio-transcricao/nao/`.
- **Validação humana pendente.** Os testes automatizados cobrem lógica, fluxo, contrato e
  independência. Ainda falta alguém **jogar** com o som ligado, em toque, e conferir que os
  números do console batem com o que fez. Roteiro na seção 7 do `CHECKLIST.md`.

## Atualizar o motor neste jogo

```
node tools/build.mjs jogo-dos-blocos
node tools/verificar-independencia.mjs jogo-dos-blocos
```
