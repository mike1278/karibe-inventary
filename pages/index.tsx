import { PageWithLayout } from '@/components/page'
import Viewport, { setAnim } from '@/components/viewport'
import { Buy, BuyDetail, Sell, SellDetail } from '@prisma/client'
import { Printer24 } from '@carbon/icons-react'
import useSWR from 'swr'
import { formatDate, printElement } from '@/lib/utils/client'
import { Button } from '@/components/button'
import React, { useCallback, useRef, useState } from 'react'
import { Chart } from '@/components/chart'
import Logo from '@/public/venita.png'
import Image from 'next/image'

const monts = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

type Reports = {
  sells: Sell[]
  buys: Buy[]
  sellDetails: SellDetail[]
  buyDetails: BuyDetail[]
}

const Index: PageWithLayout = () => {
  const [filters, setFilters] = useState(() => ({
    start: formatDate(new Date(`${new Date().getFullYear()}/${new Date().getMonth() + 1}/01`), '-'),
    end: formatDate(new Date(), '-'),
  }))

  const [inputs, setInputs] = useState(() => filters)

  const bindForm = useCallback((field: string) => ({
    value: inputs[field],
    onChange: (e) => {
      const tmp = JSON.parse(JSON.stringify(inputs))
      tmp[field] = e.target.value
      setInputs(tmp)
    }
  }), [inputs])

  const filter = useCallback(() => {
    setFilters(inputs)
  }, [inputs])

  const { data } = useSWR<Reports>(() => `/api/reports?start=${filters.start}&end=${filters.end}`)

  const wrapperRef = useRef<HTMLDivElement>()

  return (
    <div className="py-4 c-lg">
      {data ? (
        <Viewport className="w-full animate" once style={setAnim({ y: '-0.3rem' })}>
          <div className="image_print" />
          <div className="flex flex-col space-y-6" ref={wrapperRef}>
            <div className="hidden print:flex flex-col">
              <div className="w-[190px]">
                <Image src={Logo} width={190} height={94} className="mr-auto" objectFit="contain" loading="eager" />
              </div>
              <p className="mt-4"><span className="font-bold">RIF:</span> J-50031533-3</p>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="bg-bg-secondary rounded-lg flex shadow p-4 items-center print:shadow-none print:p-0 sm:mb-0">
                <h2 className="font-bold text-xl leading-normal">
                  Reportes generales
                </h2>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-lg shadow grid p-4 gap-8 grid-cols-1 items-end items-bottom print:shadow-none print:p-0 sm:grid-cols-2 lg:grid-cols-5">
              <fieldset className="flex flex-col w-full animate" style={setAnim({ d: '100ms' })}>
                <label htmlFor="init" className="input-label">Fecha de inicio</label>
                <input
                  type="date"
                  required
                  max={inputs.end ? formatDate(inputs.end, '-') : ''}
                  className="w-full input"
                  id="init"
                  style={{ height: 41 }}
                  {...bindForm('start')}
                />
              </fieldset>

              <fieldset className="flex flex-col w-full animate" style={setAnim({ d: '100ms' })}>
                <label htmlFor="end" className="input-label">Fecha fin</label>
                <input
                  type="date"
                  required
                  disabled={!inputs.start}
                  min={inputs.start ? formatDate(inputs.start, '-') : ''}
                  max={formatDate(new Date(), '-')}
                  className="w-full input"
                  id="end"
                  style={{ height: 41 }}
                  {...bindForm('end')}
                />
              </fieldset>

              <Button title="Filtrar" className="justify-center items-center print:hidden" onClick={filter} />
            </div>

            <style type="text/css" media="print" jsx global>{`
              @page {size: landscape; }
            `}</style>

            <div className="mx-auto w-full grid gap-6 grid-cols-1 sm:grid-cols-4">
              <div className="flex flex-col space-y-2 text-right w-full card">
                <h4 className="font-bold text-lg">Productos vendidos:</h4>
                <p className="font-bold text-4xl">~{data.sellDetails.map(p => p.quantity).reduce((a, b) => a + b, 0)}</p>
              </div>
              <div className="flex flex-col space-y-2 text-right w-full card">
                <h4 className="font-bold text-lg">Ganancias totales:</h4>
                <p className="font-bold text-4xl">${data.sellDetails.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0).toFixed(2)}</p>
              </div>
              <div className="flex flex-col space-y-2 text-right w-full card">
                <h4 className="font-bold text-lg">Productos solicitados:</h4>
                <p className="font-bold text-4xl">~{data.buyDetails.map(p => p.quantity).reduce((a, b) => a + b, 0)}</p>
              </div>
              <div className="flex flex-col space-y-2 text-right w-full card">
                <h4 className="font-bold text-lg">Inversión total:</h4>
                <p className="font-bold text-4xl">${data.buyDetails.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0).toFixed(2)}</p>
              </div>
              {data.sells.length ? (
                <div className="bg-bg-secondary rounded-lg flex flex-col space-y-2 shadow text-right w-full overflow-hidden print:hidden sm:col-span-full lg:col-span-2">
                  <Chart
                    chartData={data.sells.map(d => ({
                      value: d.priceTotal,
                      datetime: d.createdAt,
                    }))}
                    title="Salidas del mes"
                  />
                </div>
              ) : null}
              {data.buys.length ? (
                <div className="bg-bg-secondary rounded-lg flex flex-col space-y-2 shadow text-right w-full overflow-hidden print:hidden sm:col-span-full lg:col-span-2">
                  <Chart
                    chartData={data.buys.map(d => ({
                      value: d.priceTotal,
                      datetime: d.createdAt,
                    }))}
                    title="Entradas del mes"
                  />
                </div>
              ) : null}
            </div>
            <div className="flex mx-auto w-full pb-16 justify-end">
              <Button className="print:hidden" onClick={() => printElement(wrapperRef.current)} icon={<Printer24 />}>Exportar reportes</Button>
            </div>
          </div>
        </Viewport >
      ) : null}
    </div >
  )
}

export default Index
