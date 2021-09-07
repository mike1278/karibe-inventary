import Link from '@/components/canonical-link'
import { PageWithLayout, useOptionsDrawer } from '@/components/page'
import Table, { TableColumn } from '@/components/table'
import Viewport, { setAnim } from '@/components/viewport'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import useSWR from 'swr'
import { ProductCategory as DBProductCategory } from '@prisma/client'
import { useUser } from '@/models/auth/user'
import { Edit24, UserFollow24, ChevronLeft16, ChevronRight16 } from '@carbon/icons-react'
import { Button } from '@/components/button'
import { OptionsDrawerChildren } from '@/components/options-drawer'
import { useInput } from '@/lib/hooks'
import { formatDate } from '@/lib/utils/client'
import Loading from '@/components/loading'

type ProductCategory = DBProductCategory & {
  _count: {
    products: number
  }
}

const getColumns = (): TableColumn<ProductCategory>[] => ([
  {
    Header: 'N°',
    accessor: 'id',
  },
  {
    Header: 'Nombre',
    accessor: 'name',
  },
  {
    Header: 'Estatus',
    accessor: 'active',
    Cell: ({ value: active }: { value: boolean }) => (
      <span
        className={`rounded-full mx-auto ${active ? 'bg-green-500' : 'bg-red-500'} shadow-sm text-bg-secondary text-xs p-2`}
        style={{ transition: '0.2s background-color' }}
      >
        {active ? 'Activo' : 'Inactivo'}
      </span>
    )
  },
  {
    Header: 'Productos asociados',
    accessor: '_count',
    Cell: ({ value: { products } }) => products
  },
  {
    Header: 'Creado el',
    accessor: 'createdAt',
    Cell: ({ value }) => formatDate(value),
  }
])

type UserFormProps = {
  id?: number
  name?: string
  email?: string
  username?: string
  role?: 'USER' | 'ADMIN'
  active?: boolean
  mutate?: () => Promise<unknown>
}

const UserForm: OptionsDrawerChildren<UserFormProps> = forwardRef(({ mutate, ...rest }, ref) => {
  const { isOpen, setOpenState } = useOptionsDrawer()

  const { value: name, bind: bindName, setValue: setName, reset: resetName } = useInput('' as string)

  const [active, setActive] = useState(false)

  const reset = () => {
    resetName()
  }

  useEffect(() => {
    if (isOpen) {
      if (rest.id == -1) {
        reset()
      } else {
        setName(rest.name)
        setActive(rest.active)
      }
    }
  }, [rest.id, isOpen])

  const createUser = async () => {
    const res = await fetch(`/api/categories`, {
      method: 'POST',
      body: JSON.stringify({
        name,
      })
    })
    if (res.ok) {
      mutate()
      setOpenState(false)
      return
    }
    if (res.status == 422) {
      if ((await res.json()).error === 'DUPLICATED') {
        alert('Ya existe una categoría con el mismo nombre')
      }
    }
  }

  const updateUser = async () => {
    const res = await fetch(`/api/categories/${rest.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name,
        active,
      })
    })
    if (res.ok) {
      mutate()
      setOpenState(false)
      return
    }
    if (res.status == 422) {
      if ((await res.json()).error === 'DUPLICATED') {
        alert('La categoría ya existe')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onSubmit: async () => {
      if (rest.id == -1) {
        await createUser()
      } else {
        await updateUser()
      }
    },
    onCancel: () => {
      setOpenState(false)
    }
  }))

  return (
    <>
      <h2 className="font-bold text-fg-primary text-xl">{rest.id === -1 ? 'Crear' : 'Actualizar'} categoría</h2>

      <fieldset className="flex flex-col mb-4 animate">
        <label htmlFor="name" className="input-label">Nombre</label>
        <input
          type="text"
          required
          className="input"
          autoComplete="off"
          id="name"
          placeholder="Ej. Victor Campos"
          {...bindName}
        />
      </fieldset>

      {rest.id != -1 && (
        <label className="flex input-label items-center">
          <input className="border rounded h-4 mr-2 w-4" type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Activo
        </label>
      )}
    </>
  )
})

const ProductCategories: PageWithLayout = () => {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState(5)
  const { data, mutate } = useSWR<{
    total?: number,
    maxPages?: number,
    categories?: ProductCategory[]
  }>(() => `/api/categories?page=${page}&items=${items}`)
  const [session] = useUser()
  const columns = useMemo<TableColumn<ProductCategory>[]>(() => [
    ...getColumns(),
    ...(session.user.role === 'ADMIN' ? [{
      Header: 'Editar',
      Cell: ({ row }) => (
        <button
          className="flex mx-auto bg-green-500 rounded-[50%] h-[42px] text-bg-secondary w-[42px] justify-center items-center disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => updateUser({ ...row.original })}
        >
          <Edit24 />
        </button>
      )
    }] : []),
  ], [session])

  const { setOpenState, setDrawerChildren } = useOptionsDrawer()

  const createUser = () => {
    setDrawerChildren(() => (ref) => <UserForm ref={ref} id={-1} mutate={mutate} />)
    setOpenState(true)
  }

  const updateUser = (props: UserFormProps) => {
    setDrawerChildren(() => (ref) => <UserForm ref={ref} {...props} mutate={mutate} />)
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
              Categorías de productos
            </h2>
          </div>

          <div className="flex flex-col mx-auto space-y-6 w-full pb-16 lg:w-9/10">
            {(data !== undefined && columns) ? (
              <>
                <Button className="self-end" icon={<UserFollow24 />} onClick={createUser}>Agregar categoría</Button>
                <Table columns={columns} data={data?.categories || []} />
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
                <Loading>Cargando categorías</Loading>
              </div>
            )}
          </div>
        </div>
      </Viewport>
    </div>
  )
}

ProductCategories.getLayoutProps = () => ({
  title: 'Categorías de productos'
})

export default ProductCategories
