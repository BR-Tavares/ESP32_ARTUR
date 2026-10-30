# Sítio Online — prova de conceito de transmissão

Sistema novo para medir a cadeia **nó ESP32 → ESP-NOW → ponte ESP32 → Wi-Fi → servidor no notebook**. É uma especificação
própria, que reaproveita partes do protótipo anterior (`AFilleul/MeuProjetoESP32`, branch `com-mini-pc`, commit `3bde339`)
como componentes, com a origem de cada parte declarada.

**Estado:** proposta. Ainda não há firmware nem servidor neste repositório; só a definição da transmissão.

## O que tem aqui

| Arquivo | Para que serve |
|---|---|
| [`docs/index.html`](docs/index.html) | Fluxogramas da transmissão (ida de uma leitura e volta de uma configuração), com cada bloco marcado como importado, adaptado ou novo. Abra no navegador; funciona sem internet. |
| [`docs/opscon/`](docs/opscon/) | Cards OpsCon: o comportamento de cada máquina (nó, ponte, servidor) em estados, eventos e sinais, e o catálogo de sinais. |
| [`docs/decisoes.md`](docs/decisoes.md) | Decisões de projeto que mudaram o desenho (D-001, D-002). |
| `docs/data/sistema.json` | Fonte única dos fluxogramas. Depois de editar, rode `node tools/gen_sistema_js.mjs` (Node 18+), que valida e gera `sistema.js`. |
