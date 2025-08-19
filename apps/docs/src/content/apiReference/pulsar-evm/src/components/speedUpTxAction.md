[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# speedUpTxAction()

> **speedUpTxAction**\<`TR`, `T`\>(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/pulsar-evm/src/utils/speedUpTxAction.ts:35](https://github.com/TuwaIO/pulsar-core/blob/8e3b09e31968f4ec01c4c0951617f2dc09a588af/packages/pulsar-evm/src/utils/speedUpTxAction.ts#L35)

Speeds up a pending transaction by resubmitting it with the same nonce but higher gas fees.
This is a common strategy to prevent a transaction from getting stuck.

## Type Parameters

### TR

`TR`

### T

`T` *extends* `Transaction`\<`TR`\>

## Parameters

### params

The parameters required to speed up the transaction.

#### config

`Config`

The wagmi configuration object.

#### tx

`T`

The original transaction object that needs to be sped up.

## Returns

`Promise`\<`` `0x${string}` ``\>

A promise that resolves with the hash of the new, speed-up transaction.

## Throws

Throws an error if the wagmi config is not provided, the account is not found,
or if the transaction is missing required fields (`nonce`, `maxFeePerGas`, etc.).

## Example

```ts
import { speedUpTxAction } from './speedUpTxAction';

const handleSpeedUp = async () => {
try {
const newTxHash = await speedUpTxAction({
config: wagmiConfig,
tx: stuckTransaction,
});
console.log('Transaction sped up with new hash:', newTxHash);
} catch (error) {
console.error('Failed to speed up transaction:', error);
}
};
```
