import React, { useEffect } from 'react'

const HelloMessage = ({ name }) => {
  useEffect(() => {
    console.log('SALUUUUUUUUUUUUUUT')
  }, [])

  useEffect(() => {
    console.log('je rerun a chaque fois')
  })
  return <h1>sup {name} !!!</h1>
}

export default HelloMessage
