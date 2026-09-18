import { Star } from 'lucide-react'
import { useMemo } from 'react'
import { useNotesStore } from '../store/useNotesStore'
import { NoteCard } from '../components/NoteCard'
import { SearchBar } from '../components/SearchBar'
import { filterNotes } from '../utils/notes'

function StatsRow({ notes }: { notes: ReturnType<typeof useNotesStore.getState>['notes'] }) {
  const pinned = notes.filter((n) => n.pinned).length
  const total = notes.length

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-white p-4 text-center dark:bg-[#1a1a1a]">
        <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{pinned}</p>
        <p className="mt-0.5 text-xs text-[#6b6b6b]">Favorites</p>
      </div>
      <div className="rounded-xl bg-white p-4 text-center dark:bg-[#1a1a1a]">
        <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{total}</p>
        <p className="mt-0.5 text-xs text-[#6b6b6b]">Total Notes</p>
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

export default function Favorites() {
  const notes = useNotesStore((s) => s.notes)
  const searchQuery = useNotesStore((s) => s.searchQuery)
  const activeNoteId = useNotesStore((s) => s.activeNoteId)
  const openNote = useNotesStore((s) => s.openNote)

  const favoriteNotes = useMemo(
    () => filterNotes(notes, searchQuery, 'pinned', true),
    [notes, searchQuery],
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">Favorites</h1>
      </div>

      <StatsRow notes={notes} />

      <div className="my-4">
        <SearchBar />
      </div>

      {favoriteNotes.length > 0 ? (
        <NoteGrid>
          {favoriteNotes.map((note) => (
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
          icon={Star}
          title="No favorites yet"
          description="Pin notes you love to see them here."
        />
      )}
    </div>
  )
}
