import { useEffect, useState } from 'react'
import { useNotesStore } from '../store/useNotesStore'
import { supabase } from '../lib/supabase'

export function InitAuth({ children }: { children: React.ReactNode }) {
  const setUser = useNotesStore((s) => s.setUser)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
      }
      setReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        <div className="text-sm text-[#999]">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}
