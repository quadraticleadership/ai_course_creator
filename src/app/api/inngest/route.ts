import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'

// Register Inngest functions here as they're built
// import { processAssessment } from '@/lib/inngest/functions/process-assessment'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    // processAssessment,
  ],
})
