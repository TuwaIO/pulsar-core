# NonceSlot

> **NonceSlot** = `object`

Defined in: [utils/readNonceSlot.ts:24](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L24)

The sender and nonce of a transaction, and the fields it was sent with, which tell a speed-up from another
transaction.

## Properties

### from

> **from**: `Address`

Defined in: [utils/readNonceSlot.ts:26](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L26)

The sender as the chain knows it: for a relayed transaction the relayer, not the wallet.

***

### input?

> `optional` **input?**: `Hex`

Defined in: [utils/readNonceSlot.ts:34](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L34)

The calldata.

***

### nonce

> **nonce**: `number`

Defined in: [utils/readNonceSlot.ts:28](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L28)

The nonce of the transaction.

***

### to?

> `optional` **to?**: `Address` \| `null`

Defined in: [utils/readNonceSlot.ts:30](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L30)

The recipient. Without `to`, `value` and `input` a replacement is never reported as `repriced`.

***

### value?

> `optional` **value?**: `bigint`

Defined in: [utils/readNonceSlot.ts:32](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L32)

The value, in wei.
