// @flow

import invariant from "invariant";
import React from "react";
import { Trans } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import { CurrencyCircleIcon } from "~/renderer/components/CurrencyBadge";
import Box from "~/renderer/components/Box";
import ConnectDevice from "~/renderer/modals/ConnectDevice";
import type { StepProps } from "~/renderer/modals/MigrateAccounts";

const StepConnectDevice = ({ t, currency, device, transitionTo }: StepProps) => {
  invariant(currency, "No crypto asset given");

  const currencyName = `${currency.name} (${currency.ticker})`;
  return (
    <>
      <TrackPage category="MigrateAccounts" name="Step2" />
      <Box alignItems="center" mb={6}>
        <CurrencyCircleIcon borderRadius="10px" mb={15} size={40} currency={currency} />
        <Box
          ff="Inter|Regular"
          fontSize={6}
          color="palette.text.shade100"
          textAlign="center"
          style={{ width: 370 }}
        >
          <Trans
            i18nKey="migrateAccounts.connectDevice.title"
            parent="div"
            values={{ currencyName }}
          />
        </Box>
      </Box>
      <ConnectDevice
        t={t}
        deviceSelected={device}
        currency={currency}
        onStatusChange={(deviceStatus, appStatus) => {
          if (appStatus === "success") {
            transitionTo("currency");
          }
        }}
      />
    </>
  );
};

export default StepConnectDevice;
