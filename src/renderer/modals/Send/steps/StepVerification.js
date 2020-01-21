// @flow
import React from "react";
import TrackPage from "~/renderer/analytics/TrackPage";
import StepVerificationGeneric from "~/renderer/components/StepVerificationGeneric";

import type { StepProps } from "../types";

const StepVerification = (props: StepProps) => (
  <>
    <TrackPage category="Send Flow" name="Step Verification" />
    <StepVerificationGeneric {...props} />
  </>
);

export default StepVerification;
