import type { NextApiHandler } from 'next'
import prisma from '@/lib/db'
import protect from '@/lib/middlewares/protect'

const get: NextApiHandler = protect(async (req, res) => {
  const { id } = req.query
  console.log(id)
  try {
    const sell = await prisma.sell.findUnique({
      where: {
        id: +id,
      },
      include: {
        _count: {
          select: {
            details: true
          }
        },
        client: true,
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
    res.status(200).json(sell)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
})

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
