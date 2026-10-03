# BeforeTxProcess

> **BeforeTxProcess** = () => `Promise`\<`void`\> \| `void`

Defined in: [types.ts:347](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L347)

Preflight callback run by `executeTxAction` after metadata validation and the chain check (which can ask the wallet
to switch networks), before `actionFunction` asks the wallet to sign. It receives no transaction data.

Throw to block the transaction: with `abortOnTxError` (default `true`), `initialTx.error` is set and
`executeTxAction` rejects with the thrown error. With `abortOnTxError: false`, the error is logged and the flow
continues.

## Returns

`Promise`\<`void`\> \| `void`
