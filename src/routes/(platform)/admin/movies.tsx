import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(platform)/admin/movies')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(platform)/_pathless/movies"!</div>
}
