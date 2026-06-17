import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(platform)/admin/experiences')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(platform)/_pathless/experiences"!</div>
}
