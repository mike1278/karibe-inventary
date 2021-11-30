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
import { useInput } from '@/lib/hooks'
import { useNotifications } from '@/components/page/navigation/navbar'

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
    Header: 'Precio de venta',
    id: 'price',
    Cell: ({ row }) => <span className="font-bold ">${row.original.product.price.toFixed(2)}</span>,
  },
])

const NewSell: PageWithLayout = () => {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState(5)
  const [details, setDetails] = useState<BuyDetail[]>([])

  const { value: dni, bind: bindDni } = useInput('' as string)
  const { value: name, bind: bindName } = useInput('' as string)

  const { data, mutate } = useSWR<{
    total?: number,
    maxPages?: number,
    products?: Product[]
  }>(() => `/api/products?page=${page}&items=${items}&active=true`)

  const [mode, setMode] = useState(false)

  const router = useRouter()

  const create = async (e) => {
    e.preventDefault()
    if (!details.length) {
      alert('Debe agregar al menos un producto al detalle de la factura')
      return
    }
    const res = await fetch(`/api/sells`, {
      method: 'POST',
      body: JSON.stringify({
        client: {
          dni,
          name,
        },
        details: details.map(d => ({
          productId: d.product.id,
          quantity: d.quantity,
        }))
      })
    })
    if (res.ok) {
      mutate()
      router.push('/outs')
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
          max={Math.max(0, row.original.product.stock)}
          onChange={e => {
            changeQuantity(+e.target.value, row.original.product.id)
          }}
        />
      )
    },
    {
      Header: 'Restante en stock',
      id: 'stock',
      Cell: ({ row }) => {
        const rest = Math.max(0, row.original.product.stock) - row.original.quantity
        const warn = rest <= row.original.product.min
        return (
          <span className={warn ? '' : ''}>
            {rest} {warn ? '(En agotamiento)' : ''}
          </span>
        )
      }
    },
    {
      Header: 'Precio total',
      id: 'total',
      Cell: ({ row }) => <span className="font-bold ">${(row.original.product.price * row.original.quantity).toFixed(2)}</span>,
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
          disabled={details.some(d => d.product.id === row.original.id) || row.original.stock <= 0}
          onClick={() => {
            setDetails([
              {
                product: row.original,
                quantity: 1
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
        {mode ? (
          data ? (
            <button
              className="bg-bg-secondary border flex border-gray-100 shadow py-2 px-3 items-center hover:underline"
              onClick={() => {
                setMode(false)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 mr-2 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ir hacia atrás
            </button>
          ) : <> </>
        ) : 
        <Link href="/outs" className="bg-bg-secondary border flex border-gray-100 shadow py-2 px-3 items-center hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 mr-2 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Ir a salidas
        </Link> }
      </div>
      <Viewport className="w-full animate" once style={setAnim({ y: '-0.3rem' })}>
        <div className="flex flex-col space-y-6">
          <div className="bg-bg-secondary flex flex-col shadow mb-4 py-2 px-3 items-center justify-center sm:mb-0 md:flex-row md:justify-between">
            <h2 className="font-bold leading-normal mb-2 text-2xl md:mb-0">
              Registrar una nueva salida
            </h2>
            {mode ? (
              data ? (
                <> </>
              ) : <> </>
            ) : <Button icon={<UserFollow24 />} onClick={() => setMode(true)}>Agregar producto</Button>}
          </div>

          <form className="flex flex-col mx-auto space-y-6 w-full pb-16" onSubmit={create}>
            {mode ? (
              data ? (
                <>
                  <Table columns={productColumns} data={data?.products || []} />
                  <div className="bg-bg-secondary flex flex-col space-y-6 shadow w-full py-2 px-3 justify-between items-center sm:flex-row sm:space-y-0">
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
                      <button type="reset" className="disabled:cursor-not-allowed disabled:opacity-50" onClick={() => setPage(page - 1)} disabled={page == 1}>
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
                <div className="bg-bg-secondary flex flex-col space-y-5 shadow w-full py-2 px-3 justify-between sm:flex-row sm:space-y-0 sm:items-end">
                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <fieldset className="flex flex-col animate">
                      <label className="input-label">RIF/C.I. del cliente</label>
                      <input
                        type="text"
                        required
                        className="input"
                        autoComplete="off"
                        placeholder="Número de documento"
                        {...bindDni}
                      />
                    </fieldset>
                    <fieldset className="flex flex-col animate">
                      <label className="input-label">Nombre</label>
                      <input
                        type="text"
                        className="input"
                        autoComplete="off"
                        placeholder="Ej. Gabriela Ivanovich"
                        {...bindName}
                      />
                    </fieldset>
                  </div>
                </div>
                <Table columns={columns} data={details} />
                <div className="flex space-x-6 w-full justify-end">
                  <p>Total: <span className="font-bold ">${details.map(d => d.product.price * d.quantity).reduce((a, b) => a + b, 0).toFixed(2)}</span></p>
                </div>
                <Button className="self-end" btnType="submit">Registrar</Button>
              </>
            )}
          </form>
        </div>
      </Viewport >
    </div >
  )
}

NewSell.getLayoutProps = () => ({
  title: 'Productos'
})

export default NewSell
