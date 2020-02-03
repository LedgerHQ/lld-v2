// @flow

import React from "react";
import type { Account, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import DeviceAction from "~/renderer/components/DeviceAction";
import { action } from "~/renderer/components/DeviceAction/actions/app";

type Props = {
  account?: ?Account,
  currency?: ?CryptoCurrency,
  onStatusChange: (string, string) => void,
};

const StepConnectDevice = ({ account, currency, onStatusChange }: Props) =>
  account || currency ? (
    <DeviceAction
      action={action}
      request={{ account, currency }}
      onResult={() => {
        onStatusChange("success", "success");
      }}
    />
  ) : null;

export default StepConnectDevice;
