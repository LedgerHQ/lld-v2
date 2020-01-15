// @flow

import { concat, of } from "rxjs";
import { concatMap, filter, tap } from "rxjs/operators";
import { useEffect, useRef, useCallback } from "react";
import invariant from "invariant";
import { DisconnectedDevice, UserRefusedOnDevice } from "@ledgerhq/errors";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import type {
  AccountLike,
  Account,
  SignOperationEvent,
  Operation,
  Transaction,
} from "@ledgerhq/live-common/lib/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import type { Device } from "~/renderer/reducers/devices";
import { track } from "~/renderer/analytics/segment";

type SignTransactionArgs = {
  context: string,
  device: ?Device,
  transaction: ?Transaction,
  account: ?AccountLike,
  parentAccount: ?Account,
  onSignOperationEvent?: SignOperationEvent => void,
  handleOperationBroadcasted: Operation => void,
  handleTransactionError: Error => void,
  setSigned: boolean => void,
};

export const useSignTransactionCallback = ({
  context,
  device,
  account,
  parentAccount,
  onSignOperationEvent,
  handleOperationBroadcasted,
  transaction,
  handleTransactionError,
  setSigned,
}: SignTransactionArgs) => {
  const signTransactionSubRef = useRef(null);

  useEffect(
    () => () => {
      if (signTransactionSubRef.current) {
        signTransactionSubRef.current.unsubscribe();
      }
    },
    [],
  );

  const handleSignTransaction = useCallback(
    async ({ transitionTo }: { transitionTo: string => void }) => {
      if (!account) return;
      const mainAccount = getMainAccount(account, parentAccount);
      const bridge = getAccountBridge(account, parentAccount);
      if (!device) {
        handleTransactionError(new DisconnectedDevice());
        transitionTo("confirmation");
        return;
      }

      invariant(account && transaction && bridge, "signTransaction invalid conditions");

      const eventProps = {
        currencyName: mainAccount.currency.name,
        derivationMode: mainAccount.derivationMode,
        freshAddressPath: mainAccount.freshAddressPath,
        operationsLength: mainAccount.operations.length,
      };
      track(`${context}TransactionStart`, eventProps);
      signTransactionSubRef.current = bridge
        .signOperation({ account: mainAccount, transaction, deviceId: device.path })
        .pipe(
          filter(e => e.type !== "device-streaming" || (e.progress !== 0 && e.progress !== 1)),
          tap(e => onSignOperationEvent && onSignOperationEvent(e)),
          filter(e => e.type === "signed"),
          concatMap(e =>
            getEnv("DISABLE_TRANSACTION_BROADCAST")
              ? of(e)
              : concat(
                  of(e),
                  // TODO the broadcast part should be split OUT of the hook
                  // into a second hook
                  bridge
                    .broadcast({
                      account: mainAccount,
                      signedOperation: e.signedOperation,
                    })
                    .then(operation => ({ type: "broadcasted", operation })),
                ),
          ),
        )
        .subscribe({
          next: e => {
            switch (e.type) {
              case "signed": {
                track(`${context}TransactionSigned`, eventProps);
                setSigned(true);
                transitionTo("confirmation");
                break;
              }
              case "broadcasted": {
                track(`${context}TransactionBroadcasted`, eventProps);
                handleOperationBroadcasted(e.operation);
                break;
              }
              default:
            }
          },
          error: err => {
            if (err.statusCode === 0x6985) {
              track(`${context}TransactionRefused`, eventProps);
              handleTransactionError(new UserRefusedOnDevice());
              transitionTo("refused");
            } else {
              track(`${context}TransactionError`, eventProps);
              handleTransactionError(err);
              transitionTo("confirmation");
            }
          },
        });
    },
    [
      account,
      parentAccount,
      device,
      transaction,
      context,
      handleTransactionError,
      setSigned,
      handleOperationBroadcasted,
      onSignOperationEvent,
    ],
  );

  return handleSignTransaction;
};
