import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'

import { getCurrentUser } from '@/lib/auth'

import appCss from '../styles.css?url'
import { buttonVariants } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRoute({
  beforeLoad: async () => ({ user: await getCurrentUser() }),
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Stick-It!',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <main className="h-dvh">
      <div className="flex items-center h-full justify-center">
        <div className="flex flex-col gap-4 max-w-sm w-full">
          <div className="w-fit mx-auto px-4 py-0.5 border -skew-x-6 text-center">
            <h1 className="uppercase text-2xl leading-snug font-medium skew-x-6">
              404
            </h1>
          </div>

          <p className="text-center text-sm uppercase">Page not found</p>

          <Link
            to="/"
            className={buttonVariants({
              className: 'max-w-fit mx-auto',
            })}
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  )
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
