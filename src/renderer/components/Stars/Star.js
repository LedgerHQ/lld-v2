// @flow

import React, { useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { toggleStarAction } from "~/renderer/actions/settings";
import { isStarredAccountSelector } from "~/renderer/reducers/accounts";
import { rgba } from "~/renderer/styles/helpers";
import starAnim from "~/renderer/images/starAnim.png";
import starAnim2 from "~/renderer/images/starAnim2.png";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { refreshAccountsOrdering } from "~/renderer/actions/general";
import { Transition } from "react-transition-group";

const starBust = keyframes`
  from {
    background-position: left;
  }
  to {
    background-position: right;
  }
`;

const ButtonWrapper: ThemedComponent<{ filled?: boolean }> = styled.div`
  height: 34px;
  width: 34px;
  border: 1px solid
    ${p => (p.filled ? p.theme.colors.starYellow : p.theme.colors.palette.text.shade60)};
  border-radius: 4px;
  padding: 8px;
  text-align: center;
  background: ${p => (p.filled ? p.theme.colors.starYellow : "transparent")};
  &:hover {
    background: ${p =>
      p.filled ? p.theme.colors.starYellow : rgba(p.theme.colors.palette.divider, 0.2)};
    border-color: ${p =>
      p.filled ? p.theme.colors.starYellow : p.theme.colors.palette.text.shade100};
  }
`;
const FloatingWrapper: ThemedComponent<{}> = styled.div``;

// NB negative margin to allow the burst to overflow
const StarWrapper: ThemedComponent<{}> = styled.div`
  margin: -17px;
`;

const startBurstTiming = 800;

const StarIcon: ThemedComponent<{
  filled?: boolean,
  yellow?: boolean,
}> = styled.div`
  &.entering {
    animation: ${starBust} ${startBurstTiming}ms steps(29) 1;  
  }
  
  &.entered {
    background-position: right;
  }

  height: 50px;
  width: 50px;
  background-image: url("${p => (p.yellow ? starAnim2 : starAnim)}");
  background-repeat: no-repeat;
  background-size: 3000%;
  &:hover {
    ${p => (!p.filled ? `background-position: -50px;` : "")}
  }
`;

const mapStateToProps = createStructuredSelector({
  isAccountStared: isStarredAccountSelector,
});

const mapDispatchToProps = {
  toggleStarAction,
  refreshAccountsOrdering,
};

type OwnProps = {
  accountId: string,
  yellow?: boolean,
};

type Props = {
  ...OwnProps,
  isAccountStared: boolean,
  toggleStarAction: Function,
  refreshAccountsOrdering: Function,
};

const Star = ({
  accountId,
  isAccountStared,
  toggleStarAction,
  yellow,
  refreshAccountsOrdering,
}: Props) => {
  const toggleStar = useCallback(
    e => {
      e.stopPropagation();
      toggleStarAction(accountId);
      refreshAccountsOrdering();
    },
    [toggleStarAction, accountId, refreshAccountsOrdering],
  );
  const MaybeButtonWrapper = yellow ? ButtonWrapper : FloatingWrapper;

  return (
    <MaybeButtonWrapper filled={isAccountStared}>
      <StarWrapper onClick={toggleStar}>
        <Transition in={isAccountStared} timeout={isAccountStared ? startBurstTiming : 0}>
          {className => <StarIcon yellow={yellow} filled={isAccountStared} className={className} />}
        </Transition>
      </StarWrapper>
    </MaybeButtonWrapper>
  );
};

const ConnectedStar: React$ComponentType<OwnProps> = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Star);
export default ConnectedStar;
