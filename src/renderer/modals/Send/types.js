// @flow

import type { TFunction } from "react-i18next";
import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
  Operation,
  SignOperationEvent,
} from "@ledgerhq/live-common/lib/types";
import type { Device } from "~/renderer/reducers/devices";

import type { Step } from "~/renderer/components/Stepper";

export type StepId =
  | "warning"
  | "recipient"
  | "amount"
  | "summary"
  | "device"
  | "verification"
  | "refused"
  | "confirmation";

export type StepProps = {
  t: TFunction,
  transitionTo: string => void,
  openedFromAccount: boolean,
  device: ?Device,
  account: ?AccountLike,
  parentAccount: ?Account,
  transaction: ?Transaction,
  status: TransactionStatus,
  bridgeError: ?Error,
  bridgePending: boolean,
  error: ?Error,
  lastSignOperationEvent: ?SignOperationEvent,
  signed: boolean,
  optimisticOperation: ?Operation,
  closeModal: void => void,
  openModal: (string, any) => void,
  isAppOpened: boolean,
  onChangeAccount: (?AccountLike, ?Account) => void,
  onChangeAppOpened: boolean => void,
  onChangeTransaction: Transaction => void,
  onTransactionError: Error => void,
  onOperationBroadcasted: Operation => void,
  onRetry: void => void,
  signTransaction: ({ transitionTo: string => void }) => void,
};

export type St = Step<StepId, StepProps>;
