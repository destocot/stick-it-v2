import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'
import { SignInSchema, SignUpSchema } from '@/lib/schemas'

export interface AuthResult {
  error: string | null
}

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

export const signIn = createServerFn({ method: 'POST' })
  .validator(SignInSchema)
  .handler(async ({ data }): Promise<AuthResult> => {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) return { error: error.message }

    return { error: null }
  })

export const signOut = createServerFn({ method: 'POST' }).handler(
  async (): Promise<AuthResult> => {
    const supabase = createClient()

    const { error } = await supabase.auth.signOut({ scope: 'local' })

    if (error) return { error: error.message }

    return { error: null }
  },
)

export interface CurrentUser {
  id: string
  email: string | null
  username: string | null
}

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<CurrentUser | null> => {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getClaims()

    if (error || !data) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', data.claims.sub)
      .maybeSingle()

    return {
      id: data.claims.sub,
      email: data.claims.email ?? null,
      username: profile?.username ?? null,
    }
  },
)
