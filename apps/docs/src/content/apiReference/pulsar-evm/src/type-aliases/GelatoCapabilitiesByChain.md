[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# GelatoCapabilitiesByChain

> **GelatoCapabilitiesByChain** = `object`

Defined in: [packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts:20](https://github.com/TuwaIO/pulsar-core/blob/409d179eb7db474173c52a361610758253656cc7/packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts#L20)

Represents the per-chain capabilities returned by the Gelato `relayer_getCapabilities` RPC method.

## Properties

### feeCollector

> **feeCollector**: `string`

Defined in: [packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts:21](https://github.com/TuwaIO/pulsar-core/blob/409d179eb7db474173c52a361610758253656cc7/packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts#L21)

The address of the fee collector contract on this chain.

***

### tokens

> **tokens**: [`GelatoToken`](GelatoToken.md)[]

Defined in: [packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts:22](https://github.com/TuwaIO/pulsar-core/blob/409d179eb7db474173c52a361610758253656cc7/packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts#L22)

The list of ERC-20 tokens accepted for fee payment on this chain.
