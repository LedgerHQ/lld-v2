// @flow
import { of } from "rxjs";
import { scan, catchError } from "rxjs/operators";
import { useEffect, useState } from "react";
import type {
  AccountLike,
  Account,
  Transaction,
  TransactionStatus,
  SignedOperation,
  SignOperationEvent,
} from "@ledgerhq/live-common/lib/types";
import { UserRefusedOnDevice, TransportStatusError } from "@ledgerhq/errors";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import type { Device } from "~/renderer/reducers/devices";
import type { Action } from "./shared";
import type { AppState } from "./app";
import { action as appAction } from "./app";

type State = {|
  signedOperation: ?SignedOperation,
  deviceSignatureRequested: boolean,
  deviceStreamingProgress: ?number,
  transactionSignError: ?Error,
|};

type TransactionState = {|
  ...AppState,
  ...State,
|};

type TransactionRequest = {
  parentAccount: ?Account,
  account: AccountLike,
  transaction: Transaction,
  status: TransactionStatus,
};

type TransactionResult =
  | {
      signedOperation: SignedOperation,
    }
  | {
      transactionSignError: Error,
    };

type TransactionAction = Action<TransactionRequest, TransactionState, TransactionResult>;

const mapResult = ({
  signedOperation,
  transactionSignError,
}: TransactionState): ?TransactionResult =>
  signedOperation ? { signedOperation } : transactionSignError ? { transactionSignError } : null;

type Event = SignOperationEvent | { type: "error", error: Error };

const initialState = {
  signedOperation: null,
  deviceSignatureRequested: false,
  deviceStreamingProgress: null,
  transactionSignError: null,
};

const reducer = (state: State, e: Event): State => {
  switch (e.type) {
    case "error": {
      const { error } = e;
      const transactionSignError =
        error instanceof TransportStatusError && error.statusCode === 0x6985
          ? new UserRefusedOnDevice()
          : error;
      return { ...state, transactionSignError };
    }
    case "signed":
      return { ...state, signedOperation: e.signedOperation };
    case "device-signature-requested":
      return { ...state, deviceSignatureRequested: true };
    case "device-signature-granted":
      return { ...state, deviceSignatureRequested: false };
    case "device-streaming":
      return { ...state, deviceStreamingProgress: e.progress };
  }
  return state;
};

const useHook = (reduxDevice: ?Device, txRequest: TransactionRequest): TransactionState => {
  const { transaction } = txRequest;
  const mainAccount = getMainAccount(txRequest.account, txRequest.parentAccount);

  const appState = appAction.useHook(reduxDevice, { account: mainAccount });
  const { device, appAndVersion } = appState;

  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (!device || !appAndVersion) {
      setState(initialState);
      return;
    }

    const bridge = getAccountBridge(mainAccount);

    const sub = bridge
      .signOperation({
        account: mainAccount,
        transaction,
        deviceId: device.path,
      })
      .pipe(
        catchError(error => of({ type: "error", error })),
        scan(reducer, initialState),
      )
      .subscribe(setState);

    return () => {
      sub.unsubscribe();
    };
  }, [device, appAndVersion, mainAccount, transaction]);

  return { ...appState, ...state };
};

export const action: TransactionAction = {
  useHook,
  mapResult,
};
