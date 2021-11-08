import Link from '@/components/canonical-link'
import { PageWithLayout, useOptionsDrawer } from '@/components/page'
import Table, { TableColumn } from '@/components/table'
import Viewport, { setAnim } from '@/components/viewport'
import { useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Buy as DBBuy, Product as DBPRoduct, BuyDetail as DBBuyDetail, ProductCategory, User } from '@prisma/client'
import { UserFollow24, ChevronLeft16, ChevronRight16, Close24 } from '@carbon/icons-react'
import { Button } from '@/components/button'
import Loading from '@/components/loading'
import { formatDate } from '@/lib/utils/client'
import { getProductColumns } from '../products'
import { useRouter } from 'next/router'

type Product = DBPRoduct & {
  category: ProductCategory
}

type BuyDetail = DBBuyDetail & {
  product: Product
}

type Buy = DBBuy & {
  details: BuyDetail[]
  user: User
}

const getColumns = (): TableColumn<BuyDetail>[] => ([
  {
    Header: 'Nombre del producto',
    id: 'name',
    Cell: ({ row }) => row.original.product.name,
  },
  {
    Header: 'SKU',
    id: 'sku',
    Cell: ({ row }) => (
      <span
        className={`rounded-full mx-auto bg-gray-400 bg-opacity-20 shadow-sm text-xs p-2`}
      >
        {row.original.product.sku}
      </span>
    )
  },
  {
    Header: 'Categoría',
    id: 'category',
    Cell: ({ row }) => (
      <span
        className={`rounded-full mx-auto bg-fg-primary shadow-sm text-bg-secondary text-xs p-2`}
      >
        {row.original.product.category.name}
      </span>
    )
  },
  {
    Header: 'Precio de unidad',
    id: 'price',
    Cell: ({ row }) => <span className="font-bold text-red-500">${row.original.product.providerPrice.toFixed(2)}</span>,
  },
  {
    Header: 'Cantidad',
    accessor: 'quantity',
  },
  {
    Header: 'Precio total',
    id: 'total',
    Cell: ({ row }) => <span className="font-bold text-red-500">${(row.original.product.providerPrice * row.original.quantity).toFixed(2)}</span>,
  },
])

const Buy: PageWithLayout = () => {
  const router = useRouter()

  const { data, mutate } = useSWR<Buy>(() => `/api/buys/${router.query.id}`, {
    onSuccess: (data) => {
      if (!data) {
        router.replace('/404', window.location.pathname)
      }
    }
  })

  const columns = useMemo<TableColumn<BuyDetail>[]>(() => [
    ...getColumns(),
  ], [])

  return (
    <div className="py-4 c-lg">
      <div className="flex text-xs w-full pb-6 uppercase">
        <Link href="/" className="hover:underline">
          Ir al dashboard
        </Link>
      </div>
      <Viewport className="w-full animate" once style={setAnim({ y: '-0.3rem' })}>
        <div className="flex flex-col space-y-6">
          <div className="flex mb-4 items-center sm:mb-0">
            <h2 className="font-bold leading-normal text-2xl">
              Detalles de entrada
            </h2>
          </div>

          {data ? (
            <div className="flex flex-col mx-auto space-y-6 w-full pb-16 lg:w-9/10">
              <div className="flex sm:space-x-6">
                <p><span className="font-bold">Operador:</span> {data.user.name}</p>
                <p><span className="font-bold">Facturado el:</span> {formatDate(data.createdAt)}</p>
              </div>
              <Table columns={columns} data={data.details} />
              <div className="flex space-x-6 w-full justify-end">
                <p>Total: <span className="font-bold text-red-500">${data.priceTotal.toFixed(2)}</span></p>
              </div>
            </div>
          ) : null}
        </div>
      </Viewport >
    </div >
  )
}

Buy.getLayoutProps = () => ({
  title: 'Productos'
})

export default Buy
