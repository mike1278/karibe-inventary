import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'

export const DarkModeContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>(undefined)

export const useDarkMode = () => useContext(DarkModeContext)

export const DarkModeProvider = ({
  children
}: {
  children?: ReactNode
}) => {
  const windowGlobal = typeof window !== "undefined" && window
  const [darkMode, setDarkMode] = useState(() => {
    if (windowGlobal) {
      return JSON.parse(windowGlobal.localStorage.getItem('darkMode')) || false
    }
    return false
  })
  useEffect(() => {
    window.localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  return (
    <DarkModeContext.Provider value={[darkMode, setDarkMode]}>
      {children}
    </DarkModeContext.Provider>
  )
}
