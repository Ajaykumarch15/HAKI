import type { ReactNode } from 'react'

interface NoteGridProps {
  children: ReactNode
}

export default function NoteGrid({ children }: NoteGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  )
}
