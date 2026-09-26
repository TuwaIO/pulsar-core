# safeSdkOptions

> `const` **safeSdkOptions**: `object`

Defined in: [utils/safeConstants.ts:28](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/safeConstants.ts#L28)

Options for the Safe Apps SDK (`@safe-global/safe-apps-sdk`), for apps that run inside the Safe web app. Pulsar does
not use them itself.

## Type Declaration

### allowedDomains

> **allowedDomains**: `RegExp`[]

Domains of Safe web apps the SDK accepts messages from.

### debug

> **debug**: `boolean` = `false`

Whether the SDK logs debug messages.
