# NonceSlotScan

> **NonceSlotScan** = `object`

Defined in: [utils/readNonceSlot.ts:70](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L70)

How far [readNonceSlot](/packages/pulsar-evm/functions/readNonceSlot.md) has searched. Pass the same object to every reading of one transaction: each goes on where the last
one stopped, so a node that limits requests still gets it to the end, and a block is read once.

## Properties

### edge?

> `optional` **edge?**: `bigint`

Defined in: [utils/readNonceSlot.ts:78](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L78)

The oldest block the node could answer a count for, with the nonce already spent there.

***

### logsRead?

> `optional` **logsRead?**: `boolean`

Defined in: [utils/readNonceSlot.ts:80](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L80)

Whether the logs were read, which is done once.

***

### noDirectLookup?

> `optional` **noDirectLookup?**: `boolean`

Defined in: [utils/readNonceSlot.ts:82](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L82)

Whether the node has no `eth_getTransactionBySenderAndNonce`.

***

### oldest?

> `optional` **oldest?**: `bigint`

Defined in: [utils/readNonceSlot.ts:72](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L72)

The oldest block read one by one.

***

### spenderUnreadable?

> `optional` **spenderUnreadable?**: `boolean`

Defined in: [utils/readNonceSlot.ts:84](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L84)

The block that spent the nonce holds no transaction of the sender: an EIP-7702 authorization in someone else's.

***

### spentIn?

> `optional` **spentIn?**: `bigint`

Defined in: [utils/readNonceSlot.ts:76](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L76)

The block whose count shows the nonce spent, when the node has its state: the only block that needs reading.

***

### walked?

> `optional` **walked?**: `number`

Defined in: [utils/readNonceSlot.ts:74](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L74)

How many blocks were read one by one, up to `maxBlocks`.
