[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# BoundedUseStore()\<T\>

Defined in: [packages/pulsar-react/src/hooks/pulsarStoreFactory.ts:15](https://github.com/TuwaIO/pulsar-core/blob/568e8f7aad5858def25ecc02e62f9c9bb25c693a/packages/pulsar-react/src/hooks/pulsarStoreFactory.ts#L15)

Interface for the Bounded Store Hook, which knows the specific Transaction type T.
We use function overloading to allow T to be inferred or explicitly set.

## Type Parameters

### T

`T` *extends* `Transaction`

## Call Signature

> **BoundedUseStore**\<`TSelected`\>(`selector`): `TSelected`

Defined in: [packages/pulsar-react/src/hooks/pulsarStoreFactory.ts:17](https://github.com/TuwaIO/pulsar-core/blob/568e8f7aad5858def25ecc02e62f9c9bb25c693a/packages/pulsar-react/src/hooks/pulsarStoreFactory.ts#L17)

Interface for the Bounded Store Hook, which knows the specific Transaction type T.
We use function overloading to allow T to be inferred or explicitly set.

### Type Parameters

#### TSelected

`TSelected`

### Parameters

#### selector

`PulsarSelector`\<`T`, `TSelected`\>

### Returns

`TSelected`

## Call Signature

> **BoundedUseStore**\<`TSelected`, `TTransaction`\>(`selector`): `TSelected`

Defined in: [packages/pulsar-react/src/hooks/pulsarStoreFactory.ts:24](https://github.com/TuwaIO/pulsar-core/blob/568e8f7aad5858def25ecc02e62f9c9bb25c693a/packages/pulsar-react/src/hooks/pulsarStoreFactory.ts#L24)

Interface for the Bounded Store Hook, which knows the specific Transaction type T.
We use function overloading to allow T to be inferred or explicitly set.

### Type Parameters

#### TSelected

`TSelected`

#### TTransaction

`TTransaction` *extends* `Transaction` = `T`

### Parameters

#### selector

`PulsarSelector`\<`TTransaction`, `TSelected`\>

### Returns

`TSelected`
