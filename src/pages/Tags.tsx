import { ChevronRight, Tag } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotesStore } from '../store/useNotesStore'
import { getTagColor } from '../types'
import { deriveTags } from '../utils/notes'

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
        <Tag className="h-8 w-8 text-[#999]" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#1a1a1a] dark:text-white">No tags yet</h3>
      <p className="mt-1 max-w-xs text-sm text-[#6b6b6b]">
        Add tags to your notes to organize them.
      </p>
    </div>
  )
}

export default function Tags() {
  const notes = useNotesStore((s) => s.notes)
  const navigate = useNavigate()

  const tags = useMemo(() => deriveTags(notes), [notes])

  const pinnedCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const note of notes) {
      if (note.pinned) {
        for (const tag of note.tags) {
          counts[tag] = (counts[tag] ?? 0) + 1
        }
      }
    }
    return counts
  }, [notes])

  const tagPreviews = useMemo(() => {
    const previews: Record<string, string[]> = {}
    for (const note of notes) {
      for (const tag of note.tags) {
        if (!previews[tag]) previews[tag] = []
        if (previews[tag].length < 3 && note.title) {
          previews[tag].push(note.title)
        }
      }
    }
    return previews
  }, [notes])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">Tags</h1>
        <p className="mt-0.5 text-sm text-[#6b6b6b]">
          {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
        </p>
      </div>

      {tags.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {tags.map(({ tag, count }) => {
            const color = getTagColor(tag)
            const pinnedCount = pinnedCounts[tag] ?? 0
            const previews = tagPreviews[tag] ?? []

            return (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/tags/${encodeURIComponent(tag)}`)}
                className="group flex w-full cursor-pointer items-center gap-4 rounded-xl border border-[#e5e5e5] bg-white p-4 text-left transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1a1a1a] dark:hover:border-gray-600 dark:hover:bg-gray-800/60"
              >
                <div
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-[#1a1a1a] dark:text-white">
                      {tag}
                    </h3>
                    {pinnedCount > 0 && (
                      <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                        {pinnedCount} pinned
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-[#6b6b6b]">
                    {count} {count === 1 ? 'note' : 'notes'}
                  </p>
                  {previews.length > 0 && (
                    <div className="mt-2 space-y-0.5">
                      {previews.map((title, i) => (
                        <p key={i} className="truncate text-xs text-[#999]">
                          {title}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#999] transition-transform group-hover:translate-x-0.5" />
              </button>
            )
          })}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
