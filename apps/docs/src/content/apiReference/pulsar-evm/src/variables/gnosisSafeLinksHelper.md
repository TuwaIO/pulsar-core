[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# gnosisSafeLinksHelper

> `const` **gnosisSafeLinksHelper**: `Record`\<`number`, `string`\>

Defined in: [packages/pulsar-evm/src/utils/safeConstants.ts:41](https://github.com/TuwaIO/pulsar-core/blob/227594b111c3b7431fc1b2bfe3380cc9ee0fa156/packages/pulsar-evm/src/utils/safeConstants.ts#L41)

A mapping of chain IDs to their corresponding Safe web application URL prefixes.
Used by selectors like `selectTxExplorerLink` to build correct links for Safe transactions.
The prefixes (e.g., 'eth:', 'gor:') are part of the Safe URL scheme.
