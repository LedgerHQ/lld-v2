// @flow
import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import IconCrossCircle from "~/renderer/icons/CrossCircle";

const Holder = styled.div`
  min-width: 150px;
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
  <div style={{ textAlign: "right" }}>
    <Box horizontal alignItems="center" justifyContent="flex-end">
      <Text ff="Inter|SemiBold" fontSize={3} color="palette.primary.main" mb={5}>
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
  </div>
);

export default Progress;
