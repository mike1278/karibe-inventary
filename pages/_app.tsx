import '@/styles/carbon.scss'
import '@/styles/app.css'
import '@/styles/icons.css'

import type { AppProps } from 'next/app'
import { Provider as AuthProvider } from 'next-auth/client'
import Page, { PageProps, PageWithLayout } from '@/components/page'
import { useMemo } from 'react'
import { SWRConfig } from 'swr'
import { serviceFetcher } from '@/lib/fetcher'

type Props = AppProps & {
  Component: PageWithLayout
}

const App = ({ Component, pageProps }: Props) => {
  const layoutProps = useMemo<PageProps>(() => Component.getLayoutProps
    ? Component.getLayoutProps(pageProps)
    : pageProps,
    [Component.getLayoutProps, pageProps])
  return (
    <SWRConfig
      value={{
        fetcher: serviceFetcher,
      }}
    >
      <AuthProvider session={pageProps.session} {...pageProps} {...layoutProps}>
        <Page {...pageProps} {...layoutProps}>
          <Component {...pageProps} />
        </Page>
      </AuthProvider>
    </SWRConfig>
  )
}

export default App
