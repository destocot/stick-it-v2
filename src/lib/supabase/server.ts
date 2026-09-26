import { createServerClient } from '@supabase/ssr'
import {
  getCookies,
  setCookie,
  setResponseHeader,
} from '@tanstack/react-start/server'
import type { CookieMethodsServer } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/database.types'

// Stateless: the per-request state lives in getCookies()/setCookie(), which read
// the ambient request. Typing this explicitly pins createServerClient to its
// getAll/setAll overload; the get/set/remove one is deprecated.
const cookies: CookieMethodsServer = {
  getAll() {
    return Object.entries(getCookies()).map(([name, value]) => ({
      name,
      value,
    }))
  },
  setAll(cookiesToSet, headers) {
    cookiesToSet.forEach(({ name, value, options }) => {
      setCookie(name, value, options)
    })

    Object.entries(headers).forEach(([name, value]) => {
      setResponseHeader(name, value)
    })
  },
}

export function createClient() {
  return createServerClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    { cookies },
  )
}
