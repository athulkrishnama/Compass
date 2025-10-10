import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cab/bookings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cab/bookings"!</div>
}
