// @flow
import { useCallback, useEffect, useRef, useState } from 'react'
import debounce from 'lodash/debounce'

import type { DebounceOptions, Cancelable } from 'lodash'

export const useDebouncedCallback = (
  fn: (...args: any[]) => any,
  delay: number = 0,
  options: DebounceOptions,
): Function & Cancelable => useCallback(debounce(fn, delay, options), [fn, delay, options])

export const useDebounced = <T>(value: T, delay: number = 0, options: DebounceOptions): T => {
  const previousValue = useRef(value)
  const [current, setCurrent] = useState(value)

  const debouncedCallback = useDebouncedCallback((val: *) => setCurrent(val), delay, options)

  useEffect(() => {
    if (value !== previousValue.current) {
      debouncedCallback(value)
      previousValue.current = value

      return () => {
        debouncedCallback.cancel()
      }
    }
  }, [value])

  return current
}
