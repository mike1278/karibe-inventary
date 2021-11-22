import type { NextApiHandler } from 'next'
import prisma from '@/lib/db'
import protect from '@/lib/middlewares/protect'
import { Prisma, Product } from '@prisma/client'
import { getUser } from '@/models/auth/user'

const list: NextApiHandler = protect(async (req, res) => {
  const { page = 1, items = 5 } = req.query
  const take = Math.max(1, +(items as string))
  const skip = take * Math.max(0, (+(page as string) - 1))
  try {
    const [total, buys] = await prisma.$transaction([
      prisma.buy.count(),
      prisma.buy.findMany({
        take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: {
            select: {
              details: true
            }
          },
          details: true,
          user: true,
        }
      }),
    ])
    res.status(200).json({
      total,
      maxPages: Math.ceil(total / take),
      buys,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
})

const create: NextApiHandler = protect(async (req, res) => {
  const session = await getUser({ req })
  const details = JSON.parse(req.body)
  try {
    const products: { product: Product, price: number, quantity: number }[] = []
    for await (const d of details) {
      const product = await prisma.product.update({
        where: { id: +d.productId }, data: {
          price: +d.price,
          providerPrice: +d.providerPrice,
        }
      })
      products.push({
        product,
        price: product.providerPrice,
        quantity: +d.quantity
      })
    }

    const priceTotal = products.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0)
    const sell = await prisma.buy.create({
      data: {
        details: {
          createMany: {
            data: products.map((p) => ({
              price: p.price,
              productId: p.product.id,
              quantity: p.quantity,
            }))
          }
        },
        priceTotal,
        user: {
          connect: { id: session.user.id }
        },
      },
      include: {
        details: {
          include: {
            product: true
          }
        },
        user: true,
      },
    })

    for await (const product of products) {
      await prisma.product.update({
        where: {
          id: product.product.id,
        },
        data: {
          stock: Math.max(0, product.product.stock) + product.quantity,
        }
      })
    }
    res.status(200).json(sell)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        res.status(422).json({ error: 'SKU duplicado' })
        return
      }
    }
    res.status(500).json(error)
  }
})

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      return create(req, res)
    default:
      return list(req, res)
  }
}

export default handler
