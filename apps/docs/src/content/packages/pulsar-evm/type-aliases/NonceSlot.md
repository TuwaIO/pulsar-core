# NonceSlot

> **NonceSlot** = `object`

Defined in: [utils/readNonceSlot.ts:31](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L31)

The sender and nonce of a transaction, and the fields it was sent with, which tell a speed-up from another
transaction.

## Properties

### from

> **from**: `Address`

Defined in: [utils/readNonceSlot.ts:33](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L33)

The sender as the chain knows it: for a relayed transaction the relayer, not the wallet.

***

### input?

> `optional` **input?**: `Hex`

Defined in: [utils/readNonceSlot.ts:41](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L41)

The calldata.

***

### nonce

> **nonce**: `number`

Defined in: [utils/readNonceSlot.ts:35](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L35)

The nonce of the transaction.

***

### to?

> `optional` **to?**: `Address` \| `null`

Defined in: [utils/readNonceSlot.ts:37](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L37)

The recipient. Without `to`, `value` and `input` a replacement is never reported as `repriced`.

***

### value?

> `optional` **value?**: `bigint`

Defined in: [utils/readNonceSlot.ts:39](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L39)

The value, in wei.
