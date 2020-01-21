// @flow

import invariant from "invariant";
import React, { useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import { prepareCurrency } from "~/renderer/bridge/cache";
import TrackPage from "~/renderer/analytics/TrackPage";
import ConnectDevice from "~/renderer/modals/ConnectDevice";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import { CurrencyCircleIcon } from "~/renderer/components/CurrencyBadge";
import ParentCryptoCurrencyIcon from "~/renderer/components/ParentCryptoCurrencyIcon";
import type { StepProps } from "..";

const StepConnectDevice = ({ currency, device, transitionTo }: StepProps) => {
  invariant(currency, "No crypto asset given");
  const { t } = useTranslation();

  useEffect(() => {
    if (currency && currency.type === "CryptoCurrency") {
      prepareCurrency(currency);
    }
  }, [currency]);

  const currencyName = `${currency.name} (${currency.ticker})`;

  return (
    <>
      <TrackPage category="AddAccounts" name="Step2" />
      <Box alignItems="center" mb={6}>
        {currency.type === "TokenCurrency" ? (
          <ParentCryptoCurrencyIcon currency={currency} bigger />
        ) : (
          <CurrencyCircleIcon size={40} currency={currency} />
        )}
        <Box
          mt={3}
          ff="Inter"
          fontSize={4}
          color="palette.text.shade100"
          textAlign="center"
          style={{ width: 370 }}
        >
          <Trans i18nKey="addAccounts.connectDevice.desc" parent="div">
            {`Follow the steps below to add `}
            <strong style={{ fontWeight: "bold" }}>{currencyName}</strong>
            {` accounts from your Ledger device.`}
          </Trans>
        </Box>
      </Box>
      <ConnectDevice
        t={t}
        deviceSelected={device}
        currency={currency.type === "TokenCurrency" ? currency.parentCurrency : currency}
        onStatusChange={(deviceStatus, appStatus) => {
          if (appStatus === "success") {
            transitionTo("import");
          }
        }}
      />
    </>
  );
};

export const StepConnectDeviceFooter = ({ transitionTo, isAppOpened }: StepProps) => {
  const { t } = useTranslation();
  return (
    <Button primary disabled={!isAppOpened} onClick={() => transitionTo("import")}>
      {t("common.continue")}
    </Button>
  );
};

export default StepConnectDevice;
