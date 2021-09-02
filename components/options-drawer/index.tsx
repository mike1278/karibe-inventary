import { Button } from '@/components/button'
import { FormEventHandler, MutableRefObject, useRef, ForwardRefExoticComponent, RefAttributes, ReactNode } from 'react'

export type OptionsDrawerForm = {
  onSubmit?: () => Promise<void>
  onCancel?: () => void
}

export type OptionsDrawerChildren<T = any> = ForwardRefExoticComponent<T & RefAttributes<OptionsDrawerForm>>

export type OptionsDrawerChildrenCallback = (ref: MutableRefObject<OptionsDrawerForm>) => ReactNode

type OptionsDrawerProps = {
  open: boolean
  onClose?: () => void
  children?: OptionsDrawerChildrenCallback
}

const OptionsDrawer = ({ open, onClose = () => {}, children }: OptionsDrawerProps) => {
  const childRef = useRef<OptionsDrawerForm>(undefined)
  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    try {
      await childRef?.current?.onSubmit()
      onClose()
    } catch (e) {
    }
  }
  const cancel = () => {
    if (childRef?.current?.onCancel) {
      childRef.current.onCancel()
    }
    onClose()
  }
  return ( 
    <div
      className={`duration-500 transition-transform transform-gpu right-0 z-[1000] fixed flex flex-col space-y-4 w-full bg-bg-secondary sm:w-[50vw] xl:w-[30vw] h-screen shadow-lg ${!open ? 'translate-x-full' : ''}`}
    >
      <form className={`flex flex-col space-y-10 p-8 overflow-y-auto duration-500 transform transition-transform`} onSubmit={onSubmit}>
        {children ? children(childRef) : null}
        <div className="grid gap-4 grid-cols-2">
          <Button
            className="flex animate justify-center"
            onClick={cancel}
            btnType="button"
          >
            Cancelar
          </Button>
          <Button
            className="flex animate justify-center"
            btnType="submit"
          >
            Guardar
          </Button>
        </div>
      </form>
    </div>
  )
}

export default OptionsDrawer
