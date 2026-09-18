export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  pinned: boolean
  createdAt: number
  updatedAt: number
  deletedAt?: number
}

export type TagFilter = string | 'all' | 'pinned'

export const TAG_COLORS: Record<string, string> = {
  work: '#3b82f6',
  personal: '#10b981',
  ideas: '#f59e0b',
  urgent: '#ef4444',
}

export const DEFAULT_TAG_COLOR = '#6b7280'

export function getTagColor(tag: string): string {
  return TAG_COLORS[tag.toLowerCase()] ?? DEFAULT_TAG_COLOR
}
