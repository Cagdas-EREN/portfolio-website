import { Link, useLocation } from 'react-router-dom'
import { HiHome, HiViewGrid, HiBriefcase, HiDocumentText, HiMail, HiCog } from 'react-icons/hi'

export default function Sidebar() {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HiHome },
    { name: 'Hizmetler', href: '/services', icon: HiViewGrid },
    { name: 'Projeler', href: '/projects', icon: HiBriefcase },
    { name: 'Blog', href: '/blogs', icon: HiDocumentText },
    { name: 'Mesajlar', href: '/contacts', icon: HiMail },
    { name: 'Ayarlar', href: '/settings', icon: HiCog },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <p className="text-sm text-gray-400">© 2024 Çağdaş</p>
      </div>
    </div>
  )
}
