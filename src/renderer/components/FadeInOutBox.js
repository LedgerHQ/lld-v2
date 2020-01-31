// @flow
import React from "react";
import styled from "styled-components";

import { Transition } from "react-transition-group";
import type { TransitionProps } from "react-transition-group";

const transitions = {
  entering: { opacity: 0, maxHeight: 0, overflow: "hidden" },
  entered: { opacity: 1, maxHeight: "100vh", overflow: "auto" },
  exiting: { opacity: 0, maxHeight: 0 },
  exited: { opacity: 0, maxHeight: 0 },
};

const FadeInOutBox = styled.div.attrs(p => ({
  style: transitions[p.state],
}))`
  opacity: 0;
  height: auto;
  transition: all ${p => p.timing}ms ease-in-out;
`;

type Props = {
  ...TransitionProps,
  children: React$Node,
  timing: number,
};

const UpdateAllApps = ({ timing = 400, unmountOnExit = true, children, ...props }: Props) => {
  return (
    <Transition
      {...props}
      unmountOnExit
      timeout={{
        appear: 0,
        enter: timing,
        exit: timing * 3, // leaves extra time for the animation to end before unmount
      }}
    >
      {state => (
        <FadeInOutBox timing={timing} state={state}>
          {children}
        </FadeInOutBox>
      )}
    </Transition>
  );
};

export default UpdateAllApps;
