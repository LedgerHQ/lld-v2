// @flow
import React, { memo, useCallback, useMemo } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import manager from "@ledgerhq/live-common/lib/manager";

import type { App } from "@ledgerhq/live-common/lib/types/manager";
import type { Action } from "@ledgerhq/live-common/lib/apps/types";

import ConfirmModal from "~/renderer/modals/ConfirmModal/index";

import AppTree from "~/renderer/icons/AppTree";
import ListTreeLine from "~/renderer/icons/ListTreeLine";
import CollapsibleCard from "~/renderer/components/CollapsibleCard";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box/Box";

const IconsSection = styled.div`
  padding-top: ${p => p.theme.space[5]}px;
  height: ${p => p.theme.space[7]}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  margin: ${p => p.theme.space[2]}px 0px;
  color: ${p => p.theme.colors.grey};
`;

const ItemLine = styled(Box).attrs(() => ({
  flex: 1,
  horizontal: true,
  alignItems: "center",
  py: 1,
}))`
  height: ${p => p.theme.space[7]}px;
  position: relative;
`;

const ListIcon = styled(Box)`
  position: absolute;
  top: -28px;
`;

type Props = {
  app?: App,
  appList: App[],
  installed: *,
  dispatch: Action => void,
  onClose: () => void,
};

const AppDepsUninstallModal = ({ app, appList, installed, dispatch, onClose }: Props) => {
  const name = useMemo(() => app && app.name, [app]);
  const dependentApps = useMemo(
    () =>
      app &&
      appList.filter(a => installed.some(i => i.name === a.name) && a.dependencies.includes(name)),
    [app, appList, installed, name],
  );

  const onConfirm = useCallback(() => {
    if (name) dispatch({ type: "uninstall", name });
    onClose();
  }, [dispatch, name, onClose]);

  /** if no app with dependencies was triggered to be uninstalled we dont show anything */
  if (!app || !dependentApps) return null;

  return (
    <ConfirmModal
      analyticsName="ManagerConfirmationUninstallDeps"
      isOpened={!!app}
      onReject={onClose}
      onClose={onClose}
      onConfirm={onConfirm}
      centered
      title={
        <IconsSection>
          <AppTree uri={manager.getIconUrl(app.icon)} />
        </IconsSection>
      }
      subTitle={<Trans i18nKey="manager.apps.dependencyUninstall.title" values={{ app: name }} />}
      desc={<Trans i18nKey="manager.apps.dependencyUninstall.description" values={{ app: name }} />}
      confirmText={
        <Trans i18nKey="manager.apps.dependencyUninstall.confirm" values={{ app: name }} />
      }
    >
      <CollapsibleCard
        mt={20}
        bg="palette.background.default"
        header={
          <ItemLine>
            <Text ff="Inter|SemiBold" color="palette.primary.main" fontSize={4}>
              <Trans i18nKey="manager.apps.dependencyUninstall.showAll" />
            </Text>
          </ItemLine>
        }
      >
        {dependentApps.map(a => (
          <ItemLine px={4} key={`APP_DEPS_${a.name}`}>
            <ListIcon color="grey">
              <ListTreeLine size={55} />
            </ListIcon>
            <Box ml={4} mr={2}>
              <img alt="" src={manager.getIconUrl(a.icon)} width={22} height={22} />
            </Box>
            <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
              {a.name}
            </Text>
          </ItemLine>
        ))}
      </CollapsibleCard>
    </ConfirmModal>
  );
};

export default memo<Props>(AppDepsUninstallModal);
