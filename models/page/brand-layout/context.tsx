import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'
import { getDefaultBrandLayout, IBrandLayout } from '.'

export const BrandLayoutContext = createContext<[IBrandLayout, Dispatch<SetStateAction<IBrandLayout>>]>(null)

export const useBrandLayout = () => useContext(BrandLayoutContext)

export const BrandLayoutProvider = ({
  defaultLayout = getDefaultBrandLayout(),
  children
}: {
  defaultLayout?: IBrandLayout,
  children?: ReactNode
}) => {
  const [layout, setLayout] = useState<IBrandLayout>(defaultLayout)
  return (
    <BrandLayoutContext.Provider value={[layout, setLayout]}>
      {children}
    </BrandLayoutContext.Provider>
  )
}
