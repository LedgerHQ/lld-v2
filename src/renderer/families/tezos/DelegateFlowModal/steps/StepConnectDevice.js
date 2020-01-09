// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import TrackPage from "~/renderer/analytics/TrackPage";
import Button from "~/renderer/components/Button";
import EnsureDeviceApp from "~/renderer/components/EnsureDeviceApp";
import TokenTips from "~/renderer/modals/TokenTips";

import type { StepProps } from "../types";

const StepConnectDevice = ({ account, parentAccount, onChangeAppOpened }: StepProps) => {
  const token = account && account.type === "TokenAccount" && account.token;
  return (
    <>
      <TrackPage category="Send Flow" name="Step ConnectDevice" />
      <EnsureDeviceApp
        account={account ? getMainAccount(account, parentAccount) : null}
        isToken={!!token}
        waitBeforeSuccess={200}
        onSuccess={() => onChangeAppOpened(true)}
      />
      {!token ? null : <TokenTips token={token} />}
    </>
  );
};

export const StepConnectDeviceFooter = ({ transitionTo, isAppOpened }: StepProps) => {
  const { t } = useTranslation();
  return (
    <Button disabled={!isAppOpened} primary onClick={() => transitionTo("verification")}>
      {t("common.continue")}
    </Button>
  );
};

export default StepConnectDevice;
