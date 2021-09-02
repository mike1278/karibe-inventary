import type { NextApiHandler } from 'next'
import prisma from '@/lib/db'
import protect from '@/lib/middlewares/protect'

const updateUser: NextApiHandler = async (req, res) => {
  const { id } = req.query
  const { username, email, name, role, active } = JSON.parse(req.body)
  try {
    await prisma.user.update({
      where: { id: +id },
      data: {
        username,
        email,
        name,
        active,
        role,
      },
    })
    res.status(200).end()
  } catch (error) {
    res.status(500).json({ error })
  }
}

const handler: NextApiHandler = async (req, res) => {
  switch(req.method) {
    case 'PUT':
      return updateUser(req, res)
    default:
      res.status(404).end()
      return
  } 
}

export default protect(handler)
