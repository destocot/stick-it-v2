import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp } from '@/lib/auth'
import { SignUpSchema, firstIssue } from '@/lib/schemas'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function field(form: FormData, name: string): string {
  const value = form.get(name)
  return typeof value === 'string' ? value : ''
}

function RouteComponent() {
  const register = useServerFn(signUp)
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (evt: React.SubmitEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setError(null)
    setPending(true)

    const form = new FormData(evt.target)

    const payload = {
      email: field(form, 'email'),
      password: field(form, 'password'),
      username: field(form, 'username'),
    }

    // Same schema runs again on the server, where it is the trust boundary.
    // Checking here first turns its messages into form feedback instead of a
    // rejected promise.
    const issue = firstIssue(SignUpSchema, payload)

    if (issue) {
      setPending(false)
      setError(issue)
      return
    }

    const result = await register({ data: payload })

    setPending(false)

    if (result.error) setError(result.error)
    else navigate({ to: '/' })
  }

  return (
    <main className="h-dvh">
      <div className="flex items-center h-full justify-center">
        <div className="flex flex-col gap-4 max-w-sm w-full">
          <div className="w-fit mx-auto px-4 py-0.5 border -skew-x-6 text-center">
            <h1 className="uppercase text-2xl leading-snug font-medium skew-x-6">
              Register
            </h1>
          </div>

          <Card>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" name="email" />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="username">Username</Label>
                  <Input type="text" id="username" name="username" />
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
                  {pending ? 'Registering...' : 'Register'}
                </Button>
              </form>
            </CardContent>

            <CardFooter>
              <span>
                Already a member? Login{' '}
                <Link
                  to="/login"
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
