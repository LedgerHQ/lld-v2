// @flow
import React, { useMemo, memo } from "react";
import {
  isOutOfMemoryState,
  predictOptimisticState,
  reducer,
} from "@ledgerhq/live-common/lib/apps";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { isCurrencySupported } from "@ledgerhq/live-common/lib/data/cryptocurrencies";
import type { App } from "@ledgerhq/live-common/lib/types/manager";
import type { State, Action, InstalledItem, AppOp } from "@ledgerhq/live-common/lib/apps/types";

import styled from "styled-components";
import { Trans } from "react-i18next";
import manager from "@ledgerhq/live-common/lib/manager";

import ByteSize from "~/renderer/components/ByteSize";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import Tooltip from "~/renderer/components/Tooltip";

import IconLoader from "~/renderer/icons/Loader";
import AppActions from "./AppActions";

const AppRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid ${p => p.theme.colors.palette.text.shade10};
  padding: 20px;
  font-size: 12px;
  animation: ${p => p.theme.animations.fadeIn};
`;

const AppName = styled.div`
  flex-direction: column;
  padding-left: 15px;
  & > * {
    display: block;
  }
`;

const AppSize = styled.div`
  flex: 0.5;
  text-align: center;
  color: ${p => p.theme.colors.palette.text.shade40};
`;

const LiveCompatible = styled.div`
  width: 100px;
  text-align: center;
  & > * > * {
    align-items: center;
    justify-content: center;
    padding: 3px;
    display: flex;
    color: ${p => p.theme.colors.palette.background.paper};
    background: ${p => p.theme.colors.palette.primary.main};
    border-radius: 50%;
  }
`;

type Props = {
  state: State,
  app: App,
  installed: ?InstalledItem,
  dispatch: Action => void,
  appStoreView: boolean,
  onlyUpdate?: boolean,
  forceUninstall?: boolean,
  showActions?: boolean,
  progress: ?{ appOp: AppOp, progress: number },
  setAppInstallDep?: App => void,
  setAppUninstallDep?: App => void,
};

// eslint-disable-next-line react/display-name
const Item: React$ComponentType<Props> = ({
  state,
  app,
  installed,
  dispatch,
  appStoreView,
  onlyUpdate,
  forceUninstall,
  showActions = true,
  progress,
  setAppInstallDep,
  setAppUninstallDep,
}: Props) => {
  const { name } = app;
  const { deviceModel } = state;

  const notEnoughMemoryToInstall = useMemo(
    () => isOutOfMemoryState(predictOptimisticState(reducer(state, { type: "install", name }))),
    [name, state],
  );

  const isLiveSupported =
    app.currencyId && isCurrencySupported(getCryptoCurrencyById(app.currencyId));

  return (
    <AppRow>
      <Box flex="1" horizontal>
        <img alt="" src={manager.getIconUrl(app.icon)} width={40} height={40} />
        <AppName>
          <Text ff="Inter|Bold" color="palette.text.shade100" fontSize={3}>{`${app.name}${
            app.currencyId ? ` (${getCryptoCurrencyById(app.currencyId).ticker})` : ""
          }`}</Text>
          <Text ff="Inter|Regular" color="palette.text.shade50" fontSize={3}>
            <Trans
              i18nKey={
                installed && !installed.updated
                  ? "manager.applist.item.versionNew"
                  : "manager.applist.item.version"
              }
              values={{ version: app.version }}
            />
          </Text>
        </AppName>
      </Box>
      <AppSize>
        <ByteSize
          value={((installed && installed.blocks) || 0) * deviceModel.blockSize || app.bytes || 0}
          deviceModel={deviceModel}
        />
      </AppSize>
      <Box flex="0.5" horizontal alignContent="center" justifyContent="center">
        <LiveCompatible>
          {isLiveSupported ? (
            <Tooltip content={<Trans i18nKey="manager.applist.item.supported" />}>
              <IconLoader size={16} />
            </Tooltip>
          ) : null}
        </LiveCompatible>
      </Box>
      <AppActions
        state={state}
        app={app}
        installed={installed}
        dispatch={dispatch}
        forceUninstall={forceUninstall}
        appStoreView={appStoreView}
        onlyUpdate={onlyUpdate}
        showActions={showActions}
        notEnoughMemoryToInstall={notEnoughMemoryToInstall}
        progress={progress}
        setAppInstallDep={setAppInstallDep}
        setAppUninstallDep={setAppUninstallDep}
      />
    </AppRow>
  );
};

export default memo<Props>(
  Item,
  (
    {
      state: { installQueue: _installQueue, uninstallQueue: _uninstallQueue },
      progress: _progress,
    },
    { state: { installQueue, uninstallQueue }, progress },
  ) => {
    /** compare _prev to next props that if different should trigger a rerender */
    return (
      progress === _progress &&
      installQueue.length === _installQueue.length &&
      uninstallQueue.length === _uninstallQueue.length
    );
  },
);
