import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import CouponDashboard from './pages/CouponDashboard'
import AppHeader from './components/AppHeader'
import LoginModal from './components/loginModal'
import { useUser } from './hooks/useUser'
import { useState } from 'react'

function App() {
  const { loggedInUser, login, logout } = useUser()
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  async function handleLogin(userCred) {
    try {
      await login(userCred)
      handleClose()
    } catch (err) {
      console.error("Login error:", err)
      alert("Login failed. Please try again.")
    }
  }

  return (
    <Router>
      <AppHeader
        onLogin={handleOpen}
        onLogout={logout}
        loggedInUser={loggedInUser}
      />
      <LoginModal
        open={open}
        onClose={handleClose}
        onLogin={handleLogin}
      />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {loggedInUser && <Route path="/coupons" element={<CouponDashboard />} />}
          {loggedInUser?.isAdmin && <Route path="/users" element={<AdminDashboard />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
