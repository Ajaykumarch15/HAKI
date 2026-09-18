import { ArrowLeft, Tag } from 'lucide-react'
import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useNotesStore } from '../store/useNotesStore'
import { NoteCard } from '../components/NoteCard'
import { SearchBar } from '../components/SearchBar'
import { getTagColor } from '../types'
import { filterNotes } from '../utils/notes'

function NoteGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
        <Tag className="h-8 w-8 text-[#999]" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#1a1a1a] dark:text-white">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-[#6b6b6b]">{description}</p>
    </div>
  )
}

export default function TagNotes() {
  const { tagName } = useParams<{ tagName: string }>()
  const notes = useNotesStore((s) => s.notes)
  const searchQuery = useNotesStore((s) => s.searchQuery)
  const activeNoteId = useNotesStore((s) => s.activeNoteId)
  const openNote = useNotesStore((s) => s.openNote)

  const decodedTag = decodeURIComponent(tagName ?? '')
  const color = getTagColor(decodedTag)

  const filteredNotes = useMemo(
    () => filterNotes(notes, searchQuery, decodedTag),
    [notes, searchQuery, decodedTag],
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/app/tags"
          className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#6b6b6b] transition-colors hover:bg-gray-100 hover:text-[#1a1a1a] dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">
            {decodedTag}
          </h1>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-[#6b6b6b] dark:bg-gray-800 dark:text-gray-400">
            {filteredNotes.length}
          </span>
        </div>
      </div>

      <div className="mb-4">
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
          title="No notes with this tag"
          description="Add this tag to notes to see them here."
        />
      )}
    </div>
  )
}
