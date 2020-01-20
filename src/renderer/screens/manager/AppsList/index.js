// @flow
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsResult, Exec } from "@ledgerhq/live-common/lib/apps/types";
import type { Device } from "~/renderer/reducers/devices";
import { getActionPlan, useAppsRunner, isIncompleteState } from "@ledgerhq/live-common/lib/apps";
import { useSortedFilteredApps } from "@ledgerhq/live-common/lib/apps/filtering";
import Placeholder from "./Placeholder";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import Card from "~/renderer/components/Box/Card";
import Box from "~/renderer/components/Box";
import Input from "~/renderer/components/Input";
import IconLoader from "~/renderer/icons/Loader";
import IconSearch from "~/renderer/icons/Search";
import Item from "./Item";
import DeviceStorage from "../DeviceStorage";
import Filter from "./Filter";
import Sort from "./Sort";

const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 24px;
  position: relative;
`;

// TODO rework this into a component that works with several tabs
const Tab = styled(Button).attrs(p => ({
  transformIndicator:
    p.activeTab > p.tabIndex
      ? "calc(100% + 30px)"
      : p.activeTab < p.tabIndex
      ? "calc(-100% - 30px)"
      : 0,
}))`
  padding: 0px;
  padding-right: 30px;
  text-transform: uppercase;
  border-radius: 0;
  padding-bottom: 4px;
  color: ${p =>
    p.active ? p.theme.colors.palette.text.shade100 : p.theme.colors.palette.text.shade30};
  &:hover, &:active, &:focus {
    background: none;
    color: ${p => p.theme.colors.palette.text.shade100};
  }
  position: relative;
  &:after {
    content: "";
    display: block;
    width: 100%;
    height: 4px;
    position: absolute;
    bottom 0;
    right: 30px;
    z-index: 2;
    background-color: ${p => p.theme.colors.palette.primary.main};
    transform: translateX(${p => p.transformIndicator});
    transition: transform 0.2s linear;
    will-change: transform;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  align-items: center;
  border-bottom: 1px solid ${p => p.theme.colors.palette.text.shade10};
  & > * {
    &:first-of-type {
      flex: 1;
    }
    border: none;
  }
`;

const UpdatableHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  height: 48px;
  box-sizing: content-box;
  border-bottom: 1px solid ${p => p.theme.colors.palette.text.shade10};
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

type Props = {
  device: Device,
  deviceInfo: DeviceInfo,
  result: ListAppsResult,
  exec: Exec,
};

const AppsList = ({ deviceInfo, result, exec }: Props) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState({ type: "marketcap", order: "desc" });
  const [activeTab, setActiveTab] = useState(0);
  const [state, dispatch] = useAppsRunner(result, exec);
  const onUpdateAll = useCallback(() => dispatch({ type: "updateAll" }), [dispatch]);

  const { apps, installed: installedApps } = state;
  const onDeviceTab = activeTab === 1;
  const { currentProgress, currentError } = state;
  const plan = getActionPlan(state);

  const appList = useSortedFilteredApps(apps, { query, installedApps, type: [] }, sort);
  const installedAppList = useSortedFilteredApps(
    apps,
    { query, installedApps, type: ["installed"] },
    sort,
  );

  const updatableAppList = useSortedFilteredApps(
    installedAppList,
    { installedApps, type: ["updatable"] },
    sort,
  );

  const displayedAppList = onDeviceTab ? installedAppList : appList;

  const mapApp = (app, appStoreView, onlyUpdate) => (
    <Item
      state={state}
      key={app.name}
      scheduled={plan.find(a => a.name === app.name)}
      app={app}
      progress={currentProgress && currentProgress.appOp.name === app.name ? currentProgress : null}
      error={currentError && currentError.appOp.name === app.name ? currentError.error : null}
      installed={state.installed.find(ins => ins.name === app.name)}
      dispatch={dispatch}
      installedAvailable={state.installedAvailable}
      forceUninstall={isIncompleteState(state)}
      appStoreView={appStoreView}
      onlyUpdate={onlyUpdate}
      deviceModel={state.deviceModel}
    />
  );

  return (
    <Box>
      <Box mb={50}>
        <DeviceStorage
          state={state}
          deviceInfo={deviceInfo}
          installedApps={installedApps}
          plan={plan}
          dispatch={dispatch}
        />
      </Box>

      {isIncompleteState(state) ? null : (
        <Tabs>
          <Tab
            active={!onDeviceTab}
            tabIndex={0}
            activeTab={activeTab}
            onClick={() => setActiveTab(0)}
          >
            <Text ff="Inter|Bold" fontSize={6}>
              <Trans i18nKey="manager.tabs.appCatalog" />
            </Text>
          </Tab>
          <Tab
            active={onDeviceTab}
            tabIndex={1}
            activeTab={activeTab}
            onClick={() => setActiveTab(1)}
          >
            <Text ff="Inter|Bold" fontSize={6}>
              <Trans i18nKey="manager.tabs.appsOnDevice" />
            </Text>
          </Tab>
        </Tabs>
      )}

      {onDeviceTab && updatableAppList.length ? (
        <Card mb={20}>
          <UpdatableHeader>
            <Text ff="Inter|SemiBold" fontSize={4} color="palette.primary.main">
              <Trans i18nKey="manager.applist.updatable.title" />
            </Text>
            <Badge ff="Inter|Bold" fontSize={3} color="palette.text.shade100">
              {updatableAppList.length}
            </Badge>
            <Box flex={1} />
            <Button style={{ display: "flex" }} primary onClick={onUpdateAll} fontSize={3}>
              <IconLoader size={14} />
              <Text style={{ marginLeft: 8 }}>
                <Trans i18nKey="manager.applist.item.updateAll" />
              </Text>
            </Button>
          </UpdatableHeader>
          <Box>{updatableAppList.map(app => mapApp(app, false, true))}</Box>
        </Card>
      ) : null}

      <Card>
        <FilterHeader>
          <Input
            containerProps={{ noBoxShadow: true }}
            renderLeft={<IconSearch size={16} />}
            onChange={setQuery}
            placeholder="Search app or version number"
          />
          <Box mr={3}>
            <Sort onSortChange={setSort} sort={sort} />
          </Box>
          {!onDeviceTab ? <Filter onFilterChange={setFilter} filter={filter} /> : null}
        </FilterHeader>
        {displayedAppList.length ? (
          displayedAppList.map(app => mapApp(app, !onDeviceTab))
        ) : (
          <Placeholder installed={onDeviceTab} query={query} />
        )}
      </Card>
    </Box>
  );
};

export default AppsList;
