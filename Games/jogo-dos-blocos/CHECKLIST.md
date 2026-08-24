# Checklist — Jogo dos Blocos

> Passos para este jogo ser considerado **concluído**.
> Um item que não se aplica é **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `jogo-dos-blocos` · Refação da aula `870294` · Motor: o carimbado em `engine/MOTOR-COPIA.txt`

**Situação:** tudo que dá para verificar sem uma pessoa está fechado.
**Falta o que exige ouvidos e mãos humanas:** confirmar as transcrições dos áudios (seção 2)
e a validação jogando (seção 7.2).

---

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase — *reconhecer e ordenar sequências (1–5, 6–10, vogais), associando símbolo escrito ao nome falado*
- [x] Faixa etária confirmada e coerente com o design — *4 a 7 anos; alvos grandes, nada exige leitura, tudo narrado*
- [x] Mecânica descrita em até 3 frases — *ver README*
- [x] Níveis definidos: 3 (números 1–5, números 6–10, vogais); muda o conteúdo e a velocidade do gancho (2,8 s → 2,4 s → 2,1 s por travessia)
- [x] Condição de **vitória**: 5 blocos encaixados
- [x] Condição de **derrota**: 3 blocos derrubados
- [x] `src/config.js` preenchido por inteiro, sem texto de exemplo sobrando
- [x] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`):
  - [x] RE-01 — `textoEmCaixaAlta: true`: **todo** texto exibido vai em caixa alta (título,
        botões, níveis, tutorial, resultado, HUD), com acentos preservados (`NÍVEL`, `NÚMEROS`).
        As vogais do nível 3 estão em caixa alta na origem (`['A','E','I','O','U']`).
        Ids de áudio, slug e o campo `conteudo` do payload seguem em caixa normal por serem
        identificadores/dados para adultos, nunca texto exibido à criança.
        Conferido em navegador, tela a tela.

## 2. Assets

- [x] Arte produzida — `bloco.svg`, `base.svg`, `gancho.svg` (vetorial) e `worker.webp` (mascote, 46 KB); cenário desenhado pelo motor
- [x] Áudio de narração presente para o conteúdo **do exercício** — os 15 símbolos dos 3 níveis
- [ ] Áudio de narração presente para **as telas** — faltam 3 locuções (escolha de nível,
      vitória, derrota). Sem elas essas telas ficam em silêncio: o motor não sintetiza voz.
      Lista em `assets/audio-transcricao/A-GRAVAR.md`
- [ ] **Áudio conferido em detalhe** — inventário, transcrições, consistência entre lotes,
      peso e proveniência: ver [`CHECKLIST-AUDIO.md`](CHECKLIST-AUDIO.md), que existe porque
      neste jogo o áudio é o conteúdo, não o enfeite
- [x] Efeitos de acerto, erro e feedback presentes — `acertoSOS`, `erroSOS`, `nao`
- [x] Todo asset está dentro de `assets/`, com caminho relativo
- [x] Nenhuma fonte, imagem ou som vindo da internet — *verificado por `verificar-independencia.mjs`*
- [x] Origem/licença de cada arquivo registrada no `README.md`
- [x] Ficha de transcrição criada para **cada** áudio (`assets/audio-transcricao/`) — 23 de 23
- [ ] **Transcrições confirmadas ouvindo** — 0 de 23 (19 inferidas, 3 em branco). Prioridade:
      `abertura`, `erroSOS`, `acertoSOS`, `nao` (ver `assets/audio-transcricao/LEIA-ME.md`)
- [x] Pendências de áudio listadas no `README.md` e em `assets/audio-transcricao/A-GRAVAR.md`

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR
- [x] **Tutorial** com 3 passos narrados, ilustrados e puláveis — narração ligada em
      21/08/2026; a transcrição ainda não foi confirmada ouvindo (`CHECKLIST-AUDIO.md`, §3)
- [x] **Seleção de nível** com os 3 níveis
- [x] **Partida** com HUD legível (progresso, vidas, nome do nível, pausa)
- [x] **Aparelho de pé**: o jogo gira sozinho para a horizontal em vez de virar uma tira —
      desperdício de tela medido caindo de 75% para 20%, e o toque conferido no pixel real
      com o palco girado. Continua pendente o alvo físico de 32–36 px em celular (`docs/STATES.md`)
- [x] **Pausa** com continuar / começar de novo / sair
- [x] **Resultado** para vitória **e** para derrota
- [x] Nenhum beco sem saída: de toda tela dá para voltar ao menu

## 4. Mecânica

- [x] Regras implementadas conforme a definição
- [x] Feedback imediato de acerto — o bloco assenta com achatada e a voz diz o símbolo
- [x] Feedback imediato de erro — o bloco tomba, some, e um coração é perdido com animação
- [ ] **Dificuldade dos níveis testada jogando** (não só configurada) — *pendente: seção 7.2*
- [x] Nenhum estado travado — a trava durante a queda impede soltar dois blocos, e libera sempre
- [x] Reiniciar limpa todo o estado da partida anterior — *a cena é recriada; nós e ouvintes somem juntos*
- [x] Errar **não avança** o símbolo: o aluno repete o mesmo número/letra

## 5. Contrato do AVA

Mapeamento semântico **deste** jogo:

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | a meta da partida: os 5 blocos da torre | `5` |
| `acertos` | blocos que encaixaram na torre | `0` a `5` |
| `erros` | blocos que caíram fora e tombaram | `0` a `3` |
| `nivel` | qual sequência foi jogada | `1` = 1–5 · `2` = 6–10 · `3` = vogais |
| `jogo` | slug estável | `jogo-dos-blocos` |
| *(extra)* `conteudo` | nome do nível, para o relatório | `"Números 1 a 5"` |
| *(extra)* `blocosEmpilhados` | altura final da torre | `0` a `5` |

- [x] Existe **um único** ponto de fim de partida — `GameScene._terminar()` → `irPara('resultado', { resultado })`
- [x] `type` é exatamente `"JOGO_CONCLUIDO"`
- [x] `acertos`/`erros` são da **partida inteira**, não da última jogada
- [x] `totalPerguntas` reflete a meta real do nível jogado
- [x] `nivel` é sempre enviado, nunca nulo
- [x] `jogo` usa o slug estável
- [x] Os três números vão como `number`
- [x] `postMessage` para `window.parent` com `"*"`, protegido por `window.parent !== window`
- [x] Nenhum dado de aluno / `lo_id` / `activity_id` / turma / XP / nota é enviado
- [x] Derrota também registra — decisão do projeto, com os acertos parciais

## 6. Acessibilidade

- [x] Todo alvo tocável tem no mínimo 64×64 px lógicos — *garantido no construtor do `Button`*
- [x] Espaço suficiente entre alvos
- [x] Contraste de texto e elementos essenciais em nível AA — *texto sobre cenário usa contorno*
- [x] Cor nunca é o único portador de significado — nível tem número e amostra; vida tem ícone
- [ ] Nenhuma ação exige saber ler — os ícones cobrem toda a navegação e o tutorial já é
      narrado; falta a **tela de resultado**, que hoje depende do texto escrito. Aos 4 anos
      isso significa depender de um adulto para ler. Fecha com as 3 locuções de `A-GRAVAR.md`
- [x] Som pode ser desligado e a preferência é lembrada
- [x] Nada pisca de forma rápida ou repetitiva
- [ ] **Conferido com uma criança da faixa etária** — *pendente; nenhum teste substitui isso*

## 7. Validação

### 7.1 Automatizada — feita

- [x] `node tools/testes.mjs` — **47 passaram, 0 falharam**
- [x] `node tools/verificar-independencia.mjs jogo-dos-blocos` — **aprovado**
- [x] `node tools/teste-navegador.mjs` — **32 passaram, 0 falharam**, incluindo:
  - [x] o jogo abre e renderiza dentro de um `<iframe>` real
  - [x] nenhuma requisição para fora do servidor local
  - [x] fluxo menu → tutorial → níveis → partida → resultado
  - [x] **vitória:** `{acertos:5, erros:0, totalPerguntas:5, nivel:1}` chegando ao pai
  - [x] **derrota:** `{acertos:0, erros:3, totalPerguntas:5, nivel:3}` chegando ao pai
  - [x] **replay** gera um novo registro
  - [x] ficar parado no resultado **não** duplica
  - [x] iframes de 400×700, 640×480 e 1280×720 sem cortar nem deformar
  - [x] nenhum `console.error` na sessão
- [x] `node tools/teste-entrega-avulsa.mjs jogo-dos-blocos` — **10 passaram, 0 falharam**:
      a pasta copiada para fora do projeto, servida de `aulas/2026/turma-b/`, abre e carrega
      as 66 requisições **todas** de dentro dela mesma

### 7.2 Humana — pendente (nenhum script substitui)

- [ ] Jogar uma partida **errando de propósito 2 vezes** e conferir `erros: 2` no console
- [ ] Conferir que a **narração do símbolo** toca a cada encaixe, sem atropelar
- [ ] Conferir que a música de fundo entra e o botão de som a desliga
- [ ] Jogar **com toque** (tablet real ou emulador de dispositivo)
- [ ] Trocar de aba no meio da partida e voltar — o jogo pausa e retoma
- [ ] Usar a **pausa**: continuar, começar de novo e sair
- [ ] Avaliar se a dificuldade dos 3 níveis está adequada à faixa etária
- [ ] Abrir `tools/ava-teste.html` e conferir as regras do contrato marcadas em verde

## 8. Entrega

- [x] `README.md` do jogo atualizado
- [x] `node tools/build.mjs jogo-dos-blocos` rodado
- [x] Versão do motor conferida dentro da pasta — o carimbo de `engine/MOTOR-COPIA.txt`, e `verificar-independencia.mjs` reprova se a cópia divergir da raiz
- [x] Pasta copiada para **fora** do projeto, servida de uma subpasta e testada — *automatizado em `tools/teste-entrega-avulsa.mjs`*
- [ ] Zip gerado só com a pasta do jogo e aberto uma última vez antes de enviar
