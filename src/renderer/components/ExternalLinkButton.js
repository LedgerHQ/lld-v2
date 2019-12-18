// @flow

import React from 'react'
import { openURL } from '~/helpers/linking'

import Button from '~/renderer/components/Button'

export function ExternalLinkButton({ label, url, ...props }: { label: React$Node, url: string }) {
  return (
    <Button onClick={() => openURL(url)} {...props}>
      {label}
    </Button>
  )
}

export default ExternalLinkButton
