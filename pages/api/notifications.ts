import type { NextApiHandler } from 'next'
import prisma from '@/lib/db'
import protect from '@/lib/middlewares/protect'

const get: NextApiHandler = async (req, res) => {
  try {
    const now = new Date()
    const start = new Date(req.query.start as string || new Date(`${now.getFullYear()}/${now.getMonth() + 1}/01`))
    let end = new Date(req.query.end as string || now)
    end.setDate(end.getDate() + 1)
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    })
    const filtered = products.filter(p => p.stock < p.min).map(p => ({
      name: p.stock == -1 ? `Nuevo producto: <strong>${p.name}</strong>` : `<strong>${p.name}</strong> en agotamiento`,
      href: `/inputs/new?product=${p.id}`
    }))
    res.status(200).json(filtered)
  } catch (error) {
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
