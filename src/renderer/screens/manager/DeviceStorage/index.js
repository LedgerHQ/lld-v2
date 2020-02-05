// @flow

import React, { memo } from "react";
import { distribute, isIncompleteState } from "@ledgerhq/live-common/lib/apps";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { Transition, TransitionGroup } from "react-transition-group";

import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { State } from "@ledgerhq/live-common/lib/apps/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import ByteSize from "~/renderer/components/ByteSize";
import { rgba } from "~/renderer/styles/helpers";
import Text from "~/renderer/components/Text";
import Tooltip from "~/renderer/components/Tooltip";
import Card from "~/renderer/components/Box/Card";
import Box from "~/renderer/components/Box";

import IconTriangleWarning from "~/renderer/icons/TriangleWarning";
import IconCheckFull from "~/renderer/icons/CheckFull";

import nanoS from "./images/nanoS.png";
import nanoX from "./images/nanoX.png";
import blue from "./images/blue.png";

const illustrations = {
  nanoS,
  nanoX,
  blue,
};

export const DeviceIllustration: ThemedComponent<{}> = styled.img.attrs(p => ({
  src: illustrations[p.deviceModel.id],
}))`
  max-height: 153px;
  margin-left: 36px;
  margin-right: 56px;
  filter: drop-shadow(0px 10px 10px rgba(0, 0, 0, 0.2));
`;

const Separator = styled.div`
  height: 1px;
  margin: 20px 0px;
  background: ${p => p.theme.colors.palette.background.default};
  width: 100%;
`;

const Info = styled.div`
  font-family: Inter;
  display: flex;
  margin-bottom: 20px;
  font-size: 13px;
  line-height: 16px;

  & > div {
    display: flex;
    flex-direction: row;
    & > :nth-child(2) {
      margin-left: 10px;
    }
    margin-right: 30px;
  }
`;

const StorageBarWrapper: ThemedComponent<{}> = styled.div`
  width: 100%;
  border-radius: 3px;
  height: 23px;
  background: ${p => p.theme.colors.palette.text.shade10};
  overflow: hidden;
`;

const StorageBarGraph = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  position: relative;
  transform-origin: left;
  animation: ${p => p.theme.animations.fadeInGrowX};
`;

const transitionStyles = {
  entering: () => ({ opacity: 0, flexBasis: 0, flexGrow: 0 }),
  entered: flexBasis => ({ opacity: 1, flexBasis }),
  exiting: () => ({ opacity: 0, flexBasis: 0, flexGrow: 0 }),
  exited: () => ({ opacity: 0, flexBasis: 0, flexGrow: 0 }),
};

/** each device storage bar will grow of 0.5% if the space is available or just fill its given percent basis if the bar is filled */
const StorageBarItem: ThemedComponent<{ ratio: number }> = styled.div.attrs(props => ({
  style: {
    backgroundColor: props.color,
    ...transitionStyles[props.state](`${(props.ratio * 1e2).toFixed(3)}%`),
  },
}))`
  display: flex;
  flex: 0.005 0 0;
  background-color: black;
  position: relative;
  border-right: 1px solid ${p => p.theme.colors.palette.background.paper};
  box-sizing: border-box;
  transform-origin: left;
  opacity: 1;
  transition: all 0.33s ease-in-out;
  & > * {
    width: 100%;
  }
`;

const FreeInfo = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  color: ${p => (p.danger ? p.theme.colors.warning : p.theme.colors.palette.text.shade100)};
`;

const TooltipContentWrapper: ThemedComponent<{}> = styled.div`
  & > :nth-child(1) {
    color: ${p => rgba(p.theme.colors.palette.background.paper, 0.7)};
    text-align: center;
    display: block;
  }
  & > :nth-child(2) {
    color: ${p => p.theme.colors.palette.background.paper};
    text-align: center;
  }
`;

const TooltipContent = ({
  name,
  bytes,
  deviceModel,
}: {
  name: string,
  bytes: number,
  deviceModel: *,
}) => (
  <TooltipContentWrapper>
    <Text>{name}</Text>
    <Text>
      <ByteSize value={bytes} deviceModel={deviceModel} />
    </Text>
  </TooltipContentWrapper>
);

export const StorageBar = ({
  distribution,
  deviceModel,
  isIncomplete,
}: {
  distribution: *,
  deviceModel: *,
  isIncomplete: boolean,
}) => (
  <StorageBarWrapper>
    {!isIncomplete && (
      <TransitionGroup component={StorageBarGraph}>
        {distribution.apps.map(({ name, currency, bytes, blocks }, index) => (
          <Transition timeout={{ appear: 333, enter: 333, exit: 1200 }} key={`${name}`}>
            {state => (
              <StorageBarItem
                state={state}
                color={currency && currency.color}
                ratio={blocks / (distribution.totalBlocks - distribution.osBlocks)}
              >
                <Tooltip
                  content={<TooltipContent name={name} bytes={bytes} deviceModel={deviceModel} />}
                />
              </StorageBarItem>
            )}
          </Transition>
        ))}
      </TransitionGroup>
    )}
  </StorageBarWrapper>
);

type Props = {
  state: State,
  deviceInfo: DeviceInfo,
};

const DeviceStorage = ({ state, deviceInfo }: Props) => {
  const distribution = distribute(state);
  const isIncomplete = isIncompleteState(state);
  const shouldWarn = distribution.shouldWarnMemory || isIncomplete;

  return (
    <div>
      <Card p={20} horizontal>
        <DeviceIllustration deviceModel={state.deviceModel} />
        <div style={{ flex: 1 }}>
          <Box horizontal alignItems="center">
            <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={5}>
              {state.deviceModel.productName}
            </Text>
            <Box ml={2}>
              <Tooltip content={<Trans i18nKey="manager.deviceStorage.genuine" />}>
                <IconCheckFull size={18} />
              </Tooltip>
            </Box>
          </Box>
          <Text ff="Inter|Regular" color="palette.text.shade40" fontSize={4}>
            <Trans
              i18nKey="manager.deviceStorage.firmware"
              values={{ version: deviceInfo.version }}
            />
          </Text>
          <Separator />
          <Info>
            <div>
              <Text fontSize={4}>
                <Trans i18nKey="manager.deviceStorage.used" />
              </Text>
              <Text color="palette.text.shade100" ff="Inter|Bold" fontSize={4}>
                <ByteSize deviceModel={state.deviceModel} value={distribution.totalAppsBytes} />
              </Text>
            </div>
            <div>
              <Text fontSize={4}>
                <Trans i18nKey="manager.deviceStorage.capacity" />
              </Text>
              <Text color="palette.text.shade100" ff="Inter|Bold" fontSize={4}>
                <ByteSize deviceModel={state.deviceModel} value={distribution.appsSpaceBytes} />
              </Text>
            </div>
            <div>
              <Text fontSize={4}>
                <Trans i18nKey="manager.deviceStorage.installed" />
              </Text>
              <Text color="palette.text.shade100" ff="Inter|Bold" fontSize={4}>
                {!isIncomplete ? distribution.apps.length : "—"}
              </Text>
            </div>
          </Info>
          <StorageBar
            distribution={distribution}
            deviceModel={state.deviceModel}
            isIncomplete={isIncomplete}
          />
          <FreeInfo danger={shouldWarn}>
            {shouldWarn ? <IconTriangleWarning /> : ""}{" "}
            <Box paddingLeft={1}>
              <Text ff="Inter|SemiBold" fontSize={3}>
                {isIncomplete ? (
                  <Trans i18nKey="manager.deviceStorage.incomplete" />
                ) : distribution.freeSpaceBytes > 0 ? (
                  <>
                    <Trans i18nKey="manager.deviceStorage.freeSpace">
                      <ByteSize
                        value={distribution.freeSpaceBytes}
                        deviceModel={state.deviceModel}
                      />
                    </Trans>
                  </>
                ) : (
                  <Trans i18nKey="manager.deviceStorage.noFreeSpace" />
                )}
              </Text>
            </Box>
          </FreeInfo>
        </div>
      </Card>
    </div>
  );
};

export default memo<Props>(DeviceStorage);
