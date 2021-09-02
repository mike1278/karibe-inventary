import { FC, useRef, useState, useEffect } from 'react'
import Head from 'next/head'

export interface IGoogleFontsProps {
  /**
   * URLs to your Google Fonts StyleSheet.
   */
  families: string[]
  /**
   * Set to `swap` for append `&display=swap` for best performance.
   */
  display?: 'swap' | string
}

let hydrated = false

export const GoogleFonts: FC<IGoogleFontsProps> = ({
  families,
  display
}) => {
  const hydratedRef = useRef(false)
  const [, rerender] = useState(false)

  const href = `https://fonts.googleapis.com/css2?${
    families.map((f) => `family=${f}`).join('&')
  }${
    display ? `&display=${display}` : ''
  }`

  useEffect(() => {
    if (!hydratedRef.current) {
      hydrated = true
      hydratedRef.current = true
      rerender(true)
    }
  }, [])

  return (
    <Head>
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="preload" as="style" href={href} />
      <link href={href} rel="stylesheet" media={!hydrated ? "print" : "all"} />
      <noscript>
        <link href={href} rel="stylesheet" />
      </noscript>
    </Head>
  )
}
