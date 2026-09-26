import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'

export type AuthResult = { error: string | null }

export const signUp = createServerFn({ method: 'POST' })
  .validator(
    (data: { email: string; password: string; username: string }) => data,
  )
  .handler(async ({ data }): Promise<AuthResult> => {
    const username = data.username.trim()

    // NOT NULL on profiles.username does not reject an empty string, and the
    // signup trigger writes whatever lands in user metadata.
    if (!username) return { error: 'Username is required' }

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { username } },
    })

    if (error) return { error: error.message }

    return { error: null }
  })
