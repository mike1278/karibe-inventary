import Link from '@/components/canonical-link'
import { PageWithLayout, useOptionsDrawer } from '@/components/page'
import Table, { TableColumn } from '@/components/table'
import Viewport, { setAnim } from '@/components/viewport'
import { useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import { Buy as DBBuy, Product as DBPRoduct, BuyDetail as DBBuyDetail, ProductCategory, User } from '@prisma/client'
import { Printer24 } from '@carbon/icons-react'
import { Button } from '@/components/button'
import { formatDate, printElement } from '@/lib/utils/client'
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
        className={`rounded-full mx-auto bg-gray-400 bg-opacity-20 shadow-sm text-xs p-2 print:shadow-none print:border`}
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
        className={`rounded-full mx-auto bg-fg-primary shadow-sm text-bg-secondary text-xs p-2 print:shadow-none print:border`}
      >
        {row.original.product.category.name}
      </span>
    )
  },
  {
    Header: 'Precio de venta',
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

  const wrapperRef = useRef<HTMLDivElement>()

  return (
    <div className="py-4 c-lg">
      <Viewport className="w-full animate" once style={setAnim({ y: '-0.3rem' })}>
        <div className="flex flex-col space-y-6">
          <div className="flex mb-4 items-center sm:mb-0 bg-white px-3 py-2 shadow">
            <h2 className="font-bold leading-normal text-2xl">
              Detalles de entrada
            </h2>
          </div>

          <style type="text/css" media="print" jsx global>{`
            @page {size: landscape; }
          `}</style>

          {data ? (
            <div className="flex flex-col mx-auto space-y-6 w-full pb-16" ref={wrapperRef}>
              <div className="flex print:flex-col print:space-y-6 print:space-x-0 sm:space-x-6 bg-white px-3 py-2 shadow">
                <p><span className="font-bold">Operador:</span> {data.user.name}</p>
                <p><span className="font-bold">Registrado el:</span> {formatDate(data.createdAt)}</p>
              </div>
              <Table columns={columns} data={data.details} />
              <div className="flex space-x-6 w-full justify-end">
                <p>Total: <span className="font-bold text-red-500">${data.priceTotal.toFixed(2)}</span></p>
              </div>
              <Button className="self-end print:hidden" onClick={() => printElement(wrapperRef.current)} icon={<Printer24 />}>Exportar documento</Button>
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
