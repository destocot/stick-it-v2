import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className=" h-dvh">
      <div className="flex items-center h-full justify-center">
        <div className="flex flex-col gap-4 max-w-sm w-full">
          <div className="w-fit mx-auto px-4 py-0.5 border -skew-x-6 text-center">
            <h1 className="uppercase text-2xl leading-snug font-medium skew-x-6">
              Register
            </h1>
          </div>

          <Card>
            <CardContent>
              <form className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="username">Username</Label>
                  <Input type="text" />
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="label" htmlFor="password">
                    Password
                  </Label>
                  <Input type="password" />
                </div>

                <Button
                  type="submit"
                  className="hover:text-primary hover:bg-primary-foreground hover:border-border"
                >
                  Register
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
