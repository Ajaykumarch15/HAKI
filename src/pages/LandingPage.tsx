import { Link } from 'react-router-dom'
import {
  FileText,
  Star,
  Tags,
  Moon,
  Search,
  Sparkles,
  ArrowRight,
  Heart,
} from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Rich Text Editor',
    description:
      'Write with a powerful editor that supports bold, italic, headings, lists, code blocks, and more.',
  },
  {
    icon: Tags,
    title: 'Smart Tagging',
    description:
      'Organize notes with color-coded tags. Filter and find notes instantly with tag-based navigation.',
  },
  {
    icon: Star,
    title: 'Pin Favorites',
    description:
      'Star your most important notes and access them quickly from the favorites page.',
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    description:
      'Switch between light and dark themes for comfortable writing day and night.',
  },
  {
    icon: Search,
    title: 'Instant Search',
    description:
      'Find any note in milliseconds with full-text search across titles, content, and tags.',
  },
  {
    icon: Sparkles,
    title: 'Auto-Save',
    description:
      'Never lose your work. Notes are automatically saved to your browser as you type.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f5f5f5]/80 backdrop-blur-xl border-b border-[#e5e5e5]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/app" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a1a1a]">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1a1a1a]">
              Notes
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e5e5e5] bg-white text-[#6b6b6b] transition-colors hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
            >
              <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <Link
              to="/app"
              className="flex items-center gap-2 rounded-xl bg-[#1a1a1a] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
            >
              Open App
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pb-20 pt-32 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-4 py-1.5 text-sm text-[#6b6b6b]">
          <Sparkles className="h-4 w-4 text-amber-500" />
          Free and open source
        </div>
        <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-[#1a1a1a] sm:text-6xl md:text-7xl">
          Your thoughts,
          <br />
          beautifully organized
        </h1>
        <p className="mt-6 max-w-xl text-lg text-[#6b6b6b]">
          A minimal, powerful notes app with rich text editing, smart tagging,
          and instant search. Everything saved locally in your browser.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/app"
            className="flex items-center gap-2 rounded-xl bg-[#1a1a1a] px-7 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-85"
          >
            Start Writing
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 rounded-xl border border-[#e5e5e5] bg-white px-7 py-3.5 text-base font-semibold text-[#1a1a1a] transition-colors hover:border-[#1a1a1a]"
          >
            See Features
          </a>
        </div>

        {/* Preview Card */}
        <div className="mt-20 w-full max-w-4xl overflow-hidden rounded-3xl border border-[#e5e5e5] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 border-b border-[#e5e5e5] px-5 py-3">
            <div className="h-3 w-3 rounded-full bg-[#e5e5e5]" />
            <div className="h-3 w-3 rounded-full bg-[#e5e5e5]" />
            <div className="h-3 w-3 rounded-full bg-[#e5e5e5]" />
          </div>
          <div className="grid md:grid-cols-[220px_1fr]">
            {/* Mini Sidebar */}
            <div className="hidden border-r border-[#e5e5e5] bg-white p-4 md:block">
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a1a1a]">
                  <FileText className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-[#1a1a1a]">Notes</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-2.5 py-2 text-xs font-medium text-white">
                  <FileText className="h-3.5 w-3.5" /> All Notes
                </div>
                <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#6b6b6b]">
                  <Star className="h-3.5 w-3.5" /> Favorites
                </div>
                <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#6b6b6b]">
                  <Tags className="h-3.5 w-3.5" /> Tags
                </div>
              </div>
            </div>
            {/* Mini Content */}
            <div className="bg-[#f5f5f5] p-6">
              <div className="mb-4 text-2xl font-bold text-[#1a1a1a]">
                Welcome to Notes
              </div>
              <div className="mb-3 flex gap-2">
                <span className="rounded-full bg-[#3b82f615] px-2 py-0.5 text-[10px] font-semibold text-[#3b82f6]">
                  #work
                </span>
                <span className="rounded-full bg-[#10b98115] px-2 py-0.5 text-[10px] font-semibold text-[#10b981]">
                  #personal
                </span>
              </div>
              <div className="space-y-2 text-sm text-[#6b6b6b]">
                <p>
                  Write with a powerful rich text editor. Organize with tags.
                  Pin your favorites.
                </p>
                <p>
                  Everything is saved locally in your browser. No account
                  needed.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3 border-t border-[#e5e5e5] pt-3 text-[11px] text-[#999]">
                <span>Auto-saved</span>
                <span>42 words</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl">
              Everything you need
            </h2>
            <p className="mt-3 text-[#6b6b6b]">
              Simple, powerful features to keep your thoughts organized.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-[#e5e5e5] bg-white p-6 transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f5f5]">
                  <feature.icon className="h-5 w-5 text-[#1a1a1a]" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-[#1a1a1a]">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#6b6b6b]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-[#1a1a1a] px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to start writing?
          </h2>
          <p className="mt-3 text-white/60">
            No sign-up required. Your notes stay private in your browser.
          </p>
          <Link
            to="/app"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-[#1a1a1a] transition-opacity hover:opacity-90"
          >
            Open Notes App
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5] bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a1a1a]">
              <FileText className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-[#1a1a1a]">Notes</span>
          </div>
          <p className="flex items-center gap-1 text-sm text-[#999]">
            Made with <Heart className="h-3.5 w-3.5 fill-red-400 text-red-400" /> using React + TypeScript
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
            >
              GitHub
            </a>
            <Link
              to="/app/settings"
              className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
