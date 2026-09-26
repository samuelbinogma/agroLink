import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import FarmerDashboard from './pages/FarmerDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import Register from './pages/Register'
import Login from './pages/Login'
import VerifyOtp from './pages/VerifyOtp'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Feature 2: authentication pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        {/* Placeholder dashboards — real ones arrive with Feature 3
            (role-based access). For now they prove the routes work. */}
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        {/* catch-all: any unknown path shows the dashboard-less home? No —
            keep it simple with a redirect for unknown paths. */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}

export default App