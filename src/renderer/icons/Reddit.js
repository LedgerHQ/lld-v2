// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    d="M9.844 10.781c.041.063.062.12.062.172 0 .052-.02.1-.062.14-.25.25-.62.417-1.11.5-.49.084-.979.084-1.468 0-.49-.083-.86-.25-1.11-.5a.194.194 0 0 1-.062-.14.19.19 0 0 1 .062-.14.194.194 0 0 1 .14-.063c.053 0 .1.02.141.062.188.188.495.318.922.391a3.78 3.78 0 0 0 1.282 0c.427-.073.734-.213.921-.422a.31.31 0 0 1 .141-.031.31.31 0 0 1 .14.031zM7 9.125c0 .23-.083.422-.25.578a.839.839 0 0 1-.594.234.786.786 0 0 1-.578-.234.786.786 0 0 1-.234-.578.84.84 0 0 1 .234-.594.761.761 0 0 1 .578-.25c.23 0 .427.084.594.25.167.167.25.365.25.594zm2.844-.844c.229 0 .422.084.578.25a.839.839 0 0 1 .234.594c0 .23-.078.422-.234.578a.786.786 0 0 1-.578.234.839.839 0 0 1-.594-.234.761.761 0 0 1-.25-.578.81.81 0 0 1 .25-.594.811.811 0 0 1 .594-.25zM15 2.5v11c0 .417-.146.77-.438 1.062A1.447 1.447 0 0 1 13.5 15h-11c-.417 0-.77-.146-1.063-.438A1.447 1.447 0 0 1 1 13.5v-11c0-.417.146-.77.438-1.063A1.447 1.447 0 0 1 2.5 1h11c.417 0 .77.146 1.063.437.291.292.437.646.437 1.063zm-3.125 4.406a1.13 1.13 0 0 0-.781.313c-.813-.563-1.782-.854-2.907-.875l.594-2.657 1.844.438c0 .23.083.422.25.578a.839.839 0 0 0 .594.234.837.837 0 0 0 .593-.234.761.761 0 0 0 .25-.578.811.811 0 0 0-.25-.594.811.811 0 0 0-.593-.25.77.77 0 0 0-.438.125 1 1 0 0 0-.312.344l-2.063-.469c-.041-.02-.083-.015-.125.016a.28.28 0 0 0-.094.14l-.625 2.907c-1.125.041-2.083.343-2.875.906a1.11 1.11 0 0 0-.812-.344c-.375 0-.667.136-.875.406a1.12 1.12 0 0 0-.219.922c.063.344.26.6.594.766a2.184 2.184 0 0 0-.063.531c0 .584.204 1.12.61 1.61s.948.875 1.625 1.156a5.727 5.727 0 0 0 2.219.422 5.71 5.71 0 0 0 2.218-.422c.677-.281 1.214-.667 1.61-1.156.396-.49.593-1.026.593-1.61.021-.208 0-.385-.062-.531.333-.167.531-.422.594-.766a1.12 1.12 0 0 0-.219-.922c-.208-.27-.5-.406-.875-.406z"
  />
);

const Reddit = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    {path}
  </svg>
);

export default Reddit;
