import { ReactNode, useContext, createContext, useEffect, useMemo, useState, Dispatch, SetStateAction } from 'react'
import { Navbar, Footer } from './navigation'
import SeoTags, { SeoTagsProps } from './seo-tags'
import { GoogleFonts } from '@/components/google-fonts'
import Favicons from './favicons'
import { Session } from 'next-auth'
import { signIn, useSession } from 'next-auth/client'
import { NextPage } from 'next/types'
import { useRouter } from 'next/router'
import { IBrandLayout, getDefaultBrandLayout } from '@/models/page/brand-layout'
import Loading from '@/components/loading'
import NextNprogress from 'nextjs-progressbar'
import { BrandLayoutProvider, useBrandLayout } from '@/models/page/brand-layout/context'
import { hexToRgb } from '@/models/common/color'
import { DarkModeProvider, useDarkMode } from '@/lib/dark-mode'
import OptionsDrawer, { OptionsDrawerChildrenCallback } from '@/components/options-drawer'

export type GetLayoutProps<T = any> = (props: T) => PageProps

export type PageWithLayout<T = any> = NextPage<T> & {
  getLayoutProps?: GetLayoutProps<T>
}

export interface PageProps extends SeoTagsProps {
  useLayout?: boolean
  pageLayout?: IBrandLayout
  protect?: boolean
  session?: Session
  smoothScroll?: boolean
  navbar?: boolean
  footer?: boolean
  globalData?: any
  host?: string
  children?: ReactNode
}

export const globalDataContext = createContext<any>(null)
export const useGlobalDataContext = () => useContext(globalDataContext)

export type OptionsDrawerState = {
  isOpen: boolean
  setOpenState: Dispatch<SetStateAction<boolean>>
  drawerChildren: OptionsDrawerChildrenCallback
  setDrawerChildren: Dispatch<SetStateAction<OptionsDrawerChildrenCallback>>
}

export const optionsDrawerContext = createContext<OptionsDrawerState>(null)
export const useOptionsDrawer = () => useContext<OptionsDrawerState>(optionsDrawerContext)

export const PageColors = ({ brandLayout, children }: { brandLayout?: IBrandLayout, children?: ReactNode }) => {
  const [layout] = useBrandLayout()
  const [darkMode] = useDarkMode()
  const [theme, setTheme] = useState(() => (brandLayout || layout).themes.normal)
  useEffect(() => {
    setTheme(layout.themes[darkMode ? 'dark' : 'normal'])
  }, [layout, darkMode])
  const colors = useMemo(() => ({
    fg: {
      primary: hexToRgb(theme.foreground.primary),
      secondary: hexToRgb(theme.foreground.secondary),
    },
    bg: {
      primary: hexToRgb(theme.background.primary),
      secondary: hexToRgb(theme.background.secondary),
    },
  }), [theme])
  return (
    <>
      <NextNprogress
        color={theme.foreground.primary}
        startPosition={0.3}
        stopDelayMs={200}
        height={2}
        options={{
          showSpinner: false,
        }}
      />
      <style jsx>{`
      .page-layout {
        --brand-fg-primary: ${colors.fg.primary[0]}, ${colors.fg.primary[1]}, ${colors.fg.primary[2]};
        --brand-bg-primary: ${colors.bg.primary[0]}, ${colors.bg.primary[1]}, ${colors.bg.primary[2]};

        --brand-fg-secondary: ${colors.fg.secondary[0]}, ${colors.fg.secondary[1]}, ${colors.fg.secondary[2]};
        --brand-bg-secondary: ${colors.bg.secondary[0]}, ${colors.bg.secondary[1]}, ${colors.bg.secondary[2]};

        transition: 0.2s background-color;
        background-color: rgb(var(--brand-bg-primary));
        color: rgb(var(--brand-fg-secondary));

        position: relative;
      }
      `}</style>
      <div className="page-layout">
        {children}
      </div>
    </>
  )
}

export const PageLayout = (pageProps: PageProps) => {
  const {
    navbar = true,
    children,
  } = pageProps

  let [session] = useSession()
  const { isOpen, drawerChildren } = useOptionsDrawer()
  return (
    <>
      <GoogleFonts
        families={[
          'Pacifico',
          'Lato',
        ]}
        display="swap"
      />

      <PageColors>
        <OptionsDrawer open={isOpen}>
          {drawerChildren}
        </OptionsDrawer>
        <div className={`flex flex-col min-h-screen w-full page-layout ${isOpen ? 'pointer-events-none' : ''}`}>
          {(navbar && session) && <Navbar />}
          <main
            className="flex-grow flex justify-start items-stretch content-stretch overflow-hidden"
            style={{ paddingTop: `${navbar ? 96 : 0}px` }}
          >
            <div className="w-full overflow-auto">
              {children}
            </div>
          </main>
          {/* {footer && <Footer />} */}
        </div>
      </PageColors>
    </>
  )
}

const Page = (pageProps: PageProps) => {
  const {
    useLayout = true,
    pageLayout = getDefaultBrandLayout(),
    navbar = true,
    footer = true,
    smoothScroll = true,
    protect = true,
    title,
    brandTitle,
    description,
    children,
    globalData,
    session: serverSession,
    ...rest
  } = pageProps

  let [session, isLoading] = useSession()

  const { push } = useRouter()

  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [drawerChildren, setDrawerChildren] = useState<OptionsDrawerChildrenCallback>(null)

  useEffect(() => {
    if (protect && (!isLoading && session === null) && !serverSession) {
      push({ pathname: '/login', query: { callbackUrl: window.location.href } })
    }
  }, [session, protect, navbar, isLoading])

  const protectedGuard = !isLoading && session ? children : (
    <div className="font-bold m-auto w-full py-24 self-center justify-self-center">
      <Loading className="font-bold">Autenticando</Loading>
    </div>
  )

  return (
    <globalDataContext.Provider value={globalData}>
      <optionsDrawerContext.Provider
        value={{
          isOpen: isDrawerOpen,
          setOpenState: setDrawerOpen,
          drawerChildren,
          setDrawerChildren,
        }}
      >
        <DarkModeProvider>
          <BrandLayoutProvider defaultLayout={pageLayout}>
            <SeoTags
              {...rest}
              title={title}
              brandTitle={brandTitle || pageLayout.brandName}
              description={description || (globalData?.SEODescription || pageLayout.brandName)}
            />

            <style global jsx>{`
            html {
              ${smoothScroll ? 'scroll-behavior: smooth;' : ''}
            }
            `}</style>

            <Favicons />

            {useLayout ? (
              <PageLayout {...pageProps} session={session}>
                {protect ? protectedGuard : children}
              </PageLayout>
            ) : (
              protect ? protectedGuard : children
            )}
          </BrandLayoutProvider>
        </DarkModeProvider>
      </optionsDrawerContext.Provider>
    </globalDataContext.Provider>
  )
}

export default Page
