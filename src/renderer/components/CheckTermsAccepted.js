// @flow
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { openModal } from '~/renderer/reducers/modals'
import { isAcceptedTerms } from '~/renderer/terms'

const CheckTermsAccepted = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isAcceptedTerms()) {
      dispatch(openModal('MODAL_TERMS'))
    }
  }, [])

  return null
}

export default CheckTermsAccepted
