# NonceSlotScan

> **NonceSlotScan** = `object`

Defined in: [utils/readNonceSlot.ts:67](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L67)

How far [readNonceSlot](/packages/pulsar-evm/functions/readNonceSlot.md) has read block bodies. Pass the same object to every reading of one transaction: each
goes on where the last one stopped, so a node that limits requests still gets it to the end, and a block is read once.

## Properties

### highest?

> `optional` **highest?**: `bigint`

Defined in: [utils/readNonceSlot.ts:73](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L73)

The newest block it reads, fixed by the first reading of a spent nonce.

***

### newest?

> `optional` **newest?**: `bigint`

Defined in: [utils/readNonceSlot.ts:69](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L69)

The newest block read.

***

### oldest?

> `optional` **oldest?**: `bigint`

Defined in: [utils/readNonceSlot.ts:71](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L71)

The oldest block read.
