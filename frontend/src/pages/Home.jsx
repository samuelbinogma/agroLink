/**
 * Home.jsx — the landing page.
 *
 * This is where a visitor decides who they are, so the page has TWO jobs:
 *   1. Sell the idea: a hero section explaining "no middlemen".
 *   2. Send visitors down the right path: Farmer or Customer cards that
 *      navigate to their (future) dashboard.
 *
 * It also demonstrates FE integration: on mount we call the backend's
 * /api/health endpoint and show a small status chip. If the backend is up
 * and MongoDB connected, you'll see "API connected". This proves the
 * full stack talks to each other before we build real features on top.
 */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import './Home.css'

function Home() {
  // backendStatus: 'checking' | 'online' | 'offline'
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    // Async work must live in useEffect, never in the render body.
    let cancelled = false // avoid setting state after unmount

    async function checkBackend() {
      try {
        await api.get('/health')
        if (!cancelled) setBackendStatus('online')
      } catch {
        if (!cancelled) setBackendStatus('offline')
      }
    }

    checkBackend()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="home">
      {/* ---- Hero ---- */}
      <section className="hero">
        <h1 className="hero__title">
          Fresh produce, <span className="hero__highlight">straight from the farm</span>
        </h1>
        <p className="hero__subtitle">
          AgroLink connects farmers directly to customers. No middlemen,
          no unfair margins — just honest food at honest prices.
        </p>

        {/* Backend status chip — remove or keep for dev. It's our first
            frontend <-> backend handshake. */}
        <span className={`status-chip status-chip--${backendStatus}`} aria-live="polite">
          {backendStatus === 'checking' && 'Checking API…'}
          {backendStatus === 'online' && 'API connected ✓'}
          {backendStatus === 'offline' && 'API offline'}
        </span>
      </section>

      {/* ---- Role selection ---- */}
      <section className="roles">
        <h2 className="roles__heading">What brings you here today?</h2>

        <div className="roles__cards">
          <Link to="/farmer/dashboard" className="role-card role-card--farmer">
            <h3 className="role-card__title">I'm a Farmer</h3>
            <p className="role-card__text">
              List your crops, set your price, and sell directly to the people
              who eat what you grow.
            </p>
            <span className="role-card__cta">Start selling →</span>
          </Link>

          <Link to="/customer/dashboard" className="role-card role-card--customer">
            <h3 className="role-card__title">I'm a Customer</h3>
            <p className="role-card__text">
              Browse local produce, chat with farmers, and buy fresh food
              with zero middlemen markups.
            </p>
            <span className="role-card__cta">Start buying →</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home