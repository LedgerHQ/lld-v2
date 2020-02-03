// @flow
import React, { useEffect, Component } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { setPreferredDeviceModel } from "~/renderer/actions/settings";
import { preferredDeviceModelSelector } from "~/renderer/reducers/settings";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { Device } from "~/renderer/reducers/devices";
import AutoRepair from "~/renderer/components/AutoRepair";
import useTheme from "~/renderer/hooks/useTheme";
import type { Config } from "./actions/shared";
import {
  renderAllowManager,
  renderAllowOpeningApp,
  renderBootloaderStep,
  renderConnectYourDevice,
  renderError,
  renderInWrongAppForAccount,
  renderLoading,
  renderRequestOpenApp,
  renderRequestQuitApp,
  renderRequiresAppInstallation,
} from "./rendering";

type OwnProps<R, H, P> = {
  overridesPreferredDeviceModel?: DeviceModelId,
  Success?: React$ComponentType<P>,
  onSuccess?: P => void,
  config: Config<R, H, P>,
  request: R,
};

type Props<R, H, P> = OwnProps<R, H, P> & {
  reduxDevice?: Device,
  preferredDeviceModel: DeviceModelId,
  dispatch: (*) => void,
};

class OnSuccess extends Component<*> {
  componentDidMount() {
    const { onSuccess, ...rest } = this.props;
    onSuccess(rest);
  }

  render() {
    return null;
  }
}

const DeviceAction = <R, H, P>({
  Success,
  onSuccess,
  reduxDevice,
  overridesPreferredDeviceModel,
  preferredDeviceModel,
  dispatch,
  // $FlowFixMe god of flow help me
  config,
  request,
}: Props<R, H, P>) => {
  const hookState = config.useHook(reduxDevice, request);
  const {
    device,
    unresponsive,
    error,
    isLoading,
    allowManagerRequestedWording,
    requestQuitApp,
    deviceInfo,
    repairModalOpened,
    requestOpenApp,
    allowOpeningRequestedWording,
    requiresAppInstallation,
    inWrongDeviceForAccount,
    onRetry,
    onAutoRepair,
    closeRepairModal,
    onRepairModal,
  } = hookState;

  const type = useTheme("colors.palette.type");

  const modelId = device ? device.modelId : overridesPreferredDeviceModel || preferredDeviceModel;
  useEffect(() => {
    if (modelId !== preferredDeviceModel) {
      dispatch(setPreferredDeviceModel(modelId));
    }
  }, [dispatch, modelId, preferredDeviceModel]);

  if (repairModalOpened && repairModalOpened.auto) {
    return <AutoRepair onDone={closeRepairModal} />;
  }

  if (requestOpenApp) {
    // Nano S 1.3.1. need to ask user to open the app.
    const { appName } = requestOpenApp;
    return renderRequestOpenApp({ modelId, type, appName });
  }

  if (requestQuitApp) {
    return renderRequestQuitApp({ modelId, type });
  }

  if (requiresAppInstallation) {
    const { appName } = requiresAppInstallation;
    return renderRequiresAppInstallation({ appName });
  }

  if (allowManagerRequestedWording) {
    const wording = allowManagerRequestedWording;
    return renderAllowManager({ modelId, type, wording });
  }

  if (allowOpeningRequestedWording) {
    const wording = allowOpeningRequestedWording;
    return renderAllowOpeningApp({ modelId, type, wording });
  }

  if (inWrongDeviceForAccount) {
    return renderInWrongAppForAccount({ onRetry });
  }

  if (!isLoading && error) {
    return renderError({ error, onRetry, withExportLogs: true });
  }

  if ((!isLoading && !device) || unresponsive) {
    return renderConnectYourDevice({ modelId, type, unresponsive, device, onRepairModal, onRetry });
  }

  if (isLoading) {
    return renderLoading({ modelId });
  }

  if (deviceInfo && deviceInfo.isBootloader) {
    return renderBootloaderStep({ onAutoRepair });
  }

  const payload = config.mapSuccess(hookState);

  if (!payload) {
    return null;
  }

  return (
    <>
      {Success ? <Success {...payload} /> : null}
      {onSuccess ? <OnSuccess onSuccess={onSuccess} {...payload} /> : null}
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  reduxDevice: getCurrentDevice,
  preferredDeviceModel: preferredDeviceModelSelector,
});

const component: React$ComponentType<OwnProps<*, *, *>> = connect(mapStateToProps)(DeviceAction);

export default component;
