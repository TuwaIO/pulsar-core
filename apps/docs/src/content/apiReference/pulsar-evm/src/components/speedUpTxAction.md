[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# speedUpTxAction()

> **speedUpTxAction**\<`TR`, `T`\>(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/pulsar-evm/src/utils/speedUpTxAction.ts:49](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-evm/src/utils/speedUpTxAction.ts#L49)

Speeds up a pending EVM transaction by resubmitting it with the same nonce but higher gas fees.
This function is designed to work with wagmi's configuration and actions.

## Type Parameters

### TR

`TR`

The type of the tracker identifier.

### T

`T` *extends* `Transaction`\<`TR`\>

The transaction type, which must be a valid EVM transaction.

## Parameters

### params

The parameters required to speed up the transaction.

#### config

`Config`

The wagmi configuration object.

#### tx

`T`

The original transaction object that needs to be sped up. It must contain all necessary EVM fields.

## Returns

`Promise`\<`` `0x${string}` ``\>

A promise that resolves with the hash of the new, speed-up transaction.

## Throws

Throws an error if:
- The transaction is not an EVM transaction.
- The transaction is missing required fields (`nonce`, `from`, `to`, `value`, `maxFeePerGas`, etc.).
- The wagmi config is not provided.
- No connected account is found.
- The `sendTransaction` call fails for any reason.

## Example

```ts
const handleSpeedUp = async (stuckTransaction) => {
try {
const newTxHash = await speedUpTxAction({
config: wagmiConfig,
tx: stuckTransaction,
});
console.log('Transaction sped up with new hash:', newTxHash);
// You should now update your state to track this new transaction hash.
} catch (error) {
console.error('Failed to speed up transaction:', error);
}
};
```
