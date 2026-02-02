[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TrackerCallbacks\<T\>

Defined in: [packages/pulsar-core/src/types.ts:230](https://github.com/TuwaIO/pulsar-core/blob/1a6191eb282f8d2973c1d4cac3e8ee819324de5e/packages/pulsar-core/src/types.ts#L230)

Defines the standard callback structure for transaction events.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type, extending `Transaction`.

## Properties

### onError()?

> `optional` **onError**: (`error`, `tx?`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:232](https://github.com/TuwaIO/pulsar-core/blob/1a6191eb282f8d2973c1d4cac3e8ee819324de5e/packages/pulsar-core/src/types.ts#L232)

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

Defined in: [packages/pulsar-core/src/types.ts:233](https://github.com/TuwaIO/pulsar-core/blob/1a6191eb282f8d2973c1d4cac3e8ee819324de5e/packages/pulsar-core/src/types.ts#L233)

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

Defined in: [packages/pulsar-core/src/types.ts:231](https://github.com/TuwaIO/pulsar-core/blob/1a6191eb282f8d2973c1d4cac3e8ee819324de5e/packages/pulsar-core/src/types.ts#L231)

#### Parameters

##### tx

`T`

#### Returns

`void` \| `Promise`\<`void`\>
