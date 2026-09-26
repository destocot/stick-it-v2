import { createServerClient } from '@supabase/ssr'
import {
  getCookies,
  setCookie,
  setResponseHeader,
} from '@tanstack/react-start/server'
import type { Database } from './database.types'

export function createClient() {
  return createServerClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return Object.entries(getCookies()).map(([name, value]) => ({
            name,
            value,
          }))
        },
        setAll(cookies, headers) {
          cookies.forEach(({ name, value, options }) => {
            setCookie(name, value, options)
          })

          Object.entries(headers).forEach(([name, value]) => {
            setResponseHeader(name, value)
          })
        },
      },
    },
  )
}
