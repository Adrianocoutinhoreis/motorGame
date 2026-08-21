# CHECKLIST-AULAS.md — inventário das aulas a refazer

Estado da refação das aulas de `Aulas para Refazer/`. Documento vivo: atualizar a cada
entrega.

Legenda: ✅ concluído · 🚧 em andamento · 📋 planejado

---

## Visão geral

| # | Aula | ID | Novo slug | Status |
|---|---|---|---|---|
| 1 | Jogo dos Blocos | `870294` | `jogo-dos-blocos` | ✅ **refeito** (piloto) |
| 2 | Jogo das Formas | `870298` | `jogo-das-formas` | 📋 planejado |
| 3 | Jogo das Cores | `870296` | `jogo-das-cores` | 📋 planejado |

---

## Diagnóstico comum aos três originais

Os três são exports de Flash de ~2013 e compartilham exatamente os mesmos defeitos:

- **CreateJS/EaselJS + SoundJS 0.5.2 + jQuery 2.0.3 carregados por `http://` de
  `classes.educandus.com.br`** — bloqueado em qualquer página HTTPS moderna. Na prática, os
  três **não abrem** hoje em um AVA servido por HTTPS.
- `<canvas width="800" height="600">` fixo — cortado ou minúsculo em tablet e em iframe.
- `<meta charset="iso-8859-1">` — acentuação quebrada.
- `createjs.Ticker.setFPS(12)` e `setInterval` para o tempo — a partida corre com a aba em
  segundo plano.
- **Somente eventos de mouse** — injogáveis em tablet.
- `window.close()` como botão "voltar" — não faz nada dentro do iframe do AVA.
- Arquivo `*_visual.js` de 250 a 344 KB com a arte vetorial exportada em código.
- **Nenhum `postMessage`** — nenhuma das três aulas registra qualquer coisa no AVA hoje.
- `textos/*.json` presentes mas com conteúdo de exemplo, não usados.
- Os `.txt` na raiz de cada pasta estão vazios: são apenas marcadores do ID da aula.

---

## 1. Jogo dos Blocos — `870294` ✅

**Original:** `js/BlocosNumericos.js`. Gancho oscilante levando um bloco; clique solta;
empilhar 5 na ordem; 3 vidas. Nível "fácil" = números 1–5, "difícil" = vogais A-E-I-O-U.

**Refeito em:** `Games/jogo-dos-blocos/`

| O que mudou | Por quê |
|---|---|
| **3 níveis** (1–5, 6–10, vogais) em vez de 2 | Os áudios `seis.mp3`…`dez.mp3` **já existiam** na pasta original e nunca eram carregados. E contagem × vogais são habilidades diferentes, não graus de dificuldade |
| Toque funciona | O original só ouvia mouse |
| Tempo por delta | Não desanda ao trocar de aba |
| Menu, tutorial navegável, seleção de nível, pausa, resultado | O original abria direto numa tela de instrução e não tinha pausa |
| Base larga e tolerância generosa | Errar por milímetro aos 5 anos ensina a desistir |
| Erro **não avança** o símbolo | O aluno repete o mesmo número/letra: o jogo ensina, não só mede |
| **Registro no AVA** | Não existia |
| Arte nova em SVG + áudio original | `bloco.svg`, `base.svg`, `gancho.svg`; toda a locução pt-BR reaproveitada |

**Contrato:** `totalPerguntas: 5` · `acertos` = blocos encaixados · `erros` = blocos
derrubados · `nivel` = 1 \| 2 \| 3 · `jogo: "jogo-dos-blocos"` · derrota também registra.

**Validação:** 47 testes de lógica + 32 verificações em navegador headless (inclusive o
`postMessage` cruzando um `<iframe>` real, em três tamanhos). Falta a validação humana
descrita no `CHECKLIST.md` do jogo — jogar com o som ligado, em toque, e conferir os números.

---

## 2. Jogo das Formas — `870298` 📋

**Original:** `js/JogoFormas.js` (+ `animacao.js`). Corrente por coluna pega e solta pilhas
de blocos; a cada 15 s sobe uma linha nova (estilo *Tetris Attack*); junte 3 formas iguais.
Meta 20 pontos em 120 s; perde se a pilha alcançar o topo. Áudio nomeia a forma
(quadrado, retângulo, círculo, triângulo). Nível único.

**Assets aproveitáveis:** PNGs dos blocos e do cenário existem; a locução das formas existe.

**Contrato proposto:** `totalPerguntas: 20` (meta de pontos) · `acertos` = pontos feitos ·
`erros` = soltas inválidas · `nivel: 1`.

**O motor precisa ganhar antes:**
- estrear o `GridBoard` em jogo real (hoje só coberto por teste de unidade);
- exercitar a `TimerBar` (pronta, sem uso real);
- exercitar o modo `colunas` do `CraneController`.

**Pontos a confirmar com o humano:**
- "Solta inválida" é a definição certa de erro aqui, ou o erro é a linha que sobe?
- 120 s e 20 pontos continuam adequados, ou a dificuldade deve baixar para a faixa etária?
- Um bloco com estrela valia 2 pontos no original — manter?

---

## 3. Jogo das Cores — `870296` 📋

**Original:** `js/JogoCores.js`. Match-3 por **arrasto** numa grade 5×7: liga blocos
adjacentes (inclusive na diagonal) da mesma cor, mínimo 3. Ao eliminar, o áudio fala o nome
da cor. Fácil = verde/amarelo/azul/vermelho (meta 30 pts); difícil = rosa/marrom/roxo/laranja
(meta 45 pts). 120 s.

> **Atenção — arte:** este é o único dos três **sem nenhum PNG de bloco**. As peças coloridas
> são vetor dentro do `JogoCores_visual.js` (344 KB). A arte é obrigatoriamente nova.

**Assets aproveitáveis:** só o áudio (nomes das 8 cores, instrução, fundo, feedback).

**Contrato proposto:** `totalPerguntas: 30` (fácil) / `45` (difícil) · `acertos` = pontos
feitos · `erros` = tentativas de combo com menos de 3 · `nivel` = 1 \| 2.

**O motor precisa ganhar antes:**
- **arrasto contínuo (drag path) no `Input`** — selecionar vários blocos num só gesto é a
  mecânica central e hoje não existe;
- `GridBoard` com vizinhança de 8 (já implementado e testado).

**Pontos a confirmar com o humano:**
- **Acessibilidade:** num jogo cujo conteúdo É a cor, cada peça precisa de forma ou símbolo
  próprio, senão a atividade é inacessível a quem tem daltonismo. Isso muda a arte.
- O nível difícil (rosa/marrom/roxo/laranja) tem pares de baixo contraste entre si — vale
  revisar quais cores entram.
- "Combo com menos de 3" é mesmo um erro, ou é só uma tentativa cancelada?

---

## Ordem sugerida

1. **Formas** antes de **Cores**: ele estreia o `GridBoard` e a `TimerBar` com uma mecânica
   mais simples, e reaproveita PNGs existentes.
2. **Cores** por último: exige recurso novo no motor (arrasto contínuo), arte 100% nova e
   uma decisão de acessibilidade que muda o design das peças.
