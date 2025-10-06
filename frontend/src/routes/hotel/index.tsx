import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hotel/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/hotel/"!</div>
}
