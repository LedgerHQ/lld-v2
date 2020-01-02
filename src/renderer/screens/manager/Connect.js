// @flow

import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { timeout } from "rxjs/operators";
import { connect } from "react-redux";
import { Trans, useTranslation } from "react-i18next";
import manager from "@ledgerhq/live-common/lib/manager";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import { DeviceNotGenuineError, UnexpectedBootloader } from "@ledgerhq/errors";

import logger from "~/logger";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { createCancelablePolling } from "~/helpers/promise";
import { DEVICE_INFOS_TIMEOUT } from "~/config/constants";
import { createStructuredSelector } from "reselect";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import DeviceInteraction from "~/renderer/components/DeviceInteraction";
import { ErrorDescContainer } from "~/renderer/components/DeviceInteraction/components";

import { command } from "~/renderer/commands";
import IconUsb from "~/renderer/icons/Usb";
import IconHome from "~/renderer/icons/Home";
import IconCheck from "~/renderer/icons/Check";
import ConnectTroubleshooting from "~/renderer/components/ConnectTroubleshooting";
import type { Device } from "@ledgerhq/hw-transport/lib/Transport";
import AutoRepair from "~/renderer/components/AutoRepair";

type OwnProps = {
  onFail?: Error => void,
  onUnavailable?: Error => void,
  onSuccess: (*) => void,
};

type Props = OwnProps & {
  device: ?Device,
};

const usbIcon = <IconUsb size={16} />;
const homeIcon = <IconHome size={16} />;
const genuineCheckIcon = <IconCheck size={16} />;

const Bold = props => <Text ff="Inter|SemiBold" {...props} />;

const Connect = ({ device, onSuccess, onFail, onUnavailable, ...props }: Props) => {
  const sub = useRef(null);

  const [isBootloader, setIsBootloader] = useState(false);
  const [autoRepair, setAutoRepair] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      if (sub && sub.current) sub.current.unsubscribe();
    };
  }, []);

  const connectInteractionHandler = useCallback(
    () =>
      createCancelablePolling(() => {
        if (!device) return Promise.reject(new Error());
        return Promise.resolve(device);
      }),
    [device],
  );

  const checkDashboardInteractionHandler = ({ device }: { device: Device }) => {
    return createCancelablePolling(async () =>
      command("getDeviceInfo")({ devicePath: device.path })
        .pipe(timeout(DEVICE_INFOS_TIMEOUT))
        .toPromise(),
    );
  };

  const onStartAutoRepair = useCallback(() => setAutoRepair(true), [setAutoRepair]);
  const onDoneAutoRepair = useCallback(() => setAutoRepair(false), [setAutoRepair]);

  const handleFail = useCallback(
    (err: Error) => {
      if (err instanceof DeviceNotGenuineError) {
        onFail && onFail(err);
      } else {
        onUnavailable && onUnavailable(err);
      }
    },
    [onFail, onUnavailable],
  );

  const listAppsHandler = async ({
    device,
    deviceInfo,
  }: {
    device: Device,
    deviceInfo: DeviceInfo,
  }) => {
    if (deviceInfo.isBootloader) {
      logger.log("device is in bootloader mode");
      setIsBootloader(true);
      throw new UnexpectedBootloader();
    }
    setIsBootloader(false);

    if (deviceInfo.isOSU) {
      logger.log("device is in update mode. skipping genuine");
      return null;
    }

    // Preload things in parallel
    manager.getLatestFirmwareForDevice(deviceInfo).catch(e => {
      logger.warn(e);
    });

    return new Promise((resolve, reject) => {
      sub.current = command("listApps")({ devicePath: device.path, deviceInfo }).subscribe({
        next: e => {
          if (e.type === "result") {
            resolve(e.result);
          }
          // device-permission-requested and device-permission-granted available
        },
        error: err => reject(err),
      });
    });
  };

  const renderRepair = useCallback(() => {
    if (!isRepairing && device) {
      if (!isBootloader) {
        return null;
      }
      return (
        <Box
          fontSize={3}
          color="palette.text.shade100"
          alignItems="center"
          cursor="text"
          ff="Inter|SemiBold"
        >
          <Box mt={4} mb={2}>
            <Trans
              i18nKey="genuinecheck.deviceInBootloader"
              values={{
                button: t("common.continue"),
              }}
            />
          </Box>
          <Button primary onClick={onStartAutoRepair} event="RepairBootloaderButton">
            {t("common.continue")}
          </Button>
        </Box>
      );
    }

    return <ConnectTroubleshooting onRepair={setIsRepairing} />;
  }, [device, isBootloader, isRepairing, setIsRepairing, onStartAutoRepair, t]);

  const steps = [
    {
      id: "device",
      title: (
        <Trans i18nKey="deviceConnect.step1" parent="div">
          {"Connect and unlock your"}
          <Bold>{"Ledger device"}</Bold>
        </Trans>
      ),
      icon: usbIcon,
      run: connectInteractionHandler,
    },
    {
      id: "deviceInfo",
      title: (
        <Trans i18nKey="deviceConnect.dashboard" parent="div">
          {"Navigate to the"}
          <Bold>{"Dashboard"}</Bold>
          {"on your device"}
        </Trans>
      ),
      icon: homeIcon,
      run: checkDashboardInteractionHandler,
    },
    {
      id: "listAppsRes",
      title: (
        <Trans i18nKey="deviceConnect.step3" parent="div">
          {"Allow"}
          <Bold>{"Ledger Manager"}</Bold>
          {"on your device"}
        </Trans>
      ),
      icon: genuineCheckIcon,
      run: listAppsHandler,
    },
  ];

  return (
    <Fragment>
      <DeviceInteraction
        disabled={isRepairing}
        key={device ? device.path : null}
        {...props}
        waitBeforeSuccess={500}
        steps={steps}
        onSuccess={onSuccess}
        onFail={handleFail}
        renderError={(error, retry) =>
          device && isBootloader ? null : (
            <ErrorDescContainer error={error} onRetry={retry} mt={4} />
          )
        }
      />
      {autoRepair ? <AutoRepair onDone={onDoneAutoRepair} /> : null}
      {renderRepair()}
    </Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
});

const ConnectedConnect: React$ComponentType<OwnProps> = connect(mapStateToProps)(Connect);

export default ConnectedConnect;
