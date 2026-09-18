import { Markdown } from '@tiptap/markdown'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef } from 'react'
import { useNotesStore } from '../store/useNotesStore'
import type { Note } from '../types'
import { EditorToolbar } from './EditorToolbar'
import { TagInput } from './TagInput'

interface EditorProps {
  note: Note
}

export function Editor({ note }: EditorProps) {
  const updateNote = useNotesStore((s) => s.updateNote)

  const suppressSave = useRef(false)
  const noteRef = useRef(note)

  useEffect(() => {
    noteRef.current = note
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing...' }),
      Typography,
      Markdown,
    ],
    content: note.content,
    contentType: 'markdown',
    onUpdate: ({ editor: ed }) => {
      if (suppressSave.current) return
      const md = ed.getMarkdown() ?? ''
      if (md !== noteRef.current.content) {
        updateNote(noteRef.current.id, { content: md })
      }
    },
  })

  useEffect(() => {
    if (!editor) return
    suppressSave.current = true
    editor.commands.setContent(noteRef.current.content, {
      contentType: 'markdown',
    })
    const t = window.setTimeout(() => {
      suppressSave.current = false
    }, 0)
    return () => window.clearTimeout(t)
  }, [editor, note.id])

  if (!editor) return null

  return (
    <div className="flex flex-col">
      <input
        type="text"
        value={note.title}
        onChange={(e) => updateNote(note.id, { title: e.target.value })}
        placeholder="Note title..."
        className="mb-3 w-full bg-transparent text-[32px] font-bold tracking-tight text-[#1a1a1a] placeholder-[#999] outline-none leading-tight"
      />

      <div className="mb-6">
        <TagInput note={note} />
      </div>

      <div className="mb-6 flex items-center gap-0.5 rounded-xl border border-[#e5e5e5] bg-white p-2 flex-wrap">
        <EditorToolbar editor={editor} />
      </div>

      <div className="min-h-[300px] text-[15px] leading-[1.7] text-[#1a1a1a]">
        <EditorContent editor={editor} />
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[#e5e5e5] pt-4 text-[12px] text-[#999]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Auto-saved
          </span>
          <span>{editor.storage.characterCount?.words?.() ?? note.content.split(/\s+/).length} words</span>
        </div>
        <span>{new Date(note.updatedAt).toLocaleString()}</span>
      </div>
    </div>
  )
}
