/**
 * FarmerDashboard.jsx — placeholder.
 * Real implementation comes in Feature 3 (role-based access) when farmers
 * can log in. This stub proves the route + navigation work for now.
 */
import './Dashboard.css'

function FarmerDashboard() {
  return (
    <div className="dashboard">
      <h1>Farmer Dashboard</h1>
      <p className="dashboard__note">
        This is a placeholder. After we build authentication, farmers will log
        in here to manage their products, orders and messages.
      </p>
    </div>
  )
}

export default FarmerDashboard