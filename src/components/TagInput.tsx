import { Hash, Plus, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useNotesStore } from '../store/useNotesStore'
import type { Note } from '../types'
import { deriveTags } from '../utils/notes'
import { getTagColor } from '../types'

interface TagInputProps {
  note: Note
}

export function TagInput({ note }: TagInputProps) {
  const updateNote = useNotesStore((s) => s.updateNote)
  const notes = useNotesStore((s) => s.notes)
  const [value, setValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions = useMemo(() => {
    const existing = deriveTags(notes)
      .map((t) => t.tag)
      .filter((t) => !note.tags.includes(t))
    const q = value.trim().toLowerCase()
    return q
      ? existing.filter((t) => t.toLowerCase().includes(q))
      : existing
  }, [notes, note.tags, value])

  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/^#/, '').replace(/\s+/g, '-').toLowerCase()
    if (!tag) return
    if (note.tags.includes(tag)) {
      setValue('')
      return
    }
    updateNote(note.id, { tags: [...note.tags, tag] })
    setValue('')
    setShowSuggestions(false)
  }

  const removeTag = (tag: string) => {
    updateNote(note.id, { tags: note.tags.filter((t) => t !== tag) })
  }

  const commit = (next: string) => {
    const tags = next
      .split(/[,\n]/)
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean)
    for (const t of tags) addTag(t)
    setValue('')
    setShowSuggestions(false)
  }

  return (
    <div className="relative flex flex-wrap items-center gap-2">
      {note.tags.map((tag) => {
        const color = getTagColor(tag)
        return (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ background: `${color}15`, color }}
          >
            <Hash className="h-3 w-3" />
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="cursor-pointer rounded-full p-0.5 transition-colors hover:bg-black/10"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )
      })}

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setShowSuggestions(true)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            commit(value)
          }
          if (e.key === 'Backspace' && !value && note.tags.length > 0) {
            removeTag(note.tags[note.tags.length - 1])
          }
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder={note.tags.length ? 'Add tag...' : '# add tags'}
        className="w-32 bg-transparent px-1 py-0.5 text-xs text-[#1a1a1a] placeholder-[#999] outline-none"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 mt-10 max-h-40 w-56 overflow-y-auto rounded-xl border border-[#e5e5e5] bg-white p-1.5 shadow-lg">
          {suggestions.slice(0, 8).map((tag) => {
            const color = getTagColor(tag)
            return (
              <button
                key={tag}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  addTag(tag)
                  inputRef.current?.focus()
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-[#6b6b6b] hover:bg-[#f5f5f5]"
              >
                <Plus className="h-3 w-3 text-[#999]" />
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                {tag}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
