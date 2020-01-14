// @flow

import React, { Component } from "react";
import styled from "styled-components";

import GrowScroll from "~/renderer/components/GrowScroll";
import Box from "~/renderer/components/Box";
import Space from "~/renderer/components/Space";

type Props = {
  children: any,
  title?: React$Node,
  scroll?: boolean,
  titleRight?: any,
  emptyState?: any,
  collapsed?: boolean,
};

class SideBarList extends Component<Props> {
  render() {
    const { children, title, scroll, titleRight, emptyState, collapsed } = this.props;
    const ListWrapper: React$ComponentType<any> = scroll ? GrowScroll : Box;

    return (
      <>
        {!!title && (
          <>
            <SideBarListTitle collapsed={collapsed}>
              {title}
              {!!titleRight && <Box ml="auto">{titleRight}</Box>}
            </SideBarListTitle>
            <Space of={20} />
          </>
        )}
        {children ? (
          <ListWrapper flow={2} px={3} fontSize={3}>
            {children}
          </ListWrapper>
        ) : emptyState ? (
          <Box px={4} ff="Inter|Regular" selectable fontSize={3} color="palette.text.shade60">
            {emptyState}
          </Box>
        ) : null}
      </>
    );
  }
}

const SideBarListTitle = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  color: "palette.text.shade100",
  ff: "Inter|ExtraBold",
  fontSize: 1,
  px: 4,
}))`
  cursor: default;
  letter-spacing: 2px;
  text-transform: uppercase;

  // allow collapsing
  opacity: ${p => (p.collapsed ? 0 : 1)};
  transition: opacity 0.15s;
  overflow: hidden;
  white-space: nowrap;
`;

export default SideBarList;
