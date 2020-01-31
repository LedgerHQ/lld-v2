// @flow
import React, { memo, useCallback, useState } from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsResult, Exec } from "@ledgerhq/live-common/lib/apps/types";
import type { Device } from "~/renderer/reducers/devices";
import { getActionPlan, useAppsRunner, isIncompleteState } from "@ledgerhq/live-common/lib/apps";

import omit from "lodash/omit";

import AppList from "./AppsList";
import DeviceStorage from "../DeviceStorage/index";
import UpdateAllApps from "./UpdateAllApps";

import AppDepsInstallModal from "./AppDepsInstallModal";
import AppDepsUnInstallModal from "./AppDepsUnInstallModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  animation: ${p => p.theme.animations.fadeIn};
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
  const [appInstallDep, setAppInstallDep] = useState(undefined);
  const [appUninstallDep, setAppUninstallDep] = useState(undefined);
  const filteredState = omit(state, "currentProgress");
  const progress = state.currentProgress;
  const plan = getActionPlan(filteredState) || [];
  const isIncomplete = isIncompleteState(filteredState);

  const onCloseDepsInstallModal = useCallback(() => setAppInstallDep(undefined), [
    setAppInstallDep,
  ]);

  const onCloseDepsUninstallModal = useCallback(() => setAppUninstallDep(undefined), [
    setAppUninstallDep,
  ]);

  return (
    <Container>
      <DeviceStorage state={filteredState} deviceInfo={deviceInfo} />
      <UpdateAllApps
        state={filteredState}
        dispatch={dispatch}
        isIncomplete={isIncomplete}
        plan={plan}
        progress={progress}
      />
      <AppList
        deviceInfo={deviceInfo}
        state={filteredState}
        dispatch={dispatch}
        plan={plan}
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
