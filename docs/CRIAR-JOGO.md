# CRIAR-JOGO.md — do comando ao jogo publicável

Um jogo novo é **um comando + um formulário + uma cena**. Todo o resto — telas, som,
carregamento, navegação, escala responsiva e registro no AVA — vem pronto do motor.

---

## Passo 1 — Criar

```bash
node tools/new-game.mjs jogo-das-formas "Jogo das Formas"
```

Isso cria `Games/jogo-das-formas/` com o template, substitui os marcadores, copia o motor e
gera o `CHECKLIST.md` do jogo.

**Sobre o slug:** minúsculo, sem acento, separado por hífen. Ele vai no campo `jogo` da
mensagem do AVA e é a chave que identifica o jogo no relatório — **não mude depois de
publicar.**

## Passo 2 — Rodar

```bash
node tools/serve.mjs
```

Abra `http://localhost:8080/Games/jogo-das-formas/`.

O jogo gerado **já funciona**: menu → tutorial → níveis → partida (toque nas estrelas) →
resultado, e já emite o `JOGO_CONCLUIDO`. Isso não é enfeite: é a prova de que o encanamento
está de pé antes de você escrever qualquer linha.

> Abrir o `index.html` por `file://` **não funciona** — o motor usa módulos ES e o navegador
> os bloqueia por CORS. Sempre pelo servidor.

## Passo 3 — Preencher o formulário (`src/config.js`)

```js
export default {
  slug: 'jogo-das-formas',
  titulo: 'Jogo das Formas',
  subtitulo: 'Junte as formas iguais!',
  objetivo: 'Reconhecer quadrado, retângulo, círculo e triângulo pelo nome.',
  faixaEtaria: '4 a 7 anos',

  niveis: [
    { id: 1, nome: 'Formas', descricao: '20 pontos', amostra: '■ ● ▲',
      cor: '#2563EB', meta: 20, vidas: 0, /* campos livres do seu jogo */ },
  ],

  tutorial: [
    { titulo: '…', texto: '…', fala: 'idDoAudio',
      desenho: (ctx, largura, altura, t) => { /* anima o gesto do jogo */ } },
  ],

  assets: [
    { id: 'circulo', src: './assets/audio/circulo.mp3' },
  ],

  audio: { musica: 'somFundo', clique: null, erro: 'nao',
           vitoria: 'acertoSOS', derrota: 'erroSOS', abertura: 'instrucao1' },

  registrarDerrota: true,
};
```

Regras:
- `niveis` com **um** item → JOGAR vai direto à partida. Com mais de um → o motor mostra a
  tela de seleção sozinho.
- `meta` vira `totalPerguntas` e `id` vira `nivel` no contrato do AVA.
- Campos extras dentro de um nível são livres: o seu jogo os lê como quiser.
- Todo `src` é **relativo** e aponta para dentro de `assets/`.

## Passo 4 — Escrever a mecânica (`src/scenes/GameScene.js`)

O esqueleto gerado já mostra a estrutura. O essencial:

```js
aoEntrar() {
  this.estado = ESTADOS.JOGANDO;
  this.nivel = this.game.dados.nivel ?? this.config.niveis[0];

  // 1. O placar é a fonte ÚNICA dos números — da tela e do AVA.
  this.placar = new ScoreSystem({
    total: this.nivel.meta, nivel: this.nivel.id, vidas: this.nivel.vidas,
  });

  // 2. HUD ligado ao placar (ele se atualiza sozinho).
  this.adicionar(new ScoreBar({ x: 20, y: 20 }).acompanhar(this.placar));

  // 3. A sua mecânica chama acertar() e errar().
  // 4. O fim é um ponto só:
  this.placar.on('vitoria', () => this._terminar(true));
  this.placar.on('derrota', () => this._terminar(false));
}

_terminar(venceu) {
  this.irPara('resultado', {
    nivel: this.nivel,
    estrelas: this.placar.estrelas,
    resultado: this.placar.paraAva(venceu),
  });
}
```

**Essa última chamada É o contrato.** Não instancie o `AvaBridge`, não chame `postMessage`:
o motor registra sozinho ao entrar em `resultado`, uma única vez, e re-arma ao sair.

### Antes de codificar, decida a semântica

Do METODO.md (B6/B9). Se você não souber responder, **pergunte a um humano — não chute**:

- O que é **um acerto** aqui? E **um erro**?
- Qual é a **meta** (`totalPerguntas`)?
- Como se sabe que **terminou**? Existe derrota?
- Um campo não observável recebe o **default honesto** (`erros: 0`) e vai **documentado**.

Preencha a tabela da seção 5 do `CHECKLIST.md` do jogo **antes** de escrever a cena.

## Passo 5 — Arte e áudio

- Tudo em `assets/`, com caminho relativo. **Nada de CDN, nada de fonte externa.**
- SVG para arte estática; desenho no canvas para o que muda (símbolo, cor, estado).
- Áudio de narração é conteúdo pedagógico. Use sempre `audio.falar(id, { texto })` — a fila
  impede que duas falas se atropelem.
- Registre origem e licença de cada arquivo na tabela do `README.md` do jogo.

## Passo 6 — Fechar o checklist

`Games/<slug>/CHECKLIST.md`, do início ao fim. Um item que não se aplica é **riscado com a
justificativa**, nunca marcado por engano.

## Passo 7 — Validar

```bash
node tools/testes.mjs                          # lógica do motor
node tools/verificar-independencia.mjs <slug>  # o portão de entrega
node tools/serve.mjs 8099                      # em outro terminal
node tools/teste-navegador.mjs 8099            # ponta a ponta, com iframe real
```

E o que nenhum script substitui — **jogar**:

1. Vença errando de propósito um número conhecido de vezes; confira `erros` no console.
2. Perca de propósito; confira que registra com os acertos parciais.
3. Jogue duas partidas sem recarregar: exatamente duas mensagens.
4. Fique parado no resultado: nenhuma mensagem a mais.
5. Teste com **toque** (emulador de dispositivo ou tablet real).

## Passo 8 — Publicar

```bash
node tools/build.mjs <slug>                    # motor atualizado na cópia
node tools/verificar-independencia.mjs <slug>  # tem de aprovar
node tools/teste-entrega-avulsa.mjs <slug>     # tem de aprovar
```

O último comando **copia a pasta para fora do projeto**, serve de uma subpasta profunda
(`aulas/2026/turma-b/<slug>/`) e abre num navegador headless, conferindo que nenhuma
requisição escapou da pasta. É exatamente o que acontece quando você manda só esse jogo para
o AVA. Se funcionar ali, funciona lá.

> Um detalhe que esse teste pega e nenhum outro pegaria: sem um `<link rel="icon">`, o
> navegador pede `/favicon.ico` na **raiz do servidor** — uma requisição para fora da pasta
> do jogo. O template já traz o ícone embutido como `data:` URI.

---

## Erros comuns (e o que eles parecem)

| Sintoma | Causa provável |
|---|---|
| Tela preta, console fala de módulo | Abriu por `file://` em vez do servidor |
| "cena 'jogando' ausente" | Faltou passar `cenas: { jogando: ... }` |
| Nenhum som | Ainda não houve toque na tela (política de autoplay) — ou os ids não batem com `assets` |
| Narrações se atropelando | Usou `audio.efeito()` em vez de `audio.falar()` |
| Nada registrado no AVA | A cena não chamou `irPara('resultado', { resultado })` |
| Registrou duas vezes | Chamou o `AvaBridge` na mão além do fluxo do motor |
| Botão não responde | Faltou `interativo: true`, ou outro nó está por cima |
| Editei o motor e não mudou nada | Editou `Games/<slug>/engine/` (é cópia) em vez de `engine/` |
