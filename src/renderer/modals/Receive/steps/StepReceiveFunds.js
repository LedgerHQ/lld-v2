// @flow

import invariant from "invariant";
import React, { PureComponent } from "react";
import { getMainAccount, getAccountName } from "@ledgerhq/live-common/lib/account";
import TrackPage from "~/renderer/analytics/TrackPage";
import { command } from "~/renderer/commands";
import Box from "~/renderer/components/Box";
import CurrentAddress from "~/renderer/components/CurrentAddress";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import { DisconnectedDevice, WrongDeviceForAccount } from "@ledgerhq/errors";

import type { StepProps } from "../Body";

export default class StepReceiveFunds extends PureComponent<StepProps> {
  componentDidMount() {
    if (this.props.isAddressVerified === null) {
      this.confirmAddress();
    }
  }

  confirmAddress = async () => {
    const { account, parentAccount, device, onChangeAddressVerified, transitionTo } = this.props;
    try {
      if (!device || !account) {
        throw new DisconnectedDevice();
      }
      const mainAccount = getMainAccount(account, parentAccount);
      const { address } = await command("getAddress")({
        derivationMode: mainAccount.derivationMode,
        currencyId: mainAccount.currency.id,
        devicePath: device.path,
        path: mainAccount.freshAddressPath,
        verify: true,
      }).toPromise();

      if (address !== mainAccount.freshAddress) {
        throw new WrongDeviceForAccount(`WrongDeviceForAccount ${mainAccount.name}`, {
          accountName: mainAccount.name,
        });
      }
      onChangeAddressVerified(true);
      transitionTo("receive");
    } catch (err) {
      // TODO
      onChangeAddressVerified(false, err);
      // this.props.transitionTo("confirm");
    }
  };

  handleGoPrev = () => {
    // FIXME this is not a good practice at all. it triggers tons of setState. these are even concurrent setState potentially in future React :o
    this.props.onChangeAddressVerified(null);
    this.props.onChangeAppOpened(false);
    this.props.onResetSkip();
    this.props.transitionTo("device");
  };

  render() {
    const { account, parentAccount, isAddressVerified, verifyAddressError, token } = this.props;
    const mainAccount = account ? getMainAccount(account, parentAccount) : null;
    invariant(account && mainAccount, "No account given");
    const name = token ? token.name : getAccountName(account);
    return (
      <Box flow={5}>
        <TrackPage category="Receive Flow" name="Step 4" />
        {verifyAddressError ? (
          <ErrorDisplay error={verifyAddressError} onRetry={this.handleGoPrev} />
        ) : (
          <CurrentAddress
            name={name}
            currency={mainAccount.currency}
            address={mainAccount.freshAddress}
            isAddressVerified={isAddressVerified}
            onVerify={this.handleGoPrev}
            withBadge
            withFooter
            withQRCode
          />
        )}
      </Box>
    );
  }
}
