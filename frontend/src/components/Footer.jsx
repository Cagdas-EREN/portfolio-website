import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone } from 'react-icons/fa'
import api from '../services/api'

export default function Footer() {
  const [content, setContent] = useState(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get('/content')
        if (response.data.data.length > 0) {
          setContent(response.data.data[0])
        }
      } catch (error) {
        console.error('Error fetching content:', error)
      }
    }
    fetchContent()
  }, [])

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white py-16 mt-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
           
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {content?.about?.description || 'Modern web uygulamaları ve işletme yazılımları geliştiren full-stack developer.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Hızlı Linkler</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Hizmetler
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Portfolyo
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Hizmetler</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                Web Geliştirme
              </li>
              <li className="flex items-center">
                <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                Mini ERP Sistemleri
              </li>
              <li className="flex items-center">
                <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                Toplu SMS
              </li>
              <li className="flex items-center">
                <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                Özel Yazılım
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">İletişim</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center group">
                <div className="p-2 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-lg mr-2 group-hover:scale-110 transition-transform">
                  <FaEnvelope className="text-primary-400" />
                </div>
                <a href={`mailto:${content?.contact?.email || 'info@cagdas.com'}`} className="hover:text-primary-400 transition-colors">
                  {content?.contact?.email || 'info@cagdas.com'}
                </a>
              </li>
              <li className="flex items-center group">
                <div className="p-2 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-lg mr-2 group-hover:scale-110 transition-transform">
                  <FaPhone className="text-purple-400" />
                </div>
                <a href={`tel:${content?.contact?.phone || '+905555555555'}`} className="hover:text-primary-400 transition-colors">
                  {content?.contact?.phone || '+90 555 555 55 55'}
                </a>
              </li>
            </ul>
           
          </div>
        </div>

        <div className="border-t border-gray-700/50 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent font-semibold">Çağdaş</span>. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
