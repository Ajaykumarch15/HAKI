import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useNotesStore } from '../store/useNotesStore'
import { useMediaQuery } from '../hooks/useMediaQuery'

export function Layout() {
  const user = useNotesStore((s) => s.user)
  const sidebarOpen = useNotesStore((s) => s.sidebarOpen)
  const setSidebarOpen = useNotesStore((s) => s.setSidebarOpen)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      {/* Desktop sidebar */}
      {isDesktop && (
        <aside className="hidden lg:block">
          <Sidebar />
        </aside>
      )}

      {/* Mobile/tablet sidebar drawer */}
      {!isDesktop && (
        <>
          <div
            className={`fixed inset-y-0 left-0 z-50 transition-transform duration-200 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1100px] px-6 py-8 lg:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
