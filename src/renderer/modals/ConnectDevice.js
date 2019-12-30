// @flow

import React from "react";
import type { Account, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import EnsureDeviceApp from "~/renderer/components/EnsureDeviceApp";
import type { Device } from "~/renderer/reducers/devices";

type Props = {
  account?: ?Account,
  currency?: ?CryptoCurrency,
  onChangeDevice?: Device => void,
  onStatusChange: (string, string) => void,
};

const StepConnectDevice = ({ account, currency, onChangeDevice, onStatusChange }: Props) =>
  account || currency ? (
    <EnsureDeviceApp
      account={account}
      currency={currency}
      waitBeforeSuccess={200}
      onSuccess={({ device }) => {
        // TODO: remove those nonsense callbacks
        if (onChangeDevice) {
          onChangeDevice(device);
        }
        onStatusChange("success", "success");
      }}
    />
  ) : null;

export default StepConnectDevice;
