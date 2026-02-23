import { Inngest } from 'inngest'

export const inngest = new Inngest({ id: 'agentic-learning-platform' })

// Event types — add to this union as new jobs are introduced
export type Events = {
  'conversation/completed': {
    data: {
      conversationId: string
      enrollmentId: string
      moduleId: string
      componentType: string
    }
  }
  'enrollment/created': {
    data: {
      enrollmentId: string
      courseId: string
      studentId: string
    }
  }
  'course/publish-requested': {
    data: {
      courseId: string
    }
  }
}
