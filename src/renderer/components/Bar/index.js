// @flow

import styled from 'styled-components'
import get from 'lodash/get'

import Box from '~/renderer/components/Box'

const Bar = styled(Box)`
  background: ${p => get(p.theme.colors, p.color)};
  height: ${p => p.size || 1}px;
`

export default Bar
