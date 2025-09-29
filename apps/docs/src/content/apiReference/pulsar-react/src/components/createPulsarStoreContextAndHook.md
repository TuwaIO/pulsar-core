[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# createPulsarStoreContextAndHook()

> **createPulsarStoreContextAndHook**\<`T`\>(): `object`

Defined in: [packages/pulsar-react/src/hooks/pulsarHook.ts:35](https://github.com/TuwaIO/pulsar-core/blob/4eac4e83b9ab20a969d3d6ed318d5cf54201efe3/packages/pulsar-react/src/hooks/pulsarHook.ts#L35)

Factory function to create a unique React Context and a strictly typed Bounded Hook for a specific T.

## Type Parameters

### T

`T` *extends* `Transaction`

## Returns

`object`

### StoreContext

> **StoreContext**: `Context`\<`null` \| `PulsarStoreBound`\<`T`\>\>

### usePulsarStore

> **usePulsarStore**: [`UsePulsarStoreFn`](../interfaces/UsePulsarStoreFn.md) = `useBoundedPulsarStore`
