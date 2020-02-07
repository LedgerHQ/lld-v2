// @flow
import React, { memo, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsResult, Exec } from "@ledgerhq/live-common/lib/apps/types";
import type { Device } from "~/renderer/reducers/devices";
import { useAppsRunner, isIncompleteState } from "@ledgerhq/live-common/lib/apps";

import NavigationGuard from "~/renderer/components/NavigationGuard";
import Quit from "~/renderer/icons/Quit";

import AppList from "./AppsList";
import DeviceStorage from "../DeviceStorage/index";
import UpdateAllApps from "./UpdateAllApps";

import AppDepsInstallModal from "./AppDepsInstallModal";
import AppDepsUnInstallModal from "./AppDepsUnInstallModal";

import omit from "lodash/omit";
import ErrorModal from "~/renderer/modals/ErrorModal/index";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  animation: ${p => p.theme.animations.fadeIn};
`;

const QuitIconWrapper = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  width: ${p => p.theme.space[8]}px;
  height: ${p => p.theme.space[8]}px;
  color: ${p => p.theme.colors.palette.primary.main};
  background-color: ${p => p.theme.colors.palette.action.hover};
  border-radius: 100%;
  margin-top: -${p => p.theme.space[6]}px;
`;

type Props = {
  device: Device,
  deviceInfo: DeviceInfo,
  result: ListAppsResult,
  exec: Exec,
  t: TFunction,
};

const AppsList = ({ deviceInfo, result, exec, t }: Props) => {
  const [state, dispatch] = useAppsRunner(result, exec);
  const [error, setError] = useState();
  const [appInstallDep, setAppInstallDep] = useState(undefined);
  const [appUninstallDep, setAppUninstallDep] = useState(undefined);
  const filteredState = omit(state, "currentProgress");
  const progress = state.currentProgress;
  const isIncomplete = isIncompleteState(filteredState);

  const { installQueue, uninstallQueue, currentError } = filteredState;
  const onCloseDepsInstallModal = useCallback(() => setAppInstallDep(undefined), [
    setAppInstallDep,
  ]);

  const onCloseDepsUninstallModal = useCallback(() => setAppUninstallDep(undefined), [
    setAppUninstallDep,
  ]);

  const installState =
    installQueue.length > 0 ? (uninstallQueue.length > 0 ? "update" : "install") : "uninstall";

  useEffect(() => {
    if (currentError) setError(currentError.error);
  }, [currentError]);

  const onCloseError = useCallback(() => setError(), [setError]);

  return (
    <Container>
      <ErrorModal isOpened={!!error} error={error} onClose={onCloseError} />
      <NavigationGuard
        analyticsName="ManagerGuardModal"
        when={installQueue.length > 0 || uninstallQueue.length > 0}
        title={t(`errors.ManagerQuitPage.${installState}.title`)}
        renderIcon={() => (
          <QuitIconWrapper>
            <Quit size={30} />
          </QuitIconWrapper>
        )}
        desc={t(`errors.ManagerQuitPage.${installState}.description`)}
        confirmText={t(`errors.ManagerQuitPage.quit`)}
        cancelText={t(`errors.ManagerQuitPage.${installState}.stay`)}
      />
      <DeviceStorage state={filteredState} deviceInfo={deviceInfo} />
      <UpdateAllApps
        state={filteredState}
        dispatch={dispatch}
        isIncomplete={isIncomplete}
        progress={progress}
      />
      <AppList
        deviceInfo={deviceInfo}
        state={filteredState}
        dispatch={dispatch}
        isIncomplete={isIncomplete}
        progress={progress}
        setAppInstallDep={setAppInstallDep}
        setAppUninstallDep={setAppUninstallDep}
        t={t}
      />
      <AppDepsInstallModal
        app={appInstallDep}
        appList={filteredState.apps}
        dispatch={dispatch}
        onClose={onCloseDepsInstallModal}
      />
      <AppDepsUnInstallModal
        app={appUninstallDep}
        appList={filteredState.apps}
        installed={filteredState.installed}
        dispatch={dispatch}
        onClose={onCloseDepsUninstallModal}
      />
    </Container>
  );
};

const AppsListScreen = memo<Props>(AppsList);

export default withTranslation()(AppsListScreen);
