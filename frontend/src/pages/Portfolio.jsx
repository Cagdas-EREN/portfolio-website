import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { projectsAPI } from '../services/api'
import { HiCode, HiX } from 'react-icons/hi'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'

export default function Portfolio() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [lightboxImage, setLightboxImage] = useState(null)

  const categories = [
    { value: 'all', label: 'Tümü' },
    { value: 'web', label: 'Web' },
    { value: 'mobile', label: 'Mobil' },
    { value: 'erp', label: 'ERP' },
    { value: 'automation', label: 'Otomasyon' },
  ]

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const params = filter !== 'all' ? { category: filter } : {}
        const response = await projectsAPI.getAll(params)
        console.log('Projects:', response.data.data)
        setProjects(response.data.data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [filter])

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-purple-900 py-24 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="container-custom text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Portfolyo
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Başarıyla tamamladığım projeler ve çözümler
          </motion.p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-gradient-to-b from-white to-gray-50 border-b border-gray-100">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(cat.value)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  filter === cat.value
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container-custom">
          {loading ? (
            <div className="text-center text-gray-600">Yükleniyor...</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-gray-600">Bu kategoride proje bulunamadı.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2">
                    <div 
                      className="relative h-56 bg-gradient-to-br from-primary-400 via-purple-500 to-pink-600 flex items-center justify-center overflow-hidden cursor-pointer"
                      onClick={(e) => {
                        if (project.thumbnail) {
                          e.preventDefault()
                          setLightboxImage({ url: `${BASE_URL}${project.thumbnail}`, title: project.title })
                        }
                      }}
                    >
                      {project.thumbnail ? (
                        <img 
                          src={`${BASE_URL}${project.thumbnail}`}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <HiCode className="text-white text-7xl" />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                      {project.isFeatured && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                          Öne Çıkan
                        </div>
                      )}
                    </div>
                    <Link to={`/portfolio/${project.slug}`} className="block p-6">
                      <div className="inline-block text-xs bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent font-bold uppercase mb-2">
                        {categories.find(c => c.value === project.category)?.label || project.category}
                      </div>
                      <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{project.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{project.shortDescription}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech, i) => (
                          <span key={i} className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-medium">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-xs bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 px-3 py-1.5 rounded-full font-medium">+{project.technologies.length - 3}</span>
                        )}
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <HiX className="text-4xl" />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-7xl max-h-[90vh] cursor-default"
            >
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="w-full h-full object-contain rounded-lg"
              />
              <p className="text-white text-center mt-4 text-lg font-medium">{lightboxImage.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
