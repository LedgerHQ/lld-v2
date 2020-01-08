// @flow

import React from "react";

const BigSpinner = ({ size = 44 }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
    <path
      d="M41.85 24.437a20 20 0 10-2.926 8.22"
      stroke="url(#prefix__paint0_angular)"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <radialGradient
        id="prefix__paint0_angular"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="rotate(25.346 -37.918 59.918) scale(22.1303)"
      >
        <stop stopColor="#F6F7F8" stopOpacity={0} />
        <stop offset={0.063} stopColor="#F6F7F8" stopOpacity={0} />
        <stop offset={1} stopColor="#A1A8AD" />
      </radialGradient>
    </defs>
  </svg>
);

export default BigSpinner;
