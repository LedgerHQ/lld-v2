// @flow
import React, { useEffect } from 'react'

type Props = {
  name?: string,
}

const HelloMessage = ({ name }: Props) => {
  useEffect(() => {
    console.log('SALUUUUUUUUUUUUUUT')
  }, [])

  useEffect(() => {
    console.log('je rerun a chaque fois')
  })
  return <h1>sup {name} !!!</h1>
}

export default HelloMessage
