import type { NextApiHandler } from 'next'
import prisma from '@/lib/db'
import protect from '@/lib/middlewares/protect'
import { Prisma } from '@prisma/client'

const listProducts: NextApiHandler = protect(async (req, res) => {
  const { page = 1, items = 5, active } = req.query
  const take = Math.max(1, +(items as string))
  const skip = take * Math.max(0, (+(page as string) - 1))
  try {
    const [total, products] = await prisma.$transaction([
      prisma.product.count(),
      prisma.product.findMany({
        take,
        skip,
        where: {
          active: active ? active === 'true' : undefined
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          category: true,
        },
      }),
    ])
    console.log(products)
    res.status(200).json({
      total,
      maxPages: Math.ceil(total / take),
      products,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
})

const createProduct: NextApiHandler = protect(async (req, res) => {
  const { name, sku, min, max, price, providerPrice, description, categoryId } = JSON.parse(req.body)
  try {
    const product = await prisma.product.create({
      data: {
        name,
        sku: (sku as string).toUpperCase(),
        price: +price,
        providerPrice: +providerPrice,
        min: +min,
        max: +max,
        stock: -1,
        description,
        category: {
          connect: { id: +categoryId }
        },
        active: true,
      },
      include: {
        category: true,
      },
    })
    console.log(product)
    res.status(200).json(product)
  } catch (error) {
    console.error(error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        res.status(422).json({ error: 'SKU duplicado' })
        return
      }
    }
    res.status(500).json({ error })
  }
}, 'ADMIN')

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      return createProduct(req, res)
    default:
      return listProducts(req, res)
  }
}

export default handler
