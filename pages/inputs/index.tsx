import Link from '@/components/canonical-link'
import { PageWithLayout, useOptionsDrawer } from '@/components/page'
import Table, { TableColumn } from '@/components/table'
import Viewport, { setAnim } from '@/components/viewport'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Buy as DBBuy, Client, User } from '@prisma/client'
import { useUser } from '@/models/auth/user'
import { Edit24, UserFollow24, ChevronLeft16, ChevronRight16 } from '@carbon/icons-react'
import { Button } from '@/components/button'
import { OptionsDrawerChildren } from '@/components/options-drawer'
import { useInput } from '@/lib/hooks'
import { formatDate } from '@/lib/utils/client'
import Loading from '@/components/loading'

type Buy = DBBuy & {
  user: User
  _count: {
    details: number
  }
}

const getColumns = (): TableColumn<Buy>[] => ([
  {
    Header: 'N°',
    accessor: 'id',
  },
  {
    Header: 'Total invertido',
    accessor: 'priceTotal',
    Cell: ({ value }) => <span className="font-bold text-red-500">${value.toFixed(2)}</span>,
  },
  {
    Header: 'Registrado por',
    accessor: 'user',
    Cell: ({ value }) => value.name,
  },
  {
    Header: 'Facturada el',
    accessor: 'createdAt',
    Cell: ({ value }) => formatDate(value),
  },
])

const Products: PageWithLayout = () => {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState(5)
  const { data } = useSWR<{
    total?: number,
    maxPages?: number,
    buys?: Buy[]
  }>(() => `/api/buys?page=${page}&items=${items}`)
  const columns = useMemo<TableColumn<Buy>[]>(() => [
    ...getColumns(),
    {
      Header: 'Ver detalles',
      Cell: ({ row }) => (
        <Link href={`/inputs/${row.original.id}`}>
          <a
            className="flex mx-auto bg-green-500 rounded-[50%] h-[42px] text-bg-secondary w-[42px] justify-center items-center disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Edit24 />
          </a>
        </Link>
      )
    },
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
              Entradas
            </h2>
          </div>

          <div className="flex flex-col mx-auto space-y-6 w-full pb-16 lg:w-9/10">
            {(data !== undefined && columns) ? (
              <>
                <Button href="/inputs/new" className="self-end" icon={<UserFollow24 />}>Registrar entrada</Button>
                <Table columns={columns} data={data?.buys || []} />
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
                <Loading>Cargando entradas</Loading>
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
