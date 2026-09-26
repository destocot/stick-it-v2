import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'
import { SignUpSchema } from '@/lib/schemas'

export type AuthResult = { error: string | null }

export const signUp = createServerFn({ method: 'POST' })
  .validator(SignUpSchema)
  .handler(async ({ data }): Promise<AuthResult> => {
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { username: data.username } },
    })

    if (error) return { error: error.message }

    return { error: null }
  })
