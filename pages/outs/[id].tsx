import Link from '@/components/canonical-link'
import { PageWithLayout, useOptionsDrawer } from '@/components/page'
import Table, { TableColumn } from '@/components/table'
import Viewport, { setAnim } from '@/components/viewport'
import { useCallback, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import { Sell as DBSell, Product as DBPRoduct, SellDetail as DBSellDetail, ProductCategory, User, Client } from '@prisma/client'
import { Button } from '@/components/button'
import { formatDate, printElement } from '@/lib/utils/client'
import { Printer24 } from '@carbon/icons-react'
import { useRouter } from 'next/router'

type Product = DBPRoduct & {
  category: ProductCategory
}

type SellDetail = DBSellDetail & {
  product: Product
}

type Sell = DBSell & {
  details: SellDetail[]
  client: Client
  user: User
}

const getColumns = (): TableColumn<SellDetail>[] => ([
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
    Header: 'Precio de venta',
    id: 'price',
    Cell: ({ row }) => <span className="font-bold text-green-500">${row.original.product.price.toFixed(2)}</span>,
  },
  {
    Header: 'Cantidad',
    accessor: 'quantity',
  },
  {
    Header: 'Cantidad actual en stock',
    id: 'stock',
    Cell: ({ row }) => {
      const rest = Math.max(0, row.original.product.stock) - row.original.quantity
      const warn = rest <= row.original.product.min
      return (
        <span className={warn ? 'text-red-500' : ''}>
          {rest} {warn ? '(En agotamiento)' : ''}
        </span>
      )
    }
  },
  {
    Header: 'Precio total',
    id: 'total',
    Cell: ({ row }) => <span className="font-bold text-green-500">${(row.original.product.price * row.original.quantity).toFixed(2)}</span>,
  },
])

const Sell: PageWithLayout = () => {
  const router = useRouter()

  const { data, mutate } = useSWR<Sell>(() => `/api/sells/${router.query.id}`, {
    onSuccess: (data) => {
      if (!data) {
        router.replace('/404', window.location.pathname)
      }
    }
  })

  const columns = useMemo<TableColumn<SellDetail>[]>(() => [
    ...getColumns(),
  ], [])

  const wrapperRef = useRef<HTMLDivElement>()

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
              Detalles de salida
            </h2>
          </div>

          <style type="text/css" media="print" jsx global>{`
            @page {size: landscape; }
          `}</style>

          {data ? (
            <div className="flex flex-col mx-auto space-y-6 w-full pb-16 lg:w-9/10" ref={wrapperRef}>
              <div className="flex print:flex-col print:space-y-6 print:space-x-0 sm:space-x-6">
                <p><span className="font-bold">Operador:</span> {data.user.name}</p>
                <p><span className="font-bold">Registrado el:</span> {formatDate(data.createdAt)}</p>
              </div>
              <div className="flex print:flex-col print:space-y-6 print:space-x-0 sm:space-x-6">
                <p><span className="font-bold">Documento del cliente:</span> {data.client.dni}</p>
                <p><span className="font-bold">Nombre del cliente:</span> {data.client.name}</p>
              </div>
              <Table columns={columns} data={data.details} />
              <div className="flex space-x-6 w-full justify-end">
                <p>Total: <span className="font-bold text-green-500">${data.priceTotal.toFixed(2)}</span></p>
              </div>
              <Button className="self-end print:hidden" onClick={() => printElement(wrapperRef.current)} icon={<Printer24 />}>Exportar documento</Button>
            </div>
          ) : null}
        </div>
      </Viewport >
    </div >
  )
}

Sell.getLayoutProps = () => ({
  title: 'Productos'
})

export default Sell
