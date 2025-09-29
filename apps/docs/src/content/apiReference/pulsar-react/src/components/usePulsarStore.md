[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# usePulsarStore()

> **usePulsarStore**\<`T`, `TSelected`\>(`selector`): `TSelected`

Defined in: [packages/pulsar-react/src/hooks/pulsarHook.ts:62](https://github.com/TuwaIO/pulsar-core/blob/86c8fdb539eb00427d06ed808054f92cd1a1cac1/packages/pulsar-react/src/hooks/pulsarHook.ts#L62)

Public hook to access the Pulsar Store.
NOTE: T and TSelected are now inferred based on the Overloads in UsePulsarStoreFn.

## Type Parameters

### T

`T` *extends* `Transaction` = `Transaction`

### TSelected

`TSelected` = `unknown`

## Parameters

### selector

(`state`) => `TSelected`

## Returns

`TSelected`
