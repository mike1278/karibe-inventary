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
import Image from 'next/image'
import Logo from '@/public/venita.png'

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
        <Link href="/products" className="bg-bg-secondary border flex border-gray-100 shadow py-2 px-3 items-center hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 mr-2 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <div className="hidden print:flex flex-col">
                <div className="w-[190px]">
                  <Image src={Logo} width={190} height={94} className="mr-auto" objectFit="contain" loading="eager" />
                </div>
                <p className="mt-4"><span className="font-bold">RIF:</span> J-50031533-3</p>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="bg-bg-secondary rounded-lg flex shadow p-4 items-center print:shadow-none print:p-0 sm:mb-0">
                  <h2 className="font-bold text-xl text-fg-secondary leading-normal">
                    {data.product.name}
                  </h2>
                </div>

                <div className="bg-bg-secondary rounded-lg shadow grid p-4 gap-8 grid-cols-1 items-end print:shadow-none print:p-0 sm:grid-cols-2 lg:grid-cols-5">
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
              </div>

              <div className="mx-auto w-full auto-rows-auto grid gap-6 grid-cols-1 sm:grid-cols-4">
                <div className="flex flex-col space-y-2 text-right w-full card">
                  <h4 className="font-bold text-lg">Unidades vendidas:</h4>
                  <p className="font-bold text-4xl">~{data.sellDetails.map(p => p.quantity).reduce((a, b) => a + b, 0)}</p>
                </div>
                <div className="flex flex-col space-y-2 text-right w-full card">
                  <h4 className="font-bold text-lg">Ganancias totales:</h4>
                  <p className="font-bold text-4xl">${data.sellDetails.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0).toFixed(2)}</p>
                </div>
                {/* <div className="flex flex-col space-y-2 text-right w-full card">
                  <h4 className="font-bold text-lg">Unidades solicitadas:</h4>
                  <p className="font-bold text-4xl">~{data.buyDetails.map(p => p.quantity).reduce((a, b) => a + b, 0)}</p>
                </div> */}
                <div className="flex flex-col space-y-2 text-right w-full card">
                  <h4 className="font-bold text-lg">Inversión total:</h4>
                  <p className="font-bold text-4xl">${data.buyDetails.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0).toFixed(2)}</p>
                </div>
                <div className="flex flex-col space-y-2 text-right w-full card">
                  <h4 className="font-bold text-lg">Estadísticas</h4>
                  <p className="font-bold">Pedido óptimo: {Math.max(0, data.product.max - Math.max(0, data.product.stock))} unidades</p>
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
              <div className="flex mx-auto w-full pb-16 justify-end">
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
