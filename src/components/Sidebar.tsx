import { FileText, Plus, Star, Trash2, Settings, X, LogOut, Menu } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useNotesStore } from '../store/useNotesStore'
import { deriveTags } from '../utils/notes'
import { getTagColor } from '../types'
import { signOut } from '../services/auth'

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const notes = useNotesStore((s) => s.notes)
  const user = useNotesStore((s) => s.user)
  const setUser = useNotesStore((s) => s.setUser)
  const location = useLocation()
  const navigate = useNavigate()
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const renameTag = useNotesStore((s) => s.renameTag)
  const setSidebarOpen = useNotesStore((s) => s.setSidebarOpen)

  const tags = useMemo(() => deriveTags(notes), [notes])

  const isActive = (path: string) => location.pathname === path

  const handleSignOut = async () => {
    try {
      await signOut()
      setUser(null)
      navigate('/auth')
    } catch { /* ignore */ }
  }

  return (
    <div className="flex h-screen w-[220px] flex-col bg-white border-r border-[#e5e5e5] px-5 py-8">
      {/* Logo */}
      <div className="flex items-center justify-between mb-10">
        <Link to="/app" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1a]">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1a1a1a]">Notes</span>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#999] hover:bg-[#f5f5f5] hover:text-[#1a1a1a] lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        <Link
          to="/app"
          className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
            isActive('/app') ? 'bg-[#1a1a1a] text-white' : 'text-[#6b6b6b] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]'
          }`}
        >
          <FileText className="h-[18px] w-[18px]" />
          All Notes
        </Link>
        <Link
          to="/app/favorites"
          className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
            isActive('/app/favorites') ? 'bg-[#1a1a1a] text-white' : 'text-[#6b6b6b] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]'
          }`}
        >
          <Star className="h-[18px] w-[18px]" />
          Favorites
        </Link>
        <Link
          to="/app/trash"
          className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
            isActive('/app/trash') ? 'bg-[#1a1a1a] text-white' : 'text-[#6b6b6b] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]'
          }`}
        >
          <Trash2 className="h-[18px] w-[18px]" />
          Trash
        </Link>
        <Link
          to="/app/settings"
          className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
            isActive('/app/settings') ? 'bg-[#1a1a1a] text-white' : 'text-[#6b6b6b] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]'
          }`}
        >
          <Settings className="h-[18px] w-[18px]" />
          Settings
        </Link>

        {/* Tags divider */}
        <div className="my-4 h-px bg-[#e5e5e5]" />
        <p className="px-3.5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#999]">Tags</p>

        {tags.map(({ tag }) => {
          const color = getTagColor(tag)
          const isTagActive = location.pathname === `/app/tags/${tag}`
          return (
            <div key={tag} className="group relative">
              {editingTag === tag ? (
                <input
                  autoFocus
                  defaultValue={tag}
                  onBlur={(e) => { renameTag(tag, e.target.value); setEditingTag(null) }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { renameTag(tag, (e.target as HTMLInputElement).value); setEditingTag(null) }
                    if (e.key === 'Escape') setEditingTag(null)
                  }}
                  className="w-full rounded-xl border border-[#e5e5e5] bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none"
                />
              ) : (
                <Link
                  to={`/app/tags/${tag}`}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isTagActive ? 'bg-[#1a1a1a] text-white' : 'text-[#6b6b6b] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
                  {tag}
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto">
        <Link
          to="/app/note/new"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a1a1a] px-3 py-3 text-sm font-semibold text-white hover:opacity-85 transition-opacity mb-5"
        >
          <Plus className="h-[18px] w-[18px]" />
          New Note
        </Link>
        <div className="flex items-center justify-between rounded-xl px-3.5 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a1a] text-sm font-semibold text-white">
              {user?.email?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-[#1a1a1a] truncate max-w-[90px]">
                {user?.email?.split('@')[0] ?? 'User'}
              </span>
              <span className="text-[11px] text-[#999] truncate max-w-[90px]">
                {user?.email ?? ''}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#999] hover:bg-[#f5f5f5] hover:text-[#ef4444] transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-[#999] hover:bg-[#f5f5f5] hover:text-[#1a1a1a] lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
