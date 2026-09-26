import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*
      BrowserRouter is the <div> of routing: it listens to the URL and
      tells React which <Route> to render. Everything inside it can use
      Link, NavLink, useNavigate, useParams, etc.

      AuthProvider holds global auth state (user, token, actions) and is
      OUTSIDE App so every page can call useAuth().
    */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)