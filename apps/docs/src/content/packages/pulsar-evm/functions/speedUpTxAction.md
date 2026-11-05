# speedUpTxAction()

> **speedUpTxAction**\<`T`\>(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [utils/speedUpTxAction.ts:38](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/speedUpTxAction.ts#L38)

Speeds up a pending EVM transaction: asks the connected wallet to resend it (same `to`, `value`, `input` and nonce)
with both EIP-1559 fees 15% above the fees last sent for this nonce, and at least at the market estimate, since a
transaction stuck below the base fee stays stuck with 15% more. When it is mined, the tracker of the original
transaction reports it as `Replaced` with `replacedReason: 'repriced'`; the new transaction itself is not added to the
pool.

Side effects: reads the fees of the chain over RPC, opens a wallet prompt, broadcasts a transaction, and keeps the fees
sent in memory for the next replacement of this nonce.

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

The pending transaction. It must be an EVM transaction with `nonce`, `from`, `to`, `value`,
`maxFeePerGas` and `maxPriorityFeePerGas` (set by the EVM tracker once the transaction details are fetched).

## Returns

`Promise`\<`` `0x${string}` ``\>

The hash of the replacement transaction.

## Throws

`Error` when the transaction is not an EVM transaction or lacks the required fields, and
`Error('Failed to speed up transaction: …')` (with the original error as `cause`) when no account is connected, the
connected account did not send the transaction (from another account the same transfer would be sent a second time),
or the wallet rejects or fails to send the transaction.

## Example

```ts
const hash = await speedUpTxAction({ config: wagmiConfig, tx: pendingTx });
```
