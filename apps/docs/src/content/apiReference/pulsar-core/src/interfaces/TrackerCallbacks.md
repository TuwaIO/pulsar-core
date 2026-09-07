[**API Reference.**](../../../README.md)

***

# TrackerCallbacks\<T\>

Defined in: [packages/pulsar-core/src/types.ts:240](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L240)

Defines the standard callback structure for transaction events.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type, extending `Transaction`.

## Properties

### onError?

> `optional` **onError?**: (`error`, `tx?`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:242](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L242)

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

Defined in: [packages/pulsar-core/src/types.ts:243](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L243)

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

Defined in: [packages/pulsar-core/src/types.ts:241](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L241)

#### Parameters

##### tx

`T`

#### Returns

`void` \| `Promise`\<`void`\>
