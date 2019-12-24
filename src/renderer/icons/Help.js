// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    d="M8,15.4166667 C3.90388811,15.4166667 0.583333333,12.0961119 0.583333333,8 C0.583333333,3.90388811 3.90388811,0.583333333 8,0.583333333 C12.0961119,0.583333333 15.4166667,3.90388811 15.4166667,8 C15.4166667,12.0961119 12.0961119,15.4166667 8,15.4166667 Z M8,13.9166667 C11.2676848,13.9166667 13.9166667,11.2676848 13.9166667,8 C13.9166667,4.73231523 11.2676848,2.08333333 8,2.08333333 C4.73231523,2.08333333 2.08333333,4.73231523 2.08333333,8 C2.08333333,11.2676848 4.73231523,13.9166667 8,13.9166667 Z M8,11.4166667 C6.1130271,11.4166667 4.58333333,9.8869729 4.58333333,8 C4.58333333,6.1130271 6.1130271,4.58333333 8,4.58333333 C9.8869729,4.58333333 11.4166667,6.1130271 11.4166667,8 C11.4166667,9.8869729 9.8869729,11.4166667 8,11.4166667 Z M8,9.91666667 C9.05854577,9.91666667 9.91666667,9.05854577 9.91666667,8 C9.91666667,6.94145423 9.05854577,6.08333333 8,6.08333333 C6.94145423,6.08333333 6.08333333,6.94145423 6.08333333,8 C6.08333333,9.05854577 6.94145423,9.91666667 8,9.91666667 Z M2.75633658,3.81699675 C2.46344336,3.52410353 2.46344336,3.0492298 2.75633658,2.75633658 C3.0492298,2.46344336 3.52410353,2.46344336 3.81699675,2.75633658 L6.64366342,5.58300325 C6.93655664,5.87589647 6.93655664,6.3507702 6.64366342,6.64366342 C6.3507702,6.93655664 5.87589647,6.93655664 5.58300325,6.64366342 L2.75633658,3.81699675 Z M9.35633658,10.4169968 C9.06344336,10.1241035 9.06344336,9.6492298 9.35633658,9.35633658 C9.6492298,9.06344336 10.1241035,9.06344336 10.4169968,9.35633658 L13.2436634,12.1830032 C13.5365566,12.4758965 13.5365566,12.9507702 13.2436634,13.2436634 C12.9507702,13.5365566 12.4758965,13.5365566 12.1830032,13.2436634 L9.35633658,10.4169968 Z M10.4169968,6.64366342 C10.1241035,6.93655664 9.6492298,6.93655664 9.35633658,6.64366342 C9.06344336,6.3507702 9.06344336,5.87589647 9.35633658,5.58300325 L11.7096699,3.22966991 C12.0025631,2.9367767 12.4774369,2.9367767 12.7703301,3.22966991 C13.0632233,3.52256313 13.0632233,3.99743687 12.7703301,4.29033009 L10.4169968,6.64366342 Z M3.81699675,13.2436634 C3.52410353,13.5365566 3.0492298,13.5365566 2.75633658,13.2436634 C2.46344336,12.9507702 2.46344336,12.4758965 2.75633658,12.1830032 L5.58300325,9.35633658 C5.87589647,9.06344336 6.3507702,9.06344336 6.64366342,9.35633658 C6.93655664,9.6492298 6.93655664,10.1241035 6.64366342,10.4169968 L3.81699675,13.2436634 Z"
  />
);

const Help = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    {path}
  </svg>
);

export default Help;
