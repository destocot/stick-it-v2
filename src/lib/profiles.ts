import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'
import { FindOneProfileSchema } from './schemas'

export const findOneProfileByUsername = createServerFn({
  method: 'GET',
})
  .validator(FindOneProfileSchema)
  .handler(async ({ data }) => {
    const supabase = createClient()

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', data.username)
      .maybeSingle()

    if (error) throw new Error(error.message)

    return profile
  })
