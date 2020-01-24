// @flow
import React, { useState } from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsResult, Exec } from "@ledgerhq/live-common/lib/apps/types";
import type { Device } from "~/renderer/reducers/devices";
import { getActionPlan, useAppsRunner, isIncompleteState } from "@ledgerhq/live-common/lib/apps";
import { useSortedFilteredApps } from "@ledgerhq/live-common/lib/apps/filtering";
import Placeholder from "./Placeholder";
import Card from "~/renderer/components/Box/Card";
import Box from "~/renderer/components/Box";
import Input from "~/renderer/components/Input";
import IconSearch from "~/renderer/icons/Search";
import TabBar from "~/renderer/components/TabBar";
import Item from "./Item";
import DeviceStorage from "../DeviceStorage";
import Filter from "./Filter";
import Sort from "./Sort";
import UpdateAllApps from "./UpdateAllApps";

// sticky top bar with extra width to cover card boxshadow underneath
const StickyTabBar = styled.div`
  position: sticky;
  background-color: ${p => p.theme.colors.palette.background.default};
  top: ${p => p.theme.sizes.topBarHeight}px;
  left: 0;
  right: 0;
  padding: 16px 16px 0 16px;
  margin-left: -16px;
  width: calc(100% + 32px);
  z-index: 1;
`;

const FilterHeader = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  align-items: center;
  border-bottom: 1px solid ${p => p.theme.colors.palette.text.shade10};
  background-color: ${p => p.theme.colors.palette.background.paper};
  position: sticky;
  top: ${p => p.theme.sizes.topBarHeight * 2 + 16}px;
  left: 0;
  right: 0;
  z-index: 1;
  & > * {
    &:first-of-type {
      flex: 1;
    }
    border: none;
  }
`;

type Props = {
  device: Device,
  deviceInfo: DeviceInfo,
  result: ListAppsResult,
  exec: Exec,
  t: TFunction,
};

const AppsList = ({ deviceInfo, result, exec, t }: Props) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState([]);
  const [sort, setSort] = useState({ type: "marketcap", order: "desc" });
  const [activeTab, setActiveTab] = useState(0);
  const [state, dispatch] = useAppsRunner(result, exec);

  const { apps, appByName, installed: installedApps, installQueue } = state;
  const onDeviceTab = activeTab === 1;
  const { currentProgress, currentError } = state;
  const plan = getActionPlan(state);

  const appList = useSortedFilteredApps(apps, { query, installedApps, type: filters }, sort);
  const installedAppList = useSortedFilteredApps(
    apps,
    { query, installedApps, type: ["installed"] },
    sort,
  );

  const appsInstalling = installQueue.map(name => appByName[name]);

  const displayedAppList = onDeviceTab ? [...appsInstalling, ...installedAppList] : appList;

  const isIncomplete = isIncompleteState(state);

  const mapApp = (app, appStoreView, onlyUpdate, showActions) => (
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
      forceUninstall={isIncomplete}
      appStoreView={appStoreView}
      onlyUpdate={onlyUpdate}
      deviceModel={state.deviceModel}
      showActions={showActions}
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
      <UpdateAllApps state={state} dispatch={dispatch} isIncomplete={isIncomplete} plan={plan} />
      {isIncomplete ? null : (
        <StickyTabBar>
          <TabBar
            tabs={["manager.tabs.appCatalog", "manager.tabs.appsOnDevice"]}
            onIndexChange={setActiveTab}
          />
        </StickyTabBar>
      )}

      <Card>
        <FilterHeader>
          <Input
            containerProps={{ noBoxShadow: true }}
            renderLeft={<IconSearch size={16} />}
            onChange={setQuery}
            placeholder={t(
              onDeviceTab ? "manager.tabs.appCatalogSearch" : "manager.tabs.appOnDeviceSearch",
            )}
          />
          {!onDeviceTab ? <Filter onFiltersChange={setFilters} filters={filters} /> : null}
          <Box ml={3}>
            <Sort onSortChange={setSort} sort={sort} />
          </Box>
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

export default withTranslation()(AppsList);
