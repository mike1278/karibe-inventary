import { User } from '@prisma/client'
import { useSession } from 'next-auth/client'
import { Session as AuthSession } from 'next-auth'

export type Session = AuthSession & {
  user: User
}

export const useUser = (): [Session, boolean] => {
  const [session, isLoading] = useSession() as [Session, boolean]
  return [session, isLoading]
}
