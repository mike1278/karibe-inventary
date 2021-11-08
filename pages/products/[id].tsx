import Link from '@/components/canonical-link'
import { PageWithLayout } from '@/components/page'
import Viewport, { setAnim } from '@/components/viewport'
import useSWR from 'swr'
import { BuyDetail, Product, SellDetail } from '@prisma/client'
import { useRouter } from 'next/router'

type Reports = {
  product: Product
  sellDetails: SellDetail[]
  buyDetails: BuyDetail[]
}

const monts = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const ProductReports: PageWithLayout = () => {
  const router = useRouter()
  const { data } = useSWR<Reports>(() => `/api/products/${router.query.id}`)

  return (
    <div className="py-4 c-lg">
      <div className="flex text-xs w-full pb-6 uppercase">
        <Link href="/" className="hover:underline">
          Ir al dashboard
        </Link>
      </div>
      {data ? (
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
            <div className="mx-auto w-full grid pb-16 gap-6 grid-cols-1 sm:grid-cols-4 lg:w-9/10">
              <div className="bg-bg-secondary rounded-lg flex flex-col space-y-2 shadow text-right w-full p-4">
                <h4 className="font-bold text-lg">Unidades vendidas:</h4>
                <p className="font-bold text-4xl">~{data.sellDetails.map(p => p.quantity).reduce((a, b) => a + b, 0)}</p>
              </div>
              <div className="bg-bg-secondary rounded-lg flex flex-col space-y-2 shadow text-right w-full p-4">
                <h4 className="font-bold text-lg">Ganancias totales:</h4>
                <p className="font-bold text-green-500 text-4xl">${data.sellDetails.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0).toFixed(2)}</p>
              </div>
              <div className="bg-bg-secondary rounded-lg flex flex-col space-y-2 shadow text-right w-full p-4">
                <h4 className="font-bold text-lg">Unidades solicitadas:</h4>
                <p className="font-bold text-4xl">~{data.buyDetails.map(p => p.quantity).reduce((a, b) => a + b, 0)}</p>
              </div>
              <div className="bg-bg-secondary rounded-lg flex flex-col space-y-2 shadow text-right w-full p-4">
                <h4 className="font-bold text-lg">Inversión total:</h4>
                <p className="font-bold text-red-500 text-4xl">${data.buyDetails.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </Viewport>
      ) : null}
    </div>
  )
}

ProductReports.getLayoutProps = () => ({
  title: 'Productos'
})

export default ProductReports
