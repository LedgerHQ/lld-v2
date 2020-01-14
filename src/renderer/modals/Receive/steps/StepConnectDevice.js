// @flow

import React from "react";
import { Trans } from "react-i18next";
import { getMainAccount } from "@ledgerhq/live-common/lib/account/helpers";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import EnsureDeviceApp from "~/renderer/components/EnsureDeviceApp";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import TrackPage from "~/renderer/analytics/TrackPage";

import type { StepProps } from "../Body";
import TokenTips from "../../TokenTips";

export default function StepConnectDevice({
  account,
  parentAccount,
  token,
  onChangeAppOpened,
}: StepProps) {
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;
  const tokenCur = (account && account.type === "TokenAccount" && account.token) || token;

  return (
    <>
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      <EnsureDeviceApp
        account={mainAccount}
        isToken={!!tokenCur}
        waitBeforeSuccess={200}
        onSuccess={() => onChangeAppOpened(true)}
      />
      {!tokenCur ? null : <TokenTips token={tokenCur} />}
    </>
  );
}

export function StepConnectDeviceFooter({
  t,
  transitionTo,
  isAppOpened,
  onSkipConfirm,
}: StepProps) {
  return (
    <Box horizontal flow={2}>
      <TrackPage category="Receive Flow" name="Step 2" />
      <Button
        event="Receive Flow Without Device Clicked"
        onClick={() => {
          onSkipConfirm();
          transitionTo("receive");
        }}
      >
        {t("receive.steps.connectDevice.withoutDevice")}
      </Button>
      <Button disabled={!isAppOpened} primary onClick={() => transitionTo("confirm")}>
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  );
}
