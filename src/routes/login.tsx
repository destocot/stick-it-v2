import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from '@/lib/auth'
import { SignInSchema } from '@/lib/schemas'
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useActionState } from 'react'
import * as v from 'valibot'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: '/' })
  },
})

function RouteComponent() {
  const login = useServerFn(signIn)
  const navigate = useNavigate()
  const router = useRouter()

  const [error, submit, pending] = useActionState(
    async (_previous: string | null, form: FormData) => {
      const parsed = v.safeParse(SignInSchema, Object.fromEntries(form))

      if (!parsed.success) return parsed.issues[0].message

      const result = await login({ data: parsed.output })

      if (result.error) return result.error

      await router.invalidate()

      navigate({ to: '/' })

      return null
    },
    null,
  )

  return (
    <main className="h-dvh">
      <div className="flex items-center h-full justify-center">
        <div className="flex flex-col gap-4 max-w-sm w-full">
          <div className="w-fit mx-auto px-4 py-0.5 border -skew-x-6 text-center">
            <h1 className="uppercase text-2xl leading-snug font-medium skew-x-6">
              Login
            </h1>
          </div>

          <Card>
            <CardContent>
              <form action={submit} className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" name="email" />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="password">Password</Label>
                  <Input type="password" id="password" name="password" />
                </div>

                {error ? (
                  <p className="text-destructive text-sm">{error}</p>
                ) : null}

                <Button
                  type="submit"
                  className="hover:text-primary hover:bg-primary-foreground hover:border-border"
                  disabled={pending}
                >
                  {pending ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </CardContent>

            <CardFooter>
              <span>
                Not a member? Register{' '}
                <Link
                  to="/register"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  here
                </Link>
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
