// @flow
import React, { PureComponent } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { flowType } from "~/renderer/reducers/onboarding";
import GrowScroll from "~/renderer/components/GrowScroll";
import TrackPage from "~/renderer/analytics/TrackPage";
import LedgerLiveImg from "~/renderer/images/ledgerlive-logo.svg";
import LedgerLiveLogo from "~/renderer/components/LedgerLiveLogo";
import { Title } from "~/renderer/screens/onboarding";
import Box from "~/renderer/components/Box";

import IconPlus from "~/renderer/icons/Plus";
import IconRecover from "~/renderer/icons/Recover";
import IconCheck from "~/renderer/icons/Check";
import IconChevronRight from "~/renderer/icons/ChevronRight";

import IconExternalLink from "~/renderer/icons/ExternalLink";

const mapDispatchToProps = { flowType };

class Init extends PureComponent<StepProps, *> {
  render() {
    const { t, flowType, jumpStep } = this.props;

    const optionCards = [
      {
        key: "newDevice",
        icon: <IconPlus size={20} />,
        title: t("onboarding.init.newDevice.title"),
        onClick: () => {
          jumpStep("selectDevice");
          flowType("newDevice");
        },
      },
      {
        key: "restoreDevice",
        icon: <IconRecover size={20} />,
        title: t("onboarding.init.restoreDevice.title"),
        onClick: () => {
          jumpStep("selectDevice");
          flowType("restoreDevice");
        },
      },
      {
        key: "initializedDevice",
        icon: <IconCheck size={20} />,
        title: t("onboarding.init.initializedDevice.title"),
        onClick: () => {
          jumpStep("selectDevice");
          flowType("initializedDevice");
        },
      },
      {
        key: "noDevice",
        icon: <IconExternalLink size={20} />,
        title: t("onboarding.noDevice.title"),
        onClick: () => {
          jumpStep("noDevice");
          flowType("noDevice");
        },
      },
    ];

    return (
      <GrowScroll full justifyContent="center" py={7}>
        <TrackPage category="Onboarding" name="Init" />
        <Box alignItems="center">
          <LedgerLiveLogo
            width="64px"
            height="64px"
            icon={<img src={LedgerLiveImg} alt="" draggable="false" width={40} height={40} />}
          />
          <Box m={5} style={{ maxWidth: 480 }}>
            <Title>{t("onboarding.init.title")}</Title>
          </Box>
          <Box pt={4} flow={4}>
            {optionCards.map(card => (
              <OptionFlowCard key={card.key} card={card} />
            ))}
          </Box>
        </Box>
      </GrowScroll>
    );
  }
}

export default connect(null, mapDispatchToProps)(Init);

type CardType = {
  icon: any,
  title: any,
  onClick: Function,
};

export function OptionFlowCard({ card }: { card: CardType }) {
  const { icon, title, onClick } = card;
  return (
    <InitCardContainer onClick={onClick} color="palette.text.shade100">
      <Box justify="center" color={"palette.primary.main"}>
        <InitIconContainer justify="center">{icon}</InitIconContainer>
      </Box>
      <Box justify="center" grow>
        <CardTitle>{title}</CardTitle>
      </Box>
      <Box justify="center" mx={1} my={4}>
        <IconChevronRight size={16} />
      </Box>
    </InitCardContainer>
  );
}

const InitCardContainer = styled(Box).attrs(() => ({
  p: 3,
  horizontal: true,
  borderRadius: "4px",
}))`
  align-items: center;
  border: 1px solid ${p => p.theme.colors.palette.divider};
  width: 530px;
  height: 70px;
  transition: all ease-in-out 0.2s;
  &:hover {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.05);
  }
`;

export const CardTitle = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  fontSize: 4,
  textAlign: "left",
}))``;

const InitIconContainer = styled(Box).attrs(() => ({
  ml: 3,
  mr: 4,
}))`
  text-align: -webkit-center;
`;
