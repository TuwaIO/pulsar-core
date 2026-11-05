# NonceSlotScan

> **NonceSlotScan** = `object`

Defined in: [utils/readNonceSlot.ts:58](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L58)

How far [readNonceSlot](/packages/pulsar-evm/functions/readNonceSlot.md) has read block bodies. Pass the same object to every reading of one transaction: each
goes on where the last one stopped, so a node that limits requests still gets it to the end, and a block is read once.

## Properties

### newest?

> `optional` **newest?**: `bigint`

Defined in: [utils/readNonceSlot.ts:60](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L60)

The newest block read.

***

### oldest?

> `optional` **oldest?**: `bigint`

Defined in: [utils/readNonceSlot.ts:62](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L62)

The oldest block read.
