import type { NextApiHandler } from 'next'
import prisma from '@/lib/db'
import protect from '@/lib/middlewares/protect'
import { Prisma } from '@prisma/client'

const updateCategory: NextApiHandler = async (req, res) => {
  const { id } = req.query
  const { name, active } = JSON.parse(req.body)
  try {
    await prisma.productCategory.update({
      where: { id: +id },
      data: {
        name,
        active,
      },
    })
    res.status(200).end()
  } catch (error) {
    console.error(error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        res.status(422).json({ error: 'DUPLICATED' })
        return
      }
    }
    res.status(500).json({ error })
  }
}

const handler: NextApiHandler = async (req, res) => {
  switch(req.method) {
    case 'PUT':
      return updateCategory(req, res)
    default:
      res.status(404).end()
      return
  } 
}

export default protect(handler)
