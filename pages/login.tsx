import { PageProps } from '@/components/page'
import { ClientSafeProvider, getCsrfToken, signIn } from 'next-auth/client'
import { PageWithLayout } from '@/components/page'
import { getProviders, getSession } from 'next-auth/client'
import { GetServerSideProps } from 'next'
import { FormEventHandler, useEffect, useState } from 'react'
import Viewport, { setAnim } from '@/components/viewport'
import { getDefaultBrandLayout } from '@/models/page/brand-layout'
import { Account24 } from '@carbon/icons-react'
import { useRouter } from 'next/router'
import { useInput } from '@/lib/hooks'
import { Button } from '@/components/button'

export const getServerSideProps: GetServerSideProps<LoginProps> = async (context) => {
  const providers = await getProviders()
  const session = await getSession(context)

  return !session ? {
    props: {
      session,
      providers,
    }
  } : {
    redirect: {
      destination: '/',
      permanent: true,
    }
  }
}

export type LoginProps = PageProps & {
  providers?: Record<string, ClientSafeProvider>
}

const LoginBox = (data: LoginProps) => {
  const { query, replace } = useRouter()
  const [error, setError] = useState(false)
  const { value: email, bind: bindEmail, reset: resetEmail } = useInput('')
  const { value: password, bind: bindPwd, reset: resetPwd } = useInput('')
  useEffect(() => {
    if (query.error === 'CredentialsSignin') {
      setError(true)
    }
  }, [query])

  const loginSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    signIn('email', {
      email,
      password,
      redirect: false,
    })
      .then((e) => {
        if (e.error === 'CredentialsSignin') {
          setError(true)
          return
        }
        replace(query.callbackUrl as string || '/')
      })
  }

  return (
    <Viewport
      className="flex h-full mt-12 w-full items-center justify-center"
      style={setAnim({ y: '0.3rem' })}
      once
    >
      <div className="bg-bg-secondary rounded-xl shadow-lg p-4 animate">
        <Viewport
          className="flex flex-col"
          style={setAnim({ y: '0.3rem' })}
          once
        >
          <form
            className="flex flex-col"
            onSubmit={loginSubmit}
          >
            <fieldset className="flex flex-col mb-4 animate" style={setAnim({ d: '100ms' })}>
              <label htmlFor="email-signin" className="input-label">Email o nickname</label>
              <input
                type="text"
                required
                className="w-full input sm:w-64"
                id="email-signin"
                placeholder="Ej. johndoe@gmail.com"
                name="email"
                {...bindEmail}
              />
            </fieldset>

            <fieldset className="flex flex-col mb-6 animate" style={setAnim({ d: '200ms' })}>
              <label htmlFor="pwd-signin" className="input-label">Contraseña</label>
              <input
                type="password"
                required
                minLength={6}
                maxLength={12}
                className="w-full input sm:w-64"
                id="pwd-signin"
                placeholder="Escriba su contraseña"
                name="password"
                {...bindPwd}
              />
            </fieldset>

            {error && (
              <p
                className="text-xs text-fg-primary mb-4 animate"
                style={setAnim({ d: '300ms' })}
              >* Tus credenciales son incorrectas</p>
            )}

            <Button
              rounded={false}
              className="animate justify-center"
              style={setAnim({ d: '300ms' })}
              btnType="submit"
            >
              Iniciar sesión
            </Button>
          </form>
        </Viewport>
      </div>
    </Viewport>
  )
}

const Login: PageWithLayout = (data: LoginProps) => {
  return (
    <div className="flex flex-col h-full mx-auto w-full py-16 px-6 lg:w-[50%]">
      <Viewport className="animate" once style={setAnim({ y: '0.3rem' })}>
        <h1 className="font-title mr-auto mt-2 text-fg-primary mb-10 leading-normal select-none t-h2">
          {getDefaultBrandLayout().brandName}
        </h1>
        <div className="flex space-x-4 items-center">
          <Account24 />
          <h2 className="leading-none text-2xl">Iniciar sesión</h2>
        </div>
        <LoginBox />
      </Viewport>
    </div>
  )
}

Login.getLayoutProps = () => ({
  title: 'Inicio de sesión',
  navbar: false,
  protect: false,
})

export default Login
