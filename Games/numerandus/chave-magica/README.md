# Chave Mágica

Atividade educativa construída com o **Motor Educandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `chave-magica`
- **Faixa etária:** 6 a 7 anos (1º ano)
- **Criado em:** 2026-09-24

## O que é

Um jogo de correspondência por formato: N fechaduras ficam fixas no tabuleiro, cada
uma com um formato único de cabeça (círculo, quadrado, losango ou oval) e dentes
(1 ou 2, de alturas diferentes); a criança arrasta, da bandeja, a chave de MESMO
formato até a fechadura certa. A cor nunca decide sozinha — no nível Fácil/Médio a
fechadura é uma silhueta sem cor nenhuma; no Difícil ela vira um cadeado colorido
(a cor bate com a da chave certa, uma pista a mais, mas quem decide o encaixe
continua sendo o formato). Pratica discriminação visual de forma, atenção a
detalhe e correspondência um-a-um.

**Este é o primeiro jogo da série Numerandus com derrota de verdade.** Decisão
registrada num artefato de planejamento antes da implementação começar: ao contrário
do resto da coleção ("errar só demora mais"), aqui a criança tem 3 vidas e um
cronômetro regressivo por nível — errar o formato custa uma vida, e a partida também
acaba se o tempo zerar antes de encaixar todas as chaves.

## Como os dados do jogo foram definidos

Dois materiais de referência, nenhum dos dois um conjunto de fotos prontas (diferente
do Quebra-Cabeça Geométrico):

- `numerandus/finalizados/1ano/chave_magica/chave_magica.mp4` — vídeo do brinquedo
  físico (uma tábua com 8 silhuetas de chave recortadas, sem cor, e fechaduras
  coloridas em formato de coração, cada uma com sua chave). Frames extraídos com
  `ffmpeg` (não havia foto solta) confirmaram a mecânica: cada fechadura só aceita
  UMA chave, pelo formato.
- `Aulas para Refazer/Jogo_da_chave_magica/Game/script.js` — um protótipo solto (fora
  do motor) que já resolveu o sistema de identidade das peças: cada chave nasce de
  uma combinação de cabeça (`bow`) + dentes (`perfil`), e a fechadura da rodada é
  literalmente a MESMA geometria, sem cor. `GameScene.js` porta essa geometria
  (`bowPathD`/`dentesPathD`) para `Path2D` de canvas — a matemática é a mesma já
  validada ali, só o jeito de desenhar mudou (SVG/DOM → canvas puro).

O protótipo antigo também tinha vidas e cronômetro regressivo — isso FOI mantido
(ver acima), mas os efeitos sonoros emprestados de meme/TV dele (um "buzzer" de
programa de auditório, um efeito de videogame) **não foram reaproveitados**: sem
licença nenhuma, não podiam ir para o produto publicado. Os sons usados aqui vêm
todos da biblioteca já estabelecida da coleção Numerandus (ver seção Assets).

## Como rodar localmente

O motor usa módulos ES, então abrir o `index.html` por `file://` **não funciona**
(o navegador bloqueia os módulos). Sirva por HTTP:

```
node tools/serve.mjs
```

e abra `http://localhost:8080/Games/numerandus/chave-magica/`.

Para ver a mensagem do AVA saindo de verdade, use o host de teste:
`http://localhost:8080/tools/ava-teste.html`

## Registro no AVA

Ao terminar uma partida (vitória **ou** derrota — ver seção 5 do `CHECKLIST.md`), o
jogo emite:

```js
{ type: "JOGO_CONCLUIDO", acertos, erros, totalPerguntas, nivel, jogo: "chave-magica" }
```

`totalPerguntas` é o número de chaves do nível (4, 6 ou 8). `acertos` é a pontuação
(`ScoreSystem.pontuacao`): numa vitória, o total menos os erros; numa derrota, o
progresso puro até o momento em que as vidas ou o tempo acabaram. `erros` conta toda
tentativa de encaixe num formato errado — cada uma já custou uma vida na hora, não é
só informativo como no resto da coleção.

O jogo não conhece aluno, `lo_id`, `activity_id`, XP ou nota — isso é do AVA.

## Estrutura

```
chave-magica/
├── index.html      página do jogo
├── engine/         CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js   identidade, 3 níveis (vidas + tempo), tutorial, contrato
│   ├── main.js     ponto de entrada
│   └── scenes/     GameScene.js — toda a mecânica (arrastar, validar formato, vidas/tempo)
├── assets/         só áudio (as peças são desenhadas por código, sem imagem)
├── CHECKLIST.md    passos para concluir o jogo
└── README.md       este arquivo
```

Assim como o Quebra-Cabeça Geométrico, as peças aqui **não usam imagem** — cabeça e
dentes são desenhados via `Path2D` (sintaxe de path SVG, sem nenhum DOM) direto no
canvas.

## Assets

| Arquivo | Tipo | Origem / licença |
|---|---|---|
| `acertoSOS.wav` | Áudio, vitória | Mesmo arquivo de toda a coleção Numerandus — ver `assets/audio-transcricao/acertoSOS/transcricao.md` |
| `soltar_peca.mp3` | Áudio, encaixe certo | Mesmo arquivo do Material Dourado/Dino/Encaixe Certo/Geométrico — origem/licença a confirmar, ver `assets/audio-transcricao/soltarPeca/transcricao.md` |
| `error.MP3` | Áudio, encaixe errado (custa 1 vida) | Mesmo arquivo do Jogo da Memória/Geométrico — ainda não ouvido, ver `assets/audio-transcricao/somErro/transcricao.md` |
| `erroSOS.wav` | Áudio, derrota | Mesmo arquivo do Jogo dos Blocos — ainda não ouvido, ver `assets/audio-transcricao/erroSOS/transcricao.md` |

## Pendências conhecidas

- **Áudio de clique genérico e narração do tutorial** — ainda não gravados
  (`config.audio.clique` continua `null`; os 3 passos do tutorial têm `fala:` apontando
  pra ids que ainda não têm arquivo).
- **`error.MP3` e `erroSOS.wav` não foram ouvidos** — ambos têm ficha "não verificada".
  Aqui o risco pedagógico é maior que nos outros jogos que reusam esses arquivos: se
  qualquer um dos dois for uma fala reprovadora, conflita direto com a derrota já sendo
  uma experiência mais dura que o resto da coleção.
- **Origem/licença de `soltar_peca.mp3`** — mesma pendência já registrada nos outros
  jogos que usam este arquivo.
- **Cadeado "aberto" (nível Difícil) é só a alça deslocada + um "✓"** — funciona, mas
  não tem a animação de giro do protótipo original. Registrado como possível v2, não
  como bug.
- **Testado só com chamada direta aos métodos da cena E com toque sintético via
  `PointerEvent`/CDP** (arrastar uma chave de verdade, ver histórico da sessão) — nenhum
  evento de toque disparado por um dedo de verdade num tablet ainda.
- **Não testado em tablet real, nem em iframe pequeno/médio/grande.**
- **Valores de vidas/tempo por nível são um ponto de partida** (3 vidas; 30/40/60s),
  ainda não calibrados com crianças de verdade jogando.

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/chave-magica
node tools/verificar-independencia.mjs numerandus/chave-magica
```
