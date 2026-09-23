/**
 * Layout.jsx — shared page shell.
 * Renders a Header (logo + nav), the page content (the <main> children),
 * and a Footer. Because App.jsx wraps every route in <Layout>, this shell
 * appears on all pages automatically.
 *
 * Notice the pattern: props.children. In App.jsx we wrote
 *   <Layout>
 *     <Home />
 *   </Layout>
 * so React passes <Home /> as `children`, which we drop inside <main>.
 */
import { NavLink, Link } from 'react-router-dom'
import './Layout.css'

function Layout({ children }) {
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
          <NavLink to="/farmer/dashboard" end>Farmer</NavLink>
          <NavLink to="/customer/dashboard" end>Customer</NavLink>
        </nav>
      </header>

      <main className="layout__main">{children}</main>

      <footer className="footer">
        <p>AgroLink — fresh produce, farmer to table, no middlemen.</p>
      </footer>
    </div>
  )
}

export default Layout