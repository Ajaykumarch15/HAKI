import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { applyThemeClass } from './hooks/useDarkMode.ts'
import { getStoredTheme } from './store/useNotesStore.ts'
import { InitAuth } from './components/InitAuth.tsx'

applyThemeClass(getStoredTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <InitAuth>
        <App />
      </InitAuth>
    </BrowserRouter>
  </StrictMode>,
)
