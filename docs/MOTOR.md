# MOTOR.md — arquitetura e regras do Motor Educandus

Documento de referência do motor. Se algo aqui conflitar com o código, **o código
está errado ou este documento está desatualizado** — nunca "depende".

Motor: **Motor Educandus** — a versão corrente está em `engine/version.json` (não se repete o número aqui: número copiado à mão envelhece).
Tecnologia: **HTML + CSS + JavaScript puro (módulos ES)**. Sem framework, sem build, sem dependência.

---

## 1. Por que o motor existe

As três aulas em `Aulas para Refazer/` são exports de Flash de ~2013 (CreateJS/EaselJS,
SoundJS 0.5.2, jQuery 2.0.3). Comparando os três arquivos principais, cerca de 90% de cada
um é o **mesmo chassi reescrito à mão**: pré-carregamento, barra de pontos, cronômetro,
vidas, modal de acerto/erro, tela de instrução, guindaste. Cada cópia divergiu um pouco —
e cada divergência virou um bug diferente.

Além da duplicação, os três compartilham problemas que os tornam inviáveis hoje:

| Problema no original | Consequência | Como o motor resolve |
|---|---|---|
| jQuery e CreateJS por `http://` de servidor externo | Bloqueado em qualquer página HTTPS: o jogo não abre | Zero dependência externa; tudo local |
| `<canvas width="800" height="600">` fixo | Cortado ou minúsculo em tablet e em iframe de outro tamanho | `Stage` escala por proporção com letterbox |
| Só eventos de mouse | Injogável em tablet | `Input` sobre Pointer Events (mouse, toque e caneta) |
| `setInterval` para o cronômetro | Aba em segundo plano consome o tempo da partida | Laço `requestAnimationFrame` com delta e pausa automática |
| `window.close()` como "voltar" | Não faz nada dentro do iframe do AVA | Navegação por cenas; saída é evento interno |
| `<meta charset="iso-8859-1">` | Acentuação quebrada | UTF-8 em tudo |
| Nenhum `postMessage` | **Nenhuma partida é registrada no AVA** | `AvaBridge`, disparado num ponto único |

---

## 2. Princípios inegociáveis

1. **Zero dependência externa.** Nenhum CDN, nenhuma fonte remota, nenhum pacote npm em
   tempo de execução. Se a internet cair depois de a página abrir, o jogo continua inteiro.
2. **Todo jogo é autossuficiente.** `Games/<jogo>/` é publicável sozinho. Nenhum arquivo
   dele pode apontar para fora da própria pasta. Isso é verificado por script, não por
   disciplina — veja `tools/verificar-independencia.mjs`.
3. **Módulos ES puros, sem etapa de build.** O que está escrito é o que roda no navegador.
   Depurar não exige source map.
4. **Tempo é delta, nunca quadro.** Nenhuma lógica pode supor 12 FPS, 60 FPS ou intervalos
   de relógio. `dt` chega em segundos e é limitado a 0,1 s.
5. **Entrada é sempre ponteiro unificado.** Nada de `mousedown` cru. Toque e mouse
   percorrem o mesmo caminho, ou o jogo nasce quebrado em tablet.
6. **O motor não conhece regra de jogo.** Ele não sabe o que é "acertar". Quem sabe é a
   cena de partida do jogo.
7. **O jogo não conhece o AVA.** Ele entrega números ao `ScoreSystem` e vai para o estado
   `resultado`. Quem fala com o AVA é o motor, num lugar só.
8. **Design vem só dos tokens.** Cor, espaço, raio, sombra e tempo saem de
   `engine/theme/tokens.js`. Valor cru no meio de uma tela é um defeito.
9. **Acessibilidade é estrutura, não revisão final.** O tamanho mínimo de alvo é aplicado
   no construtor do `Button`; não há como criar um botão pequeno demais por descuido.
10. **Falhar alto, nunca em silêncio.** Recurso ausente, cena inexistente, transição
    estranha: tudo vira aviso no console. O único erro pior que um bug é um bug mudo.

---

## 3. Mapa do motor

```
engine/
├── core/        o que faz a tela existir e se mexer
│   ├── Emitter.js      publicador/assinante; base de quase tudo
│   ├── Matrix2D.js     transformação 2D; é o que torna o hit-test correto
│   ├── Node.js         nó do scene-graph (sucede o MovieClip do CreateJS)
│   ├── Sprite.js       nó que desenha imagem/SVG
│   ├── Shape.js        formas vetoriais (a base do visual flat)
│   ├── TextNode.js     texto com quebra, contorno e sombra
│   ├── Stage.js        canvas, escala responsiva e letterbox
│   ├── Input.js        Pointer Events → apertar/mover/soltar/toque/arrastar
│   ├── Loader.js       pré-carga de imagens e áudio, com progresso
│   ├── Storage.js      preferências locais, com namespace por jogo
│   ├── Rand.js         sorteio central, com semente opcional
│   ├── Tween.js        animação por tempo, encadeável
│   ├── Scene.js        uma tela, com ciclo de vida e limpeza automática
│   ├── Estados.js      a máquina de estados canônica
│   └── Game.js         orquestrador: laço, cenas, e a ponte com o AVA
├── theme/       o design system
│   ├── tokens.js       cor, tipo, espaço, raio, sombra, movimento, acessibilidade
│   ├── tokens.css      a casca da página (layout, iframe, carregamento)
│   └── icons.js        ícones vetoriais em caixa 24×24
├── ui/          componentes
│   ├── Panel.js  Button.js  ScoreBar.js  Lives.js
│   ├── SoundToggle.js  Mascot.js  Background.js
├── screens/     as telas padrão que todo jogo ganha
│   ├── LoadingScreen.js  MenuScreen.js  TutorialScreen.js
│   ├── LevelSelectScreen.js  PauseScreen.js  ResultScreen.js
│   └── HelpScreen.js     a ajuda na partida: o tutorial em camada (RE-05)
├── gameplay/    mecânicas reaproveitáveis
│   ├── ScoreSystem.js       placar e fonte única dos números do AVA
│   ├── GridBoard.js         grade, adjacência, combos, gravidade
│   └── CraneController.js   guindaste oscilante ou por colunas
├── audio/AudioBus.js        três canais; a fila de narração é o ponto central
├── ava/AvaBridge.js         o contrato do METODO.md
├── bootstrap.js             `iniciarJogo()` — a largada de qualquer jogo
└── index.js                 ponto ÚNICO de importação
```

**Regra de importação:** um jogo importa de `./engine/index.js` e de mais nada do motor.
Isso permite reorganizar o interior sem tocar em jogo publicado.

---

## 4. O ciclo de vida, de ponta a ponta

```
index.html
  └─ src/main.js  →  iniciarJogo({ config, cenas })
        1. aplicarTokensNoCSS()          tokens viram variáveis CSS
        2. LoadingScreen.mostrar()       HTML, aparece antes do motor existir
        3. new Game(...)                 Stage + Input + AudioBus + Loader + Storage + AvaBridge
        4. loader.carregar(config.assets)  barra de progresso acompanha
        5. audio.registrarDoLoader(...)
        6. game.irPara('menu')
        7. game.iniciar()                laço rAF começa
```

A cada quadro, o `Game` faz exatamente três coisas, nesta ordem:
`Tween.atualizarTodos(dt)` → `stage.atualizar(dt)` → `stage.renderizar()`.

Uma cena tem `preload() → aoEntrar() → atualizar(dt) → aoSair()`. Como a cena **é** um
`Node`, tudo que ela adicionou a si mesma desaparece quando ela sai, junto com os ouvintes
registrados por `ouvirEntrada()` e `aoDesmontar()`. É o que elimina a limpeza manual em
array que os jogos originais faziam — e às vezes esqueciam.

---

## 5. O contrato com o AVA, em uma frase

> A cena de partida chama `irPara('resultado', { resultado: placar.paraAva(venceu) })`.
> O resto é do motor.

O `Game` detecta a **entrada** no estado `resultado` e chama `AvaBridge.concluir()` uma
única vez; ao **sair** desse estado, chama `rearmar()`. Isso implementa a borda de subida e
descida do METODO.md (B3.5): uma partida levada ao fim registra uma vez, um replay genuíno
registra de novo, e ficar parado na tela de resultado nunca duplica.

Detalhes e checklist completo: [`CONTRATO-AVA.md`](CONTRATO-AVA.md).

---

## 6. Versionamento e propagação

- A versão vive em `engine/version.json`.
- `node tools/build.mjs [slug]` copia `engine/` para `Games/<slug>/engine/` e escreve o
  carimbo `MOTOR-COPIA.txt`.
- A cópia dentro do jogo **nunca** é editada. Se for, a próxima build apaga a alteração —
  de propósito.
- **Esquecer a build é erro detectado, não esperança.** `verificar-independencia.mjs`
  compara a cópia com `engine/` da raiz arquivo por arquivo, por hash, e reprova se
  divergirem em qualquer direção: arquivo diferente, arquivo faltando, ou arquivo sobrando
  de uma versão anterior do motor.
- Para saber qual motor um jogo publicado leva, leia o `version.json` de dentro dele.

Ao mexer no motor: rode `node tools/testes.mjs`, depois `node tools/build.mjs` (todos os
jogos), depois `node tools/teste-navegador.mjs` para o piloto, e por fim
`node tools/verificar-independencia.mjs` — é ele que reprova a cópia esquecida. Só então
publique.

---

## 7. O que o motor deliberadamente NÃO faz

Saber os limites vale tanto quanto saber os recursos.

- **Não tem física.** Colisão e queda são tween + comparação de coordenada. Jogos que
  precisem de física de verdade pedem outra ferramenta.
- **Não tem rede.** Nenhum jogo salva no servidor. O único canal para fora é o
  `postMessage` do contrato.
- **Não tem multiplayer, nem save em nuvem, nem conta de usuário.** Aluno é assunto do AVA.
- **Não renderiza WebGL.** É Canvas 2D. Para a arte plana destes jogos, sobra desempenho.
- **Não faz internacionalização.** Os jogos são em português. Traduzir exigiria extrair
  textos e narração — trabalho real, não uma opção de configuração.
- **Não trava a orientação da tela.** Não por escolha: `screen.orientation.lock()` exige
  tela cheia, e tela cheia dentro do `<iframe>` do AVA depende de o pai conceder
  `allow="fullscreen"` — que o jogo não controla. Em iOS a API não existe. O motor faz o
  que está ao seu alcance: em aparelho de pé, **gira o conteúdo** um quarto de volta
  (`tokens.css` + `Stage`), o que também cobre o tablet com a rotação bloqueada pelo
  sistema, onde virar o aparelho não faz nada.
