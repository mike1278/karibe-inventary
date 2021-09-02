import { PageWithLayout } from '@/components/page'
import { Repeat24 } from '@carbon/icons-react'
import { useRouter } from 'next/router'
import { Button } from '@/components/button'

const PageOffline: PageWithLayout = () => {
  const router = useRouter()
  const reload = () => {
    router.reload()
  }
  return (
    <div className="text-center w-full py-16">
      <h1 className="font-title text-fg-primary mb-8 text-5xl">
        Offline
      </h1>
      <p className="mb-6">Lo siento, no tienes internet</p>
      <Button icon={<Repeat24 />} title="Refresh" onClick={reload} />
    </div>
  )
}

  PageOffline.getLayoutProps = () => ({
    title: 'Offline',
    canonical: true,
    protect: false,
  })

  export default PageOffline
