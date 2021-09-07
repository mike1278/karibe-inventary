import prisma from '@/lib/db'
import { User } from '@prisma/client'
import { compare } from 'bcrypt'

export const loginUser = async (emailOrUsername: string, password: string): Promise<User> => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: {
            equals: emailOrUsername,
          }
        },
        {
          username: {
            equals: emailOrUsername,
          },
        }
      ],
      AND: {
        active: true
      }
    },
    include: {
      account: true
    }
  })
  if (user && await compare(password, user.account.hash)) {
    return user
  }
  return null
}


type GetUserParams = {
  id?: number
  email?: string
}

export const getUser = async ({ id, email }: GetUserParams): Promise<User> =>
  prisma.user.findUnique({
    where: {
      id,
      email: id ? undefined : email,
    }
  })
