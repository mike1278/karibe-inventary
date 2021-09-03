import { User } from '@prisma/client'
import { getSession, GetSessionOptions, useSession } from 'next-auth/client'
import { Session as AuthSession } from 'next-auth'

export type Session = AuthSession & {
  user: User
}

export const useUser = (): [Session, boolean] => {
  const [session, isLoading] = useSession() as [Session, boolean]
  return [session, isLoading]
}

export const getUser = (options: GetSessionOptions): Promise<Session> => getSession(options) as Promise<Session>
