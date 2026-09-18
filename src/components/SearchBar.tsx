import { Search, X } from 'lucide-react'
import { useNotesStore } from '../store/useNotesStore'

export function SearchBar() {
  const query = useNotesStore((s) => s.searchQuery)
  const setSearchQuery = useNotesStore((s) => s.setSearchQuery)

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
      <input
        type="text"
        value={query}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search notes..."
        className="w-full rounded-xl border border-[#e5e5e5] bg-white py-2.5 pl-10 pr-9 text-sm text-[#1a1a1a] placeholder-[#999] outline-none transition-colors focus:border-[#1a1a1a]"
      />
      {query && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-[#999] hover:text-[#1a1a1a]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
