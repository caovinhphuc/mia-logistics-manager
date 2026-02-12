//Login.js
// Ứng dụng quản lý SLA (Service Level Agreement) với các chức năng như quản lý đơn hàng, phân bổ đơn hàng, theo dõi hiệu suất, cài đặt và giao diện nhân viên.
// Import các thư viện cần thiết
import { useState } from 'react'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticatd, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [systemData, setSystemData] = useState({
    orders: [],
    staff: [],
    performance: {},
    settings: {},
  })

  const handleLogin = () => {
    setIsLoading(true)
    setError('')
    setIsAuthenticated(false)
    setCurrentUser(null)
    setNotifications([])
    setSystemData({
      orders: [],
      staff: [],
      performance: {},
      settings: {},
    })
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md p-2"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Login'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  )
}

export default Login
