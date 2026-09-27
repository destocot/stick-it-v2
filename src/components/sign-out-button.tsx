import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useActionState } from 'react'
import { toast } from 'sonner'

export function SignOutButton() {
  const logout = useServerFn(signOut)
  const navigate = useNavigate()
  const router = useRouter()

  const [, submit, pending] = useActionState(async () => {
    const result = await logout()

    if (result.error) {
      toast.error(result.error)
      return null
    }

    await router.invalidate()

    navigate({ to: '/' })

    return null
  }, null)

  return (
    <form action={submit}>
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        {pending ? 'Signing out...' : 'Sign out'}
      </Button>
    </form>
  )
}
