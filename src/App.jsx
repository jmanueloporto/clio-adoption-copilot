import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { DemoGuideProvider } from './context/DemoGuideContext'
import { FindingsProvider } from './context/FindingsContext'
import { RoleProvider, useRole } from './context/RoleContext'
import DashboardPage from './pages/DashboardPage'
import DomainDetailPage from './pages/DomainDetailPage'
import EngagementPage from './pages/EngagementPage'
import ExpansionPage from './pages/ExpansionPage'
import FindingDetailPage from './pages/FindingDetailPage'
import FindingsPage from './pages/FindingsPage'
import InterviewGuidePage from './pages/InterviewGuidePage'
import QuestionnairePage from './pages/QuestionnairePage'
import ReportPreviewPage from './pages/ReportPreviewPage'

function ConsultantRoute({ children }) {
  const { role } = useRole()
  return role === 'consultant' ? children : <Navigate to="/" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/findings" element={<FindingsPage />} />
        <Route path="/findings/:id" element={<FindingDetailPage />} />
        <Route path="/domains/:domainId" element={<DomainDetailPage />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route
          path="/interview-guide"
          element={
            <ConsultantRoute>
              <InterviewGuidePage />
            </ConsultantRoute>
          }
        />
        <Route path="/report" element={<ReportPreviewPage />} />
        <Route
          path="/engagement"
          element={
            <ConsultantRoute>
              <EngagementPage />
            </ConsultantRoute>
          }
        />
        <Route
          path="/expansion"
          element={
            <ConsultantRoute>
              <ExpansionPage />
            </ConsultantRoute>
          }
        />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <RoleProvider>
      <DemoGuideProvider>
        <FindingsProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </FindingsProvider>
      </DemoGuideProvider>
    </RoleProvider>
  )
}

export default App
