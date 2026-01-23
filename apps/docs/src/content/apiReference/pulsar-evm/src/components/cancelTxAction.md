[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# cancelTxAction()

> **cancelTxAction**\<`T`\>(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/pulsar-evm/src/utils/cancelTxAction.ts:49](https://github.com/TuwaIO/pulsar-core/blob/b90238926d902fe8ff6f2fc7ccda63c1dd3ac942/packages/pulsar-evm/src/utils/cancelTxAction.ts#L49)

Cancels a pending EVM transaction by sending a new, zero-value transaction to oneself
with the same nonce but higher gas fees. This effectively replaces the original transaction.

## Type Parameters

### T

`T` *extends* `Transaction`

The transaction type, which must be a valid EVM transaction.

## Parameters

### params

The parameters required to cancel the transaction.

#### config

`Config`

The wagmi configuration object.

#### tx

`T`

The original transaction object to be canceled. It must contain the nonce and gas fee fields.

## Returns

`Promise`\<`` `0x${string}` ``\>

A promise that resolves with the hash of the new cancellation transaction.

## Throws

Throws an error if:
- The transaction is not an EVM transaction.
- The transaction is missing required fields (`nonce`, `maxFeePerGas`, etc.).
- The wagmi config is not provided.
- No connected account is found.
- The `sendTransaction` call fails.

## Example

```ts
const handleCancel = async (stuckTransaction) => {
try {
const cancelTxHash = await cancelTxAction({
config: wagmiConfig,
tx: stuckTransaction,
});
console.log('Cancellation transaction sent with hash:', cancelTxHash);
// You should now update your state to track this new transaction.
} catch (error) {
console.error('Failed to cancel transaction:', error);
}
};
```
