import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import CouponDashboard from './pages/CouponDashboard'
import AppHeader from './components/AppHeader'
import { useUser } from './hooks/useUser'

function App() {
  const { loggedInUser, login, logout } = useUser()

  return (
    <Router>
      <AppHeader
        onLogin={() => {}}
        onLogout={logout}
        loggedInUser={loggedInUser}
      />
      <main>
        <Routes>
          <Route path="/" element={<Home login={login} />} />
          {loggedInUser && <Route path="/coupons" element={<CouponDashboard />} />}
          {loggedInUser?.isAdmin && <Route path="/users" element={<AdminDashboard />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
