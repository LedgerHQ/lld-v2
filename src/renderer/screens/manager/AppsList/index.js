// @flow
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Trans, withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsResult, Exec } from "@ledgerhq/live-common/lib/apps/types";
import type { Device } from "~/renderer/reducers/devices";
import { getActionPlan, useAppsRunner, isIncompleteState } from "@ledgerhq/live-common/lib/apps";
import { useSortedFilteredApps } from "@ledgerhq/live-common/lib/apps/filtering";
import Placeholder from "./Placeholder";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import Card from "~/renderer/components/Box/Card";
import CollapsibleCard from "~/renderer/components/CollapsibleCard";
import Box from "~/renderer/components/Box";
import Input from "~/renderer/components/Input";
import IconLoader from "~/renderer/icons/Loader";
import IconSearch from "~/renderer/icons/Search";
import TabBar from "~/renderer/components/TabBar";
import Item from "./Item";
import DeviceStorage from "../DeviceStorage";
import Filter from "./Filter";
import Sort from "./Sort";

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
  const onUpdateAll = useCallback(() => dispatch({ type: "updateAll" }), [dispatch]);

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

  const updatableAppList = useSortedFilteredApps(
    apps,
    { installedApps, type: ["updatable"] },
    { type: "marketcap", order: "desc" },
  );

  const appsInstalling = installQueue.map(name => appByName[name]);

  const displayedAppList = onDeviceTab ? [...appsInstalling, ...installedAppList] : appList;

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
      forceUninstall={isIncompleteState(state)}
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
      {updatableAppList.length > 0 && (
        <CollapsibleCard
          mb={20}
          header={
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
          }
        >
          {updatableAppList.map(app => mapApp(app, false, true, false))}
        </CollapsibleCard>
      )}

      {isIncompleteState(state) ? null : (
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
