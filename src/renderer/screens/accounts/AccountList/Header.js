// @flow

import React, { useState } from "react";
import styled from "styled-components";
import type { PortfolioRange } from "@ledgerhq/live-common/lib/types/portfolio";

import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import GridIcon from "~/renderer/icons/Grid";
import ListIcon from "~/renderer/icons/List";
import SearchIcon from "~/renderer/icons/Search";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { GenericBox } from "..";
import AccountsOrder from "./Order";
import AccountsRange from "./Range";

type Props = {
  onModeChange: (*) => void,
  onTextChange: (evt: SyntheticInputEvent<HTMLInputElement>) => void,
  onRangeChange: PortfolioRange => void,
  mode: string,
  search?: string,
  range?: PortfolioRange,
};

const ToggleButton: ThemedComponent<{ active?: boolean }> = styled(Button)`
  height: 30px;
  width: 30px;
  padding: 7px;
  background: ${p =>
    p.active ? p.theme.colors.pillActiveBackground : p.theme.colors.palette.background.paper};
  color: ${p => (p.active ? p.theme.colors.wallet : p.theme.colors.palette.divider)};
`;

const SearchInput: ThemedComponent<{}> = styled.input`
  border: none;
  background: transparent;
  outline: none;
  flex-grow: 1;
  font-family: "Inter";
  cursor: text;
  color: ${p => p.theme.colors.palette.text.shade100};
  &::placeholder {
    color: #999999;
    font-weight: 500;
  }
`;

const SearchIconContainer: ThemedComponent<{ focused?: boolean }> = styled(Box).attrs(p => ({
  style: {
    color: p.focused ? p.theme.colors.palette.text.shade100 : p.theme.colors.palette.text.shade40,
  },
}))`
  justify-content: center;
`;

const Header = ({ onModeChange, onTextChange, onRangeChange, mode, search, range }: Props) => {
  const [focused, setFocused] = useState(false);

  return (
    <GenericBox horizontal p={0} alignItems="center">
      <SearchIconContainer pr={3} focused={focused || !!search}>
        <SearchIcon size={16} />
      </SearchIconContainer>
      <SearchInput
        autoFocus
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search"
        onChange={onTextChange}
        value={search}
      />
      <AccountsRange onRangeChange={onRangeChange} range={range} />
      <Box ml={4} mr={4}>
        <AccountsOrder />
      </Box>
      <ToggleButton mr={1} onClick={() => onModeChange("list")} active={mode === "list"}>
        <ListIcon />
      </ToggleButton>
      <ToggleButton onClick={() => onModeChange("card")} active={mode === "card"}>
        <GridIcon />
      </ToggleButton>
    </GenericBox>
  );
};

export default React.memo<Props>(Header);
