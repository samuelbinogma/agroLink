import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

function Layout({ children }) {
  // Auth state powers the right side of the navbar:
  // logged out = Log in / Register links; logged in = name + role + Logout.
  const { user, logout } = useAuth()

  return (
    <div className="layout">
      <header className="navbar">
        <Link to="/" className="navbar__logo">
          {/* Small inline SVG so we don't need an image file. */}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 22c0-6 3-10 9-10 0 6-3 10-9 10Z"
              fill="#22c55e"
            />
            <path
              d="M12 22C12 12 8 7 2 5c0 8 4 13 10 17Z"
              fill="#16a34a"
            />
            <circle cx="14" cy="12" r="2.5" fill="#dcfce7" />
          </svg>
          <span>AgroLink</span>
        </Link>

        <nav className="navbar__links">
          <NavLink to="/" end>Home</NavLink>
          {user ? (
            <>
              <NavLink to={user.role === 'farmer' ? '/farmer/dashboard' : '/customer/dashboard'} end>
                {user.role === 'farmer' ? 'My Farm' : 'My Market'}
              </NavLink>
              <button className="navbar__logout" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" end>Log in</NavLink>
              <NavLink to="/register" end className="navbar__register">Sign up</NavLink>
            </>
          )}
        </nav>
      </header>

      {/* Tiny status line when logged in */}
      {user && (
        <div className="navbar__userline">
          Logged in as <strong>{user.name}</strong> ({user.role}){user.isVerified ? '' : ' — verify your account'}
        </div>
      )}

      <main className="layout__main">{children}</main>

      <footer className="footer">
        <p>AgroLink — fresh produce, farmer to table, no middlemen.</p>
      </footer>
    </div>
  )
}

export default Layout