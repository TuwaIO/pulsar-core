[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ~~OnSuccessCallback\<T\>~~

> **OnSuccessCallback**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:241](https://github.com/TuwaIO/pulsar-core/blob/f0f5d6f91c3be58651d790d4784e75c2d93f0376/packages/pulsar-core/src/types.ts#L241)

## Deprecated

Use `TrackerCallbacks<T>` instead.
Defines a callback function to be executed upon a successful transaction.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The specific transaction type, extending `Transaction`.

## Properties

### ~~onSuccessCallback()?~~

> `optional` **onSuccessCallback**: (`tx`) => `Promise`\<`void`\> \| `void`

Defined in: [packages/pulsar-core/src/types.ts:243](https://github.com/TuwaIO/pulsar-core/blob/f0f5d6f91c3be58651d790d4784e75c2d93f0376/packages/pulsar-core/src/types.ts#L243)

Callback to execute when the transaction is successfully submitted.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`void`\> \| `void`
