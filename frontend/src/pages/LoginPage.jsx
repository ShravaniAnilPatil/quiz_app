import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault()
    // try {
    //   const response = await fetch('/api/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ username, password }),
    //   })
    //   if (response.ok) {
    //     const data = await response.json()
    //     // Store the token in localStorage or a secure cookie
    //     localStorage.setItem('token', data.token)
    //     navigate.push('/dashboard')
    //   } else {
    //     alert("Login Failed. Please check your credentials and try again.")
    //   }
    // } catch (error) {
    //   console.error('Login error:', error)
    //   alert("An unexpected error occurred. Please try again later.")
    // }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-[350px]">
        <h2 className="text-2xl font-bold mb-2">Login</h2>
        <p className="text-gray-500 mb-6">Enter your credentials to access the quiz</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-between">
            <Link href="/register">
              <a className="text-blue-500 hover:underline">Register</a>
            </Link>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
