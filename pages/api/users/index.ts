import type { NextApiHandler } from 'next'
import prisma from '@/lib/db'
import protect from '@/lib/middlewares/protect'
import { hash } from 'bcrypt'

const listUsers: NextApiHandler = async (req, res) => {
  const { page = 1, items = 5 } = req.query
  const take = Math.max(1, +(items as string))
  const skip = take * Math.max(0, (+(page as string) - 1))
  try {
    const total = await prisma.user.count()
    const users = await prisma.user.findMany({
      take,
      skip,
      orderBy: {
        createdAt: 'desc',
      }
    })
    res.status(200).json({
      total,
      maxPages: Math.ceil(total / take),
      users
    })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const createUser: NextApiHandler = async (req, res) => {
  const { username, email, name, role, password } = JSON.parse(req.body)
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        name,
        role,
        account: {
          create: {
            hash: await hash(password, 10)
          }
        }
      },
    })
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error })
  }
}

const handler: NextApiHandler = async (req, res) => {
  switch(req.method) {
    case 'POST':
      return createUser(req, res)
    default:
      return listUsers(req, res)
  } 
}

export default protect(handler)
