import { Input } from '@/components/ui/input'
import { findAllNotes } from '@/lib/notes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => findAllNotes(),
})

function Home() {
  const notes = Route.useLoaderData()

  return (
    <main>
      <div className="p-4 py-16 min-h-dvh container mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center md:justify-between">
          <div className="w-fit px-4 py-0.5 border -skew-x-6 text-center">
            <h1 className="uppercase text-2xl leading-snug font-medium skew-x-6">
              Check out the most recent notes
            </h1>
          </div>

          <div>
            <Input />
          </div>
        </div>

        <div className="pt-4">
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
