// @flow
import React, { useMemo, memo, useCallback } from "react";
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

import IconCheckFull from "~/renderer/icons/CheckFull";
import AppActions from "./AppActions";

const AppRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid ${p => p.theme.colors.palette.text.shade10};
  padding: 20px;
  font-size: 12px;
`;

const AppName = styled.div`
  flex-direction: column;
  padding-left: 15px;
  & > * {
    display: block;
  }
`;

const AppSize = styled.div`
  flex: 0 0 50px;
  text-align: center;
  color: ${p => p.theme.colors.palette.text.shade60};
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
  addAccount?: (*) => void,
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
  addAccount,
}: Props) => {
  const { name } = app;
  const { deviceModel } = state;

  const currency = useMemo(() => app.currencyId && getCryptoCurrencyById(app.currencyId), [
    app.currencyId,
  ]);

  const notEnoughMemoryToInstall = useMemo(
    () => isOutOfMemoryState(predictOptimisticState(reducer(state, { type: "install", name }))),
    [name, state],
  );

  const isLiveSupported = !!currency && isCurrencySupported(currency);

  const onAddAccount = useCallback(() => {
    if (addAccount) addAccount(currency);
  }, [addAccount, currency]);

  return (
    <AppRow>
      <Box flex="0.7" horizontal>
        <img alt="" src={manager.getIconUrl(app.icon)} width={40} height={40} />
        <AppName>
          <Text ff="Inter|Bold" color="palette.text.shade100" fontSize={3}>{`${app.name}${
            currency ? ` (${currency.ticker})` : ""
          }`}</Text>
          <Text ff="Inter|Regular" color="palette.text.shade60" fontSize={3}>
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
        {isLiveSupported && (
          <>
            <Box mr={1}>
              <IconCheckFull size={16} />
            </Box>
            <Text ml={1} ff="Inter|Regular" color="palette.text.shade60" fontSize={3}>
              <Trans i18nKey="manager.applist.item.supported" />
            </Text>
          </>
        )}
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
        isLiveSupported={isLiveSupported}
        addAccount={onAddAccount}
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
