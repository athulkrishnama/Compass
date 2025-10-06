import Signup from '@/pages/traveler/Signup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/traveler/signup')({
  component: Signup,
})

