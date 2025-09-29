[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# OnSuccessCallback\<T\>

> **OnSuccessCallback**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:219](https://github.com/TuwaIO/pulsar-core/blob/86c8fdb539eb00427d06ed808054f92cd1a1cac1/packages/pulsar-core/src/types.ts#L219)

Defines a callback function to be executed upon a successful transaction.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The specific transaction type, extending `Transaction`.

## Properties

### onSuccessCallback()?

> `optional` **onSuccessCallback**: (`tx`) => `Promise`\<`void`\> \| `void`

Defined in: [packages/pulsar-core/src/types.ts:221](https://github.com/TuwaIO/pulsar-core/blob/86c8fdb539eb00427d06ed808054f92cd1a1cac1/packages/pulsar-core/src/types.ts#L221)

Callback to execute when the transaction is successfully submitted.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`void`\> \| `void`
