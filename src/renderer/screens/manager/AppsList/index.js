// @flow
import React, { memo } from "react";
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

type Props = {
  device: Device,
  deviceInfo: DeviceInfo,
  result: ListAppsResult,
  exec: Exec,
  t: TFunction,
};

const AppsList = ({ deviceInfo, result, exec, t }: Props) => {
  const [state, dispatch] = useAppsRunner(result, exec);
  const filteredState = omit(state, "currentProgress");
  const progress = state.currentProgress;
  const plan = getActionPlan(filteredState) || [];
  const isIncomplete = isIncompleteState(filteredState);

  return (
    <>
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
        t={t}
      />
    </>
  );
};

const AppsListScreen = memo<Props>(AppsList);

export default withTranslation()(AppsListScreen);
