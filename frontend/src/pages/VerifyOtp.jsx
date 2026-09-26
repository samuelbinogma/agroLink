
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'
import './Auth.css'

const DIGITS = Array.from({ length: 6 })

function VerifyOtp() {
  const { verifyOtp } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()

  const contact = state?.contact
  const via = state?.via || (contact?.includes('@') ? 'email' : 'phone')

  const [digits, setDigits] = useState(Array(6).fill(''))
  const [error, setError] = useState('')
  const [resendMsg, setResendMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const inputsRef = useRef([])

  // No contact supplied (e.g. someone visited /verify-otp directly).
  useEffect(() => {
    if (!contact) navigate('/register', { replace: true })
  }, [contact, navigate])

  const focusNext = (index) => {
    if (index < 5) inputsRef.current[index + 1]?.focus()
  }

  const handleChange = (index, value) => {
    const clean = value.replace(/\D/g, '')
    setDigits((prev) => {
      const next = [...prev]
      next[index] = clean
      return next
    })
    if (clean) focusNext(index)
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const verify = async () => {
    const otp = digits.join('')
    if (otp.length !== 6) {
      setError('Enter all 6 digits.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const user = await verifyOtp(contact, otp)
      navigate(user.role === 'farmer' ? '/farmer/dashboard' : '/customer/dashboard', {
        replace: true,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed — try again.')
    } finally {
      setBusy(false)
    }
  }

  const resend = async () => {
    setBusy(true)
    setError('')
    try {
      await api.post('/auth/request-otp', { contact })
      setDigits(Array(6).fill(''))
      setResendMsg(`A fresh code was sent to your ${via}. Check the backend console.`)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend the code.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth">
      <h1 className="auth__title">Enter your code</h1>
      <p className="auth__subtitle">
        We sent a 6-digit code to your {via}: <strong>{contact}</strong>.
      </p>

      <div className="auth__form">
        {error && <div className="auth__alert auth__alert--error">{error}</div>}
        {resendMsg && <div className="auth__alert auth__alert--info">{resendMsg}</div>}

        <div className="otp-row">
          {DIGITS.map((_, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              className="form__input otp-input"
              inputMode="numeric"
              maxLength={1}
              value={digits[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        <button className="btn" type="button" onClick={verify} disabled={busy}>
          {busy ? 'Verifying…' : 'Verify & continue'}
        </button>

        <button className="btn btn--ghost" type="button" onClick={resend} disabled={busy}>
          Resend code
        </button>
      </div>
    </div>
  )
}

export default VerifyOtp