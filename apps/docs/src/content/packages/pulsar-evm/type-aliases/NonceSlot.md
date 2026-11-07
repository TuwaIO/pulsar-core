# NonceSlot

> **NonceSlot** = `object`

Defined in: [utils/readNonceSlot.ts:34](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L34)

The sender and nonce of a transaction, and the fields it was sent with, which tell a speed-up from another
transaction.

## Properties

### from

> **from**: `Address`

Defined in: [utils/readNonceSlot.ts:36](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L36)

The sender as the chain knows it: for a relayed transaction the relayer, not the wallet.

***

### input?

> `optional` **input?**: `Hex`

Defined in: [utils/readNonceSlot.ts:44](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L44)

The calldata.

***

### nonce

> **nonce**: `number`

Defined in: [utils/readNonceSlot.ts:38](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L38)

The nonce of the transaction.

***

### to?

> `optional` **to?**: `Address` \| `null`

Defined in: [utils/readNonceSlot.ts:40](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L40)

The recipient. Without `to`, `value` and `input` a replacement is never reported as `repriced`.

***

### value?

> `optional` **value?**: `bigint`

Defined in: [utils/readNonceSlot.ts:42](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L42)

The value, in wei.
