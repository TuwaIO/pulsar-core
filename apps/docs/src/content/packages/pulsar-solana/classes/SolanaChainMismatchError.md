# SolanaChainMismatchError

Defined in: [errors.ts:9](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/errors.ts#L9)

Thrown by [checkSolanaChain](/packages/pulsar-solana/functions/checkSolanaChain.md) (and so by `executeTxAction` through the Solana adapter) when the wallet is
connected to another cluster than the transaction requires. Catch it to ask the user to switch networks.

## Extends

- `Error`

## Constructors

### Constructor

> **new SolanaChainMismatchError**(`requiredChain`, `currentChain`): `SolanaChainMismatchError`

Defined in: [errors.ts:21](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/errors.ts#L21)

#### Parameters

##### requiredChain

`string`

The cluster the transaction requires.

##### currentChain

`string`

The cluster the wallet is connected to.

#### Returns

`SolanaChainMismatchError`

#### Overrides

`Error.constructor`

## Properties

### currentChain

> **currentChain**: `string`

Defined in: [errors.ts:15](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/errors.ts#L15)

The cluster the wallet is connected to.

***

### name

> **name**: `string` = `'SolanaChainMismatchError'`

Defined in: [errors.ts:11](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/errors.ts#L11)

Always `'SolanaChainMismatchError'`.

#### Overrides

`Error.name`

***

### requiredChain

> **requiredChain**: `string`

Defined in: [errors.ts:13](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/errors.ts#L13)

The cluster the transaction requires, for example `devnet`.
