import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(platform)/admin/blogs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(platform)/_pathless/blogs"!</div>
}
