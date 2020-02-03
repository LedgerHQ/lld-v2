// @flow

import React from "react";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import TrackPage from "~/renderer/analytics/TrackPage";
import DeviceAction from "~/renderer/components/DeviceAction";
import { config } from "~/renderer/components/DeviceAction/actions/app";

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
      <DeviceAction
        config={config}
        request={{ account: account ? getMainAccount(account, parentAccount) : null }}
        onSuccess={() => transitionTo("verification")}
      />
      {!token ? null : <TokenTips token={token} />}
    </>
  );
}
