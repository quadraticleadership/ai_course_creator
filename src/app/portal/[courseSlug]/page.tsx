import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  courses,
  modules,
  enrollments,
  students,
  moduleComponents,
} from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { notFound } from 'next/navigation'

export default async function PortalHomePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>
}) {
  const { courseSlug } = await params
  const session = await auth()

  const course = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, courseSlug))
    .limit(1)
    .then((rows) => rows[0])

  if (!course) notFound()

  const enrollment = await db
    .select()
    .from(enrollments)
    .innerJoin(students, eq(students.id, enrollments.studentId))
    .where(
      and(
        eq(students.email, session!.user!.email!),
        eq(enrollments.courseId, course.id),
      ),
    )
    .limit(1)
    .then((rows) => rows[0])

  if (!enrollment) notFound()

  const courseModules = await db
    .select()
    .from(modules)
    .where(eq(modules.courseId, course.id))
    .orderBy(asc(modules.sequenceNumber))

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-2">{course.name}</h1>
      <p className="text-gray-500 mb-8">
        Welcome back, {enrollment.students.name.split(' ')[0]}.
      </p>

      <ol className="space-y-3">
        {courseModules.map((mod) => {
          const isCurrent = mod.id === enrollment.enrollments.currentModuleId
          return (
            <li
              key={mod.id}
              className={`rounded-lg border px-4 py-3 ${
                isCurrent ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
              }`}
            >
              <span className="text-sm text-gray-400 mr-2">{mod.sequenceNumber}.</span>
              <span className="font-medium">{mod.name}</span>
              {isCurrent && (
                <span className="ml-2 text-xs text-indigo-600 font-medium">In progress</span>
              )}
            </li>
          )
        })}
      </ol>
    </main>
  )
}
