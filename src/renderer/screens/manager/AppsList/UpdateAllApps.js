// @flow
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";

import styled from "styled-components";

import { Trans } from "react-i18next";

import type { State, AppOp, Action } from "@ledgerhq/live-common/lib/apps/types";

import CollapsibleCard from "~/renderer/components/CollapsibleCard";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box/Box";
import FadeInOutBox from "~/renderer/components/FadeInOutBox";
import Button from "~/renderer/components/Button";

import IconLoader from "~/renderer/icons/Loader";

import Item from "./Item";
import Progress from "~/renderer/components/Progress";
import get from "lodash/get";

const UpdatableHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 20px 10px 0px;
  height: 48px;
  box-sizing: content-box;
`;

const Badge = styled(Text)`
  border-radius: 29px;
  background-color: ${p => p.theme.colors.palette.primary.main};
  color: ${p => p.theme.colors.palette.background.paper};
  height: 18px;
  display: flex;
  align-items: center;
  padding: 0px 8px;
  margin-left: 10px;
`;

const ProgressHolder = styled.div`
  width: 100px;
  height: 5px;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
`;

type Props = {
  state: State,
  dispatch: Action => void,
  plan: AppOp[],
  isIncomplete: boolean,
  progress: *,
};

const UpdateAllApps = ({ state, dispatch, plan, isIncomplete, progress }: Props) => {
  const [appsUpdating, setAppsUpdating] = useState([]);

  const { apps, installed, installQueue, uninstallQueue } = state;

  const updatableAppList = useMemo(
    () => apps.filter(({ name }) => installed.some(i => i.name === name && !i.updated)),
    [apps, installed],
  );

  const updateProgress = useMemo(() => {
    return (
      (appsUpdating.length * 2 - (uninstallQueue.length + installQueue.length)) /
        (appsUpdating.length * 2) || 0
    );
  }, [appsUpdating, uninstallQueue, installQueue]);

  useEffect(() => {
    if (updateProgress >= 1) setAppsUpdating([]);
  }, [updateProgress]);

  const onUpdateAll = useCallback(() => {
    setAppsUpdating(updatableAppList);
    dispatch({ type: "updateAll" });
  }, [dispatch, setAppsUpdating, updatableAppList]);

  const updateHeader =
    appsUpdating.length > 0 ? (
      <>
        <Box vertical>
          <Text ff="Inter|SemiBold" fontSize={5} color="palette.primary.main">
            <Trans
              i18nKey="manager.applist.updatable.progressTitle"
              values={{ number: appsUpdating.length }}
            />
          </Text>
          <Text ff="Inter|SemiBold" fontSize={2} color="palette.text.shade60">
            <Trans i18nKey="manager.applist.updatable.progressWarning" />
          </Text>
        </Box>
        <Box flex={1} />
        <Box vertical alignItems="flex-end">
          <Box
            flex="0 0 auto"
            horizontal
            alignItems="center"
            justifyContent="center"
            py={1}
            maxWidth="100%"
          >
            <Text ff="Inter|SemiBold" fontSize={3} color="palette.primary.main">
              <Trans i18nKey="manager.applist.updatable.progress" />
            </Text>
          </Box>
          <ProgressHolder>
            <Progress progress={updateProgress} timing={1200} infinite />
          </ProgressHolder>
        </Box>
      </>
    ) : (
      <>
        <Text ff="Inter|SemiBold" fontSize={4} color="palette.primary.main">
          <Trans i18nKey="manager.applist.updatable.title" />
        </Text>
        <Badge ff="Inter|Bold" fontSize={3} color="palette.text.shade100">
          {updatableAppList.length}
        </Badge>
        <Box flex={1} />
        <Button primary onClick={onUpdateAll} fontSize={3} event="Manager Update All">
          <IconLoader size={14} />
          <Text style={{ marginLeft: 8 }}>
            <Trans i18nKey="manager.applist.item.updateAll" />
          </Text>
        </Button>
      </>
    );

  const mapApp = useCallback(
    app => (
      <Item
        state={state}
        key={`UPDATE_${app.name}`}
        app={app}
        dispatch={dispatch}
        forceUninstall={isIncomplete}
        appStoreView={false}
        onlyUpdate={true}
        showActions={false}
        scheduled={plan.find(a => a.name === app.name)}
        progress={get(progress, ["appOp", "name"]) === app.name ? progress : null}
      />
    ),
    [state, dispatch, isIncomplete, plan, progress],
  );

  const appsToShow = appsUpdating.length > 0 ? appsUpdating : updatableAppList;
  const visible = appsToShow.length > 0;

  return (
    <FadeInOutBox in={visible}>
      <CollapsibleCard
        mt={20}
        header={<UpdatableHeader>{visible && updateHeader}</UpdatableHeader>}
      >
        {appsToShow.map(mapApp)}
      </CollapsibleCard>
    </FadeInOutBox>
  );
};

export default memo<Props>(UpdateAllApps);
