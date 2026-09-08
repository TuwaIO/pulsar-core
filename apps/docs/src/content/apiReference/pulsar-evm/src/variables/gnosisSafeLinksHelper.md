[**API Reference.**](../../../README.md)

***

# gnosisSafeLinksHelper

> `const` **gnosisSafeLinksHelper**: `Record`\<`number`, `string`\>

Defined in: [packages/pulsar-evm/src/utils/safeConstants.ts:41](https://github.com/TuwaIO/pulsar-core/blob/d8faba2b05042ba673e3ec758d4763f15973e717/packages/pulsar-evm/src/utils/safeConstants.ts#L41)

A mapping of chain IDs to their corresponding Safe web application URL prefixes.
Used by selectors like `selectTxExplorerLink` to build correct links for Safe transactions.
The prefixes (e.g., 'eth:', 'gor:') are part of the Safe URL scheme.
