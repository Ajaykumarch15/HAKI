import { Download, ExternalLink, FileText, Import, Moon, Sun, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useDarkMode } from '../hooks/useDarkMode'
import { exportNotesAsJson } from '../store/useNotesStore'
import { useNotesStore } from '../store/useNotesStore'

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#e5e5e5] bg-white p-5 dark:border-gray-700 dark:bg-[#1a1a1a]">
      <h2 className="mb-4 text-sm font-semibold text-[#1a1a1a] dark:text-white">{title}</h2>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-sm text-[#6b6b6b]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  )
}

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="inline-flex rounded-lg border border-[#e5e5e5] bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === opt.value
              ? 'bg-white text-[#1a1a1a] shadow-sm dark:bg-gray-700 dark:text-white'
              : 'text-[#6b6b6b] hover:text-[#1a1a1a] dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

const SHORTCUTS = [
  { keys: ['Ctrl', 'N'], description: 'New note' },
  { keys: ['Ctrl', 'S'], description: 'Save note' },
  { keys: ['Ctrl', 'B'], description: 'Bold text' },
  { keys: ['Ctrl', 'I'], description: 'Italic text' },
  { keys: ['Ctrl', 'K'], description: 'Insert link' },
  { keys: ['Ctrl', 'Shift', 'C'], description: 'Code block' },
  { keys: ['Ctrl', 'Z'], description: 'Undo' },
  { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
]

export default function Settings() {
  const { theme, toggle: toggleTheme } = useDarkMode()
  const emptyTrash = useNotesStore((s) => s.emptyTrash)

  const [autoSave, setAutoSave] = useState(true)
  const [spellCheck, setSpellCheck] = useState(false)
  const [compactMode, setCompactMode] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [defaultView, setDefaultView] = useState('rich')

  const handleExport = () => {
    const json = exportNotesAsJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `notes-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const notes = JSON.parse(ev.target?.result as string)
          if (Array.isArray(notes)) {
            useNotesStore.setState((s) => ({ notes: [...notes, ...s.notes] }))
          }
        } catch {
          // ignore invalid file
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">Settings</h1>
      </div>

      <div className="space-y-4">
        <SectionCard title="Appearance">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-[#6b6b6b]">Theme</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    theme === 'light'
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-400'
                      : 'border-[#e5e5e5] bg-white text-[#6b6b6b] hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-400'
                      : 'border-[#e5e5e5] bg-white text-[#6b6b6b] hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-[#6b6b6b] transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  System
                </button>
              </div>
            </div>
            <Toggle checked={compactMode} onChange={setCompactMode} label="Compact Mode" />
            <Toggle checked={showPreview} onChange={setShowPreview} label="Show Note Preview" />
          </div>
        </SectionCard>

        <SectionCard title="Editor">
          <div className="space-y-4">
            <Toggle checked={autoSave} onChange={setAutoSave} label="Auto-save" />
            <Toggle checked={spellCheck} onChange={setSpellCheck} label="Spell Check" />
            <div>
              <p className="mb-2 text-sm text-[#6b6b6b]">Default View</p>
              <RadioGroup
                options={[
                  { label: 'Rich Text', value: 'rich' },
                  { label: 'Markdown', value: 'markdown' },
                ]}
                value={defaultView}
                onChange={setDefaultView}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Data Management">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-lg border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-[#6b6b6b] transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <Download className="h-4 w-4" />
              Export Notes
            </button>
            <button
              type="button"
              onClick={handleImport}
              className="inline-flex items-center gap-2 rounded-lg border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-[#6b6b6b] transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <Import className="h-4 w-4" />
              Import Notes
            </button>
            <button
              type="button"
              onClick={() => { if (window.confirm('Permanently delete all notes in trash?')) { emptyTrash(); } }}
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white dark:border-red-500/40 dark:bg-[#1a1a1a] dark:hover:bg-red-500"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Keyboard Shortcuts">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SHORTCUTS.map((shortcut) => (
              <div key={shortcut.description} className="flex items-center justify-between rounded-lg px-3 py-2">
                <span className="text-sm text-[#6b6b6b]">{shortcut.description}</span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, i) => (
                    <span key={i} className="flex items-center gap-1">
                      {i > 0 && <span className="text-[10px] text-[#999]">+</span>}
                      <kbd className="inline-flex h-6 min-w-[24px] items-center justify-center rounded border border-[#e5e5e5] bg-gray-50 px-1.5 text-[11px] font-medium text-[#6b6b6b] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        {key}
                      </kbd>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="About">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b6b6b]">Version</span>
              <span className="text-sm font-medium text-[#1a1a1a] dark:text-white">1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b6b6b]">Built with</span>
              <span className="text-sm font-medium text-[#1a1a1a] dark:text-white">React + TypeScript</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b6b6b]">Source Code</span>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-500 hover:text-indigo-600"
              >
                <FileText className="h-3.5 w-3.5" />
                GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b6b6b]">Report Issue</span>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-500 hover:text-indigo-600"
              >
                Report Issue
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
