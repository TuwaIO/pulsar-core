[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionTracker

Defined in: [packages/pulsar-evm/src/types.ts:13](https://github.com/TuwaIO/pulsar-core/blob/cef3f4fa8c4f60c96b5803206f685db0060e639e/packages/pulsar-evm/src/types.ts#L13)

Enum representing the different tracking strategies available for EVM transactions.

## Enumeration Members

### Ethereum

> **Ethereum**: `"ethereum"`

Defined in: [packages/pulsar-evm/src/types.ts:15](https://github.com/TuwaIO/pulsar-core/blob/cef3f4fa8c4f60c96b5803206f685db0060e639e/packages/pulsar-evm/src/types.ts#L15)

For standard on-chain EVM transactions tracked by their hash.

***

### Gelato

> **Gelato**: `"gelato"`

Defined in: [packages/pulsar-evm/src/types.ts:19](https://github.com/TuwaIO/pulsar-core/blob/cef3f4fa8c4f60c96b5803206f685db0060e639e/packages/pulsar-evm/src/types.ts#L19)

For meta-transactions relayed through the Gelato Network.

***

### Safe

> **Safe**: `"safe"`

Defined in: [packages/pulsar-evm/src/types.ts:17](https://github.com/TuwaIO/pulsar-core/blob/cef3f4fa8c4f60c96b5803206f685db0060e639e/packages/pulsar-evm/src/types.ts#L17)

For multi-signature transactions managed by a Safe contract.
