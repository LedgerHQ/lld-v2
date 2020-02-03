// @flow

import React from "react";
import type { Account, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import DeviceAction from "~/renderer/components/DeviceAction";
import { config } from "~/renderer/components/DeviceAction/actions/app";
import type { Device } from "~/renderer/reducers/devices";

type Props = {
  account?: ?Account,
  currency?: ?CryptoCurrency,
  onChangeDevice?: Device => void,
  onStatusChange: (string, string) => void,
};

const StepConnectDevice = ({ account, currency, onChangeDevice, onStatusChange }: Props) =>
  account || currency ? (
    <DeviceAction
      config={config}
      request={{ account, currency }}
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
