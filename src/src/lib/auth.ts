import NextAuth, { type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from './server-utils'
import { AuthSchema } from './validations'
import { use } from 'react'

const config: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    updateAge: 0,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // runs on login
        console.log('AUTHORIZE FUNC!!!!!!!!')
        // zod validation
        const validatedData = AuthSchema.safeParse(credentials)
        if (!validatedData.success) return null

        const { email, password } = validatedData.data

        const user = await getUserByEmail(email)

        if (!user) {
          console.log('ERRORRRRR: No user found')
          return null
        }

        const passwordMatch = await bcrypt.compare(
          String(password),
          user.hashedPassword
        )

        if (!passwordMatch) {
          console.log('ERRORRRRR: Password is incorrect')
          return null
        }

        console.log({ user })
        return user
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request
      console.log({ userFromAuthorized: auth?.user })

      const isRoot = request.nextUrl.pathname === '/'
      const goingToAppPart = request.nextUrl.pathname.includes('/app')
      const isLoginRoute = request.nextUrl.pathname.includes('/login')
      const isSignupRoute = request.nextUrl.pathname.includes('/signup')
      const isPaymentRoute = request.nextUrl.pathname === '/payment'
      const authorized = Boolean(auth?.user)
      const hasAccess = auth?.user.hasAccess

      // console.log('I RUN ON EVERY REQUEST!!!!!!!!', { authorized, hasAccess })
      // console.log({request: request.cookies.get('authjs.session-token')?.value})
      // console.log({auth})
      // console.log('url:', request.nextUrl.origin + '/login')

      if (isRoot) {
        return true
      }

      if (!authorized && (goingToAppPart || isPaymentRoute)) {
        console.log('I AM !authorized')
        return false
      }

      if (authorized && !hasAccess && !isPaymentRoute) {
        console.log('I AM authorized && !hasAccess → redirect to payment')
        return Response.redirect(new URL('/payment', request.url))
      }

      if (authorized && hasAccess && (isLoginRoute || isSignupRoute)) {
        console.log('I AM authorized && hasAccess → redirect to dashboard')
        return Response.redirect(new URL('/app/dashboard', request.url))
      }

      console.log('I AM simple authorized redirect from auth')
      return true
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        // on sign in
        token.userId = user.id
        token.hasAccess = user.hasAccess
      }

      if (user?.email) {
        token.email = user.email
      }

      if (trigger === 'update') {
        console.log('JWT: Updating token due to trigger')
        try {
          const userUpdated = await getUserByEmail(token.email as string)
          console.log({ userUpdated })
          if (userUpdated) {
            token.hasAccess = userUpdated.hasAccess
          }
        } catch (error) {
          console.error('Error updating user in JWT callback:', error)
        }
      }

      console.log({ tokenFromJWT: token, user })
      return token
    },
    session: async ({ session, token }) => {
      // on sign in
      session.user.id = token.userId
      session.user.hasAccess = token.hasAccess
      console.log({ sessionFromSession: session, token })

      return session
    },
  },
  secret: process.env.AUTH_SECRET,
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
  update
} = NextAuth(config)
