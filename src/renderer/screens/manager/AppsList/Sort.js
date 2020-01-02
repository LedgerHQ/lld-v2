// @flow

import React, { useCallback } from "react";
import { Trans, withTranslation } from "react-i18next";
import DropDown, { DropDownItem } from "~/renderer/components/DropDown";
import Box from "~/renderer/components/Box";
import BoldToggle from "~/renderer/components/BoldToggle";
import Text from "~/renderer/components/Text";
import IconAngleDown from "~/renderer/icons/AngleDown";

const Sort = ({ onSortChange, sort }: *) => {
  const onSortChangeWrapper = useCallback(
    ({ selectedItem: item }) => {
      if (!item) {
        return;
      }
      onSortChange(item.key);
    },
    [onSortChange],
  );

  const sortItems = [
    {
      key: "name",
      label: <Trans i18nKey="manager.applist.sort.name" />,
    },
    {
      key: "marketcap",
      label: <Trans i18nKey="manager.applist.sort.marketcap" />,
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
      items={sortItems}
      renderItem={renderItem}
      onStateChange={onSortChangeWrapper}
      value={sortItems.find(item => item.key === sort)}
    >
      <Text color="palette.text.shade60" ff="Inter|SemiBold" fontSize={4}>
        <Trans i18nKey="manager.applist.sort.title" />
      </Text>
      <Box alignItems="center" color="wallet" ff="Inter|SemiBold" flow={1} fontSize={4} horizontal>
        <Text color="wallet">
          <Trans i18nKey={`manager.applist.sort.${sort || "name"}`} />
        </Text>
        <IconAngleDown size={16} />
      </Box>
    </DropDown>
  );
};

export default withTranslation()(Sort);
