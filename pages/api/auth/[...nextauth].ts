import { Session } from '@/models/auth/user'
import { getUser, loginUser } from '@/models/auth/user/db'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  session: {
    jwt: true,
  },
  debug: true,
  providers: [
    Providers.Credentials({
      id: 'email',
      name: "Email Account",
      // @ts-ignore
      async authorize(credentials: any) {
        return await loginUser(credentials.email, credentials.password)
      },
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
        password: {  label: 'Password', type: 'password' }
     }
    }),
  ],
  callbacks: {
    async session(session: Session) {
      // Add property to session, like an access_token from a provider.
      session.user = await getUser(session.user)

      return session
    },
  },
  pages: {
    signIn: '/login',
  }
})
