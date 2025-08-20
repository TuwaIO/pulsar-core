[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# createPulsarStore()

> **createPulsarStore**\<`TR`, `T`, `A`\>(`__namedParameters`): `Write`\<`StoreApi`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>\>, `StorePersist`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>, [`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>\>\>

Defined in: [packages/pulsar-core/src/store/txTrackingStore.ts:9](https://github.com/TuwaIO/pulsar-core/blob/3276bf16709f6ec29953e98e8eed75f9c97b41d2/packages/pulsar-core/src/store/txTrackingStore.ts#L9)

## Type Parameters

### TR

`TR`

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)\<`TR`\>

### A

`A`

## Parameters

### \_\_namedParameters

`object` & `PersistOptions`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>, [`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>\>

## Returns

`Write`\<`StoreApi`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>\>, `StorePersist`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>, [`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>\>\>
