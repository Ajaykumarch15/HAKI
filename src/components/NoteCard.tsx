import { Star, MoreHorizontal } from 'lucide-react'
import type { Note } from '../types'
import { excerpt, relativeTime } from '../utils/notes'
import { getTagColor } from '../types'

interface NoteCardProps {
  note: Note
  active: boolean
  onClick: () => void
}

export function NoteCard({ note, active, onClick }: NoteCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group block w-full cursor-pointer rounded-2xl border p-5 text-left transition-all duration-200 ${
        active
          ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white shadow-lg'
          : 'border-[#e5e5e5] bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 hover:border-transparent'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        {note.tags.length > 0 ? (
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
            style={{
              background: active ? 'rgba(255,255,255,0.15)' : `${getTagColor(note.tags[0])}15`,
              color: active ? 'rgba(255,255,255,0.8)' : getTagColor(note.tags[0]),
            }}
          >
            {note.tags[0]}
          </span>
        ) : (
          <span />
        )}
        {note.pinned && (
          <Star className={`h-4 w-4 fill-amber-400 text-amber-400 ${active ? 'text-amber-300' : ''}`} />
        )}
      </div>

      <h3 className={`text-base font-semibold mb-2 leading-snug ${active ? 'text-white' : 'text-[#1a1a1a]'}`}>
        {note.title || 'Untitled'}
      </h3>

      {note.content && (
        <p className={`text-[13px] leading-relaxed line-clamp-4 flex-1 ${active ? 'text-white/70' : 'text-[#6b6b6b]'}`}>
          {excerpt(note)}
        </p>
      )}

      <div className={`mt-4 flex items-center justify-between pt-3 border-t ${active ? 'border-white/10' : 'border-[#e5e5e5]'}`}>
        <span className={`text-[11px] ${active ? 'text-white/60' : 'text-[#999]'}`}>
          {relativeTime(note.updatedAt)}
        </span>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className={`rounded-lg p-1 transition-colors ${
            active
              ? 'text-white/60 hover:bg-white/10 hover:text-white'
              : 'text-[#999] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]'
          }`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </button>
  )
}
