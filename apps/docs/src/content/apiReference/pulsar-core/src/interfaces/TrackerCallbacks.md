[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TrackerCallbacks\<T\>

Defined in: [packages/pulsar-core/src/types.ts:223](https://github.com/TuwaIO/pulsar-core/blob/2f1f6a4f06a19b6a90ce02fab5bff03e7ac74e24/packages/pulsar-core/src/types.ts#L223)

Defines the standard callback structure for transaction events.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type, extending `Transaction`.

## Properties

### onError()?

> `optional` **onError**: (`error`, `tx?`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:225](https://github.com/TuwaIO/pulsar-core/blob/2f1f6a4f06a19b6a90ce02fab5bff03e7ac74e24/packages/pulsar-core/src/types.ts#L225)

#### Parameters

##### error

`unknown`

##### tx?

`T`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onReplaced()?

> `optional` **onReplaced**: (`newTx`, `oldTx`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:226](https://github.com/TuwaIO/pulsar-core/blob/2f1f6a4f06a19b6a90ce02fab5bff03e7ac74e24/packages/pulsar-core/src/types.ts#L226)

#### Parameters

##### newTx

`T`

##### oldTx

`T`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onSuccess()?

> `optional` **onSuccess**: (`tx`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:224](https://github.com/TuwaIO/pulsar-core/blob/2f1f6a4f06a19b6a90ce02fab5bff03e7ac74e24/packages/pulsar-core/src/types.ts#L224)

#### Parameters

##### tx

`T`

#### Returns

`void` \| `Promise`\<`void`\>
