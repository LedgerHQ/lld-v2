// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import lte from "semver/functions/lte";
import type {
  OsuFirmware,
  FinalFirmware,
  DeviceInfo,
} from "@ledgerhq/live-common/lib/types/manager";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import getCleanVersion from "~/renderer/screens/manager/FirmwareUpdate/getCleanVersion";
import IconInfoCircle from "~/renderer/icons/InfoCircle";

type Props = {
  firmware: ?{ osu: OsuFirmware, final: FinalFirmware },
  onClick: () => void,
  deviceInfo: DeviceInfo,
};

const UpdateFirmwareButton = ({ firmware, onClick, deviceInfo }: Props) => {
  const { t } = useTranslation();

  return firmware ? (
    <>
      <Box vertical alignItems="center" style={{ marginLeft: "auto", marginRight: 15 }}>
        <Text ff="Inter|SemiBold" fontSize={4} color="palette.text.shade100">
          {t("manager.firmware.latest", { version: getCleanVersion(firmware.final.name) })}
        </Text>
        {lte(deviceInfo.version, "1.4.2") && (
          <Box horizontal alignItems="center">
            <IconInfoCircle size={12} style={{ marginRight: 6 }} />
            <Text ff="Inter" fontSize={3} color="palette.text.shade60">
              {t("manager.firmware.removeApps")}
            </Text>
          </Box>
        )}
      </Box>

      <Button
        primary
        onClick={onClick}
        event={"Manager Firmware Update Click"}
        eventProperties={{
          firmwareName: firmware.final.name,
        }}
      >
        {t("manager.firmware.updateBtn")}
      </Button>
    </>
  ) : null;
};

export default UpdateFirmwareButton;
