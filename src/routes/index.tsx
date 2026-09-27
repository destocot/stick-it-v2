import { SignOutButton } from '@/components/sign-out-button'
import { Input } from '@/components/ui/input'
import { findAllNotes } from '@/lib/notes'
import { buttonVariants } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { StickyNoteIcon } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => findAllNotes(),
})

function Home() {
  const notes = Route.useLoaderData()
  const { user } = Route.useRouteContext()

  return (
    <main>
      <div className="p-4 py-16 min-h-dvh container mx-auto">
        <div className="border-b flex justify-between ">
          <div className="flex items-center gap-2">
            <h1 className="uppercase text-2xl leading-snug font-medium ">
              Stick-It!
            </h1>
            <StickyNoteIcon />
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Welcome, {user.username}
              </span>
              <SignOutButton />
            </div>
          ) : (
            <Link to="/login" className={buttonVariants({ size: 'sm' })}>
              Sign in
            </Link>
          )}
        </div>

        <div className="pt-8 flex flex-col md:flex-row gap-4 items-center md:justify-between">
          <div className="w-fit px-4 py-0.5 border -skew-x-6 text-center">
            <h1 className="uppercase text-xl leading-snug font-medium skew-x-6">
              Check out the most recent notes
            </h1>
          </div>

          <div>
            <Input />
          </div>
        </div>

        <div className="pt-8">
          <div className="grid grid-cols-4 gap-4">
            {notes.map((note) => (
              <pre
                className="overflow-hidden p-2 rounded-md border"
                key={note.id}
              >
                {JSON.stringify(note, null, 2)}
              </pre>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
