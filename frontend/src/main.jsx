import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*
      BrowserRouter is the <div> of routing: it listens to the URL and
      tells React which <Route> to render. Everything inside it can use
      Link, NavLink, useNavigate, useParams, etc.
    */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)