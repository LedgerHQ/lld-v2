// @flow

import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { toggleStarAction } from "~/renderer/actions/settings";
import { isStarredAccountSelector } from "~/renderer/reducers/accounts";
import { rgba } from "~/renderer/styles/helpers";
import starAnim from "~/renderer/images/starAnim.png";
import starAnim2 from "~/renderer/images/starAnim2.png";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

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

const StarIcon: ThemedComponent<{
  filled?: boolean,
  yellow?: boolean,
  showAnimation?: boolean,
}> = styled.div.attrs(p => ({
  style: {
    backgroundPosition: p.filled ? "right" : "left",
    animation: p.showAnimation ? "star-burst .8s steps(29) 1" : "none",
  },
}))`
  & {
    height: 50px;
    width: 50px;
    background-image: url("${p => (p.yellow ? starAnim2 : starAnim)}");
    background-repeat: no-repeat;
    background-size: 3000%;
    animation: none;
  }

  &:hover {
    ${p => (!p.filled ? `background-position: -50px;` : "")}
  }

  @keyframes star-burst {
    from {
      background-position: left;
    }
    to {
      background-position: right;
    }
  }
`;

const mapStateToProps = createStructuredSelector({
  isAccountStared: isStarredAccountSelector,
});

const mapDispatchToProps = {
  toggleStarAction,
};

type OwnProps = {
  accountId: string,
  yellow?: boolean,
};

type Props = {
  ...OwnProps,
  isAccountStared: boolean,
  toggleStarAction: Function,
};

const Star = ({ accountId, isAccountStared, toggleStarAction, yellow }: Props) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const toggleStar = useCallback(
    e => {
      e.stopPropagation();
      setShowAnimation(!isAccountStared);
      toggleStarAction(accountId);
    },
    [accountId, toggleStarAction, isAccountStared],
  );
  const MaybeButtonWrapper = yellow ? ButtonWrapper : FloatingWrapper;

  return (
    <MaybeButtonWrapper filled={isAccountStared}>
      <StarWrapper onClick={toggleStar}>
        <StarIcon yellow={yellow} filled={isAccountStared} showAnimation={showAnimation} />
      </StarWrapper>
    </MaybeButtonWrapper>
  );
};

const ConnectedStar: React$ComponentType<OwnProps> = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Star);
export default ConnectedStar;
