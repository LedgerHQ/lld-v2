// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    d="M3.417 14a.75.75 0 1 1-1.5 0V9.333a.75.75 0 1 1 1.5 0V14zm0-7.333a.75.75 0 0 1-1.5 0V2a.75.75 0 1 1 1.5 0v4.667zM8.75 14a.75.75 0 1 1-1.5 0V8a.75.75 0 0 1 1.5 0v6zm0-8.667a.75.75 0 1 1-1.5 0V2a.75.75 0 0 1 1.5 0v3.333zM14.083 14a.75.75 0 1 1-1.5 0v-3.333a.75.75 0 0 1 1.5 0V14zm0-6a.75.75 0 1 1-1.5 0V2a.75.75 0 0 1 1.5 0v6zM.667 10.083a.75.75 0 1 1 0-1.5h4a.75.75 0 0 1 0 1.5h-4zm5.333-4a.75.75 0 1 1 0-1.5h4a.75.75 0 1 1 0 1.5H6zm5.333 5.334a.75.75 0 0 1 0-1.5h4a.75.75 0 1 1 0 1.5h-4z"
  />
);

const Controls = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    {path}
  </svg>
);

export default Controls;
