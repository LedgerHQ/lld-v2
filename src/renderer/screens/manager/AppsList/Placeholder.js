// @flow
import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const PlaceholderWrapper: ThemedComponent<{}> = styled.div`
  text-align: center;
  padding: 20px;
`;

const Placeholder = ({ installed, search }: { installed: boolean, search: string }) => (
  <PlaceholderWrapper>
    <Text ff="Inter|SemiBold" fontSize={6}>
      <Trans
        i18nKey={installed ? "manager.applist.placeholderInstalled" : "manager.applist.placeholder"}
        values={{ search }}
      />
    </Text>
  </PlaceholderWrapper>
);

export default Placeholder;
