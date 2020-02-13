// @flow
import React, { useCallback, useMemo, memo } from "react";

import type { App } from "@ledgerhq/live-common/lib/types/manager";
import type { State, Action, InstalledItem, AppOp } from "@ledgerhq/live-common/lib/apps/types";

import styled from "styled-components";
import { Trans } from "react-i18next";

import Text from "~/renderer/components/Text";
import Tooltip from "~/renderer/components/Tooltip";
import Button from "~/renderer/components/Button";
import Progress from "~/renderer/screens/manager/AppsList/Progress";

import { colors } from "~/renderer/styles/theme";

import AccountAdd from "~/renderer/icons/AccountAdd";
import IconCheck from "~/renderer/icons/Check";
import IconTrash from "~/renderer/icons/Trash";
import IconArrowDown from "~/renderer/icons/ArrowDown";

const AppActionsWrapper = styled.div`
  display: flex;
  flex: 1;
  min-width: 150px;
  justify-content: flex-end;
  flex-direction: row;
  > *:not(:last-child) {
    margin-right: 10px;
  }
`;

const SuccessInstall = styled.div`
  color: ${p => p.theme.colors.positiveGreen};
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  > svg {
    padding-right: 5px;
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
  notEnoughMemoryToInstall: boolean,
  showActions?: boolean,
  progress: ?{ appOp: AppOp, progress: number },
  setAppInstallDep?: App => void,
  setAppUninstallDep?: App => void,
  isLiveSupported: boolean,
  addAccount?: () => void,
};

// eslint-disable-next-line react/display-name
const AppActions: React$ComponentType<Props> = React.memo(
  ({
    state,
    app,
    installed,
    dispatch,
    forceUninstall,
    appStoreView,
    onlyUpdate,
    notEnoughMemoryToInstall,
    showActions = true,
    progress,
    setAppInstallDep,
    setAppUninstallDep,
    isLiveSupported,
    addAccount,
  }: Props) => {
    const { name, dependencies } = app;
    const {
      apps,
      installed: installedList,
      installedAvailable,
      installQueue,
      uninstallQueue,
    } = state;

    const needsInstallDeps = useMemo(
      () =>
        dependencies &&
        dependencies.some(
          dep => installedList.every(app => app.name !== dep) && !installQueue.includes(dep),
        ),
      [dependencies, installQueue, installedList],
    );

    const needsUninstallDeps = useMemo(
      () =>
        apps
          .filter(a => installedList.some(i => i.name === a.name))
          .some(({ dependencies }) => dependencies.includes(name)),
      [apps, installedList, name],
    );

    const onInstall = useCallback(() => {
      if (needsInstallDeps && setAppInstallDep) setAppInstallDep(app);
      else dispatch({ type: "install", name });
    }, [app, dispatch, name, needsInstallDeps, setAppInstallDep]);

    const onUninstall = useCallback(() => {
      if (needsUninstallDeps && setAppUninstallDep) setAppUninstallDep(app);
      else dispatch({ type: "uninstall", name });
    }, [app, dispatch, name, needsUninstallDeps, setAppUninstallDep]);

    const onAddAccount = useCallback(() => {
      if (addAccount) addAccount();
    }, [addAccount]);

    const installing = useMemo(() => installQueue.includes(name), [installQueue, name]);
    const uninstalling = useMemo(() => uninstallQueue.includes(name), [uninstallQueue, name]);

    const canAddAccount = useMemo(
      () => installed && installQueue.length <= 0 && uninstallQueue.length <= 0,
      [installQueue.length, installed, uninstallQueue.length],
    );

    return (
      <AppActionsWrapper>
        {installing || uninstalling ? (
          <Progress currentProgress={progress} />
        ) : (
          showActions && (
            <>
              {isLiveSupported && !appStoreView && (
                <Tooltip
                  content={
                    canAddAccount ? null : <Trans i18nKey="manager.applist.item.addAccountWarn" />
                  }
                >
                  <Button
                    color={canAddAccount ? "palette.primary.main" : "palette.text.shade40"}
                    inverted
                    style={{ display: "flex", background: "transparent" }}
                    fontSize={3}
                    disabled={!canAddAccount}
                    onClick={onAddAccount}
                    event="Manager AddAccount Click"
                    eventProperties={{
                      appName: name,
                      appVersion: app.version,
                    }}
                  >
                    <AccountAdd size={16} />
                    <Text style={{ marginLeft: 8 }}>
                      <Trans i18nKey="manager.applist.item.addAccount" />
                    </Text>
                  </Button>
                </Tooltip>
              )}
              {appStoreView && installed && (
                <SuccessInstall>
                  <IconCheck size={16} />
                  <Text ff="Inter|SemiBold" fontSize={4}>
                    <Trans i18nKey="manager.applist.item.installed" />
                  </Text>
                </SuccessInstall>
              )}

              {!installed && (
                <Tooltip
                  content={
                    notEnoughMemoryToInstall ? (
                      <Trans i18nKey="manager.applist.item.notEnoughSpace" />
                    ) : null
                  }
                >
                  <Button
                    style={{ display: "flex" }}
                    lighterPrimary
                    disabled={notEnoughMemoryToInstall}
                    onClick={onInstall}
                    event="Manager Install Click"
                    eventProperties={{
                      appName: name,
                      appVersion: app.version,
                    }}
                  >
                    <IconArrowDown size={14} />
                    <Text style={{ marginLeft: 8 }}>
                      <Trans i18nKey="manager.applist.item.install" />
                    </Text>
                  </Button>
                </Tooltip>
              )}
              {(((installed || !installedAvailable) && !appStoreView && !onlyUpdate) ||
                forceUninstall) && (
                <Button
                  style={{ padding: 13 }}
                  onClick={onUninstall}
                  event="Manager Uninstall Click"
                  eventProperties={{
                    appName: name,
                    appVersion: app.version,
                  }}
                >
                  <IconTrash color={colors.grey} size={14} />
                </Button>
              )}
            </>
          )
        )}
      </AppActionsWrapper>
    );
  },
);

export default memo<Props>(AppActions);
