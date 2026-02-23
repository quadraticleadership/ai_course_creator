import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { db } from '@/lib/db'
import { students } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false

      // Upsert student record on first sign-in
      const existing = await db
        .select({ id: students.id })
        .from(students)
        .where(eq(students.email, user.email))
        .limit(1)

      if (existing.length === 0) {
        await db.insert(students).values({
          name: user.name ?? user.email,
          email: user.email,
        })
      }

      return true
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token.email) {
        session.user.email = token.email as string
      }
      return session
    },
  },
})
