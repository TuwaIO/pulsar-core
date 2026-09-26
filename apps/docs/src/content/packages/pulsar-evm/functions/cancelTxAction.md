# cancelTxAction()

> **cancelTxAction**\<`T`\>(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [utils/cancelTxAction.ts:36](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/cancelTxAction.ts#L36)

Cancels a pending EVM transaction: asks the connected wallet to send a zero-value transaction to its own address with
the same nonce and both EIP-1559 fees raised by 15%. When it is mined, the tracker of the original transaction
reports it as `Replaced`; the cancellation transaction itself is not added to the pool.

Side effects: opens a wallet prompt and broadcasts a transaction.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

The wagmi config and the transaction.

#### config

`Config`

The wagmi config of the app.

#### tx

`T`

The pending transaction. It must be an EVM transaction with `nonce`, `maxFeePerGas` and
`maxPriorityFeePerGas` (set by the EVM tracker once the transaction details are fetched).

## Returns

`Promise`\<`` `0x${string}` ``\>

The hash of the cancellation transaction.

## Throws

`Error` when the transaction is not an EVM transaction or lacks the nonce and fee fields, and
`Error('Failed to cancel transaction: …')` (with the original error as `cause`) when no account is connected or the
wallet rejects or fails to send the transaction.

## Example

```ts
const hash = await cancelTxAction({ config: wagmiConfig, tx: pendingTx });
```
