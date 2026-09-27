import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'

export const findAllNotes = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('notes')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return data
  },
)
