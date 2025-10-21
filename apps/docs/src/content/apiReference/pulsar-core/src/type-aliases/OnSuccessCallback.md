[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# OnSuccessCallback\<T\>

> **OnSuccessCallback**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:230](https://github.com/TuwaIO/pulsar-core/blob/e3594e7fa8bdb6fe89020533e414a546965dfc16/packages/pulsar-core/src/types.ts#L230)

Defines a callback function to be executed upon a successful transaction.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The specific transaction type, extending `Transaction`.

## Properties

### onSuccessCallback()?

> `optional` **onSuccessCallback**: (`tx`) => `Promise`\<`void`\> \| `void`

Defined in: [packages/pulsar-core/src/types.ts:232](https://github.com/TuwaIO/pulsar-core/blob/e3594e7fa8bdb6fe89020533e414a546965dfc16/packages/pulsar-core/src/types.ts#L232)

Callback to execute when the transaction is successfully submitted.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`void`\> \| `void`
