// @flow
import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import ProgressBar from "~/renderer/components/Progress";
import IconCrossCircle from "~/renderer/icons/CrossCircle";

const Holder = styled.div`
  width: 100px;
  height: 5px;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
`;

const Cancel = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  cursor: pointer;
  margin-left: 4px;
  color: ${p => p.theme.colors.palette.primary.main};
`;

const Progress = ({ onClick, progress }: { onClick: () => void, progress: * }) => (
  <Box flex="1" horizontal justifyContent="flex-end" overflow="hidden">
    <Box flex="0 0 auto" vertical alignItems="flex-end" justifyContent="center">
      <Box
        flex="0 0 auto"
        horizontal
        alignItems="center"
        justifyContent="center"
        py={1}
        maxWidth="100%"
      >
        <Text ff="Inter|SemiBold" fontSize={3} color="palette.primary.main">
          <Trans
            i18nKey={
              progress && progress.appOp
                ? progress.appOp.type === "install"
                  ? "manager.applist.item.installing"
                  : "manager.applist.item.uninstalling"
                : "manager.applist.item.scheduled"
            }
          />
        </Text>
        {!progress ? (
          <Cancel onClick={onClick}>
            <IconCrossCircle size={20} />
          </Cancel>
        ) : null}
      </Box>
      <Holder>
        {progress && progress.appOp ? (
          progress.appOp.type === "install" ? (
            <ProgressBar progress={progress ? progress.progress : 0} />
          ) : (
            <ProgressBar infinite timing={1200} />
          )
        ) : (
          <ProgressBar infinite color="palette.text.shade20" timing={1200} />
        )}
      </Holder>
    </Box>
  </Box>
);

export default Progress;
