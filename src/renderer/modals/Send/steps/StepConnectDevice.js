// @flow

import React from "react";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import TrackPage from "~/renderer/analytics/TrackPage";
import EnsureDeviceApp from "~/renderer/components/EnsureDeviceApp";

import TokenTips from "../../TokenTips";
import type { StepProps } from "../types";

export default function StepConnectDevice({
  account,
  parentAccount,
  onChangeAppOpened,
  transitionTo,
}: StepProps) {
  const token = account && account.type === "TokenAccount" && account.token;
  return (
    <>
      <TrackPage category="Send Flow" name="Step ConnectDevice" />
      <EnsureDeviceApp
        account={account ? getMainAccount(account, parentAccount) : null}
        isToken={!!token}
        waitBeforeSuccess={200}
        onSuccess={() => transitionTo("verification")}
      />
      {!token ? null : <TokenTips token={token} />}
    </>
  );
}
