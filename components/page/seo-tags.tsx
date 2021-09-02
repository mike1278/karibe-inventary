import Head from 'next/head'
import { useRouter } from 'next/router'
import { getAbsoluteURL, getDefaultHost } from '@/lib/utils/client'

export interface SeoTagsProps {
  title?: string
  brandTitle?: string
  description?: string
  type?: string
  host?: string
}

const SeoTags = ({
  title,
  brandTitle,
  description,
  type = 'website',
  host = getDefaultHost(),
}: SeoTagsProps) => {
  const { pathname } = useRouter()
  return (
    <Head>
      <title>{title ? `${title} | ${brandTitle}` : brandTitle}</title>
      <meta property="og:title" content={title || brandTitle}/>
      <meta property="twitter:title" content={title || brandTitle}/>
      <meta name="application-name" content={brandTitle}/>

      <meta name="description" content={description}/>
      <meta property="og:description" content={description}/>

      <meta property="og:url" content={getAbsoluteURL({ path: pathname, host })}/>
      <meta property="og:type" content={type}/>
      <meta property="og:site_name" content={brandTitle}/>

      <meta name="twitter:card" content="summary_large_image"/>
    </Head>
  )
}
export default SeoTags
