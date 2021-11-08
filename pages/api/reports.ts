import type { NextApiHandler } from 'next'
import prisma from '@/lib/db'
import protect from '@/lib/middlewares/protect'

const get: NextApiHandler = async (req, res) => {
  try {
    const now = new Date()
    const month = new Date(`${now.getFullYear()}/${now.getMonth() + 1}/01`)
    const buyDetails = await prisma.buyDetail.findMany({
      where: {
        createdAt: {
          gte: month,
        }
      }
    })
    const sellDetails = await prisma.sellDetail.findMany({
      where: {
        createdAt: {
          gte: month,
        }
      }
    })
    res.status(200).json({
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