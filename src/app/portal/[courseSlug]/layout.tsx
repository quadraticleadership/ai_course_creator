import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { courses, enrollments, students } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ courseSlug: string }>
}) {
  const { courseSlug } = await params
  const session = await auth()

  if (!session?.user?.email) {
    redirect('/api/auth/signin')
  }

  // Verify the course exists and is active
  const course = await db
    .select()
    .from(courses)
    .where(and(eq(courses.slug, courseSlug), eq(courses.status, 'active')))
    .limit(1)
    .then((rows) => rows[0])

  if (!course) notFound()

  // Verify the student has an active enrollment in this course
  const enrollment = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .innerJoin(students, eq(students.id, enrollments.studentId))
    .where(
      and(
        eq(students.email, session.user.email),
        eq(enrollments.courseId, course.id),
        eq(enrollments.status, 'active'),
      ),
    )
    .limit(1)
    .then((rows) => rows[0])

  if (!enrollment) {
    // Student is authenticated but not enrolled — show a holding page
    redirect(`/portal/${courseSlug}/not-enrolled`)
  }

  return <>{children}</>
}
