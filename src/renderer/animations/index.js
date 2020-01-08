// @flow

import React from "react";
import Lottie from "react-lottie";

import * as connectDeviceEnterPinNanoX from "./connectDeviceEnterPinNanoX.json";

const animations = {
  connectDeviceEnterPinNanoX,
};

type LottieAnimations = $Keys<typeof animations>;

const LottieAnimationWrapper = ({
  name,
  width = "100%",
  height = "auto",
  loop = true,
  autoplay = true,
  rendererSettings = { preserveAspectRatio: "xMidYMin" },
}: {
  name: LottieAnimations,
  width?: string,
  height?: string,
  loop?: boolean,
  autoplay?: boolean,
  rendererSettings?: *,
}) => (
  <Lottie
    isClickToPauseDisabled
    ariaRole="animation"
    height={height}
    width={width}
    options={{
      loop,
      autoplay,
      animationData: animations[name],
      rendererSettings,
    }}
  />
);

export default LottieAnimationWrapper;
