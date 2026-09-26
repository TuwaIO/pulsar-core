# ~~GelatoCapabilitiesByChain~~

> **GelatoCapabilitiesByChain** = `object`

Defined in: [utils/checkIsGelatoAvailable.ts:18](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts#L18)

The Gelato Relay capabilities of one chain, as returned by `relayer_getCapabilities`.

## Deprecated

Gelato relay is deprecated. Use `TransactionTracker.ERC4337` instead.

## Properties

### ~~feeCollector~~

> **feeCollector**: `string`

Defined in: [utils/checkIsGelatoAvailable.ts:20](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts#L20)

The address of the fee collector contract on this chain.

***

### ~~tokens~~

> **tokens**: [`GelatoToken`](/packages/pulsar-evm/type-aliases/GelatoToken.md)[]

Defined in: [utils/checkIsGelatoAvailable.ts:22](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts#L22)

The ERC-20 tokens accepted for fee payment on this chain.
