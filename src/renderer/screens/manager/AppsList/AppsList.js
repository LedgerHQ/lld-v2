// @flow
import React, { useState, memo, useCallback } from "react";
import styled from "styled-components";
import type { TFunction } from "react-i18next";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { State, Action, AppOp } from "@ledgerhq/live-common/lib/apps/types";
import { useSortedFilteredApps } from "@ledgerhq/live-common/lib/apps/filtering";
import Placeholder from "./Placeholder";
import Card from "~/renderer/components/Box/Card";
import Box from "~/renderer/components/Box";
import Input from "~/renderer/components/Input";
import IconSearch from "~/renderer/icons/Search";
import TabBar from "~/renderer/components/TabBar";
import Item from "./Item";
import Filter from "./Filter";
import Sort from "./Sort";

import get from "lodash/get";

// sticky top bar with extra width to cover card boxshadow underneath
const StickyTabBar = styled.div`
  position: sticky;
  background-color: ${p => p.theme.colors.palette.background.default};
  top: 0px;
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
  margin: 0px;
  align-items: center;
  border-bottom: 1px solid ${p => p.theme.colors.palette.text.shade10};
  background-color: ${p => p.theme.colors.palette.background.paper};
  position: sticky;
  top: ${p => p.theme.sizes.topBarHeight + 16}px;
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
  deviceInfo: DeviceInfo,
  state: State,
  dispatch: Action => void,
  plan: AppOp[],
  isIncomplete: boolean,
  progress: *,
  t: TFunction,
};

const AppsList = ({ deviceInfo, state, dispatch, plan, isIncomplete, progress = {}, t }: Props) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState([]);
  const [sort, setSort] = useState({ type: "marketcap", order: "desc" });
  const [activeTab, setActiveTab] = useState(0);

  const onDeviceTab = activeTab === 1;

  const { apps, appByName, installed: installedApps, installQueue } = state;

  const appList = useSortedFilteredApps(apps, { query, installedApps, type: filters }, sort);
  const installedAppList = useSortedFilteredApps(
    apps,
    { query, installedApps, type: ["installed"] },
    sort,
  );

  const appsInstalling = installQueue.map(name => appByName[name]);

  const displayedAppList = onDeviceTab ? [...appsInstalling, ...installedAppList] : appList;

  const mapApp = useCallback(
    (app, appStoreView, onlyUpdate, showActions) => (
      <Item
        state={state}
        key={`${appStoreView ? "APP_STORE" : "DEVICE_TAB"}_${app.name}`}
        app={app}
        dispatch={dispatch}
        forceUninstall={isIncomplete}
        appStoreView={appStoreView}
        onlyUpdate={onlyUpdate}
        showActions={showActions}
        scheduled={plan.find(a => a.name === app.name)}
        progress={get(progress, ["appOp", "name"]) === app.name ? progress : null}
      />
    ),
    [state, dispatch, isIncomplete, plan, progress],
  );

  return (
    <>
      {isIncomplete ? null : (
        <StickyTabBar>
          <TabBar
            tabs={["manager.tabs.appCatalog", "manager.tabs.appsOnDevice"]}
            onIndexChange={setActiveTab}
          />
        </StickyTabBar>
      )}
      <Card mt={0}>
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
    </>
  );
};

export default memo<Props>(AppsList);
