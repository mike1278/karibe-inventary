import type { NextApiHandler } from 'next'
import prisma from '@/lib/db'
import protect from '@/lib/middlewares/protect'

const get: NextApiHandler = async (req, res) => {
  const { id } = req.query
  try {
    const now = new Date()
    const start = new Date(req.query.start as string || new Date(`${now.getFullYear()}/${now.getMonth() + 1}/01`))
    let end = new Date(req.query.end as string || now)
    end.setDate(end.getDate() + 1)
    const product = await prisma.product.findUnique({ where: { id: +id }, include: { category: true } })
    const buyDetails = await prisma.buyDetail.findMany({
      where: {
        productId: +id,
        createdAt: {
          gte: start,
          lte: end,
        }
      }
    })
    console.log(buyDetails)
    const sellDetails = await prisma.sellDetail.findMany({
      where: {
        productId: +id,
        createdAt: {
          gte: start,
          lte: end,
        }
      }
    })
    res.status(200).json({
      product,
      buyDetails,
      sellDetails,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

const put: NextApiHandler = async (req, res) => {
  const { id } = req.query
  const data = JSON.parse(req.body)
  try {
    const product = await prisma.product.update({
      where: { id: +id },
      include: { category: true },
      data: {
        name: data.name || undefined,
        price: +data.price ?? undefined,
        providerPrice: +data.providerPrice ?? undefined,
        categoryId: +data.categoryId || undefined,
        sku: data.sku || undefined,
      }
    })
    res.status(200).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      return get(req, res)
    case 'PUT':
      return put(req, res)
    default:
      res.status(404).end()
      return
  }
}

export default protect(handler)
