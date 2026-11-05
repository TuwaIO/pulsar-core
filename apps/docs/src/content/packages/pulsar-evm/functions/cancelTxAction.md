# cancelTxAction()

> **cancelTxAction**\<`T`\>(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [utils/cancelTxAction.ts:38](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/cancelTxAction.ts#L38)

Cancels a pending EVM transaction: asks the connected wallet to send a zero-value transaction to its own address with
the same nonce and both EIP-1559 fees 15% above the fees last sent for this nonce, and at least at the market estimate,
since a cancellation stuck below the base fee cancels nothing. When it is mined, the tracker of the original
transaction reports it as `Replaced` with `replacedReason: 'cancelled'`; the cancellation transaction itself is not
added to the pool.

Side effects: reads the fees of the chain over RPC, opens a wallet prompt, broadcasts a transaction, and keeps the fees
sent for the next replacement of this nonce, in memory and in `sessionStorage` under
`pulsar-evm:replacementFees:<chain>:<sender>:<nonce>`.

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
`Error('Failed to cancel transaction: …')` (with the original error as `cause`) when no account is connected, the
connected account did not send the transaction, or the wallet rejects or fails to send the transaction.

## Example

```ts
const hash = await cancelTxAction({ config: wagmiConfig, tx: pendingTx });
```
