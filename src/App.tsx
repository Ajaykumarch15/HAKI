import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import LandingPage from './pages/LandingPage'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Favorites from './pages/Favorites'
import Trash from './pages/Trash'
import Tags from './pages/Tags'
import TagNotes from './pages/TagNotes'
import NoteEditor from './pages/NoteEditor'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route element={<Layout />}>
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/favorites" element={<Favorites />} />
        <Route path="/app/trash" element={<Trash />} />
        <Route path="/app/tags" element={<Tags />} />
        <Route path="/app/tags/:tagName" element={<TagNotes />} />
        <Route path="/app/note/new" element={<NoteEditor />} />
        <Route path="/app/note/:id" element={<NoteEditor />} />
        <Route path="/app/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
