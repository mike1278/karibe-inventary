import { useBrandLayout } from '@/models/page/brand-layout/context'
import { useInput } from '@/lib/hooks'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { OptionsDrawerChildren } from '.'

const GlobalOptions: OptionsDrawerChildren = forwardRef((_, ref) => {
  const [layout, setLayout] = useBrandLayout()
  const [rollbackLayout, setRollbackLayout] = useState(layout)

  const bindBrandName = {
    value: layout.brandName,
    onChange: (e) => setLayout({...layout, brandName: e.target.value})
  }

  useImperativeHandle(ref, () => ({
    onSubmit: async () => {
      setRollbackLayout(layout)
    },
    onCancel: () => {
      setLayout(rollbackLayout)
    }
  }))

  return (
    <>
      <h2 className="font-bold text-fg-primary text-xl">Global options</h2>

      <fieldset className="flex flex-col mb-4 animate">
        <label htmlFor="page-name" className="input-label">Page brand name</label>
        <input
          required
          id="page-name"
          type="text"
          className="input"
          placeholder="Ex. Maria's Blog"
          maxLength={24}
          {...bindBrandName}
        />
      </fieldset>
    </>
  )
})

export default GlobalOptions
