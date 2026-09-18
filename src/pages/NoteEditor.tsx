import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pin, Trash2 } from 'lucide-react'
import { useNotesStore } from '../store/useNotesStore'
import { Editor } from '../components/Editor'
import { NoteCard } from '../components/NoteCard'
import { filterNotes } from '../utils/notes'
import { useMemo } from 'react'

export default function NoteEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const notes = useNotesStore((s) => s.notes)
  const activeNoteId = useNotesStore((s) => s.activeNoteId)
  const searchQuery = useNotesStore((s) => s.searchQuery)
  const createNote = useNotesStore((s) => s.createNote)
  const trashNote = useNotesStore((s) => s.trashNote)

  const isNew = id === 'new'

  const filtered = useMemo(
    () => filterNotes(notes, searchQuery, 'all'),
    [notes, searchQuery],
  )

  const activeNote = useMemo(() => {
    if (isNew) return null
    return notes.find((n) => n.id === (id ?? activeNoteId)) ?? null
  }, [notes, id, activeNoteId, isNew])

  const handleSelect = (noteId: string) => {
    navigate(`/app/note/${noteId}`)
  }

  const handleBack = () => {
    navigate('/app')
  }

  const handleDelete = () => {
    if (activeNote && window.confirm('Delete this note?')) {
      trashNote(activeNote.id)
      navigate('/app')
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] -mx-6 -my-8 lg:-mx-10 lg:-my-8">
      {/* Note List Panel */}
      <div className="w-[340px] shrink-0 border-r border-[#e5e5e5] bg-white flex flex-col">
        <div className="p-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-[#f5f5f5] px-3.5 py-2.5">
            <svg className="h-4 w-4 text-[#999] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => useNotesStore.getState().setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#1a1a1a] placeholder-[#999] outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {filtered.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
              <p className="text-sm text-[#999]">No notes yet</p>
              <button
                type="button"
                onClick={() => { createNote(); navigate('/app/note/new') }}
                className="rounded-xl bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-white hover:opacity-85"
              >
                Create note
              </button>
            </div>
          ) : (
            filtered.map((note) => (
              <div key={note.id} className="mb-1">
                <NoteCard
                  note={note}
                  active={note.id === (id ?? activeNoteId)}
                  onClick={() => handleSelect(note.id)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor Panel */}
      <div className="flex-1 flex flex-col bg-[#f5f5f5] overflow-hidden">
        {activeNote ? (
          <>
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between border-b border-[#e5e5e5] bg-white px-5 py-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5e5e5] bg-white text-[#6b6b6b] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors lg:hidden"
                >
                  <ArrowLeft className="h-[18px] w-[18px]" />
                </button>
                <span className="text-sm text-[#999]">Editing note</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => useNotesStore.getState().togglePin(activeNote.id)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                    activeNote.pinned
                      ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                      : 'border-[#e5e5e5] bg-white text-[#6b6b6b] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
                  }`}
                >
                  <Pin className="h-4 w-4" />
                  Pin
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 rounded-xl border border-[#ef4444] bg-[rgba(239,68,68,0.08)] px-3 py-2 text-sm font-medium text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto p-10">
              <div className="mx-auto max-w-[700px]">
                <Editor key={activeNote.id} note={activeNote} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5f5f5]">
              <svg className="h-8 w-8 text-[#999]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1a1a1a]">Select a note</h2>
              <p className="mt-1 max-w-xs text-sm text-[#999]">
                Pick a note from the list or create a new one to start writing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => { createNote(); navigate('/app/note/new') }}
              className="rounded-xl bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-white hover:opacity-85"
            >
              New note
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
