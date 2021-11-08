import Link from '@/components/canonical-link'
import { PageWithLayout, useOptionsDrawer } from '@/components/page'
import Table, { TableColumn } from '@/components/table'
import Viewport, { setAnim } from '@/components/viewport'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Product as DBProduct, ProductCategory } from '@prisma/client'
import { useUser } from '@/models/auth/user'
import { Edit24, UserFollow24, ChevronLeft16, ChevronRight16 } from '@carbon/icons-react'
import { Button } from '@/components/button'
import { OptionsDrawerChildren } from '@/components/options-drawer'
import { useInput } from '@/lib/hooks'
import { formatDate } from '@/lib/utils/client'
import Loading from '@/components/loading'

type Product = DBProduct & {
  category: ProductCategory
}

export const getProductColumns = (): TableColumn<Product>[] => ([
  {
    Header: 'N°',
    accessor: 'id',
  },
  {
    Header: 'Nombre',
    accessor: 'name',
  },
  {
    Header: 'SKU',
    accessor: 'sku',
    Cell: ({ value }) => (
      <span
        className={`rounded-full mx-auto bg-gray-400 bg-opacity-20 shadow-sm text-xs p-2`}
      >
        {value}
      </span>
    )
  },
  {
    Header: 'Precio de venta',
    accessor: 'price',
    Cell: ({ value }) => <span className="font-bold text-green-500">${value.toFixed(2)}</span>,
  },
  {
    Header: 'Precio del proveedor',
    accessor: 'providerPrice',
    Cell: ({ value }) => <span className="font-bold text-green-500">${value.toFixed(2)}</span>,
  },
  {
    Header: 'Categoría',
    accessor: 'category',
    Cell: ({ value }) => (
      <span
        className={`rounded-full mx-auto bg-fg-primary shadow-sm text-bg-secondary text-xs p-2`}
      >
        {value.name}
      </span>
    )
  },
  {
    Header: 'Stock',
    accessor: 'stock',
    Cell: ({ value }) => (
      value >= 0 ? value : (
        <span
          className={`rounded-full mx-auto bg-fg-primary shadow-sm text-bg-secondary text-xs p-2`}
        >
          Plantilla
        </span>
      )
    )
  },
  {
    Header: 'Creado el',
    accessor: 'createdAt',
    Cell: ({ value }) => formatDate(value),
  },
])

type FormProps = {
  id?: number
  name?: string
  sku?: string
  categoryId?: number
  min?: number
  max?: number
  price?: number
  providerPrice?: number
  mutate?: () => Promise<unknown>
}

const Form: OptionsDrawerChildren<FormProps> = forwardRef(({ mutate, ...rest }, ref) => {
  const { isOpen, setOpenState } = useOptionsDrawer()

  const { data: dataCateg } = useSWR<{
    total?: number,
    maxPages?: number,
    categories?: ProductCategory[]
  }>(() => `/api/categories?page=1&items=1000`)

  const { value: name, bind: bindName, setValue: setName, reset: resetName } = useInput('' as string)
  const { value: sku, bind: bindSku, setValue: setSku, reset: resetSku } = useInput('' as string)
  const { value: category, bind: bindCategory, setValue: setCategory, reset: resetCategory } = useInput('' as string)
  const { value: min, bind: bindMin, setValue: setMin, reset: resetMin } = useInput('25' as string)
  const { value: max, bind: bindMax, setValue: setMax, reset: resetMax } = useInput('70' as string)
  const { value: price, bind: bindPrice, setValue: setPrice, reset: resetPrice } = useInput('' as string)
  const { value: providerPrice, bind: bindProviderPrice, setValue: setProviderPrice, reset: resetProviderPrice } = useInput('' as string)

  const [active, setActive] = useState(false)

  const reset = () => {
    resetName()
    resetSku()
    resetCategory()
    resetMin()
    resetMax()
    resetPrice()
    resetProviderPrice()
  }

  useEffect(() => {
    if (isOpen) {
      if (rest.id == -1) {
        reset()
      } else {
        setName(rest.name)
        setSku(rest.sku)
        setCategory(String(rest.categoryId))
        setMin(String(rest.min))
        setMax(String(rest.max))
        setPrice(String(rest.price))
        setProviderPrice(String(rest.providerPrice))
      }
    }
  }, [rest.id, isOpen])

  const create = async () => {
    const res = await fetch(`/api/products`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        sku,
        categoryId: category,
        min,
        max,
        price,
        providerPrice,
      })
    })
    if (res.ok) {
      mutate()
      setOpenState(false)
      return
    }
    if (res.status == 422) {
      alert((await res.json()).error)
    }
  }

  const update = async () => {
    const res = await fetch(`/api/products/${rest.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name,
        sku,
        categoryId: category,
        min,
        max,
        price,
        providerPrice,
      })
    })
    if (res.ok) {
      mutate()
      setOpenState(false)
      return
    }
    if (res.status == 422) {
      if (res.status == 422) {
        alert((await res.json()).error)
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onSubmit: async () => {
      if (rest.id == -1) {
        await create()
      } else {
        await update()
      }
    },
    onCancel: () => {
      setOpenState(false)
    }
  }))

  return (
    <>
      <h2 className="font-bold text-fg-primary text-xl">{rest.id === -1 ? 'Crear' : 'Actualizar'} producto</h2>

      <fieldset className="flex flex-col mb-4 animate">
        <label htmlFor="name" className="input-label">Nombre</label>
        <input
          type="text"
          required
          className="input"
          autoComplete="off"
          id="name"
          placeholder="Ej. Café"
          {...bindName}
        />
      </fieldset>

      <fieldset className="flex flex-col mb-6 animate">
        <label htmlFor="role" className="input-label">Categoría</label>
        <select
          required
          className="input"
          id="role"
          {...bindCategory}
        >
          <option value="" hidden>Seleccione...</option>
          {dataCateg?.categories?.filter(c => c.active).sort((a, b) => a.name.localeCompare(b.name)).map((c, idx) => (
            <option value={c.id} key={idx}>{c.name}</option>
          ))}
        </select>
      </fieldset>

      <fieldset className="flex flex-col mb-4 animate">
        <label htmlFor="sku" className="input-label">SKU</label>
        <input
          type="text"
          required
          className="input"
          autoComplete="off"
          id="sku"
          title="Ingrese un código SKU con un formato válido"
          maxLength={4}
          {...bindSku}
        />
      </fieldset>

      <fieldset className="flex flex-col mb-4 animate">
        <label className="input-label">Mínimo/máximo en el stock</label>
        <div className="w-full grid gap-4 grid-cols-2">
          <input
            type="number"
            required
            className="font-sans input"
            placeholder="Mínimo"
            autoComplete="off"
            min={0}
            {...bindMin}
          />
          <input
            type="number"
            required
            className="font-sans input"
            autoComplete="off"
            placeholder="Máximo"
            min={0}
            {...bindMax}
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col mb-4 animate">
        <label className="input-label">Precio de venta / precio del proveedor</label>
        <div className="w-full grid gap-4 grid-cols-2">
          <input
            type="number"
            required
            className="font-sans input"
            placeholder="Venta"
            autoComplete="off"
            step={0.1}
            min={0}
            {...bindPrice}
          />
          <input
            type="number"
            required
            className="font-sans input"
            autoComplete="off"
            placeholder="Proveedor"
            step={0.1}
            min={0}
            {...bindProviderPrice}
          />
        </div>
      </fieldset>
    </>
  )
})

const Products: PageWithLayout = () => {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState(5)
  const { data, mutate } = useSWR<{
    total?: number,
    maxPages?: number,
    products?: Product[]
  }>(() => `/api/products?page=${page}&items=${items}`)
  const [session] = useUser()
  const columns = useMemo<TableColumn<Product>[]>(() => [
    ...getProductColumns(),
    ...(session.user.role === 'ADMIN' ? [{
      Header: 'Editar',
      Cell: ({ row }) => (
        <button
          className="flex mx-auto bg-green-500 rounded-[50%] h-[42px] text-bg-secondary w-[42px] justify-center items-center disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => update({ ...row.original })}
        >
          <Edit24 />
        </button>
      )
    }] : []),
    {
      Header: 'Ver reportes',
      Cell: ({ row }) => (
        <Link href={`/products/${row.original.id}`}>
          <a
            className="flex mx-auto bg-green-500 rounded-[50%] h-[42px] text-bg-secondary w-[42px] justify-center items-center disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Edit24 />
          </a>
        </Link>
      )
    },
  ], [session])

  const { setOpenState, setDrawerChildren } = useOptionsDrawer()

  const create = () => {
    setDrawerChildren(() => (ref) => <Form ref={ref} id={-1} mutate={mutate} />)
    setOpenState(true)
  }

  const update = (props: FormProps) => {
    setDrawerChildren(() => (ref) => <Form ref={ref} {...props} mutate={mutate} />)
    setOpenState(true)
  }

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
              Productos
            </h2>
          </div>

          <div className="flex flex-col mx-auto space-y-6 w-full pb-16 lg:w-9/10">
            {(data !== undefined && columns) ? (
              <>
                {session.user.role === 'ADMIN' ? (
                  <Button className="self-end" icon={<UserFollow24 />} onClick={create}>Agregar producto</Button>
                ) : null}
                <Table columns={columns} data={data?.products || []} />
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
                            <option value={i}>{i}</option>
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
                            <option value={idx + 1}>{idx + 1}</option>
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
            )}
          </div>
        </div>
      </Viewport>
    </div>
  )
}

Products.getLayoutProps = () => ({
  title: 'Productos'
})

export default Products
