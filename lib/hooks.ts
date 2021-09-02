import { RefObject, useEffect, useState } from 'react'

export const useOutsideClick = (ref: RefObject<HTMLElement>, callback: CallableFunction) => {
  const handleClick = (e: MouseEvent) => {
    if (!ref.current?.contains(e.target as Node)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  })
}

export const useInput = <T extends (number | string | boolean)>(initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);
  return {
    value,
    setValue,
    reset: () => setValue(initialValue),
    bind: {
      value,
      onChange: event => {
        setValue(event.target.value)
      }
    }
  }
}
