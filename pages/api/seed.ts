import { NextApiHandler } from 'next'
import { seed } from '@/prisma/seed'

const handler: NextApiHandler = async (req, res) => {
  try {
    await seed()
    res.json({
      status: 'seeded'
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    })
  }
}

export default handler
