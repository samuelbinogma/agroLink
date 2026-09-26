/**
 * pages/Login.jsx — contact + password login.
 *
 * After a successful login we redirect to the user's role dashboard.
 * If the account is unverified the backend returns 403 with a clear
 * message; we forward that straight to the user.
 */
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { contact: '', password: '' } })

  const onSubmit = async ({ contact, password }) => {
    setServerError('')
    try {
      const user = await login(contact, password)
      navigate(user.role === 'farmer' ? '/farmer/dashboard' : '/customer/dashboard')
    } catch (error) {
      setServerError(error.response?.data?.message || 'Login failed. Try again.')
    }
  }

  return (
    <div className="auth">
      <h1 className="auth__title">Welcome back</h1>
      <p className="auth__subtitle">Log in with your email or phone number.</p>

      <form className="auth__form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <div className="auth__alert auth__alert--error">{serverError}</div>}

        <div className="form__group">
          <label className="form__label" htmlFor="contact">Email or phone</label>
          <input
            id="contact"
            className="form__input"
            type="text"
            placeholder="you@example.com or +254712345678"
            {...register('contact', { required: 'Enter your email or phone' })}
          />
          {errors.contact && <p className="form__error">{errors.contact.message}</p>}
        </div>

        <div className="form__group">
          <label className="form__label" htmlFor="password">Password</label>
          <input
            id="password"
            className="form__input"
            type="password"
            placeholder="Your password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p className="form__error">{errors.password.message}</p>}
        </div>

        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="auth__switch">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  )
}

export default Login