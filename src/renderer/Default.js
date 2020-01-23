// @flow

import { remote } from "electron";
import React, { useEffect, useRef } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import styled from "styled-components";

import { SYNC_PENDING_INTERVAL } from "~/config/constants";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Track from "~/renderer/analytics/Track";
import Dashboard from "~/renderer/screens/dashboard";
import Settings from "~/renderer/screens/settings";
import Accounts from "~/renderer/screens/accounts";
import Manager from "~/renderer/screens/manager";
import Partners from "~/renderer/screens/partners";
import Account from "~/renderer/screens/account";
import Asset from "~/renderer/screens/asset";
import SyncBackground from "~/renderer/components/SyncBackground";
import SyncContinuouslyPendingOperations from "~/renderer/components/SyncContinouslyPendingOperations";
import Box from "~/renderer/components/Box/Box";
import GrowScroll from "~/renderer/components/GrowScroll";
import ListenDevices from "~/renderer/components/ListenDevices";
import ExportLogsButton from "~/renderer/components/ExportLogsButton";
import Idler from "~/renderer/components/Idler";
import IsUnlocked from "~/renderer/components/IsUnlocked";
import OnboardingOrElse from "~/renderer/components/OnboardingOrElse";
import AppRegionDrag from "~/renderer/components/AppRegionDrag";
import CheckTermsAccepted from "~/renderer/components/CheckTermsAccepted";
import IsNewVersion from "~/renderer/components/IsNewVersion";
import HSMStatusBanner from "~/renderer/components/HSMStatusBanner";
import TopBar from "~/renderer/components/TopBar";
import LibcoreBusyIndicator from "~/renderer/components/LibcoreBusyIndicator";
import DeviceBusyIndicator from "~/renderer/components/DeviceBusyIndicator";
import KeyboardContent from "~/renderer/components/KeyboardContent";
import PerfIndicator from "~/renderer/components/PerfIndicator";
import MainSideBar from "~/renderer/components/MainSideBar";
import TriggerAppReady from "~/renderer/components/TriggerAppReady";
import ContextMenuWrapper from "~/renderer/components/ContextMenu/ContextMenuWrapper";
import DebugUpdater from "~/renderer/components/Updater/DebugUpdater";
import ModalsLayer from "./ModalsLayer";

const Main: ThemedComponent<{
  tabIndex?: number,
  full?: boolean,
  ref?: React$Ref<React$ElementRef<any>>,
}> = styled(GrowScroll).attrs(() => ({
  px: 6,
}))`
  outline: none;
`;

const ScrollZone = styled(Box)`
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
`;

const reloadApp = event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "r") {
    remote.getCurrentWindow().webContents.reload();
  }
};

const Default = () => {
  const location = useLocation();
  const ref: React$ElementRef<any> = useRef();

  useEffect(() => {
    window.addEventListener("keydown", reloadApp);
    return () => window.removeEventListener("keydown", reloadApp);
  }, []);

  // every time location changes, scroll back up
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      <TriggerAppReady />
      <ListenDevices />
      <ExportLogsButton hookToShortcut />
      <Track mandatory onMount event="App Starts" />
      <Idler />
      {process.platform === "darwin" ? <AppRegionDrag /> : null}

      <IsUnlocked>
        <ContextMenuWrapper>
          <ModalsLayer />
          <OnboardingOrElse>
            <CheckTermsAccepted />

            <IsNewVersion />

            {process.env.DEBUG_UPDATE && <DebugUpdater />}

            <SyncContinuouslyPendingOperations priority={20} interval={SYNC_PENDING_INTERVAL} />
            <SyncBackground />

            <div id="sticky-back-to-top-root" />

            <Box grow horizontal bg="palette.background.paper">
              <MainSideBar />
              <ScrollZone
                className="main-container"
                shrink
                grow
                bg="palette.background.default"
                color="palette.text.shade60"
                relative
              >
                <HSMStatusBanner />
                <TopBar />

                <Main ref={ref} tabIndex={-1}>
                  <Switch>
                    <Route path="/" exact component={Dashboard} />
                    <Route path="/settings" component={Settings} />
                    <Route path="/accounts" component={Accounts} />
                    <Route path="/manager" component={Manager} />
                    <Route path="/partners" component={Partners} />
                    <Route path="/account/:parentId/:id" component={Account} />
                    <Route path="/account/:id" component={Account} />
                    <Route path="/asset/:assetId+" component={Asset} />
                  </Switch>
                </Main>
              </ScrollZone>
            </Box>

            <LibcoreBusyIndicator />
            <DeviceBusyIndicator />

            <KeyboardContent sequence="BJBJBJ">
              <PerfIndicator />
            </KeyboardContent>
          </OnboardingOrElse>
        </ContextMenuWrapper>
      </IsUnlocked>
    </>
  );
};

export default Default;
