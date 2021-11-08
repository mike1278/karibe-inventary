import type { NextApiHandler } from 'next'
import prisma from '@/lib/db'
import protect from '@/lib/middlewares/protect'

const get: NextApiHandler = async (req, res) => {
  const { id } = req.query
  try {
    const buy = await prisma.buy.findUnique({
      where: {
        id: +id,
      },
      include: {
        _count: {
          select: {
            details: true
          }
        },
        details: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        },
        user: true,
      }
    })
    console.log(buy)
    res.status(200).json(buy)
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
