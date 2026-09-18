import { FileText, Heart, Tag } from 'lucide-react'

interface StatsRowProps {
  totalNotes: number
  favorites: number
  activeTags: number
  tagNames: string
}

export default function StatsRow({ totalNotes, favorites, activeTags, tagNames }: StatsRowProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-1 rounded-2xl border border-[#e5e5e5] bg-white p-5 transition-shadow hover:shadow-md">
        <div className="mb-3 flex items-center gap-2 text-[#6b6b6b]">
          <FileText size={18} />
          <span className="text-sm font-medium">Total Notes</span>
        </div>
        <div className="text-[32px] font-bold leading-tight text-[#1a1a1a]">{totalNotes}</div>
        <div className="mt-1 text-sm text-[#999]">+{Math.min(totalNotes, 3)} this week</div>
      </div>

      <div className="flex-1 rounded-2xl border border-[#e5e5e5] bg-white p-5 transition-shadow hover:shadow-md">
        <div className="mb-3 flex items-center gap-2 text-[#6b6b6b]">
          <Heart size={18} />
          <span className="text-sm font-medium">Favorites</span>
        </div>
        <div className="text-[32px] font-bold leading-tight text-[#1a1a1a]">{favorites}</div>
        <div className="mt-1 text-sm text-[#999]">+{Math.min(favorites, 2)} this week</div>
      </div>

      <div className="flex-1 rounded-2xl border border-[#e5e5e5] bg-[#1a1a1a] p-5 transition-shadow hover:shadow-md">
        <div className="mb-3 flex items-center gap-2 text-[#999]">
          <Tag size={18} />
          <span className="text-sm font-medium">Active Tags</span>
        </div>
        <div className="text-[32px] font-bold leading-tight text-white">{activeTags}</div>
        <div className="mt-1 text-sm text-[#999]">{tagNames}</div>
      </div>
    </div>
  )
}
