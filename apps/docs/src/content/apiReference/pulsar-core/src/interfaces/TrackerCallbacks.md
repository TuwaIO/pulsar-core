[**API Reference.**](../../../README.md)

***

# TrackerCallbacks\<T\>

Defined in: [packages/pulsar-core/src/types.ts:228](https://github.com/TuwaIO/pulsar-core/blob/bce332a451ffb6c6fd85056151cae084e4b561b1/packages/pulsar-core/src/types.ts#L228)

Defines the standard callback structure for transaction events.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type, extending `Transaction`.

## Properties

### onError?

> `optional` **onError?**: (`error`, `tx?`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:230](https://github.com/TuwaIO/pulsar-core/blob/bce332a451ffb6c6fd85056151cae084e4b561b1/packages/pulsar-core/src/types.ts#L230)

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

Defined in: [packages/pulsar-core/src/types.ts:231](https://github.com/TuwaIO/pulsar-core/blob/bce332a451ffb6c6fd85056151cae084e4b561b1/packages/pulsar-core/src/types.ts#L231)

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

Defined in: [packages/pulsar-core/src/types.ts:229](https://github.com/TuwaIO/pulsar-core/blob/bce332a451ffb6c6fd85056151cae084e4b561b1/packages/pulsar-core/src/types.ts#L229)

#### Parameters

##### tx

`T`

#### Returns

`void` \| `Promise`\<`void`\>
