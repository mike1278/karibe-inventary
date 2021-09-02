import { getAbsoluteURL, getDefaultHost } from '@/lib/utils/client'
import Head from 'next/head'
import { useRouter } from 'next/router'

export interface OgImageProps {
  image?: string
  host?: string
}

const buildPath = (pathname: string, params: any) => {
  const used = new Set()
  // Replace the parts in [xxx]
  pathname = pathname.replace(/\[([^\]]+)]/g, (_, c0) => {
    used.add(c0)
    return c0 in params ? params[c0] : ''
  })
  // Add query string if there are any left over
  let qstr = Object.entries(params)
    .filter(([key]) => !used.has(key))
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
    .join('&')
  return pathname + (qstr && '?' + qstr)
}

const OgImage = ({ image, host = getDefaultHost() }: OgImageProps) => {
  const { pathname, query } = useRouter()
  if (!image) {
    const searchParams = new URLSearchParams()
    searchParams.set('path', buildPath(pathname, query))
    // Open Graph & Twitter images need a full URL including domain
    image = getAbsoluteURL({
      path: `/api/thumbnail?${searchParams}`,
      host
    })
  }
  return (
    <Head>
      <meta property="og:image" content={image} />
      <meta name="twitter:image" content={image} />
    </Head>
  )
}

export default OgImage
