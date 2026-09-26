import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

function CustomerDashboard() {
  const { user } = useAuth()

  return (
    <div className="dashboard">
      <h1>{user ? `Fresh picks for you, ${user.name}` : 'Customer Dashboard'}</h1>
      <p className="dashboard__note">
        This is a placeholder. Soon you'll browse and order products
        directly from farmers.
      </p>
    </div>
  )
}

export default CustomerDashboard