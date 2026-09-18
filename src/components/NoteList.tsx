import { FilePlus2, Filter, Menu, SearchX } from 'lucide-react'
import { useMemo } from 'react'
import { useNotesStore } from '../store/useNotesStore'
import { filterNotes } from '../utils/notes'
import { NoteCard } from './NoteCard'
import { SearchBar } from './SearchBar'

interface NoteListProps {
  onSelect: (id: string) => void
}

export function NoteList({ onSelect }: NoteListProps) {
  const notes = useNotesStore((s) => s.notes)
  const activeNoteId = useNotesStore((s) => s.activeNoteId)
  const searchQuery = useNotesStore((s) => s.searchQuery)
  const tagFilter = useNotesStore((s) => s.tagFilter)
  const setSidebarOpen = useNotesStore((s) => s.setSidebarOpen)
  const createNote = useNotesStore((s) => s.createNote)

  const filtered = useMemo(
    () => filterNotes(notes, searchQuery, tagFilter),
    [notes, searchQuery, tagFilter],
  )

  const pinnedCount = useMemo(() => filterNotes(notes, '', 'pinned').length, [notes])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-gray-200 px-3 pb-3 pt-3 dark:border-gray-800 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          title="Open menu"
          className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-base font-semibold text-gray-800 dark:text-gray-100">
          {tagFilter === 'all'
            ? 'All notes'
            : tagFilter === 'pinned'
              ? 'Pinned'
              : `#${tagFilter}`}
        </h1>
      </div>

      <div className="px-3 pb-2 pt-2 lg:pt-4">
        <SearchBar />
      </div>

      <div className="flex items-center justify-between px-3 pb-1 pt-1">
        <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
          <Filter className="h-3.5 w-3.5" />
          {searchQuery ? 'Search results' : 'Notes'}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {filtered.length} of {notes.length}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {filtered.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            {notes.length === 0 ? (
              <>
                <FilePlus2 className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  No notes yet.
                </p>
                <button
                  type="button"
                  onClick={createNote}
                  className="cursor-pointer rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
                >
                  Create your first note
                </button>
              </>
            ) : (
              <>
                <SearchX className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  No notes match your search.
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Try a different keyword or clear the search.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {filtered.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                active={note.id === activeNoteId}
                onClick={() => onSelect(note.id)}
              />
            ))}
          </div>
        )}
      </div>

      {pinnedCount > 0 && (
        <p className="shrink-0 border-t border-gray-200 px-4 py-3 text-center text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500">
          {pinnedCount} pinned note{pinnedCount === 1 ? '' : 's'}
        </p>
      )}
    </div>
  )
}