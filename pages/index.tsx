import { PageWithLayout } from '@/components/page'
import Viewport, { setAnim } from '@/components/viewport'
import { BuyDetail, SellDetail } from '@prisma/client'
import { Printer24 } from '@carbon/icons-react'
import useSWR from 'swr'
import { printElement } from '@/lib/utils/client'
import { Button } from '@/components/button'
import { useRef } from 'react'

const monts = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

type Reports = {
  sellDetails: SellDetail[]
  buyDetails: BuyDetail[]
}

const Index: PageWithLayout = () => {
  const { data } = useSWR<Reports>(() => `/api/reports`)

  const wrapperRef = useRef<HTMLDivElement>()
  
  return (
    <div className="py-4 c-lg">
      {data ? (
        <Viewport className="w-full animate" once style={setAnim({ y: '-0.3rem' })}>
          <div className="flex flex-col space-y-6" ref={wrapperRef}>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center sm:mb-0">
                <h2 className="font-bold leading-normal text-2xl">
                  Reportes generales
                </h2>
              </div>
              <h3 className="leading-normal">
                Reportes generales del último mes - {monts[new Date().getMonth()]} de {new Date().getFullYear()}
              </h3>
            </div>

            <style type="text/css" media="print" jsx global>{`
              @page {size: landscape; }
            `}</style>

            <div className="mx-auto w-full grid gap-6 grid-cols-1 sm:grid-cols-4 lg:w-9/10">
              <div className="flex flex-col space-y-2 text-right w-full card">
                <h4 className="font-bold text-lg">Productos vendidos:</h4>
                <p className="font-bold text-4xl">~{data.sellDetails.map(p => p.quantity).reduce((a, b) => a + b, 0)}</p>
              </div>
              <div className="flex flex-col space-y-2 text-right w-full card">
                <h4 className="font-bold text-lg">Ganancias totales:</h4>
                <p className="font-bold text-green-500 text-4xl">${data.sellDetails.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0).toFixed(2)}</p>
              </div>
              <div className="flex flex-col space-y-2 text-right w-full card">
                <h4 className="font-bold text-lg">Productos solicitados:</h4>
                <p className="font-bold text-4xl">~{data.buyDetails.map(p => p.quantity).reduce((a, b) => a + b, 0)}</p>
              </div>
              <div className="flex flex-col space-y-2 text-right w-full card">
                <h4 className="font-bold text-lg">Inversión total:</h4>
                <p className="font-bold text-red-500 text-4xl">${data.buyDetails.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0).toFixed(2)}</p>
              </div>
            </div>
            <div className="flex mx-auto w-full pb-16 justify-end lg:w-9/10">
              <Button className="print:hidden" onClick={() => printElement(wrapperRef.current)} icon={<Printer24 />}>Exportar reportes</Button>
            </div>
          </div>
        </Viewport>
      ) : null}
    </div>
  )
}

export default Index
