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
    async jwt(token, user, account, profile) {
      const { id, email } = token as any
      const params = id ? { id } : { email }
      return {...token, ...await getUser(params)}
    },
    async session(session) {
      // Add property to session, like an access_token from a provider.
      // @ts-ignore
      const { id, email } = session.user
      const params = id ? { id } : { email }
      session.user = await getUser(params)

      return session
    },
  },
  pages: {
    signIn: '/login',
  }
})
