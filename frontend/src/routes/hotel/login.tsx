import Login from '@/pages/hotel/Login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hotel/login')({
  component: Login,
})
