import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { user } = Route.useRouteContext()

  return (
    <main className="h-dvh">
      <div className="p-8">
        <pre className="text-xs whitespace-pre-wrap">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </main>
  )
}
