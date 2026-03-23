import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tours from './pages/Tours'
import TourCreate from './pages/TourCreate'
import Bookings from './pages/Bookings'
import Customers from './pages/Customers'
import Guides from './pages/Guides'
import Payments from './pages/Payments'
import Reports from './pages/Reports'
import PublicTour from './pages/PublicTour'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/tours/:tourId" element={<PublicTour />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tours" element={<Tours />} />
        <Route path="tours/new" element={<TourCreate />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="customers" element={<Customers />} />
        <Route path="guides" element={<Guides />} />
        <Route path="payments" element={<Payments />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
