// @flow
import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import IconCrossCircle from "~/renderer/icons/CrossCircle";

const Holder = styled.div`
  min-width: 100px;
  width: 100%;
  height: 5px;
  background: ${p => p.theme.colors.palette.text.shade20};
  position: relative;
  border-radius: 5px;
`;
const Bar = styled.div`
  position: absolute;
  background: ${p => p.theme.colors.palette.primary.main};
  height: 100%;
  border-radius: 5px;
  width: ${p => `${(p.value * 100).toFixed(2)}%`};
  max-width: 100%;
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
    <Box flex="0 0 auto" vertical alignItems="center" justifyContent="center">
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
        <Bar value={progress ? progress.progress : 0} />
      </Holder>
    </Box>
  </Box>
);

export default Progress;
