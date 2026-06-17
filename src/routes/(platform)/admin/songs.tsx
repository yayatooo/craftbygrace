import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(platform)/admin/songs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(platform)/_pathless/musics"!</div>
}
