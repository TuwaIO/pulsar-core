[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# gnosisSafeLinksHelper

> `const` **gnosisSafeLinksHelper**: `Record`\<`number`, `string`\>

Defined in: [packages/pulsar-evm/src/utils/safeConstants.ts:41](https://github.com/TuwaIO/pulsar-core/blob/bbb9e2e0f0f23382d49e10f4e6c8ee38979bf353/packages/pulsar-evm/src/utils/safeConstants.ts#L41)

A mapping of chain IDs to their corresponding Safe web application URL prefixes.
Used by selectors like `selectTxExplorerLink` to build correct links for Safe transactions.
The prefixes (e.g., 'eth:', 'gor:') are part of the Safe URL scheme.
