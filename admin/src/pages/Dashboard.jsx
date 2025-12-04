import { useState, useEffect } from 'react'
import api from '../services/api'
import { HiViewGrid, HiBriefcase, HiDocumentText, HiMail } from 'react-icons/hi'

export default function Dashboard() {
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    blogs: 0,
    contacts: 0,
    newContacts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [services, projects, blogs, contactStats] = await Promise.all([
        api.get('/services/admin/all'),
        api.get('/projects/admin/all'),
        api.get('/blogs/admin/all'),
        api.get('/contacts/admin/stats')
      ])

      setStats({
        services: services.data.data.length,
        projects: projects.data.data.length,
        blogs: blogs.data.data.length,
        contacts: contactStats.data.data.total,
        newContacts: contactStats.data.data.new
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Hizmetler',
      value: stats.services,
      icon: HiViewGrid,
      color: 'bg-blue-500',
      href: '/services'
    },
    {
      title: 'Projeler',
      value: stats.projects,
      icon: HiBriefcase,
      color: 'bg-green-500',
      href: '/projects'
    },
    {
      title: 'Blog Yazıları',
      value: stats.blogs,
      icon: HiDocumentText,
      color: 'bg-purple-500',
      href: '/blogs'
    },
    {
      title: 'Mesajlar',
      value: stats.contacts,
      badge: stats.newContacts > 0 ? `${stats.newContacts} Yeni` : null,
      icon: HiMail,
      color: 'bg-orange-500',
      href: '/contacts'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Sitenizin genel durumunu görüntüleyin</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Yükleniyor...</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    {stat.badge && (
                      <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                        {stat.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Hızlı İşlemler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/services" className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
                <HiViewGrid className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="font-medium">Yeni Hizmet Ekle</p>
              </a>
              <a href="/projects" className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
                <HiBriefcase className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="font-medium">Yeni Proje Ekle</p>
              </a>
              <a href="/blogs" className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
                <HiDocumentText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="font-medium">Yeni Blog Yazısı</p>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
