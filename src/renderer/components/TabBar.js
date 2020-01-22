// @flow
import React, { useState, useRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Trans } from "react-i18next";
import { Base } from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";

const Tabs: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const Tab = styled(Base)`
  padding: 0 0 4px 30px;
  text-transform: uppercase;
  border-radius: 0;
  color: ${p =>
    p.active ? p.theme.colors.palette.text.shade100 : p.theme.colors.palette.text.shade30};
  &:hover,
  &:active,
  &:focus {
    background: none;
    color: ${p => p.theme.colors.palette.text.shade100};
  }
`;

const TabIndicator = styled.span.attrs(({ currentRef = {} }) => ({
  style: {
    width: `${currentRef.clientWidth - 30}px`,
    transform: `translateX(${currentRef.offsetLeft}px)`,
  },
}))`
  height: 3px;
  position: absolute;
  bottom: 0;
  left: 30px;
  background-color: ${p => p.theme.colors.palette.primary.main};
  transition: all 0.3s ease-in-out;
`;

type Props = {
  tabs: string[],
  onIndexChange: number => void,
  defaultIndex?: number,
};

const TabBar = ({ tabs, onIndexChange, defaultIndex = 0 }: Props) => {
  const tabRefs = useRef([]);
  const [index, setIndex] = useState(defaultIndex);
  const [currentRef, setCurrentRef] = useState({});

  useEffect(() => {
    setCurrentRef(() => tabRefs.current[index]);
  }, [setCurrentRef, index]);

  const updateIndex = useCallback(
    i => {
      setIndex(i);
      onIndexChange(i);
    },
    [setIndex, onIndexChange],
  );

  const setTabRef = index => ref => {
    tabRefs.current[index] = ref;
  };

  return (
    <Tabs>
      {tabs.map((tab, i) => (
        <Tab
          ref={setTabRef(i)}
          key={`TAB_${i}_${tab}`}
          active={i === index}
          tabIndex={i}
          onClick={() => updateIndex(i)}
        >
          <Text ff="Inter|Bold" fontSize={6}>
            <Trans i18nKey={tab} />
          </Text>
        </Tab>
      ))}
      <TabIndicator currentRef={currentRef} />
    </Tabs>
  );
};

export default TabBar;
