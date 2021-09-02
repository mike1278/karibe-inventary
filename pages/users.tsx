import Link from '@/components/canonical-link'
import { PageWithLayout, useOptionsDrawer } from '@/components/page'
import Table, { TableColumn } from '@/components/table'
import Viewport, { setAnim } from '@/components/viewport'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import useSWR from 'swr'
import { User } from '@prisma/client'
import { useUser } from '@/models/auth/user'
import { Edit24, UserFollow24, ChevronLeft16, ChevronRight16 } from '@carbon/icons-react'
import { Button } from '@/components/button'
import { OptionsDrawerChildren } from '@/components/options-drawer'
import { useInput } from '@/lib/hooks'
import { formatDate } from '@/lib/utils/client'
import Loading from '@/components/loading'

const getColumns = (): TableColumn<User>[] => ([
  {
    Header: 'N°',
    accessor: 'id',
  },
  {
    Header: 'Avatar',
    accessor: 'image',
    Cell: ({ row }) => (
      <div className="flex mx-auto space-x-4 items-center">
        {row.original.image ? (
          <img
            src={row.original.image}
            width={42}
            height={42}
            className="border bg-gray-300 border-x-gray-600 rounded-[50%] h-[42px] w-[42px]"
          />
        ) : (
          <div className="bg-gradient-to-br border from-green-400 to-purple-300 border-x-gray-600 rounded-[50%] h-[42px] w-[42px]" />
        )}
      </div>
    )
  },
  {
    Header: 'Nombre',
    accessor: 'name',
  },
  {
    Header: 'Username',
    accessor: 'username',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Rol',
    accessor: 'role',
    Cell: ({ value: role }: { value: 'USER' | 'ADMIN' }) => (
      <span
        className={`${role === 'ADMIN' ? 'bg-purple-400' : 'bg-fg-primary'} rounded-full mx-auto shadow-sm text-bg-secondary text-xs p-2`}
        style={{ transition: '0.2s background-color' }}
      >
        {role === 'ADMIN' ? 'Administrador' : 'Usuario básico'}
      </span>
    )
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
  const { value: email, bind: bindEmail, setValue: setEmail, reset: resetEmail } = useInput('' as string)
  const { value: username, bind: bindUsername, setValue: setUsername, reset: resetUsername } = useInput('' as string)

  const { value: role, bind: bindRole, reset: resetRole, setValue: setRole } = useInput('' as string)

  const { value: password, bind: bindPwd, reset: resetPwd } = useInput('')
  const { value: rePwd, bind: bindRePwd, reset: resetRePwd } = useInput('')

  const [active, setActive] = useState(false)

  const reset = () => {
    resetName()
    resetEmail()
    resetUsername()
    resetRole()
    resetPwd()
    resetRePwd()
  }

  useEffect(() => {
    if (isOpen) {
      if (rest.id == -1) {
        reset()
      } else {
        setName(rest.name)
        setEmail(rest.email)
        setUsername(rest.username)
        setRole(rest.role)
        setActive(rest.active)
      }
    }
  }, [rest.id, isOpen])

  const createUser = async () => {
    if (password !== rePwd) {
      alert('Las contraseñas deben ser iguales')
      return
    }
    const res = await fetch(`/api/users`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        username,
        role,
        password,
      })
    })
    if (res.ok) {
      mutate()
      setOpenState(false)
    }
  }

  const updateUser = async () => {
    const res = await fetch(`/api/users/${rest.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name,
        email,
        username,
        role,
        active,
      })
    })
    if (res.ok) {
      mutate()
      setOpenState(false)
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
      <h2 className="font-bold text-fg-primary text-xl">{rest.id === -1 ? 'Crear' : 'Actualizar'} usuario</h2>

      <fieldset className="flex flex-col mb-4 animate">
        <label htmlFor="name" className="input-label">Nombre y apellido</label>
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

      <fieldset className="flex flex-col mb-4 animate">
        <label htmlFor="email" className="input-label">Email</label>
        <input
          type="email"
          required
          className="input"
          autoComplete="off"
          id="email"
          placeholder="Ej. johndoe@gmail.com"
          {...bindEmail}
        />
      </fieldset>

      <fieldset className="flex flex-col mb-6 animate">
        <label htmlFor="username" className="input-label">Username</label>
        <input
          type="text"
          required
          pattern="^\w+$"
          className="input"
          autoComplete="off"
          id="username"
          placeholder="Ej. victorcampos"
          {...bindUsername}
        />
        <p className="text-xs opacity-40 pt-1">* Sólo se permiten caracteres alfanuméricos y guiones bajos</p>
      </fieldset>

      <fieldset className="flex flex-col mb-6 animate">
        <label htmlFor="role" className="input-label">Rol</label>
        <select
          required
          className="input"
          id="role"
          {...bindRole}
        >
          <option value="" hidden>Seleccione...</option>
          <option value="ADMIN">Administrador</option>
          <option value="USER">Usuario básico</option>
        </select>
      </fieldset>

      {rest.id == -1 ? (
        <>
          <fieldset className="flex flex-col mb-4 animate" style={setAnim({ d: '100ms' })}>
            <label htmlFor="pwd" className="input-label">Contraseña</label>
            <input
              type="password"
              minLength={6}
              maxLength={12}
              required
              autoComplete="off"
              className="input"
              id="pwd"
              placeholder="Escriba la nueva contraseña"
              {...bindPwd}
            />
          </fieldset>

          <fieldset className="flex flex-col mb-6 animate" style={setAnim({ d: '200ms' })}>
            <label htmlFor="re-pwd" className="input-label">Repita la contraseña</label>
            <input
              type="password"
              required
              autoComplete="off"
              className="input"
              id="re-pwd"
              placeholder="Repita la contraseña"
              {...bindRePwd}
            />
          </fieldset>
        </>
      ) : (
        <label className="flex input-label items-center">
          <input className="border rounded h-4 mr-2 w-4" type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Activo
        </label>
      )}
    </>
  )
})

const Users: PageWithLayout = () => {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState(5)
  const { data, mutate } = useSWR<{
    total?: number,
    maxPages?: number,
    users?: User[]
  }>(() => `/api/users?page=${page}&items=${items}`)
  const [session] = useUser()
  const columns = useMemo<TableColumn<User>[]>(() => [
    ...getColumns(),
    {
      Header: 'Editar',
      Cell: ({ row }) => (
        <button
          className="flex mx-auto bg-green-500 rounded-[50%] h-[42px] text-bg-secondary w-[42px] justify-center items-center disabled:cursor-not-allowed disabled:opacity-50"
          disabled={row.original.id == session.user.id}
          onClick={() => updateUser({ ...row.original })}
        >
          <Edit24 />
        </button>
      )
    },
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
              Administración de usuarios
            </h2>
          </div>

          <div className="flex flex-col mx-auto space-y-6 w-full pb-16 lg:w-9/10">
            {(data !== undefined && columns) ? (
              <>
                <Button className="self-end" icon={<UserFollow24 />} onClick={createUser}>Agregar usuario</Button>
                <Table columns={columns} data={data?.users || []} />
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
                    <button className="disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setPage(page - 1)} disabled={page == 1}>
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
                    <button className="disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setPage(page + 1)} disabled={page == data.maxPages || !data.maxPages}>
                      <ChevronRight16 />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="font-bold pt-16">
                <Loading>Cargando usuarios</Loading>
              </div>
            )}
          </div>
        </div>
      </Viewport>
    </div>
  )
}

Users.getLayoutProps = () => ({
  title: 'Usuarios'
})

export default Users
