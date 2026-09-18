import { create } from 'zustand'
import type { Note, TagFilter } from '../types'
import type { AuthUser } from '../services/auth'
import * as notesService from '../services/notesService'

type NotePatch = Partial<Pick<Note, 'title' | 'content' | 'tags' | 'pinned' | 'deletedAt' | 'updatedAt'>> & { deletedAt?: number }

const THEME_KEY = 'notes-app:theme'
const CACHE_NOTES_KEY = 'notes-app:notes'
const CACHE_TRASH_KEY = 'notes-app:trash'
const CACHE_ACTIVE_KEY = 'notes-app:activeNote'

export function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* ignore */ }
}

function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-')
}

function cacheNotes(notes: Note[]) {
  saveJSON(CACHE_NOTES_KEY, notes)
}

function cacheTrash(trash: Note[]) {
  saveJSON(CACHE_TRASH_KEY, trash)
}

function readCachedNotes(): Note[] {
  const data = loadJSON<unknown>(CACHE_NOTES_KEY, null)
  if (Array.isArray(data)) return data
  return []
}

function readCachedTrash(): Note[] {
  const data = loadJSON<unknown>(CACHE_TRASH_KEY, [])
  if (Array.isArray(data)) return data
  return []
}

interface NotesState {
  user: AuthUser | null
  notes: Note[]
  trash: Note[]
  activeNoteId: string | null
  searchQuery: string
  tagFilter: TagFilter
  sidebarOpen: boolean
  loading: boolean

  setUser: (user: AuthUser | null) => void
  loadFromSupabase: () => Promise<void>
  setSidebarOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setTagFilter: (filter: TagFilter) => void
  openNote: (id: string) => void
  createNote: () => Promise<void>
  updateNote: (id: string, patch: NotePatch) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  trashNote: (id: string) => Promise<void>
  restoreNote: (id: string) => Promise<void>
  permanentDelete: (id: string) => Promise<void>
  emptyTrash: () => Promise<void>
  togglePin: (id: string) => Promise<void>
  deleteTag: (tag: string) => Promise<void>
  renameTag: (oldTag: string, newName: string) => Promise<void>
}

export const useNotesStore = create<NotesState>()((set, get) => ({
  user: null,
  notes: readCachedNotes(),
  trash: readCachedTrash(),
  activeNoteId: loadJSON<string | null>(CACHE_ACTIVE_KEY, null),
  searchQuery: '',
  tagFilter: 'all',
  sidebarOpen: false,
  loading: false,

  setUser: (user) => {
    set({ user, notes: [], trash: [], activeNoteId: null })
    if (user) {
      get().loadFromSupabase()
    }
  },

  loadFromSupabase: async () => {
    const { user } = get()
    if (!user) return
    set({ loading: true })
    try {
      const [notes, trash] = await Promise.all([
        notesService.fetchNotes(user.id),
        notesService.fetchTrash(user.id),
      ])
      cacheNotes(notes)
      cacheTrash(trash)
      const activeNoteId = notes.length > 0 ? notes[0].id : null
      saveJSON(CACHE_ACTIVE_KEY, activeNoteId)
      set({ notes, trash, activeNoteId, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setTagFilter: (filter) => set({ tagFilter: filter, sidebarOpen: false }),

  openNote: (id) => {
    set({ activeNoteId: id, sidebarOpen: false })
    saveJSON(CACHE_ACTIVE_KEY, id)
  },

  createNote: async () => {
    const { user } = get()
    const now = Date.now()
    const note: Note = {
      id: createId(),
      title: '',
      content: '',
      tags: [],
      pinned: false,
      createdAt: now,
      updatedAt: now,
    }
    set((s) => ({
      notes: [note, ...s.notes],
      activeNoteId: note.id,
      tagFilter: 'all',
      sidebarOpen: false,
    }))
    cacheNotes(get().notes)
    if (user) {
      try {
        await notesService.createNote(user.id, note)
      } catch {
        set((s) => ({ notes: s.notes.filter((n) => n.id !== note.id) }))
        cacheNotes(get().notes)
      }
    }
  },

  updateNote: async (id, patch) => {
    const { user } = get()
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n,
      ),
    }))
    cacheNotes(get().notes)
    if (user) {
      try {
        await notesService.updateNote(user.id, id, patch)
      } catch {
        await get().loadFromSupabase()
      }
    }
  },

  deleteNote: async (id) => {
    const { user } = get()
    set((s) => {
      const notes = s.notes.filter((n) => n.id !== id)
      return {
        notes,
        activeNoteId:
          s.activeNoteId === id
            ? notes.length > 0 ? notes[0].id : null
            : s.activeNoteId,
      }
    })
    cacheNotes(get().notes)
    if (user) {
      try {
        await notesService.permanentDelete(user.id, id)
      } catch {
        await get().loadFromSupabase()
      }
    }
  },

  trashNote: async (id) => {
    const { user } = get()
    const note = get().notes.find((n) => n.id === id)
    if (!note) return
    const deletedNote = { ...note, deletedAt: Date.now() }
    set((s) => ({
      notes: s.notes.filter((n) => n.id !== id),
      trash: [deletedNote, ...s.trash],
      activeNoteId:
        s.activeNoteId === id
          ? s.notes.filter((n) => n.id !== id).length > 0
            ? s.notes.filter((n) => n.id !== id)[0].id
            : null
          : s.activeNoteId,
    }))
    cacheNotes(get().notes)
    cacheTrash(get().trash)
    if (user) {
      try {
        await notesService.trashNote(user.id, id)
      } catch {
        await get().loadFromSupabase()
      }
    }
  },

  restoreNote: async (id) => {
    const { user } = get()
    const note = get().trash.find((n) => n.id === id)
    if (!note) return
    const { deletedAt: _, ...restored } = note
    set((s) => ({
      trash: s.trash.filter((n) => n.id !== id),
      notes: [restored, ...s.notes],
    }))
    cacheNotes(get().notes)
    cacheTrash(get().trash)
    if (user) {
      try {
        await notesService.restoreNote(user.id, id)
      } catch {
        await get().loadFromSupabase()
      }
    }
  },

  permanentDelete: async (id) => {
    const { user } = get()
    set((s) => ({
      trash: s.trash.filter((n) => n.id !== id),
    }))
    cacheTrash(get().trash)
    if (user) {
      try {
        await notesService.permanentDelete(user.id, id)
      } catch {
        await get().loadFromSupabase()
      }
    }
  },

  emptyTrash: async () => {
    const { user } = get()
    set({ trash: [] })
    cacheTrash([])
    if (user) {
      try {
        await notesService.emptyTrash(user.id)
      } catch {
        await get().loadFromSupabase()
      }
    }
  },

  togglePin: async (id) => {
    const { user } = get()
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned } : n,
      ),
    }))
    cacheNotes(get().notes)
    if (user) {
      const note = get().notes.find((n) => n.id === id)
      if (note) {
        try {
          await notesService.updateNote(user.id, id, { pinned: note.pinned })
        } catch {
          await get().loadFromSupabase()
        }
      }
    }
  },

  deleteTag: async (tag) => {
    const { user } = get()
    const reminder = get().tagFilter === tag ? 'all' : get().tagFilter
    set((s) => ({
      notes: s.notes.map((n) =>
        n.tags.includes(tag)
          ? { ...n, tags: n.tags.filter((t) => t !== tag) }
          : n,
      ),
      tagFilter: reminder,
    }))
    cacheNotes(get().notes)
    if (user) {
      const affected = get().notes.filter((n) => n.tags.includes(tag))
      for (const note of affected) {
        try {
          await notesService.updateNote(user.id, note.id, { tags: note.tags })
        } catch { /* continue */ }
      }
    }
  },

  renameTag: async (oldTag, newName) => {
    const clean = slugify(newName)
    if (!clean || clean === slugify(oldTag)) return
    const { user } = get()
    const reminder = get().tagFilter === oldTag ? clean : get().tagFilter
    set((s) => ({
      notes: s.notes.map((n) =>
        n.tags.includes(oldTag)
          ? { ...n, tags: [...new Set(n.tags.map((t) => (t === oldTag ? clean : t)))] }
          : n,
      ),
      tagFilter: reminder,
    }))
    cacheNotes(get().notes)
    if (user) {
      const affected = get().notes.filter((n) => n.tags.includes(clean) || n.tags.includes(oldTag))
      for (const note of affected) {
        try {
          await notesService.updateNote(user.id, note.id, { tags: note.tags })
        } catch { /* continue */ }
      }
    }
  },
}))

export function syncActiveNote(id: string | null) {
  if (id) {
    saveJSON(CACHE_ACTIVE_KEY, id)
  } else {
    localStorage.removeItem(CACHE_ACTIVE_KEY)
  }
}

export function exportNotesAsJson(): string {
  return JSON.stringify(useNotesStore.getState().notes, null, 2)
}

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (raw === 'light' || raw === 'dark') return raw
  } catch { /* ignore */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function saveTheme(theme: 'light' | 'dark') {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch { /* ignore */ }
}
