import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon size={48} className="mb-4 text-[#999]" />
      <h3 className="mb-1 text-lg font-semibold text-[#1a1a1a]">{title}</h3>
      <p className="mb-6 max-w-xs text-sm text-[#6b6b6b]">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-xl bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
