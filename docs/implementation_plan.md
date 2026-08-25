# Plano de Implementação — Build Offline (Execução por Duplo-Clique sem Servidor)

Criar uma ferramenta de build offline e a estrutura de exportação `dist/` para permitir que jogos do Motor Educandus sejam executados diretamente abrindo o arquivo `index.html` (protocolo `file://`) por duplo-clique no computador, sem necessidade de servidores Web (Node.js, Live Server ou Nginx).

## 1. Visão Geral da Solução

Atualmente, o motor utiliza Módulos ES (`import`/`export`) e `fetch()` para carregar binários de áudio e imagens, os quais são bloqueados pelos navegadores sob a regra de segurança CORS quando acessados via `file://`.

Para resolver isso de forma transparente e elegante:
1. Manteremos a pasta **`Games/`** para o modo Servidor Web / AVA / GitHub Pages (como está hoje).
2. Criaremos um script **`tools/bundle-offline.mjs [slug]`** que gera uma versão independente na pasta **`dist/<slug>/`**.
3. O script empacota todos os Módulos ES em um arquivo JavaScript único (bundle tradicional sem `import`) e ajusta o `Loader` para decodificar Data URIs (Base64) de áudios e imagens sem depender de `fetch()` restrito via `file://`.

---

## 2. Mudanças Propostas

### Ferramenta e Motor

#### [NEW] [bundle-offline.mjs](file:///c:/Users/ricoa/OneDrive/Desktop/motorGame/tools/bundle-offline.mjs)
* Script em Node.js que processa um jogo de `Games/<slug>/`:
  * Transpila/empacota os Módulos ES da `engine/` e da pasta `src/` em um único arquivo de script autônomo (ex: `dist/<slug>/bundle.js`).
  * Converte os arquivos de áudio (.mp3) e imagens em Data URIs (Base64) ou embutidos no pacote para compatibilidade total com `file://`.
  * Copia o `index.html` adaptado para carregar o `bundle.js` simples em vez do `<script type="module">`.

#### [MODIFY] [Loader.js](file:///c:/Users/ricoa/OneDrive/Desktop/motorGame/engine/core/Loader.js)
* Adicionar suporte ao decodificador de Data URIs (Base64 -> ArrayBuffer) em `carregarBinario(src)`. Se o caminho for uma Data URI (`data:audio/mp3;base64,...`) ou se a página estiver em protocolo `file://`, converter a string Base64 em `ArrayBuffer` usando `atob()` e typed arrays sem disparar a restrição de rede do `fetch()`.

#### [NEW] [dist/](file:///c:/Users/ricoa/OneDrive/Desktop/motorGame/dist/)
* Pasta raiz onde as builds offline prontas para duplo-clique serão geradas (ex: `dist/jogo-dos-blocos/index.html`).

---

## 3. Plano de Verificação

### Testes Automáticos
- `node tools/testes.mjs`: Confirmar que todos os 55 testes de lógica continuam passando sem regressões.
- `node tools/bundle-offline.mjs jogo-dos-blocos`: Testar a geração da build em `dist/jogo-dos-blocos/`.

### Validação Manual
- Abrir o arquivo `dist/jogo-dos-blocos/index.html` diretamente via navegador (duplo-clique / protocolo `file://`) sem nenhum servidor ativo no sistema.
- Confirmar que:
  1. A tela de carregamento conclui e o menu abre normalmente.
  2. Todos os áudios e imagens são reproduzidos corretamente.
  3. A gameplay funciona em tela cheia e responsiva sem erros no console.
