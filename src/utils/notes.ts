import type { Note } from '../types'

export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~\-=`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function excerpt(note: Note, maxLength = 140): string {
  if (note.title) {
    const body = stripMarkdown(note.content)
    if (body.length > maxLength) return `${body.slice(0, maxLength)}…`
    return body
  }
  return stripMarkdown(note.content) || 'Untitled'
}

export function deriveTags(notes: Note[]): { tag: string; count: number }[] {
  if (!Array.isArray(notes)) return []
  const counts = new Map<string, number>()
  for (const note of notes) {
    for (const tag of note.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag))
}

export function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function filterNotes(
  notes: Note[],
  searchQuery: string,
  tagFilter: string,
  pinnedOnly = false,
): Note[] {
  if (!Array.isArray(notes)) return []
  const q = searchQuery.trim().toLowerCase()
  return [...notes]
    .filter((n) => {
      if (pinnedOnly && !n.pinned) return false
      if (tagFilter !== 'all') {
        if (tagFilter === 'pinned') {
          if (!n.pinned) return false
        } else if (!n.tags.includes(tagFilter)) return false
      }
      if (q) {
        const haystack = `${n.title} ${n.content} ${n.tags.join(' ')}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt)
}