import { Info, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNotesStore } from '../store/useNotesStore'
import { excerpt, relativeTime } from '../utils/notes'

function ContextMenu({
  x,
  y,
  onClose,
  onRestore,
  onDeleteForever,
}: {
  x: number
  y: number
  onClose: () => void
  onRestore: () => void
  onDeleteForever: () => void
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose() }} />
      <div
        className="fixed z-50 min-w-[160px] rounded-xl border border-[#e5e5e5] bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-[#1a1a1a]"
        style={{ top: y, left: x }}
      >
        <button
          type="button"
          onClick={() => { onRestore(); onClose() }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <RotateCcw className="h-4 w-4" />
          Restore
        </button>
        <button
          type="button"
          onClick={() => { onDeleteForever(); onClose() }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
          Delete forever
        </button>
      </div>
    </>
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

function TrashNoteCard({
  note,
  onContextMenu,
  onMoreClick,
}: {
  note: ReturnType<typeof useNotesStore.getState>['trash'][0]
  onContextMenu: (e: React.MouseEvent, noteId: string) => void
  onMoreClick: (e: React.MouseEvent, noteId: string) => void
}) {
  return (
    <div
      className="group relative block w-full cursor-default rounded-xl border border-[#e5e5e5] bg-white p-3 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1a1a1a] dark:hover:border-gray-600 dark:hover:bg-gray-800/60"
      onContextMenu={(e) => onContextMenu(e, note.id)}
    >
      <div className="flex items-start gap-2">
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-[#1a1a1a] dark:text-white">
          {note.title || 'Untitled'}
        </h3>
        <button
          type="button"
          onClick={(e) => onMoreClick(e, note.id)}
          className="shrink-0 cursor-pointer rounded p-1 text-[#999] opacity-0 transition-opacity hover:bg-gray-100 hover:text-[#6b6b6b] group-hover:opacity-100 dark:hover:bg-gray-800"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
            <circle cx="8" cy="3" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="8" cy="13" r="1.5" />
          </svg>
        </button>
      </div>

      {note.content && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#6b6b6b]">
          {excerpt(note)}
        </p>
      )}

      <div className="mt-2 flex items-center gap-2">
        {note.tags.length > 0 && (
          <div className="flex min-w-0 items-center gap-1 overflow-hidden">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="truncate rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-[#6b6b6b] dark:bg-gray-800 dark:text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <span className="ml-auto shrink-0 text-[11px] text-[#999]">
          {relativeTime(note.updatedAt)}
        </span>
      </div>
    </div>
  )
}

export default function Trash() {
  const trash = useNotesStore((s) => s.trash)
  const restoreNote = useNotesStore((s) => s.restoreNote)
  const permanentDelete = useNotesStore((s) => s.permanentDelete)
  const emptyTrash = useNotesStore((s) => s.emptyTrash)

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; noteId: string } | null>(null)

  const handleContextMenu = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, noteId })
  }

  const handleMoreClick = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY, noteId })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">Trash</h1>
        {trash.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Permanently delete all notes in trash?')) {
                emptyTrash()
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white dark:border-red-500/40 dark:hover:bg-red-500"
          >
            <Trash2 className="h-4 w-4" />
            Empty Trash
          </button>
        )}
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        <Info className="h-4 w-4 shrink-0" />
        Notes in trash will be permanently deleted after 30 days.
      </div>

      {trash.length > 0 ? (
        <NoteGrid>
          {trash.map((note) => (
            <TrashNoteCard
              key={note.id}
              note={note}
              onContextMenu={handleContextMenu}
              onMoreClick={handleMoreClick}
            />
          ))}
        </NoteGrid>
      ) : (
        <EmptyState
          icon={Trash2}
          title="Trash is empty"
          description="Deleted notes will appear here."
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onRestore={() => restoreNote(contextMenu.noteId)}
          onDeleteForever={() => {
            if (window.confirm('Permanently delete this note?')) {
              permanentDelete(contextMenu.noteId)
            }
          }}
        />
      )}
    </div>
  )
}
