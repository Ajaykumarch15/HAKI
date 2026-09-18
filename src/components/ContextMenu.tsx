import { useEffect, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'

interface ContextMenuItem {
  label: string
  icon: LucideIcon
  onClick: () => void
  danger?: boolean
}

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  items: ContextMenuItem[]
}

export default function ContextMenu({ x, y, onClose, items }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[160px] rounded-xl border border-[#e5e5e5] bg-white p-1.5 shadow-lg"
      style={{ left: x, top: y }}
    >
      {items.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.label}
            onClick={() => {
              item.onClick()
              onClose()
            }}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
              item.danger
                ? 'text-red-500 hover:bg-red-50'
                : 'text-[#1a1a1a] hover:bg-gray-100'
            }`}
          >
            <Icon size={16} />
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
