[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# GelatoCapabilitiesByChain

> **GelatoCapabilitiesByChain** = `object`

Defined in: [packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts:20](https://github.com/TuwaIO/pulsar-core/blob/1c91d65eda8baf365ba3ddea0556929964753b54/packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts#L20)

Represents the per-chain capabilities returned by the Gelato `relayer_getCapabilities` RPC method.

## Properties

### feeCollector

> **feeCollector**: `string`

Defined in: [packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts:21](https://github.com/TuwaIO/pulsar-core/blob/1c91d65eda8baf365ba3ddea0556929964753b54/packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts#L21)

The address of the fee collector contract on this chain.

***

### tokens

> **tokens**: [`GelatoToken`](GelatoToken.md)[]

Defined in: [packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts:22](https://github.com/TuwaIO/pulsar-core/blob/1c91d65eda8baf365ba3ddea0556929964753b54/packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts#L22)

The list of ERC-20 tokens accepted for fee payment on this chain.
