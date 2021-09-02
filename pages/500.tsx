import { Button } from '@/components/button'
import { PageWithLayout } from '@/components/page'

const Page404: PageWithLayout = () => (
  <div className="text-center w-full py-16">
    <h1 className="font-bold text-fg-primary mb-4 text-8xl">
      500
    </h1>
    <p className="mb-6">Un error salvaje ha aparecido</p>
    <Button title="Ir al inicio" href="/" />
  </div>
)

Page404.getLayoutProps = () => ({
  title: '500: Oopsie',
  protect: false,
})

export default Page404
