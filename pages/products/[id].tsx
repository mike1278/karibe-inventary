import Link from '@/components/canonical-link'
import { PageWithLayout } from '@/components/page'
import Viewport, { setAnim } from '@/components/viewport'
import useSWR from 'swr'
import { BuyDetail, Product, SellDetail } from '@prisma/client'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { formatDate, printElement } from '@/lib/utils/client'
import { Button } from '@/components/button'
import { Printer24 } from '@carbon/icons-react'
import { Chart } from '@/components/chart'

type Reports = {
  product: Product
  sellDetails: SellDetail[]
  buyDetails: BuyDetail[]
}

const monts = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const ProductReports: PageWithLayout = () => {
  const router = useRouter()

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

  const { data } = useSWR<Reports>(() => `/api/products/${router.query.id}?start=${filters.start}&end=${filters.end}`)

  const wrapperRef = useRef<HTMLDivElement>()

  const chartData = useMemo(() => {
    if (!data) return [];
    return [...data.sellDetails, ...data.buyDetails]
      .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
      .map(d => ({
        value: d.inStock,
        datetime: d.createdAt,
      }))
  }, [data])

  return (
    <div className="py-4 c-lg">
      <div className="flex text-xs w-full pb-6 uppercase">
        <Link href="/products" className="hover:underline px-3 py-2 bg-white border border-gray-100 shadow flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
      </div>

      <style type="text/css" media="print" jsx global>{`
        @page {size: landscape; }
      `}</style>

      {data ? (
        <div ref={wrapperRef}>
          <Viewport className="w-full animate" once style={setAnim({ y: '-0.3rem' })}>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center sm:mb-0 bg-white px-3 py-2 shadow">
                  <h2 className="font-bold leading-normal text-xl text-gray-700">
                    {data.product.name}
                  </h2>
                </div>

                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 items-end lg:grid-cols-5 bg-white px-3 py-2 shadow">
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

                  <Button title="Filtrar" className="justify-center items-center" onClick={filter} />
                </div>
              </div>

              <div className="mx-auto w-full auto-rows-auto grid gap-6 grid-cols-1 sm:grid-cols-4">
                <div className="flex flex-col space-y-2 text-right w-full card">
                  <h4 className="font-bold text-lg">Unidades vendidas:</h4>
                  <p className="font-bold text-4xl">~{data.sellDetails.map(p => p.quantity).reduce((a, b) => a + b, 0)}</p>
                </div>
                <div className="flex flex-col space-y-2 text-right w-full card">
                  <h4 className="font-bold text-lg">Ganancias totales:</h4>
                  <p className="font-bold text-green-500 text-4xl">${data.sellDetails.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0).toFixed(2)}</p>
                </div>
                {/* <div className="flex flex-col space-y-2 text-right w-full card">
                  <h4 className="font-bold text-lg">Unidades solicitadas:</h4>
                  <p className="font-bold text-4xl">~{data.buyDetails.map(p => p.quantity).reduce((a, b) => a + b, 0)}</p>
                </div> */}
                <div className="flex flex-col space-y-2 text-right w-full card">
                  <h4 className="font-bold text-lg">Inversión total:</h4>
                  <p className="font-bold text-red-500 text-4xl">${data.buyDetails.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0).toFixed(2)}</p>
                </div>
                <div className="flex flex-col space-y-2 text-right w-full card">
                  <h4 className="font-bold text-lg">Estadísticas</h4>
                  <p className="font-bold">Pedido óptimo: {data.product.max - Math.max(0, data.product.stock)} unidades</p>
                  <p className="font-bold">Punto de reorden: {data.product.min} unidades</p>
                  <p className="font-bold">C. Amortiguadora: {data.product.max - data.product.min} unidades</p>
                </div>
                {data.sellDetails?.length ? (
                  <div className="bg-bg-secondary rounded-lg flex flex-col space-y-2 shadow text-right w-full overflow-hidden print:hidden sm:col-span-full">
                    <Chart
                      chartData={chartData}
                      title="Comportamiento del stock"
                    />
                  </div>
                ) : null}
              </div>
              <div className="flex mx-auto w-full pb-16 justify-end lg:w-9/10">
                <Button className="print:hidden" onClick={() => printElement(wrapperRef.current)} icon={<Printer24 />}>Exportar reportes</Button>
              </div>
            </div>
          </Viewport>
        </div>
      ) : null}
    </div>
  )
}

ProductReports.getLayoutProps = () => ({
  title: 'Productos'
})

export default ProductReports
