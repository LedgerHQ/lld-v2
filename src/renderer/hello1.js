import React, { useEffect } from 'react'

const HelloMessage = ({ name }) =>
{
  useEffect(() => {
    console.log('SALUUUUUUUUUUUUUUT')
  }, [])

  useEffect(() => {
    console.log('je rerun a chaque fois')
  })
  return (
    <h1>
      suppp { name }
      <div>ll</div>
    </h1>
  )
}

export default HelloMessage