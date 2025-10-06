import Signup from '@/pages/hotel/Signup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hotel/signup')({
  component: Signup,
})
