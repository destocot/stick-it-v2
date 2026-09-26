import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'

export type AuthResult = { error: string | null }

export const signUp = createServerFn({ method: 'POST' })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }): Promise<AuthResult> => {
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (error) return { error: error.message }

    return { error: null }
  })
