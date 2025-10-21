[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# gnosisSafeLinksHelper

> `const` **gnosisSafeLinksHelper**: `Record`\<`number`, `string`\>

Defined in: [packages/pulsar-evm/src/utils/safeConstants.ts:41](https://github.com/TuwaIO/pulsar-core/blob/e3594e7fa8bdb6fe89020533e414a546965dfc16/packages/pulsar-evm/src/utils/safeConstants.ts#L41)

A mapping of chain IDs to their corresponding Safe web application URL prefixes.
Used by selectors like `selectTxExplorerLink` to build correct links for Safe transactions.
The prefixes (e.g., 'eth:', 'gor:') are part of the Safe URL scheme.
