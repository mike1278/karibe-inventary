import { IBrandLayout } from '@/models/page/brand-layout'
import { useBrandLayout } from '@/models/page/brand-layout/context'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { OptionsDrawerChildren } from '.'

const ThemeOptions: OptionsDrawerChildren = forwardRef((_, ref) => {
  const [layout, setLayout] = useBrandLayout()
  const [rollbackLayout, setRollbackLayout] = useState(layout)

  const bindColor = (theme: 'normal' | 'dark', type: 'foreground' | 'background', color: 'primary' | 'secondary') => ({
    value: layout.themes[theme][type][color],
    onChange: (e) => {
      const tmp = JSON.parse(JSON.stringify(layout)) as IBrandLayout
      tmp.themes[theme][type][color] = e.target.value
      setLayout(tmp)
    }
  })

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
      <h2 className="font-bold text-fg-primary text-xl">Theme options</h2>

      <h3 className="font-bold text-md text-fg-primary">Normal theme</h3>

      <div className="flex flex-col space-y-4 px-6">
        <h4 className="font-bold text-sm text-fg-primary">Foreground</h4>

        <fieldset className="flex space-x-4 mb-4 animate">
          <div className="flex items-center">
            <input
              required
              id="fg-p"
              type="color"
              className="mr-2"
              {...bindColor('normal', 'foreground', 'primary')}
            />
            <label htmlFor="page-name" className="input-label">Primary</label>
          </div>
          <div className="flex items-center">
            <input
              required
              id="fg-s"
              type="color"
              className="mr-2"
              {...bindColor('normal', 'foreground', 'secondary')}
            />
            <label htmlFor="fg-s" className="input-label">Secondary</label>
          </div>
        </fieldset>
      </div>


      <div className="flex flex-col space-y-4 px-6">
        <h4 className="font-bold text-sm text-fg-primary">Background</h4>

        <fieldset className="flex space-x-4 mb-4 animate">
          <div className="flex items-center">
            <input
              required
              id="bg-p"
              type="color"
              className="mr-2"
              {...bindColor('normal', 'background', 'primary')}
            />
            <label htmlFor="bg-p" className="input-label">Primary</label>
          </div>
          <div className="flex items-center">
            <input
              required
              id="bg-s"
              type="color"
              className="mr-2"
              {...bindColor('normal', 'background', 'secondary')}
            />
            <label htmlFor="bg-s" className="input-label">Secondary</label>
          </div>
        </fieldset>
      </div>

      <h3 className="font-bold text-md text-fg-primary">Dark theme</h3>

      <div className="flex flex-col space-y-4 px-6">
        <h4 className="font-bold text-sm text-fg-primary">Foreground</h4>

        <fieldset className="flex space-x-4 mb-4 animate">
          <div className="flex items-center">
            <input
              required
              id="fg-p"
              type="color"
              className="mr-2"
              {...bindColor('dark', 'foreground', 'primary')}
            />
            <label htmlFor="page-name" className="input-label">Primary</label>
          </div>
          <div className="flex items-center">
            <input
              required
              id="fg-s"
              type="color"
              className="mr-2"
              {...bindColor('dark', 'foreground', 'secondary')}
            />
            <label htmlFor="fg-s" className="input-label">Secondary</label>
          </div>
        </fieldset>
      </div>


      <div className="flex flex-col space-y-4 px-6">
        <h4 className="font-bold text-sm text-fg-primary">Background</h4>

        <fieldset className="flex space-x-4 mb-4 animate">
          <div className="flex items-center">
            <input
              required
              id="bg-p"
              type="color"
              className="mr-2"
              {...bindColor('dark', 'background', 'primary')}
            />
            <label htmlFor="bg-p" className="input-label">Primary</label>
          </div>
          <div className="flex items-center">
            <input
              required
              id="bg-s"
              type="color"
              className="mr-2"
              {...bindColor('dark', 'background', 'secondary')}
            />
            <label htmlFor="bg-s" className="input-label">Secondary</label>
          </div>
        </fieldset>
      </div>
    </>
  )
})

export default ThemeOptions
