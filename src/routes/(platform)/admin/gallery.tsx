import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(platform)/admin/gallery')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(platform)/admin/gallery"!</div>
}
