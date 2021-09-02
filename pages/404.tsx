import { Button } from '@/components/button'
import { PageWithLayout } from '@/components/page'

const Page404: PageWithLayout = () => (
  <div className="text-center w-full py-16">
    <h1 className="font-bold text-fg-primary mb-4 text-8xl">
      404
    </h1>
    <p className="mb-6">Esta página no existe</p>
    <Button title="Ir al inicio" href="/" />
  </div>
)

Page404.getLayoutProps = () => ({
  title: '404: Esta página no existe',
  protect: false,
})

export default Page404
