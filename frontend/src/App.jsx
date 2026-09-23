/**
 * App.jsx — the route table of the whole app.
 *
 * A <Route> says: "when the URL looks like this, render that component".
 * The order/layout matters less here because routes are unique.
 *
 * We wrap everything in <Layout> so the header + footer appear on
 * every page without duplicating code — a classic React pattern.
 */
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import FarmerDashboard from './pages/FarmerDashboard'
import CustomerDashboard from './pages/CustomerDashboard'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
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