import { Home, Star, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-[120px] font-bold leading-none text-[#e5e5e5] dark:text-gray-800">404</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1a1a1a] dark:text-white">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-[#6b6b6b]">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/app"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
      >
        <Home className="h-4 w-4" />
        Go Home
      </Link>
      <div className="mt-6 flex items-center gap-4">
        <Link
          to="/app"
          className="text-sm text-[#6b6b6b] transition-colors hover:text-[#1a1a1a] dark:text-gray-400 dark:hover:text-white"
        >
          Dashboard
        </Link>
        <Link
          to="/app/favorites"
          className="inline-flex items-center gap-1 text-sm text-[#6b6b6b] transition-colors hover:text-[#1a1a1a] dark:text-gray-400 dark:hover:text-white"
        >
          <Star className="h-3.5 w-3.5" />
          Favorites
        </Link>
        <Link
          to="/app/settings"
          className="inline-flex items-center gap-1 text-sm text-[#6b6b6b] transition-colors hover:text-[#1a1a1a] dark:text-gray-400 dark:hover:text-white"
        >
          <Settings className="h-3.5 w-3.5" />
          Settings
        </Link>
      </div>
    </div>
  )
}
