[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TrackerCallbacks\<T\>

Defined in: [packages/pulsar-core/src/types.ts:216](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-core/src/types.ts#L216)

Defines the standard callback structure for transaction events.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type, extending `Transaction`.

## Properties

### onError?

> `optional` **onError?**: (`error`, `tx?`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:218](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-core/src/types.ts#L218)

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

Defined in: [packages/pulsar-core/src/types.ts:219](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-core/src/types.ts#L219)

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

Defined in: [packages/pulsar-core/src/types.ts:217](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-core/src/types.ts#L217)

#### Parameters

##### tx

`T`

#### Returns

`void` \| `Promise`\<`void`\>
