// @flow

import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import { getDeviceModel } from "@ledgerhq/devices";
import type { DeviceInfo, FirmwareUpdateContext } from "@ledgerhq/live-common/lib/types/manager";
import type { T } from "~/types/common";
import { command } from "~/renderer/commands";
import type { Device } from "~/renderer/reducers/devices";
import DisclaimerModal from "~/renderer/modals/DisclaimerModal";
import UpdateModal from "~/renderer/modals/UpdateFirmwareModal";
import type { StepId } from "~/renderer/modals/UpdateFirmwareModal";
import Tooltip from "~/renderer/components/Tooltip";
import Box, { Card } from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import NanoS from "~/renderer/icons/device/NanoS";
import NanoX from "~/renderer/icons/device/NanoX";
import Blue from "~/renderer/icons/device/Blue";
import CheckFull from "~/renderer/icons/CheckFull";
import UpdateFirmwareButton from "./UpdateFirmwareButton";
import type { ModalStatus } from "./types";

const Icon = ({ type }: { type: string }) => {
  switch (type) {
    case "blue":
      return <Blue size={30} />;
    case "nanoX":
      return <NanoX size={30} />;
    default:
      return <NanoS size={30} />;
  }
};

type Props = {
  t: T,
  deviceInfo: DeviceInfo,
  device: Device,
};

type State = {
  firmware: ?FirmwareUpdateContext,
  modal: ModalStatus,
  stepId: StepId,
  ready: boolean,
  error: ?Error,
};

const initialStepId = ({ deviceInfo, device }): StepId =>
  deviceInfo.isOSU
    ? "updateMCU"
    : getDeviceModel(device.modelId).id === "blue"
    ? "resetDevice"
    : "idCheck";

const initializeState = (props: Props): State => ({
  firmware: null,
  modal: "closed",
  stepId: initialStepId(props),
  ready: false,
  error: null,
});

class FirmwareUpdate extends PureComponent<Props, State> {
  state = initializeState(this.props);

  async componentDidMount() {
    const { deviceInfo } = this.props;
    try {
      const firmware = await command("getLatestFirmwareForDevice")(deviceInfo).toPromise();
      if (firmware && !this._unmounting) {
        this.setState({
          firmware,
          ready: true,
          modal: deviceInfo.isOSU ? "install" : "closed",
          stepId: initialStepId(this.props),
        });
      }
    } catch (error) {
      this.setState({
        ready: true,
        modal: deviceInfo.isOSU ? "install" : "closed",
        stepId: "finish",
        error,
      });
    }
  }

  componentWillUnmount() {
    this._unmounting = true;
  }

  _unmounting = false;

  handleCloseModal = () => this.setState({ modal: "closed" });

  handleDisclaimerModal = () => this.setState({ modal: "disclaimer" });

  handleDisclaimerNext = () => this.setState({ modal: "install" });

  render() {
    const { deviceInfo, t, device } = this.props;
    const { firmware, modal, stepId, ready, error } = this.state;

    const deviceSpecs = getDeviceModel(device.modelId);

    return (
      <Card p={4}>
        <Box horizontal alignItems="center" flow={2}>
          <Box color="palette.text.shade100">
            <Icon type={deviceSpecs.id} />
          </Box>
          <Box>
            <Box horizontal alignItems="center">
              <Text ff="Inter|SemiBold" fontSize={4} color="palette.text.shade100">
                {deviceSpecs.productName}
              </Text>
              <Box color="wallet" ml={2}>
                <Tooltip content={t("manager.yourDeviceIsGenuine")}>
                  <CheckFull size={13} tickColor="white" />
                </Tooltip>
              </Box>
            </Box>
            <Text ff="Inter|SemiBold" fontSize={2}>
              {t("manager.firmware.installed", {
                version: deviceInfo.version,
              })}
            </Text>
          </Box>
          <UpdateFirmwareButton
            deviceInfo={deviceInfo}
            firmware={firmware}
            onClick={this.handleDisclaimerModal}
          />
        </Box>
        {ready ? (
          <>
            <DisclaimerModal
              firmware={firmware}
              deviceInfo={deviceInfo}
              status={modal}
              goToNextStep={this.handleDisclaimerNext}
              onClose={this.handleCloseModal}
            />
            <UpdateModal
              status={modal}
              stepId={stepId}
              onClose={this.handleCloseModal}
              firmware={firmware}
              error={error}
              deviceModelId={deviceSpecs.id}
            />
          </>
        ) : null}
      </Card>
    );
  }
}

export default withTranslation()(FirmwareUpdate);
