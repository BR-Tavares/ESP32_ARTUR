# Decisões

Registro das decisões de projeto. Cada uma diz o contexto, o que foi decidido e o que muda por causa dela. Uma decisão só muda
por outra decisão registrada aqui.

## D-001 — Leituras não entregues ficam guardadas no nó (store-and-forward)

**Data:** 2026-10-30 · **Decidido por:** gestor do projeto · **Afeta:** card `1.0`, fluxograma de ida, contrato IF-01 (`LEITURA`)

**Contexto.** Na proposta anterior, quando o nó não conseguia entregar uma leitura (ponte desligada, Wi-Fi caído, troca de canal),
ele voltava a dormir e a leitura se perdia. A perda ficava visível no servidor como lacuna na sequência, mas o dado não voltava.

**Decisão.**
- **Na prova de conceito:** o nó guarda as leituras não entregues num buffer em anel na **memória RTC**, com até 64 leituras
  (cerca de 1 hora com intervalo de 60 s). No ciclo seguinte em que achar a ponte, envia primeiro as pendentes, da mais antiga para
  a mais nova, até 10 por ciclo. Com o buffer cheio, descarta a mais antiga e conta o descarte (`descartes_no`).
- **Na próxima versão:** o buffer passa para a **flash, com LittleFS**, para sobreviver à falta de energia e guardar dias de
  leituras. Fica como requisito do sistema de campo a bateria.

**Consequências.**
- A `LEITURA` ganha `descartes_no`, para que a perda por buffer cheio continue visível.
- Uma leitura só sai do buffer quando a ponte responde que a aceitou (ver `D-002`).
- Limite aceito na prova: falta de energia no nó apaga o buffer na memória RTC. Resolvido pela versão com LittleFS.

## D-002 — A ponte responde a cada leitura com a hora; o nó carimba a medição

**Data:** 2026-10-30 · **Decidido por:** gestor do projeto · **Afeta:** cards `1.0`, `2.0`, `2.1`, `3.0`, contratos IF-01 e IF-02

**Contexto.** Com o store-and-forward (`D-001`), uma leitura pode chegar ao servidor horas depois de medida, e a hora de chegada
deixa de servir como hora da medição. O nó não tem relógio de referência.

**Decisão.**
- A cada `LEITURA`, a ponte devolve ao nó um pacote `RESPOSTA` com a leitura respondida (`sessao`, `seq`), se a aceitou na fila
  e a hora atual. A `RESPOSTA` aceita é o que tira a leitura do buffer do nó; ela substitui a confirmação só do rádio.
- O nó acerta o relógio a cada `RESPOSTA` e carimba cada leitura com `ts_medicao` no momento da medição.
- A hora de referência vem do **notebook (servidor)**: ele manda a hora atual em cada resposta de lote, e a ponte acerta o relógio
  por ela. **Pendente de confirmação pelo gestor.**

**Consequências.**
- Novo pacote `MSG_RESPOSTA` no IF-01; a `LEITURA` ganha `ts_medicao`; a resposta de lote do IF-02 ganha `agora`.
- Leituras feitas depois de ligar, antes do primeiro acerto, saem com `ts_medicao = 0`; o servidor usa a hora de chegada e as marca
  como hora estimada.
- Uma fila cheia na ponte já não perde leitura: a ponte responde "recusada" e a leitura fica no buffer do nó.
- Limite aceito: o relógio do ESP32 desvia durante o deep sleep. Com a ponte respondendo, ele é acertado a cada ciclo; o desvio só
  se acumula nas leituras feitas durante uma queda. Um cristal de 32 kHz na placa reduz o desvio, se for necessário.
