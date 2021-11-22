import Link from '@/components/canonical-link'
import { PageWithLayout } from '@/components/page'
import Viewport, { setAnim } from '@/components/viewport'
import useSWR from 'swr'
import { BuyDetail, Product, SellDetail } from '@prisma/client'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { printElement } from '@/lib/utils/client'
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
  const { data } = useSWR<Reports>(() => `/api/products/${router.query.id}`)

  const wrapperRef = useRef<HTMLDivElement>()

  return (
    <div className="py-4 c-lg">
      <div className="flex text-xs w-full pb-6 uppercase">
        <Link href="/products" className="hover:underline">
          Ir a productos
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
                <div className="flex items-center sm:mb-0">
                  <h2 className="font-bold leading-normal text-2xl">
                    {data.product.name}
                  </h2>
                </div>
                <h3 className="leading-normal">
                  Reportes del último mes - {monts[new Date().getMonth()]} de {new Date().getFullYear()}
                </h3>
              </div>
              <div className="mx-auto w-full auto-rows-auto grid gap-6 grid-cols-1 sm:grid-cols-4 lg:w-9/10">
                <div className="flex flex-col space-y-2 text-right w-full card">
                  <h4 className="font-bold text-lg">Unidades vendidas:</h4>
                  <p className="font-bold text-4xl">~{data.sellDetails.map(p => p.quantity).reduce((a, b) => a + b, 0)}</p>
                </div>
                <div className="flex flex-col space-y-2 text-right w-full card">
                  <h4 className="font-bold text-lg">Ganancias totales:</h4>
                  <p className="font-bold text-green-500 text-4xl">${data.sellDetails.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0).toFixed(2)}</p>
                </div>
                <div className="flex flex-col space-y-2 text-right w-full card">
                  <h4 className="font-bold text-lg">Unidades solicitadas:</h4>
                  <p className="font-bold text-4xl">~{data.buyDetails.map(p => p.quantity).reduce((a, b) => a + b, 0)}</p>
                </div>
                <div className="flex flex-col space-y-2 text-right w-full card">
                  <h4 className="font-bold text-lg">Inversión total:</h4>
                  <p className="font-bold text-red-500 text-4xl">${data.buyDetails.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0).toFixed(2)}</p>
                </div>
                {data.sellDetails?.length ? (
                  <div className="bg-bg-secondary rounded-lg flex flex-col space-y-2 shadow text-right w-full overflow-hidden print:hidden sm:col-span-full lg:col-span-3">
                    <Chart
                      chartData={data.sellDetails.map(d => ({
                        value: d.inStock,
                        datetime: d.createdAt,
                      }))}
                      title="Stock por salida"
                    />
                  </div>
                ) : null}
                <div className="flex flex-col space-y-2 text-right w-full sm:col-start-3 sm:col-span-2 lg:col-start-auto lg:col-span-1">
                  <h4 className="font-bold text-lg">Estadísticas</h4>
                  <div className="flex flex-col space-y-2 card">
                    <p className="font-bold">Pedido óptimo: {data.product.max - Math.max(0, data.product.stock)} unidades</p>
                    <p className="font-bold">Punto de reorden: {data.product.min} unidades</p>
                    <p className="font-bold">C. Amortiguadora: {data.product.max - data.product.min} unidades</p>
                  </div>
                </div>
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
