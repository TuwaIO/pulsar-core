[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# cancelTxAction()

> **cancelTxAction**\<`T`\>(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/pulsar-evm/src/utils/cancelTxAction.ts:34](https://github.com/TuwaIO/pulsar-core/blob/b0a80b70bc22baf2c706d161bdc4a093678b2647/packages/pulsar-evm/src/utils/cancelTxAction.ts#L34)

Cancels a pending transaction by sending a new, zero-value transaction to oneself
with the same nonce but a higher gas price.

## Type Parameters

### T

`T` *extends* `Transaction`\<`any`\>

## Parameters

### params

The parameters for the cancellation.

#### config

`Config`

The wagmi configuration object.

#### tx

`T`

The transaction object to be canceled. Must contain nonce, gas fees, etc.

## Returns

`Promise`\<`` `0x${string}` ``\>

A promise that resolves with the hash of the new cancellation transaction.

## Throws

Throws an error if the transaction is missing required fields or if sending fails.

## Example

```ts
import { cancelTxAction } from './cancelTxAction';

const handleCancel = async () => {
try {
const cancelTxHash = await cancelTxAction({
config: wagmiConfig,
tx: stuckTransaction,
});
console.log('Cancellation transaction sent:', cancelTxHash);
} catch (error) {
console.error('Failed to cancel transaction:', error);
}
};
```
