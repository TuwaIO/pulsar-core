[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# createPulsarStoreContextAndHook()

> **createPulsarStoreContextAndHook**\<`T`\>(): `object`

Defined in: [packages/pulsar-react/src/hooks/pulsarStoreFactory.ts:31](https://github.com/TuwaIO/pulsar-core/blob/568e8f7aad5858def25ecc02e62f9c9bb25c693a/packages/pulsar-react/src/hooks/pulsarStoreFactory.ts#L31)

Factory function to create a unique React Context and a strongly typed hook
for a specific Transaction type T.

## Type Parameters

### T

`T` *extends* `Transaction`

## Returns

`object`

### StoreContext

> **StoreContext**: `Context`\<`null` \| `StoreApi`\<[`PulsarStoreState`](../type-aliases/PulsarStoreState.md)\<`T`\>\>\>

### usePulsarStore

> **usePulsarStore**: [`BoundedUseStore`](../interfaces/BoundedUseStore.md)\<`T`\>
