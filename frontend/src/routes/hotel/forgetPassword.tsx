import ForgetPassword from '@/pages/hotel/ForgetPassword'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hotel/forgetPassword')({
  component: ForgetPassword,
})
