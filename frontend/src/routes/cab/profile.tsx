import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cab/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cab/profile"!</div>
}
