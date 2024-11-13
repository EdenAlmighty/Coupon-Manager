import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />}>
            {/* <Route path="users" element={<ManageUsers />} /> */}
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App