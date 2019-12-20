// @flow

import React from 'react'
import { useSelector } from 'react-redux'
import { hasCompletedOnboardingSelector } from '~/renderer/reducers/settings'
import { onboardingRelaunchedSelector } from '~/renderer/reducers/onboarding'

// TODO: ONBOARDING
// import Onboarding from '~/renderer/components/Onboarding'

type Props = {
  children: React$Node,
}

const OnboardingOrElse = ({ children }: Props) => {
  const hasCompletedOnboarding = useSelector(hasCompletedOnboardingSelector)
  const onboardingRelaunched = useSelector(onboardingRelaunchedSelector)

  if (!hasCompletedOnboarding || onboardingRelaunched) {
    return <h1>Onboarding</h1>
  }

  return children
}

export default OnboardingOrElse
