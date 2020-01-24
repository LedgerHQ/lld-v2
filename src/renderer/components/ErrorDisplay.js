// @flow

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import TranslatedError from "~/renderer/components/TranslatedError";
import Button from "~/renderer/components/Button";
import ExportLogsButton from "~/renderer/components/ExportLogsButton";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";

const Wrapper: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.colors.alertRed};
  margin-bottom: 20px;
`;

const Title = styled(Text).attrs({
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
  textAlign: "center",
  fontSize: 6,
})`
  margin-bottom: 10px;
`;

const Description = styled(Text).attrs({
  ff: "Inter|Regular",
  color: "palette.text.shade60",
  textAlign: "center",
  fontSize: 4,
})``;

const ButtonContainer = styled(Box).attrs(p => ({
  mt: 25,
  horizontal: true,
}))``;

type Props = {
  error: Error,
  onRetry?: () => void,
  withExportLogs?: boolean,
};

const ErrorDisplay = ({ error, onRetry, withExportLogs }: Props) => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Logo>
        <ExclamationCircleThin size={44} />
      </Logo>
      <Title>
        <TranslatedError error={error} />
      </Title>
      <Description>
        <TranslatedError error={error} field="description" />
      </Description>
      <ButtonContainer>
        {withExportLogs ? (
          <ExportLogsButton
            title={t("settings.exportLogs.title")}
            small={false}
            primary={false}
            outlineGrey
          />
        ) : null}
        <Button primary ml={withExportLogs ? 4 : 0} onClick={onRetry}>
          {t("common.retry")}
        </Button>
      </ButtonContainer>
    </Wrapper>
  );
};

export default ErrorDisplay;
