import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { SidebarLayout } from '@/layouts'
import { LoginPage } from '@/features/auth'
import { DashboardPage } from '@/features/dashboard'
import { ProjectsPage } from '@/features/projects'
import { NotesPage } from '@/features/notes'
import { SnippetsPage } from '@/features/snippets'
import { AnalyticsPage } from '@/features/analytics'
import { SettingsPage } from '@/features/settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="snippets" element={<SnippetsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
