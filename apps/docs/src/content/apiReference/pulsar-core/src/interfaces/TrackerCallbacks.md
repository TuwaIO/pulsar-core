[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TrackerCallbacks\<T\>

Defined in: [packages/pulsar-core/src/types.ts:223](https://github.com/TuwaIO/pulsar-core/blob/f7116b96322133914fc40c97a545da2d7493aa4f/packages/pulsar-core/src/types.ts#L223)

Defines the standard callback structure for transaction events.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type, extending `Transaction`.

## Properties

### onError()?

> `optional` **onError**: (`error`, `tx?`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:225](https://github.com/TuwaIO/pulsar-core/blob/f7116b96322133914fc40c97a545da2d7493aa4f/packages/pulsar-core/src/types.ts#L225)

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

Defined in: [packages/pulsar-core/src/types.ts:226](https://github.com/TuwaIO/pulsar-core/blob/f7116b96322133914fc40c97a545da2d7493aa4f/packages/pulsar-core/src/types.ts#L226)

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

Defined in: [packages/pulsar-core/src/types.ts:224](https://github.com/TuwaIO/pulsar-core/blob/f7116b96322133914fc40c97a545da2d7493aa4f/packages/pulsar-core/src/types.ts#L224)

#### Parameters

##### tx

`T`

#### Returns

`void` \| `Promise`\<`void`\>
