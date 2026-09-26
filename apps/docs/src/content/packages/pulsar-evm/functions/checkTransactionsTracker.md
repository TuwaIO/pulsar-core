# checkTransactionsTracker()

> **checkTransactionsTracker**(`params`): `object`

Defined in: [utils/checkTransactionsTracker.ts:33](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/checkTransactionsTracker.ts#L33)

Picks the tracker for the key returned by an `actionFunction`. The key is always used as `txKey`. Rules, in order:
1. `tracker` is `Gelato` and `gelatoApiKey` is set: `Gelato` (the key is a task ID).
2. The key must be a hex string; otherwise it throws.
3. `tracker` is `ERC4337`: `ERC4337` (the key is a `userOpHash`). ERC-4337 is never detected automatically.
4. The connector type ends with `safe` or `safewallet` (for example `evm:safe`): `Safe` (the key is a `safeTxHash`).
5. Otherwise: `Ethereum`.

`bundlerUrl` and `pimlicoApiKey` are not used here. `pulsarEvmAdapter` uses this function as
`checkTransactionsTracker`.

## Parameters

### params

[`CheckTxTracker`](/packages/pulsar-core/type-aliases/CheckTxTracker.md)

The returned key and its context (`CheckTxTracker` from `@tuwaio/pulsar-core`).

## Returns

The tracker and the `txKey`.

### tracker

> **tracker**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

The tracker to use.

### txKey

> **txKey**: `string`

The key to store the transaction under: always `actionTxKey`.

## Throws

`Error` when the key is not a hex string and the Gelato rule does not apply.

## Example

```ts
checkTransactionsTracker({ actionTxKey: '0xabc123', connectorType: 'evm:metamask' });
// { tracker: TransactionTracker.Ethereum, txKey: '0xabc123' }
```
