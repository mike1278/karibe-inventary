import type { NextApiHandler } from 'next'
import prisma from '@/lib/db'
import protect from '@/lib/middlewares/protect'

const get: NextApiHandler = async (req, res) => {
  const { id } = req.query
  try {
    const now = new Date()
    const month = new Date(`${now.getFullYear()}/${now.getMonth() + 1}/01`)
    const product = await prisma.product.findUnique({ where: { id: +id } })
    const buyDetails = await prisma.buyDetail.findMany({
      where: {
        productId: +id,
        createdAt: {
          gte: month,
        }
      }
    })
    const sellDetails = await prisma.sellDetail.findMany({
      where: {
        productId: +id,
        createdAt: {
          gte: month,
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
