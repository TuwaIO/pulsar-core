# UseTxFinishedParams\<T\>

> **UseTxFinishedParams**\<`T`\> = `object`

Defined in: [useTxFinished.tsx:12](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-react/src/hooks/useTxFinished.tsx#L12)

The parameters of [useTxFinished](/packages/pulsar-react/functions/useTxFinished.md).

## Type Parameters

### T

`T`

The application transaction type.

## Properties

### onFinished

> **onFinished**: (`tx`) => `Promise`\<`void`\> \| `void`

Defined in: [useTxFinished.tsx:25](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-react/src/hooks/useTxFinished.tsx#L25)

Called with the transaction when it reaches `Success`, `Failed` or `Replaced`, also when a tracker restarted after
a page reload finishes it. The latest function is used, so an inline callback does not subscribe again. Its return
value is not awaited; a rejection is logged by the store.

#### Parameters

##### tx

`T`

The transaction with its final `status`.

#### Returns

`Promise`\<`void`\> \| `void`

***

### subscribeTxFinished

> **subscribeTxFinished**: (`listener`) => () => `void`

Defined in: [useTxFinished.tsx:17](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-react/src/hooks/useTxFinished.tsx#L17)

The store's `subscribeTxFinished` action (`createPulsarStore` from `@tuwaio/pulsar-core`). Pass a stable reference:
the hook subscribes again whenever it changes.

#### Parameters

##### listener

(`tx`) => `Promise`\<`void`\> \| `void`

#### Returns

() => `void`
