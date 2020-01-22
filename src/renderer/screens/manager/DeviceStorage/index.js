// @flow

import React from "react";
import { distribute, isIncompleteState } from "@ledgerhq/live-common/lib/apps";
import styled from "styled-components";
import { Trans } from "react-i18next";

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
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

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
  display: flex;
  flex-direction: row;
  width: 100%;
  border-radius: 3px;
  height: 23px;
  background: ${p => p.theme.colors.palette.text.shade10};
  overflow: hidden;
`;

const StorageBarItem: ThemedComponent<{ ratio: number }> = styled.div.attrs(props => ({
  style: { width: `${(props.ratio * 1e2).toFixed(3)}%` },
}))`
  display: flex;
  width: 0;
  background-color: ${p => p.color};
  position: relative;
  border-right: 3px solid ${p => p.theme.colors.palette.background.paper};
  transform-origin: left;
  transition: all 0.4s ease-in;
  animation: ${p => p.theme.animations.fadeInGrowX};
`;

const FreeInfo = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  color: ${p => (p.danger ? p.theme.colors.alertRed : p.theme.colors.palette.text.shade100)};
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

export const StorageBar = ({ distribution, deviceModel }: { distribution: *, deviceModel: * }) => (
  <StorageBarWrapper>
    {distribution.apps.map(({ name, currency, bytes, blocks }, index) => {
      const color = currency ? currency.color : "black";
      return (
        <StorageBarItem
          key={`${name}`}
          color={color}
          ratio={blocks / (distribution.totalBlocks - distribution.osBlocks)}
        >
          <Tooltip
            content={<TooltipContent name={name} bytes={bytes} deviceModel={deviceModel} />}
          />
        </StorageBarItem>
      );
    })}
  </StorageBarWrapper>
);

const DeviceStorage = ({ state, deviceInfo }: *) => {
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
            <Tooltip content={<Trans i18nKey="manager.deviceStorage.genuine" />}>
              <Box ml={2}>
                <IconCheckFull size={18} />
              </Box>
            </Tooltip>
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
                {distribution.apps.length}
              </Text>
            </div>
          </Info>
          <StorageBar distribution={distribution} deviceModel={state.deviceModel} />
          <FreeInfo danger={shouldWarn}>
            {shouldWarn ? <IconTriangleWarning /> : ""}{" "}
            <Box paddingLeft={1}>
              <Text ff="Inter|SemiBold" fontSize={3}>
                {isIncomplete ? (
                  <Trans i18nKey="manager.deviceStorage.incomplete" />
                ) : (
                  <Trans i18nKey="manager.deviceStorage.freeSpace">
                    <ByteSize value={distribution.freeSpaceBytes} deviceModel={state.deviceModel} />
                    {" free"}
                  </Trans>
                )}
              </Text>
            </Box>
          </FreeInfo>
        </div>
      </Card>
    </div>
  );
};

export default DeviceStorage;
