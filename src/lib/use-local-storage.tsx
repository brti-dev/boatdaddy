import { useState } from 'react'

const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [string | T, typeof setValue] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)

      return item ?? initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: T): void => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, String(value))
    } catch (error) {
      console.error(`Error setting localStorage value for key '${key}'`)
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
