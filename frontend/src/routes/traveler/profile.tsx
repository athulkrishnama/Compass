import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/traveler/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/traveler/profile"!</div>
}
