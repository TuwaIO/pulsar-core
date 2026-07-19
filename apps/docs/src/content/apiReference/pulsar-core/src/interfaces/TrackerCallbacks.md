[**API Reference.**](../../../README.md)

***

# TrackerCallbacks\<T\>

Defined in: [packages/pulsar-core/src/types.ts:225](https://github.com/TuwaIO/pulsar-core/blob/17a55cf59aedebd775206822ceabe49db52c0f88/packages/pulsar-core/src/types.ts#L225)

Defines the standard callback structure for transaction events.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type, extending `Transaction`.

## Properties

### onError?

> `optional` **onError?**: (`error`, `tx?`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:227](https://github.com/TuwaIO/pulsar-core/blob/17a55cf59aedebd775206822ceabe49db52c0f88/packages/pulsar-core/src/types.ts#L227)

#### Parameters

##### error

`unknown`

##### tx?

`T`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onReplaced?

> `optional` **onReplaced?**: (`newTx`, `oldTx`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:228](https://github.com/TuwaIO/pulsar-core/blob/17a55cf59aedebd775206822ceabe49db52c0f88/packages/pulsar-core/src/types.ts#L228)

#### Parameters

##### newTx

`T`

##### oldTx

`T`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onSuccess?

> `optional` **onSuccess?**: (`tx`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:226](https://github.com/TuwaIO/pulsar-core/blob/17a55cf59aedebd775206822ceabe49db52c0f88/packages/pulsar-core/src/types.ts#L226)

#### Parameters

##### tx

`T`

#### Returns

`void` \| `Promise`\<`void`\>
