import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(platform)/admin/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(platform)/_pathless/settings"!</div>
}
