import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notes/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/notes/new"!</div>
}
