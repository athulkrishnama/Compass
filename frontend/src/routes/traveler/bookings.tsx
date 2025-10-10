import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/traveler/bookings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/traveler/bookints"!</div>
}
