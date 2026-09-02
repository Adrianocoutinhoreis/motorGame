# CHECKLIST-JOGO.md — o modelo de checklist de cada jogo

Todo jogo criado por `node tools/new-game.mjs` recebe um **`CHECKLIST.md` próprio**, dentro
da sua pasta, gerado a partir de `templates/jogo-base/CHECKLIST.md`. Este documento explica
o modelo e por que cada seção existe.

**Onde fica o checklist de verdade:** `Games/<slug>/CHECKLIST.md`.
**Onde se edita o modelo:** `templates/jogo-base/CHECKLIST.md` (vale para os próximos jogos).

---

## Como usar

- Marque conforme avança. Um jogo só é "concluído" com o checklist fechado.
- Item que **não se aplica** é riscado com a justificativa (`~~item~~ — não há tempo neste jogo`),
  nunca marcado por engano. A diferença entre "não se aplica" e "esqueci" é o que faz o
  checklist valer alguma coisa.
- As seções 5 e 7 não são opinião: elas repetem o checklist A5 do METODO.md e o roteiro de
  validação B8. Pular ali significa publicar sem saber se o AVA vai registrar.

---

## As 8 seções, e o que cada uma protege

### 1. Definição
Objetivo pedagógico, faixa etária, mecânica, níveis, vitória e derrota, e a conferência das
[regras educacionais](REGRAS-EDUCACIONAIS.md).
**Protege contra:** construir um jogo bonito que não ensina nada verificável — e contra
descobrir só no fim que ninguém sabia dizer o que era "acertar".

> Ao criar uma regra nova em `REGRAS-EDUCACIONAIS.md`, acrescente o item correspondente
> **aqui e no template**. Regra que não vira item de checklist é regra que ninguém confere.

### 2. Assets
Arte, áudio, licenças, tudo local.
**Protege contra:** a falha que matou as aulas originais — depender de um arquivo que mora
em outro servidor. E contra publicar áudio sem saber de onde veio.

### 3. Telas
Menu, tutorial, seleção de nível, partida, pausa, AJUDA, resultado, e nenhum beco sem saída.
**Protege contra:** a criança ficar presa numa tela sem caminho de volta — situação em que,
nos originais, a única saída era `window.close()`, que dentro do iframe não faz nada. A ajuda
protege contra um beco mais sutil: saber o que fazer e não ter como reler a regra sem perder a
partida (regra RE-05).

### 4. Mecânica
Regras, dificuldade real, feedback de acerto e de erro, reinício limpo.
**Protege contra:** o estado da partida anterior vazar para a próxima, e contra "dificuldade"
que só existe no arquivo de configuração porque ninguém jogou.

### 5. Contrato do AVA
Tabela de mapeamento semântico + os 10 itens do checklist A5.
**Protege contra:** o pior defeito possível aqui — o jogo parecer instrumentado e registrar
número errado. É a seção que exige preencher, com palavras, o que cada campo significa
**neste** jogo.

### 6. Acessibilidade
Alvo de 64 px, contraste, cor nunca sozinha, nada exige leitura, som desligável.
**Protege contra:** excluir justamente o aluno que mais precisa da atividade.

### 7. Validação
Scripts + o roteiro manual no navegador.
**Protege contra:** confiar num teste automatizado que não prova o que se imagina. Os
scripts provam formato, fluxo e independência; **só jogando** se prova que os números batem
com o que o aluno fez.

### 8. Entrega
README, build final, versão do motor, e o teste que manda: **copiar a pasta para fora do
projeto e abrir de lá.**
**Protege contra:** o jogo funcionar aqui e quebrar no AVA por depender de algo da raiz.

---

## A tabela que não pode ficar em branco

A seção 5 pede isto preenchido **com palavras**, antes de escrever a cena de partida:

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | a meta da partida | 5 |
| `acertos` | o progresso alcançado | 0–5 |
| `erros` | as falhas cometidas | 0–3 |
| `nivel` | qual nível foi jogado | 1, 2 ou 3 |
| `jogo` | slug estável | `jogo-dos-blocos` |

Se você não consegue preencher uma linha, **você ainda não sabe o que vai medir** — e é
hora de perguntar, não de escolher um número. Ver [`CONTRATO-AVA.md`](CONTRATO-AVA.md) e a
Parte A do `METODO.md`.
