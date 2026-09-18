import { X } from 'lucide-react'
import { getTagColor } from '../types'

interface TagBadgeProps {
  tag: string
  color?: string
  onRemove?: () => void
  size?: 'sm' | 'md'
}

export default function TagBadge({ tag, color, onRemove, size = 'sm' }: TagBadgeProps) {
  const tagColor = color ?? getTagColor(tag)
  const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses}`}
      style={{
        backgroundColor: `${tagColor}15`,
        color: tagColor,
      }}
    >
      <span
        className="inline-block rounded-full"
        style={{
          width: 6,
          height: 6,
          backgroundColor: tagColor,
        }}
      />
      {tag}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-black/10"
        >
          <X size={10} />
        </button>
      )}
    </span>
  )
}
