import Viewport, { setAnim } from './viewport'
import { Error32 } from '@carbon/icons-react'

export const ErrorCard = ({ message }: { message: string}) => (
  <Viewport
    className="flex-grow flex flex-col h-full my-4 w-full animate justify-center items-center"
    style={setAnim({ y: '0.2rem' })}
    oneWay
  >
    <div className="border rounded-lg border-x-gray-800 shadow p-4">
      <Error32 className="m-auto mb-4 w-full text-red-500 sm:w-auto" width={48} height={48} />
      <p className="text-center text-sm leading-none">
        {message}
      </p>
    </div>
  </Viewport>
)
