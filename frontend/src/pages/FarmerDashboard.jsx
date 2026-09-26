/**
 * FarmerDashboard.jsx — placeholder until Feature 3.
 * Now it greets the logged-in farmer, proving the JWT + /me pipeline works.
 * Feature 3 will protect this route and only allow role === 'farmer'.
 */
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

function FarmerDashboard() {
  const { user } = useAuth()

  return (
    <div className="dashboard">
      <h1>{user ? `Welcome to your farm, ${user.name}` : 'Farmer Dashboard'}</h1>
      <p className="dashboard__note">
        This is a placeholder. In Feature 4 you'll upload and manage your
        products here.
      </p>
    </div>
  )
}

export default FarmerDashboard