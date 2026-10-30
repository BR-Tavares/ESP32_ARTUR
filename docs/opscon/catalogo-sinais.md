# Catálogo de Sinais

Registro dos sinais que circulam entre os cards da transmissão. Em vez de um card apontar para outro, cada sinal lista quem o emite e quem o consome. Atualize-o sempre que um card ganhar ou perder uma publicação ou um sinal consumido.

| Sinal | Tipo | Emissor | Consumidores | Payload essencial |
| :--- | :--- | :--- | :--- | :--- |
| `BEACON` | 📢 fato | `2.0` | `1.0` | `canal`, id da ponte |
| `LEITURA` | 📢 fato | `1.0` | `2.0` | `no`, `sessao`, `seq`, `grandeza`, `valor`, `ts_medicao`, `descartes_no`, `acordado_ms_ant`, `intervalo_s`, `config_id` |
| `RESPOSTA` | ⚡ comando | `2.0` | `1.0` | `sessao`, `seq`, `aceita`, `hora` |
| `CONFIG` | ⚡ comando | `2.0` | `1.0` | `no`, `config_id`, `intervalo_s` |
| `CONFIG_APLICADA` | 📢 fato | `1.0` | `2.0` | `no`, `config_id`, `intervalo_s`, `ok` |
| `EVENTO_ENFILEIRADO` | 📢 fato | `2.0` | `2.1` | pacote, `t_rx`, RSSI, MAC do nó |
| `EVENTO_DESCARTADO` | ⚠️ alerta | `2.0` | operador (pelo contador `descartes` em todo lote) | `descartes` |
| `PACOTE_INVALIDO` | ⚠️ alerta | `2.0` | operador (pelo contador `invalidos` em todo lote) | `invalidos` |
| `GRAVAR_LOTE` | ⚡ comando | `2.1` | `3.0` | até 10 eventos, estado da ponte (`boot`, `fila`, `descartes`, `invalidos`) |
| `LOTE_ACEITO` | 📢 fato | `3.0` | `2.1` | `ok`, configurações pendentes, `agora` |
| `LOTE_RECUSADO` | 📢 fato | `3.0`, ou o próprio transporte em `2.1` (timeout, sem Wi-Fi) | `2.1` | código ou motivo |
| `CONFIGS_MQTT` | 📢 fato | `3.0` (mensagem retida no MQTT) | `2.1` | lista (`no`, `config_id`, `intervalo_s`), `agora` |
| `CONFIGS_PENDENTES` | 📢 fato | `2.1` | `2.0` | lista (`no`, `config_id`, `intervalo_s`) |
| `HORA_SERVIDOR` | 📢 fato | `2.1` | `2.0` | `agora` (hora do notebook) |
| `NOVA_CONFIG` | ⚡ comando | operador | `3.0` | `no`, `intervalo_s` |
| `CONFIG_CONFIRMADA` | 📢 fato | `3.0` | operador, métricas | `no`, `config_id`, tempo até confirmar |
| `CONFIG_REJEITADA` | ⚠️ alerta | `3.0` | operador | motivo (intervalo inválido na criação, ou recusa do nó) |
| `LOTE_INVALIDO` | ⚠️ alerta | `3.0` | operador | id do lote, erro |

Sinais de entrada sem emissor em card (gerados pelo próprio hardware ou relógio): `DESPERTAR`, `ENVIO_CONFIRMADO`, `ENVIO_FALHOU`, `VARREDURA_ESGOTADA`, `RESPOSTA_ESGOTADA`, `JANELA_ENCERRADA` (nó, `1.0`); `TEMPO_BEACON` (ponte, `2.0`); `ESPERA_ENCERRADA` (despacho, `2.1`).
