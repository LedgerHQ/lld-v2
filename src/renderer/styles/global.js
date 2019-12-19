// @flow

/* eslint-disable no-unused-expressions */

import { createGlobalStyle } from 'styled-components'

import { rgba } from './helpers'
import { radii } from './theme'
import reset from './reset'

export const GlobalStyle = createGlobalStyle`
  body, #preload {
    background-color: ${p => p.theme.colors.palette.background.default} !important;
  }

  ${reset};

  .tippy-content {
    padding: 0 !important;
  }

  .tippy-tooltip.ledger-theme {
    background-color: ${p => p.theme.colors.palette.text.shade100};
    color: ${p => p.theme.colors.palette.background.default};
    border-radius: ${radii[1]}px;
  }

  .tippy-tooltip.ledger-theme .tippy-svg-arrow {
    fill: ${p => p.theme.colors.palette.text.shade100};
  }

  .tippy-popper.ledger-theme .tippy-roundarrow {
    fill: ${p => p.theme.colors.palette.text.shade100};
  }

  .select__control:hover, .select__control-is-focused {
    border-color: ${p => p.theme.colors.palette.divider};
  }

  .select__single-value {
    color: inherit !important;
    right: 0;
    left: 15px;
  }

  .select__placeholder {
    color ${p => p.theme.colors.palette.divider} !important;
  }

  ::selection {
    background: ${p => rgba(p.theme.colors.wallet, 0.1)};
  }
`
