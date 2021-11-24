import { Fragment, useEffect, useState } from 'react'
import Link from '@/components/canonical-link'
import Hamburger from './hamburguer'
import Sidebar from './sidebar'
import Dropdown, { CustomDropdown } from './dropdown'
import s from './styles/navbar.module.css'
import nav from '@/lib/navigation'
import { useGlobalDataContext } from '@/components/page'
import { Session } from 'next-auth'
import Navigation from '@/lib/navigation'
import { useBrandLayout } from '@/models/page/brand-layout/context'
import { useDarkMode } from '@/lib/dark-mode'
import dynamic from 'next/dynamic'
import { useUser } from '@/models/auth/user'
import { signOut } from 'next-auth/client'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Logo from '@/public/venita.png'

const DarkModeSwitch = dynamic(import('react-toggle-dark-mode').then(m => m.DarkModeSwitch), {
  ssr: false
})

export default function Navbar({ }: {
  session?: Session
}) {
  const [sidebar, setSidebar] = useState(false)
  const [scrollY, setScrollY] = useState<number>(null)
  const toggleSidebar = () => (setSidebar(!sidebar))
  const globalData = useGlobalDataContext()

  const [{ user }] = useUser()
  const { push } = useRouter()

  const scrollHander = () => {
    setScrollY(window.scrollY)
    showingHandler()
  }

  const [brand] = useBrandLayout()

  const [isDarkMode, setDarkMode] = useDarkMode()

  const [isShowing, setShowing] = useState(true)
  const [lastScrollPosition, setLastScrollPosition] = useState(0)
  const showingHandler = () => {
    const currentScrollPosition =
      window.pageYOffset || document.documentElement.scrollTop
    if (currentScrollPosition < 0) {
      return
    }
    // Stop executing this function if the difference between
    // current scroll position and last scroll position is less than some offset
    if (Math.abs(currentScrollPosition - lastScrollPosition) < 128) {
      return
    }
    if (currentScrollPosition > 128) {
      setShowing(currentScrollPosition < lastScrollPosition)
    } else {
      setShowing(true)
    }
    setLastScrollPosition(currentScrollPosition)
  }

  useEffect(() => {
    if (scrollY === null) {
      scrollHander()
    }
    window.addEventListener('scroll', scrollHander, { passive: true })
    return () => (window.removeEventListener('scroll', scrollHander))
  })

  const [dark] = useDarkMode()

  return (
    <>
      <header className={`${s.header} transform-gpu bg-white shadow ${(!sidebar && !isShowing) && '-translate-y-full pointer-events-none'}`}>
        <Sidebar open={sidebar} toggle={toggleSidebar} />
        <div className={`flex items-center h-full bg-white w-full border-b ${scrollY > 0 ? 'border-x-gray-200' : 'border-transparent'}`}>
          <div className={`${s.headerWrapper} c-lg`}>
            <div className="flex overflow-hidden pointer-events-auto items-center">
              <Link title="Home" className="font-bold font-title transform duration-200 hover:scale-95" href="/" style={{ willChange: 'transform', filter: isDarkMode ? 'brightness(0) invert(1)' : 'unset' }}>
                <Image src={Logo} width={190} height={94} objectFit="contain" />
                {/* <h1 className="font-title text-fg-primary leading-[normal] py-4 pr-1 text-3xl select-none sm:text-4xl">{brand.brandName}</h1> */}
              </Link>
            </div>
            <div className={s.elements}>
              <div className="mr-2 text-sm items-center hidden lg:flex">
                {nav(globalData).map((n, i) => n.childrens ? (
                  <Fragment key={i}>
                    <Dropdown titulo={n.titulo} links={n.childrens} />
                  </Fragment>
                ) : (
                  <Link
                    key={i}
                    href={n.href || '/'}
                    className="border-transparent font-bold border-b-[3px] mx-4 -mt-[3px] hover:border-fg-primary"
                    style={{
                      transition: '0.2s border-color, 0s color'
                    }}
                  >
                    {n.titulo}
                  </Link>
                ))}
              </div>
              {user && (
                <>
                  <div className="text-sm lg:mr-4">
                    <CustomDropdown titulo={`Hola, ${user?.name?.split(' ').slice(0, 2).join(' ')}`} links={[
                      ...(user?.role === 'ADMIN' ? [
                        {
                          titulo: 'Administración de usuarios',
                          href: '/users',
                        },
                      ] : []),
                      {
                        titulo: 'Configuración de la cuenta',
                        href: '/settings',
                      },
                      {
                        titulo: 'Cerrar sesión',
                        isButton: true,
                        onClick: () => signOut({ callbackUrl: '/' }),
                      }
                    ]}>
                      <div
                        className="cursor-pointer overflow-hidden"
                      >
                        <div className="h-[30px] flex items-center" >
                          { user?.name }
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </CustomDropdown>
                  </div>
                </>
              )}
              {Navigation(globalData).length ? (
                <div className="ml-6 lg:hidden">
                  <Hamburger open={sidebar} toggle={toggleSidebar} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
