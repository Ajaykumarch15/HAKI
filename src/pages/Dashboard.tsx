import { FileText } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNotesStore } from '../store/useNotesStore'
import { NoteCard } from '../components/NoteCard'
import { SearchBar } from '../components/SearchBar'
import { filterNotes } from '../utils/notes'

function StatsRow({ notes }: { notes: ReturnType<typeof useNotesStore.getState>['notes'] }) {
  const total = notes.length
  const pinned = notes.filter((n) => n.pinned).length
  const [weekAgo] = useState(() => Date.now() - 7 * 24 * 60 * 60 * 1000)
  const thisWeek = notes.filter((n) => n.updatedAt > weekAgo).length

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-xl bg-white p-4 text-center dark:bg-[#1a1a1a]">
        <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{total}</p>
        <p className="mt-0.5 text-xs text-[#6b6b6b]">Total Notes</p>
      </div>
      <div className="rounded-xl bg-white p-4 text-center dark:bg-[#1a1a1a]">
        <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{pinned}</p>
        <p className="mt-0.5 text-xs text-[#6b6b6b]">Pinned</p>
      </div>
      <div className="rounded-xl bg-white p-4 text-center dark:bg-[#1a1a1a]">
        <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{thisWeek}</p>
        <p className="mt-0.5 text-xs text-[#6b6b6b]">This Week</p>
      </div>
    </div>
  )
}

function NoteGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}

function EmptyState({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
        <Icon className="h-8 w-8 text-[#999]" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#1a1a1a] dark:text-white">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-[#6b6b6b]">{description}</p>
    </div>
  )
}

export default function Dashboard() {
  const notes = useNotesStore((s) => s.notes)
  const searchQuery = useNotesStore((s) => s.searchQuery)
  const activeNoteId = useNotesStore((s) => s.activeNoteId)
  const openNote = useNotesStore((s) => s.openNote)

  const filteredNotes = useMemo(
    () => filterNotes(notes, searchQuery, 'all'),
    [notes, searchQuery],
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">My Notes</h1>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5e5e5] bg-white px-3 py-1.5 text-sm text-[#6b6b6b] transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-300 dark:hover:bg-gray-800"
        >
          This week
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <StatsRow notes={notes} />

      <div className="my-4">
        <SearchBar />
      </div>

      {filteredNotes.length > 0 ? (
        <NoteGrid>
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              active={note.id === activeNoteId}
              onClick={() => openNote(note.id)}
            />
          ))}
        </NoteGrid>
      ) : (
        <EmptyState
          icon={FileText}
          title={searchQuery ? 'No notes found' : 'No notes yet'}
          description={searchQuery ? 'Try a different search term.' : 'Create your first note to get started.'}
        />
      )}
    </div>
  )
}
