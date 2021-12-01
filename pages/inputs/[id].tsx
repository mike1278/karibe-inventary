import Link from '@/components/canonical-link'
import { PageWithLayout, useOptionsDrawer } from '@/components/page'
import Table, { TableColumn } from '@/components/table'
import Viewport, { setAnim } from '@/components/viewport'
import { useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import { Buy as DBBuy, Product as DBPRoduct, BuyDetail as DBBuyDetail, ProductCategory, User } from '@prisma/client'
import { Printer24 } from '@carbon/icons-react'
import { Button } from '@/components/button'
import { printElement } from '@/lib/utils/client'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Logo from '@/public/venita.png'

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
    Cell: ({ row }) => <span className="font-bold ">${row.original.product.providerPrice.toFixed(2)}</span>,
  },
  {
    Header: 'Cantidad',
    accessor: 'quantity',
  },
  {
    Header: 'Precio total',
    id: 'total',
    Cell: ({ row }) => <span className="font-bold ">${(row.original.product.providerPrice * row.original.quantity).toFixed(2)}</span>,
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
        <div className="flex flex-col space-y-6" ref={wrapperRef}>
          <div className="hidden print:flex flex-col">
            <div className="w-[190px]">
              <Image src={Logo} width={190} height={94} className="mr-auto" objectFit="contain" loading="eager" />
            </div>
            <p className="mt-4"><span className="font-bold">RIF:</span> J-50031533-3</p>
          </div>
          <div className="bg-bg-secondary flex shadow mb-4 py-2 px-3 items-center print:shadow-none sm:mb-0">
            <h2 className="font-bold leading-normal text-2xl">
              Detalles de entrada
            </h2>
          </div>

          <style type="text/css" media="print" jsx global>{`
            @page {size: landscape; }
          `}</style>

          {data ? (
            <div className="flex flex-col mx-auto space-y-6 w-full pb-16">
              <div className="bg-bg-secondary flex shadow py-2 px-3 print:flex-col print:space-y-6 print:space-x-0 print:shadow-none sm:space-x-6">
                <p><span className="font-bold">Operador:</span> {data.user.name}</p>
                <p><span className="font-bold">Registrado el:</span> {new Date(data.createdAt).toLocaleString()}</p>
              </div>
              <Table columns={columns} data={data.details} />
              <div className="flex space-x-6 w-full justify-end">
                <p>Total: <span className="font-bold ">${data.priceTotal.toFixed(2)}</span></p>
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
