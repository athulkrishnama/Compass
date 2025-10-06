import Login from '@/pages/traveler/Login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/traveler/login')({
  component: Login,
})

