import type { NextApiHandler } from 'next'
import prisma from '@/lib/db'
import { hash } from 'bcrypt'
import protect from '@/lib/middlewares/protect'

const handler: NextApiHandler = async (req, res) => {
  const { id } = req.query
  const { password } = JSON.parse(req.body)
  try {
    const accountId = (await prisma.user.findUnique({ where: { id: +id } }).account())?.id
    await prisma.account.update({
      where: { id: accountId },
      data: {
        hash: await hash(password, 10)
      },
    })
    res.status(200).end()
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default protect(handler)
