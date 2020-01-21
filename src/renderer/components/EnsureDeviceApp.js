// @flow

import React, { Component } from "react";
import invariant from "invariant";
import { connect } from "react-redux";
import { Trans } from "react-i18next";
import { WrongDeviceForAccount } from "@ledgerhq/errors";
import type { Account, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import { getCryptoCurrencyIcon } from "@ledgerhq/live-common/lib/react";
import {
  isSegwitDerivationMode,
  getDerivationScheme,
  getDerivationModesForCurrency,
  runDerivationScheme,
} from "@ledgerhq/live-common/lib/derivation";
import logger from "~/logger";
import { createCancelablePolling } from "~/helpers/promise";
import { command } from "~/renderer/commands";
import DeviceInteraction from "~/renderer/components/DeviceInteraction";
import Text from "~/renderer/components/Text";
import AppConnect from "~/renderer/components/AppConnect";
import IconUsb from "~/renderer/icons/Usb";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import type { Device } from "~/renderer/reducers/devices";

const usbIcon = <IconUsb size={16} />;
const Bold = props => <Text ff="Inter|SemiBold" {...props} />;

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
});

type OwnProps = {
  account?: ?Account,
  currency?: ?CryptoCurrency,
  isToken?: boolean,
  onSuccess?: ({ device: Device }) => void,
};

type Props = OwnProps & {
  device: ?Device,
};

class EnsureDeviceApp extends Component<Props> {
  connectInteractionHandler = () =>
    createCancelablePolling(() => {
      // FIXME: use a real error ?
      if (!this.props.device) return Promise.reject(new Error());
      return Promise.resolve(this.props.device);
    });

  openAppInteractionHandler = ({ device }: { device: Device }) =>
    createCancelablePolling(async () => {
      const { account, currency: _currency } = this.props;
      const currency = account ? account.currency : _currency;
      invariant(currency, "No currency given");
      const address = await getAddressFromAccountOrCurrency(device, account, currency);
      if (account) {
        const { freshAddress } = account;
        if (account && freshAddress !== address) {
          logger.warn({ freshAddress, address });
          throw new WrongDeviceForAccount(`WrongDeviceForAccount ${account.name}`, {
            accountName: account.name,
          });
        }
      }
      return address;
    });

  renderOpenAppTitle = () => {
    const { account, currency, isToken } = this.props;
    const cur = account ? account.currency : currency;
    invariant(cur, "No currency given");
    return (
      <Trans i18nKey="deviceConnect.step2" parent="div">
        {"Open the "}
        <Bold>{cur.managerAppName + (isToken ? "*" : "")}</Bold>
        {" app on your device"}
      </Trans>
    );
  };

  render() {
    const { account, currency, device, ...props } = this.props;
    const cur = account ? account.currency : currency;
    const Icon = cur ? getCryptoCurrencyIcon(cur) : null;
    return (
      <DeviceInteraction
        key={device ? device.path : null}
        shouldRenderRetry
        steps={[
          {
            id: "device",
            title: (
              <Trans i18nKey="deviceConnect.step1" parent="div">
                {"Connect your"}
                <Bold>{"Ledger device"}</Bold>
                {"to your computer and enter your"}
                <Bold>{"PIN code"}</Bold>
                {"  on your device"}
              </Trans>
            ),
            icon: usbIcon,
            run: this.connectInteractionHandler,
          },
          {
            id: "address",
            title: this.renderOpenAppTitle,
            icon: Icon ? <Icon size={16} /> : null,
            run: this.openAppInteractionHandler,
          },
        ]}
        {...props}
      />
    );
  }
}

async function getAddressFromAccountOrCurrency(device, account, currency) {
  let derivationMode;
  let path;

  if (account) {
    derivationMode = account.derivationMode;
    path = account.freshAddressPath;
  } else {
    const modes = getDerivationModesForCurrency(currency);
    derivationMode = modes[modes.length - 1];
    path = runDerivationScheme(getDerivationScheme({ currency, derivationMode }), currency);
  }

  const { address } = await command("getAddress")({
    derivationMode,
    devicePath: device.path,
    currencyId: currency.id,
    path,
    segwit: isSegwitDerivationMode(derivationMode),
  }).toPromise();

  return address;
}

const Legacy: React$ComponentType<OwnProps> = connect(mapStateToProps)(EnsureDeviceApp);

const EXPERIMENTAL = true;

const EnsureDeviceAppDispatch = ({ isToken, ...props }: OwnProps) =>
  EXPERIMENTAL ? <AppConnect {...props} /> : <Legacy {...props} isToken={isToken} />;

export default EnsureDeviceAppDispatch;
