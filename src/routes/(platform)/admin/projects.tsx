import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(platform)/admin/projects')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(platform)/_pathless/projects"!</div>
}
