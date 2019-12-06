import React, { useEffect } from 'react'

const HelloMessage2 = ({ name }) => {
  useEffect(() => {
    console.log('je rerun a chaque fois 2')
  })
  return <h1>1</h1>
}

export default HelloMessage2
