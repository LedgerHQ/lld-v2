// @flow

import React, { useCallback } from "react";
import { Trans, withTranslation } from "react-i18next";

import IconAngleDown from "~/renderer/icons/AngleDown";
import DropDown, { DropDownItem } from "~/renderer/components/DropDown";
import Box from "~/renderer/components/Box";
import BoldToggle from "~/renderer/components/BoldToggle";
import Text from "~/renderer/components/Text";

const Filter = ({ onFilterChange, filter }: *) => {
  const onFilterChangeWrapper = useCallback(
    ({ selectedItem: item }) => {
      if (!item) {
        return;
      }
      onFilterChange(item.key);
    },
    [onFilterChange],
  );

  const filterItems = [
    {
      key: "all",
      label: <Trans i18nKey="manager.applist.filter.all" />,
    },
    {
      key: "installed",
      label: <Trans i18nKey="manager.applist.filter.installed" />,
    },
    {
      key: "notInstalled",
      label: <Trans i18nKey="manager.applist.filter.notInstalled" />,
    },
    {
      key: "supported",
      label: <Trans i18nKey="manager.applist.filter.supported" />,
    },
  ];

  const renderItem = useCallback(
    ({ item, isHighlighted, isActive }) => (
      <DropDownItem
        alignItems="center"
        justifyContent="flex-start"
        horizontal
        isHighlighted={isHighlighted}
        isActive={isActive}
        flow={2}
      >
        <Box grow alignItems="flex-start">
          <BoldToggle isBold={isActive}>{item.label}</BoldToggle>
        </Box>
      </DropDownItem>
    ),
    [],
  );

  return (
    <DropDown
      flow={1}
      offsetTop={2}
      horizontal
      items={filterItems}
      renderItem={renderItem}
      onStateChange={onFilterChangeWrapper}
      value={filterItems.find(item => item.key === filter)}
    >
      <Text color="palette.text.shade60" ff="Inter|SemiBold" fontSize={4}>
        <Trans i18nKey="manager.applist.filter.title" />
      </Text>
      <Box alignItems="center" color="wallet" ff="Inter|SemiBold" flow={1} fontSize={4} horizontal>
        <Text color="wallet">
          <Trans i18nKey={`manager.applist.filter.${filter || "all"}`} />
        </Text>
        <IconAngleDown size={16} />
      </Box>
    </DropDown>
  );
};

export default withTranslation()(Filter);
