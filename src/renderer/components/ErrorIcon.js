// @flow
import React from "react";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import CrossCircle from "~/renderer/icons/CrossCircle";

import {
  UserRefusedAllowManager,
  UserRefusedFirmwareUpdate,
  UserRefusedOnDevice,
  UserRefusedAddress,
} from "@ledgerhq/errors";

export type ErrorIconProps = {
  error: Error,
  size?: number,
};

const ErrorIcon = ({ error, size = 44 }: ErrorIconProps) => {
  if (!error) return null;

  if (
    error instanceof UserRefusedAllowManager ||
    error instanceof UserRefusedFirmwareUpdate ||
    error instanceof UserRefusedOnDevice ||
    error instanceof UserRefusedAddress
  ) {
    return <CrossCircle size={size} />;
  }

  return <ExclamationCircleThin size={size} />;
};

export default ErrorIcon;
