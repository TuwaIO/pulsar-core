[**API Reference.**](../../README.md)

***

# pulsar-core/src

## Enumerations

- [TransactionStatus](enumerations/TransactionStatus.md)
- [TransactionTracker](enumerations/TransactionTracker.md)

## Classes

- [PulsarTransactionValidationError](classes/PulsarTransactionValidationError.md)

## Interfaces

- [IInitializeTxTrackingStore](interfaces/IInitializeTxTrackingStore.md)
- [SyncCallbacks](interfaces/SyncCallbacks.md)
- [TrackerCallbacks](interfaces/TrackerCallbacks.md)

## Type Aliases

- [ActionTxKey](type-aliases/ActionTxKey.md)
- [BaseTransaction](type-aliases/BaseTransaction.md)
- [BeforeTxProcess](type-aliases/BeforeTxProcess.md)
- [CheckTxTracker](type-aliases/CheckTxTracker.md)
- [EvmTransaction](type-aliases/EvmTransaction.md)
- [InitialTransaction](type-aliases/InitialTransaction.md)
- [InitialTransactionParams](type-aliases/InitialTransactionParams.md)
- [ITxInMemoryStore](type-aliases/ITxInMemoryStore.md)
- [ITxInMemoryStoreParameters](type-aliases/ITxInMemoryStoreParameters.md)
- [ITxTrackingStore](type-aliases/ITxTrackingStore.md)
- [PollingFetcherParams](type-aliases/PollingFetcherParams.md)
- [PollingTrackerConfig](type-aliases/PollingTrackerConfig.md)
- [PulsarAdapter](type-aliases/PulsarAdapter.md)
- [SolanaTransaction](type-aliases/SolanaTransaction.md)
- [StarknetTransaction](type-aliases/StarknetTransaction.md)
- [StoreSlice](type-aliases/StoreSlice.md)
- [Transaction](type-aliases/Transaction.md)
- [TransactionPool](type-aliases/TransactionPool.md)
- [TxAdapter](type-aliases/TxAdapter.md)
- [TxInMemoryPagination](type-aliases/TxInMemoryPagination.md)
- [UpdatableTransactionFields](type-aliases/UpdatableTransactionFields.md)

## Variables

- [createBoundedUseStore](variables/createBoundedUseStore.md)
- [MAX\_TRANSACTION\_DESCRIPTION\_LENGTH](variables/MAX_TRANSACTION_DESCRIPTION_LENGTH.md)
- [MAX\_TRANSACTION\_PAYLOAD\_BYTES](variables/MAX_TRANSACTION_PAYLOAD_BYTES.md)
- [MAX\_TRANSACTION\_TITLE\_LENGTH](variables/MAX_TRANSACTION_TITLE_LENGTH.md)

## Functions

- [createPulsarStore](functions/createPulsarStore.md)
- [createTxInMemoryStore](functions/createTxInMemoryStore.md)
- [initializePollingTracker](functions/initializePollingTracker.md)
- [initializeTxTrackingStore](functions/initializeTxTrackingStore.md)
- [selectAllTransactions](functions/selectAllTransactions.md)
- [selectAllTransactionsByActiveWallet](functions/selectAllTransactionsByActiveWallet.md)
- [selectPendingTransactions](functions/selectPendingTransactions.md)
- [selectPendingTransactionsByActiveWallet](functions/selectPendingTransactionsByActiveWallet.md)
- [selectTxByKey](functions/selectTxByKey.md)
- [validateInitialTransactionParams](functions/validateInitialTransactionParams.md)
- [validateTransaction](functions/validateTransaction.md)
