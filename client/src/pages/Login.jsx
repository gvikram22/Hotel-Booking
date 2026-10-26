
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const baseURL =
        import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

      const response = await fetch(`${baseURL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      })

      const data = await response.json()

      if (!response.ok || data.success === false) {
        setError(data.message || 'Invalid email or password.')
        return
      }

      if (!data.token) {
        setError('Login response did not contain a token.')
        console.error('Login response:', data)
        return
      }

      if (!data.user) {
        setError('Login response did not contain user information.')
        console.error('Login response:', data)
        return
      }

      // Save authentication information.
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Notify components that authentication has changed.
      window.dispatchEvent(new Event('auth-change'))

      // Redirect according to the account role.
      if (data.user.role === 'hotelOwner') {
        navigate('/owner', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Cannot connect to the server. Check your backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <h1 className="mb-2 text-3xl font-semibold">
          Login
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          Sign in to your QuickStay account.
        </p>

        {error && (
          <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="mt-5 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
