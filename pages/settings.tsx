import { Button } from '@/components/button'
import Link from '@/components/canonical-link'
import { PageWithLayout } from '@/components/page'
import Viewport, { setAnim } from '@/components/viewport'
import { useInput } from '@/lib/hooks'
import { useUser } from '@/models/auth/user'

const ProfileSettings: PageWithLayout = () => {
  const [session] = useUser()
  const { user } = session
  const { value: name, bind: bindName } = useInput(user?.name)
  const { value: email, bind: bindEmail } = useInput(user?.email)
  const { value: username, bind: bindUsername } = useInput(user?.username)

  const { value: pwd, bind: bindPwd, reset: resetPwd } = useInput('')
  const { value: rePwd, bind: bindRePwd, reset: resetRePwd } = useInput('')

  const updateUser = (e) => {
    e.preventDefault()
    fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name,
        email,
        username,
      })
    })
  }

  const updateAccount = (e) => {
    e.preventDefault()
    if (pwd !== rePwd) {
      alert('Las contraseñas deben ser iguales')
      return
    }
    fetch(`/api/users/${user.id}/account`, {
      method: 'PUT',
      body: JSON.stringify({
        password: pwd,
      })
    }).then((res) => {
      if (res.ok) {
        resetPwd()
        resetRePwd()
      }
    })
  }

  return (
    <div className="py-4 c-lg">
      <Viewport className="w-full animate" once style={setAnim({ y: '-0.3rem' })}>
        <div className="flex flex-col space-y-12">
          <div className="flex mb-4 items-center bg-white px-3 py-2 shadow sm:mb-0">
            <h2 className="font-bold leading-normal text-gray-700 text-2xl">
              Configuración de la cuenta
            </h2>
          </div>

          <div className="flex flex-col jusify-strech space-y-12 w-full justify-center items-stretch sm:flex-row sm:space-y-0 sm:space-x-12">
            <div className="bg-bg-secondary rounded-xl shadow-lg w-full p-4 animate">
              <div className="flex flex-col">

                <form
                  className="flex flex-col"
                  onSubmit={updateUser}
                >
                  <fieldset className="flex flex-col mb-4 animate" style={setAnim({ d: '100ms' })}>
                    <label htmlFor="name" className="input-label">Nombre y apellido</label>
                    <input
                      type="text"
                      required
                      className="w-full input"
                      id="name"
                      placeholder="Ex. Victor Campos"
                      {...bindName}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col mb-4 animate" style={setAnim({ d: '200ms' })}>
                    <label htmlFor="email" className="input-label">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full input"
                      id="email"
                      placeholder="Ex. johndoe@gmail.com"
                      {...bindEmail}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col mb-6 animate" style={setAnim({ d: '200ms' })}>
                    <label htmlFor="username" className="input-label">Username</label>
                    <input
                      type="text"
                      required
                      className="w-full input"
                      id="username"
                      placeholder="Ex. victorcampos"
                      {...bindUsername}
                    />
                  </fieldset>

                  <Button
                    rounded={false}
                    className="animate justify-center"
                    style={setAnim({ d: '300ms' })}
                    btnType="submit"
                  >
                    Guardar cambios
                  </Button>
                </form>
              </div>
            </div>
            <div className="bg-bg-secondary rounded-xl shadow-lg w-full p-4 animate">
              <div className="flex flex-col h-full">
                <form
                  className="flex flex-col justify-between h-full"
                  onSubmit={updateAccount}
                >
                  <div>
                    <label className="mb-4 input-label">Cambiar contraseña</label>
                    <fieldset className="flex flex-col mb-4 animate" style={setAnim({ d: '100ms' })}>
                      <input
                        type="password"
                        minLength={6}
                        maxLength={12}
                        required
                        autoComplete="off"
                        className="w-full input"
                        id="pwd"
                        placeholder="Escriba la nueva contraseña"
                        {...bindPwd}
                      />
                    </fieldset>

                    <fieldset className="flex flex-col mb-6 animate" style={setAnim({ d: '200ms' })}>
                    <label htmlFor="username" className="input-label">Confirmaciòn de contraseña</label>
                      <input
                        type="password"
                        required
                        autoComplete="off"
                        className="w-full input"
                        id="re-pwd"
                        placeholder="Repita la contraseña"
                        {...bindRePwd}
                      />
                    </fieldset>

                  </div>

                  <Button
                    rounded={false}
                    className="animate justify-center"
                    style={setAnim({ d: '300ms' })}
                    btnType="submit"
                  >
                    Actualizar la contraseña
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Viewport>
    </div>
  )
}

ProfileSettings.getLayoutProps = () => ({
  title: 'Configuración de la cuenta',
})

export default ProfileSettings
