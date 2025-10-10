import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hotel/history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/hotel/history"!</div>
}
