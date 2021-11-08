import Link from '@/components/canonical-link'
import { PageWithLayout, useOptionsDrawer } from '@/components/page'
import Table, { TableColumn } from '@/components/table'
import Viewport, { setAnim } from '@/components/viewport'
import { useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Buy as DBBuy, Product as DBPRoduct, ProductCategory, User } from '@prisma/client'
import { Edit24, UserFollow24, ChevronLeft16, ChevronRight16, Close24 } from '@carbon/icons-react'
import { Button } from '@/components/button'
import Loading from '@/components/loading'
import { formatDate } from '@/lib/utils/client'
import { getProductColumns } from '../products'
import { useRouter } from 'next/router'

type Buy = DBBuy & {
  user: User
  _count: {
    details: number
  }
}

type Product = DBPRoduct & {
  category: ProductCategory
}

type BuyDetail = { product: Product, quantity: number }

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
])

const NewBuy: PageWithLayout = () => {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState(5)
  const [details, setDetails] = useState<BuyDetail[]>([])

  const { data, mutate } = useSWR<{
    total?: number,
    maxPages?: number,
    products?: Product[]
  }>(() => `/api/products?page=${page}&items=${items}&active=true`)

  const [mode, setMode] = useState(false)

  const router = useRouter()

  const create = async () => {
    if (!details.length) {
      alert('Debe agregar primero productos al detalle de la factura')
      return
    }
    const res = await fetch(`/api/buys`, {
      method: 'POST',
      body: JSON.stringify(details.map(d => ({
        productId: d.product.id,
        quantity: d.quantity,
      })))
    })
    if (res.ok) {
      mutate()
      router.push('/inputs')
      return
    }
    if (res.status == 422) {
      alert((await res.json()).error)
    }
  }

  const changeQuantity = useCallback((value, id) => {
    setDetails((details) => {
      const clone = Array.from(details)
      const idx = clone.findIndex(d => d.product.id === id)
      clone[idx].quantity = value
      return clone
    })
  }, [])

  const delDetail = useCallback((id) => {
    setDetails((details) => {
      const clone = Array.from(details)
      const idx = clone.findIndex(d => d.product.id === id)
      clone.splice(idx, 1)
      return clone
    })
  }, [])

  const columns = useMemo<TableColumn<BuyDetail>[]>(() => [
    ...getColumns(),
    {
      Header: 'Cantidad',
      accessor: 'quantity',
      Cell: ({ value, row }) => (
        <input
          type="number"
          value={value}
          className="input"
          min={1}
          max={row.original.product.max - Math.max(0, row.original.product.stock)}
          onChange={e => {
            changeQuantity(+e.target.value, row.original.product.id)
          }}
        />
      )
    },
    {
      Header: 'En stock',
      id: 'stock',
      Cell: ({ row }) => Math.max(0, row.original.product.stock),
    },
    // {
    //   Header: 'Restante en stock',
    //   id: 'stock',
    //   Cell: ({ row }) => Math.max(0, row.original.product.stock) + row.original.quantity,
    // },
    {
      Header: 'Precio total',
      id: 'total',
      Cell: ({ row }) => <span className="font-bold text-red-500">${(row.original.product.providerPrice * row.original.quantity).toFixed(2)}</span>,
    },
    {
      Header: 'Eliminar',
      Cell: ({ row }) => (
        <button
          className="flex mx-auto bg-red-500 rounded-[50%] h-[42px] text-bg-secondary w-[42px] justify-center items-center disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            delDetail(row.original.product.id)
          }}
        >
          <Close24 />
        </button>
      )
    },
  ], [])

  const productColumns = useMemo<TableColumn<Product>[]>(() => [
    ...getProductColumns(),
    {
      Header: 'Agregar',
      Cell: ({ row }) => (
        <button
          className="flex mx-auto bg-green-500 rounded-[50%] h-[42px] text-bg-secondary w-[42px] justify-center items-center disabled:cursor-not-allowed disabled:opacity-50"
          disabled={details.some(d => d.product.id === row.original.id) || row.original.stock == row.original.max}
          onClick={() => {
            if (row.original.stock == row.original.max) {
              alert('Máximo del stock alcanzado')
              return
            }
            setDetails([
              {
                product: row.original,
                quantity: row.original.max - Math.max(0, row.original.stock)
              },
              ...details,
            ])
            setMode(false)
            setPage(1)
          }}
        >
          <UserFollow24 />
        </button>
      )
    },
  ], [details])

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
              Facturar una nueva entrada
            </h2>
          </div>

          <div className="flex flex-col mx-auto space-y-6 w-full pb-16 lg:w-9/10">
            {mode ? (
              data ? (
                <>
                  <button
                    className="mr-auto text-xs uppercase hover:underline"
                    onClick={() => {
                      setMode(false)
                    }}
                  >
                    Ir hacia atrás
                  </button>
                  <Table columns={productColumns} data={data?.products || []} />
                  <div className="flex flex-col space-y-6 w-full justify-between items-center sm:flex-row sm:space-y-0">
                    <div className="flex space-x-6">
                      <p>Viendo
                        <span className="px-2">
                          <select
                            required
                            className="input"
                            value={items}
                            onChange={e => setItems(+e.target.value)}
                          >
                            {[5, 10, 20, 30, 50, 100].map(i => (
                              <option value={i} key={i}>{i}</option>
                            ))}
                          </select>
                        </span> registros por página</p>
                    </div>
                    <div className="flex space-x-6">
                      <button className="disabled:cursor-not-allowed disabled:opacity-50" onClick={() => setPage(page - 1)} disabled={page == 1}>
                        <ChevronLeft16 />
                      </button>
                      <p>Página
                        <span className="px-2">
                          <select
                            required
                            className="input"
                            value={page}
                            onChange={e => setPage(+e.target.value)}
                          >
                            {Array.from({ length: data.maxPages || 1 }).map((_, idx) => (
                              <option value={idx + 1} key={idx}>{idx + 1}</option>
                            ))}
                          </select>
                        </span> de {data.maxPages || 1}</p>
                      <button className="disabled:cursor-not-allowed disabled:opacity-50" onClick={() => setPage(page + 1)} disabled={page == data.maxPages || !data.maxPages}>
                        <ChevronRight16 />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="font-bold pt-16">
                  <Loading>Cargando productos</Loading>
                </div>
              )
            ) : (
              <>
                <Button className="self-end" icon={<UserFollow24 />} onClick={() => setMode(true)}>Agregar producto</Button>
                <Table columns={columns} data={details} />
                <div className="flex space-x-6 w-full justify-end">
                  <p>Total: <span className="font-bold text-red-500">${details.map(d => d.product.providerPrice * d.quantity).reduce((a, b) => a + b, 0).toFixed(2)}</span></p>
                </div>
                <Button className="self-end" onClick={create}>Facturar</Button>
              </>
            )}
          </div>
        </div>
      </Viewport >
    </div >
  )
}

NewBuy.getLayoutProps = () => ({
  title: 'Productos'
})

export default NewBuy
