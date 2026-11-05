# NonceSlotReading

> **NonceSlotReading** = \{ `state`: `"open"`; \} \| \{ `receipt?`: `TransactionReceipt`; `state`: `"ours"`; \} \| \{ `replacement`: `ReplacementReturnType`; `state`: `"replaced"`; \} \| \{ `state`: `"spent"`; \}

Defined in: [utils/readNonceSlot.ts:48](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L48)

What [readNonceSlot](/packages/pulsar-evm/functions/readNonceSlot.md) found:
- `open`: no final answer, ask again. The nonce is free, so the transaction can still land, or the transaction that
  spent it has no readable receipt yet.
- `ours`: the transaction itself spent the nonce. `receipt` is its receipt, when the node has it already.
- `replaced`: another transaction spent it, with the same data as viem's `onReplaced` gives.
- `spent`: the nonce is spent, so the transaction can never land, and no transaction of this sender could be found for
  it: an EIP-7702 authorization in someone else's transaction, a replacement further back than the scan reached, or a
  node behind its load balancer. Read it again before believing it.
