# NonceSlotReading

> **NonceSlotReading** = \{ `state`: `"open"`; \} \| \{ `state`: `"spender_found"`; `transaction`: `GetTransactionReturnType`; \} \| \{ `receipt?`: `TransactionReceipt`; `state`: `"ours"`; \} \| \{ `replacement`: `ReplacementReturnType`; `state`: `"replaced"`; \} \| \{ `state`: `"spent"`; \}

Defined in: [utils/readNonceSlot.ts:56](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L56)

What [readNonceSlot](/packages/pulsar-evm/functions/readNonceSlot.md) found:
- `open`: the nonce is free, so the transaction can still land.
- `spender_found`: another transaction spent the nonce and its receipt is not readable yet, which on a load-balanced RPC says
  nothing: it was mined, in a block one node has. The tracked transaction will not land unless a reorganization brings it
  back, so this is no free nonce. Ask again: with its receipt it is `replaced`.
- `ours`: the transaction itself spent the nonce. `receipt` is its receipt, when the node has it already.
- `replaced`: another transaction spent it, with the same data as viem's `onReplaced` gives.
- `spent`: the nonce is spent, so the transaction can never land, and no transaction of this sender could be found for
  it: an EIP-7702 authorization in someone else's transaction, a replacement further back than the scan reached, or a
  node behind its load balancer. Read it again before believing it.
