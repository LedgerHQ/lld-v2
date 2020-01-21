// @flow

import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import type { TFunction } from "react-i18next";
import { createStructuredSelector } from "reselect";
import { Trans, withTranslation } from "react-i18next";
import { UserRefusedOnDevice } from "@ledgerhq/errors";
import { addPendingOperation, getMainAccount } from "@ledgerhq/live-common/lib/account";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import type { Account, AccountLike, Operation } from "@ledgerhq/live-common/lib/types";
import logger from "~/logger";
import { useThrottledCallback } from "~/renderer/hooks/useDebounce";
import Stepper from "~/renderer/components/Stepper";
import SyncSkipUnderPriority from "~/renderer/components/SyncSkipUnderPriority";
import { closeModal, openModal } from "~/renderer/actions/modals";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import Track from "~/renderer/analytics/Track";
import { useSignTransactionCallback } from "~/renderer/hooks/useSignTransaction";

import type { Device } from "~/renderer/reducers/devices";

import StepRecipient, { StepRecipientFooter } from "./steps/StepRecipient";
import StepAmount, { StepAmountFooter } from "./steps/StepAmount";
import StepConnectDevice from "./steps/StepConnectDevice";
import StepVerification from "./steps/StepVerification";
import StepSummary, { StepSummaryFooter } from "./steps/StepSummary";
import StepConfirmation, { StepConfirmationFooter } from "./steps/StepConfirmation";
import StepWarning, { StepWarningFooter } from "./steps/StepWarning";
import type { St } from "./types";

type OwnProps = {|
  stepId: string,
  onClose: () => void,
  onChangeStepId: string => void,
  params: {
    account: ?AccountLike,
    parentAccount: ?Account,
    startWithWarning?: boolean,
  },
|};

type StateProps = {|
  t: TFunction,
  device: ?Device,
  accounts: Account[],
  closeModal: string => void,
  openModal: (string, any) => void,
  updateAccountWithUpdater: (string, (Account) => Account) => void,
|};

type Props = {|
  ...OwnProps,
  ...StateProps,
|};

const createSteps = (): St[] => [
  {
    id: "warning",
    excludeFromBreadcrumb: true,
    component: StepWarning,
    footer: StepWarningFooter,
  },
  {
    id: "recipient",
    label: <Trans i18nKey="send.steps.recipient.title" />,
    component: StepRecipient,
    footer: StepRecipientFooter,
  },
  {
    id: "amount",
    label: <Trans i18nKey="send.steps.amount.title" />,
    component: StepAmount,
    footer: StepAmountFooter,
    onBack: ({ transitionTo }) => transitionTo("recipient"),
  },
  {
    id: "summary",
    label: <Trans i18nKey="send.steps.summary.title" />,
    component: StepSummary,
    footer: StepSummaryFooter,
    onBack: ({ transitionTo }) => transitionTo("amount"),
  },
  {
    id: "device",
    label: <Trans i18nKey="send.steps.device.title" />,
    component: StepConnectDevice,
    onBack: ({ transitionTo }) => transitionTo("summary"),
  },
  {
    id: "verification",
    excludeFromBreadcrumb: true,
    component: StepVerification,
    shouldPreventClose: true,
  },
  {
    id: "refused",
    excludeFromBreadcrumb: true,
    component: StepConfirmation,
    footer: StepConfirmationFooter,
    onBack: ({ transitionTo, onRetry }) => {
      onRetry();
      transitionTo("summary");
    },
  },
  {
    id: "confirmation",
    label: <Trans i18nKey="send.steps.confirmation.title" />,
    excludeFromBreadcrumb: true,
    component: StepConfirmation,
    footer: StepConfirmationFooter,
    onBack: ({ transitionTo, onRetry }) => {
      onRetry();
      transitionTo("recipient");
    },
  },
];

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
  accounts: accountsSelector,
});

const mapDispatchToProps = {
  closeModal,
  openModal,
  updateAccountWithUpdater,
};

const Body = ({
  t,
  device,
  openModal,
  closeModal,
  onChangeStepId,
  onClose,
  stepId,
  params,
  accounts,
  updateAccountWithUpdater,
}: Props) => {
  const openedFromAccount = !!params.account;
  const [steps] = useState(createSteps);
  const {
    transaction,
    setTransaction,
    account,
    parentAccount,
    setAccount,
    status,
    bridgeError,
    bridgePending,
  } = useBridgeTransaction(() => {
    const parentAccount = params && params.parentAccount;
    const account = (params && params.account) || accounts[0];
    return {
      account,
      parentAccount,
    };
  });

  // make sure step id is in sync
  useEffect(() => {
    const stepId = params && params.startWithWarning ? "warning" : null;
    if (stepId) onChangeStepId(stepId);
  }, [onChangeStepId, params]);

  const [isAppOpened, setAppOpened] = useState(false);
  const [optimisticOperation, setOptimisticOperation] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [signed, setSigned] = useState(false);
  const signTransactionSubRef = useRef(null);

  const handleCloseModal = useCallback(() => closeModal("MODAL_SEND"), [closeModal]);

  const handleChangeAccount = useCallback(
    (nextAccount: AccountLike, nextParentAccount: ?Account) => {
      if (account !== nextAccount) {
        setAccount(nextAccount, nextParentAccount);
      }
    },
    [account, setAccount],
  );

  const handleRetry = useCallback(() => {
    setSignOperationEvent(null);
    setTransactionError(null);
    setOptimisticOperation(null);
    setAppOpened(false);
    setSigned(false);
  }, []);

  const handleTransactionError = useCallback(
    (error: Error) => {
      if (!(error instanceof UserRefusedOnDevice)) {
        logger.critical(error);
      }
      const stepVerificationIndex = steps.findIndex(step => step.id === "verification");
      if (stepVerificationIndex === -1) return;
      setTransactionError(error);
    },
    [steps],
  );

  const handleOperationBroadcasted = useCallback(
    (optimisticOperation: Operation) => {
      if (!account) return;
      const mainAccount = getMainAccount(account, parentAccount);
      updateAccountWithUpdater(mainAccount.id, account =>
        addPendingOperation(account, optimisticOperation),
      );
      setOptimisticOperation(optimisticOperation);
      setTransactionError(null);
    },
    [account, parentAccount, updateAccountWithUpdater],
  );

  const [lastSignOperationEvent, setSignOperationEvent] = useState(null);
  const onSignOperationEvent = useThrottledCallback(setSignOperationEvent, 100);

  const handleSignTransaction = useSignTransactionCallback({
    context: "Send",
    device,
    account,
    parentAccount,
    onSignOperationEvent,
    handleOperationBroadcasted,
    transaction,
    handleTransactionError,
    setSigned,
  });

  const handleStepChange = useCallback(e => onChangeStepId(e.id), [onChangeStepId]);

  // only call on mount/unmount
  useEffect(
    () => () => {
      if (signTransactionSubRef.current) {
        signTransactionSubRef.current.unsubscribe();
      }
    },
    [],
  );

  const errorSteps = [];

  if (transactionError) {
    errorSteps.push(3);
  } else if (bridgeError) {
    errorSteps.push(0);
  }

  const error = transactionError || bridgeError;

  const stepperProps = {
    title: stepId === "warning" ? t("common.information") : t("send.title"),
    initialStepId: params && params.startWithWarning ? "warning" : stepId,
    steps,
    errorSteps,
    device,
    openedFromAccount,
    account,
    parentAccount,
    transaction,
    isAppOpened,
    hideBreadcrumb: (!!error && ["recipient", "amount"].includes(stepId)) || stepId === "warning",
    error,
    status,
    bridgePending,
    signed,
    optimisticOperation,
    openModal,
    onClose,
    lastSignOperationEvent,
    closeModal: handleCloseModal,
    onChangeAccount: handleChangeAccount,
    onChangeAppOpened: setAppOpened,
    onChangeTransaction: setTransaction,
    onRetry: handleRetry,
    signTransaction: handleSignTransaction,
    onStepChange: handleStepChange,
  };

  if (!status) return null;

  return (
    <Stepper {...stepperProps}>
      <SyncSkipUnderPriority priority={100} />
      <Track onUnmount event="CloseModalDelegate" />
    </Stepper>
  );
};

const m: React$ComponentType<OwnProps> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(Body);

export default m;
