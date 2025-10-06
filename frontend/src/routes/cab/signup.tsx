import Signup from '@/pages/cab/Signup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cab/signup')({
  component: Signup,
})

