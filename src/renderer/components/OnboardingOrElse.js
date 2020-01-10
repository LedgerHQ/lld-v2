// @flow

import { memo } from "react";
// import React, { memo } from "react";
// import { useSelector } from "react-redux";
// import { hasCompletedOnboardingSelector } from "~/renderer/reducers/settings";
// import { onboardingRelaunchedSelector } from "~/renderer/reducers/onboarding";
// import Onboarding from "~/renderer/screens/onboarding";

type Props = {
  children: React$Node,
};

const OnboardingOrElseC = ({ children }: Props) => {
  // const hasCompletedOnboarding = useSelector(hasCompletedOnboardingSelector);
  // const onboardingRelaunched = useSelector(onboardingRelaunchedSelector);

  // if (!hasCompletedOnboarding || onboardingRelaunched) {
  //   return <Onboarding />;
  // }

  return children;
};

const OnboardingOrElse: React$ComponentType<Props> = memo(OnboardingOrElseC);

export default OnboardingOrElse;
