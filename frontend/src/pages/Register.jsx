
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

const ROLE_OPTIONS = [
  { value: 'farmer', title: 'Farmer', desc: 'I sell produce' },
  { value: 'customer', title: 'Customer', desc: 'I buy fresh food' },
]

function Register() {
  const { register: signUp } = useAuth()
  const navigate = useNavigate()

  const [serverError, setServerError] = useState('')
  const [role, setRole] = useState('farmer')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { role: 'farmer', name: '', email: '', phone: '', password: '' },
  })

  // Pick a role = update the hidden field + re-render the toggle.
  const chooseRole = (value) => {
    setRole(value)
    setValue('role', value)
  }

  const onSubmit = async (data) => {
    setServerError('')
    try {
      // Which contact is the OTP sent to? Prefer email.
      const contact = data.email || data.phone
      const result = await signUp(data)
      navigate('/verify-otp', {
        state: { contact, via: result.via, name: data.name },
      })
    } catch (error) {
      setServerError(error.response?.data?.message || 'Something went wrong.')
    }
  }

  return (
    <div className="auth">
      <h1 className="auth__title">Create your account</h1>
      <p className="auth__subtitle">Choose a role and sign up as email or phone.</p>

      <form className="auth__form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <div className="auth__alert auth__alert--error">{serverError}</div>}

        <div className="form__group">
          <span className="form__label">I am a...</span>
          <div className="role-select">
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => chooseRole(opt.value)}
                className={`role-select__option${role === opt.value ? ' role-select__option--active' : ''}`}
              >
                <div className="role-select__title">{opt.title}</div>
                <div className="role-select__desc">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* hidden field — react-hook-form tracks the role through the toggle */}
        <input type="hidden" {...register('role')} />

        <div className="form__group">
          <label className="form__label" htmlFor="name">Full name</label>
          <input
            id="name"
            className="form__input"
            type="text"
            placeholder="e.g. Amina Kemboi"
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'At least 2 characters' },
            })}
          />
          {errors.name && <p className="form__error">{errors.name.message}</p>}
        </div>

        <div className="form__group">
          <label className="form__label" htmlFor="email">Email <span style={{ color: 'var(--color-text-muted)' }}>(or phone)</span></label>
          <input
            id="email"
            className="form__input"
            type="email"
            placeholder="you@example.com"
            {...register('email', { pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })}
          />
          {errors.email && <p className="form__error">{errors.email.message}</p>}
        </div>

        <div className="form__group">
          <label className="form__label" htmlFor="phone">Phone <span style={{ color: 'var(--color-text-muted)' }}>(optional if email given)</span></label>
          <input
            id="phone"
            className="form__input"
            type="tel"
            placeholder="+254712345678"
            {...register('phone', { pattern: { value: /^[0-9+\- ]{7,15}$/, message: 'Enter a valid phone number' } })}
          />
          {errors.phone && <p className="form__error">{errors.phone.message}</p>}
        </div>

        <div className="form__group">
          <label className="form__label" htmlFor="password">Password</label>
          <input
            id="password"
            className="form__input"
            type="password"
            placeholder="At least 6 characters"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
          />
          {errors.password && <p className="form__error">{errors.password.message}</p>}
        </div>

        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <p className="auth__switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}

export default Register