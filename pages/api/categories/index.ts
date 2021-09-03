import type { NextApiHandler } from 'next'
import prisma from '@/lib/db'
import protect from '@/lib/middlewares/protect'
import { Prisma } from '@prisma/client'

const listCategories: NextApiHandler = protect(async (req, res) => {
  const { page = 1, items = 5 } = req.query
  const take = Math.max(1, +(items as string))
  const skip = take * Math.max(0, (+(page as string) - 1))
  try {
    const [total, categories] = await prisma.$transaction([
      prisma.productCategory.count(),
      prisma.productCategory.findMany({
        take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: {
            select: {
              products: true
            }
          }
        },
      }),
    ])
    res.status(200).json({
      total,
      maxPages: Math.ceil(total / take),
      categories
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
})

const createCategory: NextApiHandler = protect(async (req, res) => {
  const { name } = JSON.parse(req.body)
  try {
    const user = await prisma.productCategory.create({
      data: {
        name,
      },
    })
    res.status(200).json(user)
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
}, 'ADMIN')

const handler: NextApiHandler = async (req, res) => {
  switch(req.method) {
    case 'POST':
      return createCategory(req, res)
    default:
      return listCategories(req, res)
  } 
}

export default handler
