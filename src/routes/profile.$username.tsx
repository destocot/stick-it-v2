import { findOneProfileByUsername } from '@/lib/profiles'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$username')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const profile = await findOneProfileByUsername({
      data: { username: params.username },
    })

    if (!profile) throw notFound()

    if (profile.username !== params.username) {
      throw redirect({
        to: '/profile/$username',
        params: { username: profile.username },
        statusCode: 301,
      })
    }

    return profile
  },
})

function RouteComponent() {
  return <div>Hello "/profile/$username"!</div>
}
