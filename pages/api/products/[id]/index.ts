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
    const product = await prisma.product.findUnique({ where: { id: +id } })
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

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      return get(req, res)
    default:
      res.status(404).end()
      return
  }
}

export default protect(handler)
