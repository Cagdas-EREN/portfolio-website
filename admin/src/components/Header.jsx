import { useAuth } from '../context/AuthContext'
import { HiLogout, HiUser } from 'react-icons/hi'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Hoş Geldiniz, {user?.name}
        </h2>

        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-700">
            <HiUser className="h-5 w-5 mr-2" />
            <span className="text-sm">{user?.email}</span>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
          >
            <HiLogout className="h-5 w-5 mr-2" />
            <span className="text-sm">Çıkış</span>
          </button>
        </div>
      </div>
    </header>
  )
}
