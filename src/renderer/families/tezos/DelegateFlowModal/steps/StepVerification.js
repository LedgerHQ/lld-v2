// @flow

import React, { useEffect, useCallback } from "react";
import TrackPage from "~/renderer/analytics/TrackPage";
import TransactionConfirm from "~/renderer/components/TransactionConfirm";

import type { StepProps } from "../types";

const StepVerification = ({
  signTransaction,
  transitionTo,
  device,
  account,
  parentAccount,
  transaction,
  status,
}: StepProps) => {
  const handleSignTransaction = useCallback(async () => {
    signTransaction({ transitionTo });
  }, [signTransaction, transitionTo]);

  // didMount
  // this was done only on mount on v1, so I removed the
  // dependencies to simulate that (val)
  useEffect(() => {
    handleSignTransaction();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!account || !device || !transaction) return null;
  return (
    <>
      <TrackPage category="Send Flow" name="Step Verification" />
      <TransactionConfirm
        device={device}
        account={account}
        parentAccount={parentAccount}
        transaction={transaction}
        status={status}
      />
    </>
  );
};

export default StepVerification;
