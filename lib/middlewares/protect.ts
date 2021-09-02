import type { NextApiHandler } from 'next'
import { getSession } from 'next-auth/client'

const protect = (handler: NextApiHandler): NextApiHandler => async (req, res) => {
  const session = await getSession({ req })
  if (!session) {
    res.status(401).json({
      error: 'Unauthorized'
    })
    return
  }
  req.headers.a = 'peo'

  return handler(req, res)
}

export default protect
