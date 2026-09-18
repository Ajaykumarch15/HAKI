import { supabase } from '../lib/supabase'
import type { Note } from '../types'

interface SupabaseNote {
  id: string
  user_id: string
  title: string
  content: string
  tags: string[]
  pinned: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
}

function toNote(row: SupabaseNote): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    tags: row.tags ?? [],
    pinned: row.pinned,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
    deletedAt: row.deleted_at ? new Date(row.deleted_at).getTime() : undefined,
  }
}

function toRow(note: Note, userId: string) {
  return {
    id: note.id,
    user_id: userId,
    title: note.title,
    content: note.content,
    tags: note.tags,
    pinned: note.pinned,
    deleted_at: note.deletedAt ? new Date(note.deletedAt).toISOString() : null,
    created_at: new Date(note.createdAt).toISOString(),
    updated_at: new Date(note.updatedAt).toISOString(),
  }
}

export async function fetchNotes(userId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data as SupabaseNote[]).map(toNote)
}

export async function fetchTrash(userId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
  if (error) throw error
  return (data as SupabaseNote[]).map(toNote)
}

export async function createNote(userId: string, note: Note): Promise<Note> {
  const { error } = await supabase
    .from('notes')
    .insert(toRow(note, userId))
  if (error) throw error
  return note
}

export async function updateNote(userId: string, id: string, patch: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<void> {
  const update: Record<string, unknown> = {}
  if (patch.title !== undefined) update.title = patch.title
  if (patch.content !== undefined) update.content = patch.content
  if (patch.tags !== undefined) update.tags = patch.tags
  if (patch.pinned !== undefined) update.pinned = patch.pinned
  update.updated_at = new Date().toISOString()
  const { error } = await supabase
    .from('notes')
    .update(update)
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

export async function trashNote(userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from('notes')
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

export async function restoreNote(userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from('notes')
    .update({ deleted_at: null, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

export async function permanentDelete(userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

export async function emptyTrash(userId: string): Promise<void> {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('user_id', userId)
    .not('deleted_at', 'is', null)
  if (error) throw error
}
