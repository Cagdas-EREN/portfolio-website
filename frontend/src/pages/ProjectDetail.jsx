import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { projectsAPI } from '../services/api'
import { HiArrowLeft, HiExternalLink, HiX } from 'react-icons/hi'
import { FaGithub } from 'react-icons/fa'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectsAPI.getBySlug(slug)
        setProject(response.data.data)
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [slug])

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="container-custom">Yükleniyor...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="py-20 text-center">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-4">Proje bulunamadı</h2>
          <Link to="/portfolio" className="text-primary-600 hover:underline">
            Portfolyo sayfasına dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-100 py-16">
        <div className="container-custom">
          <Link to="/portfolio" className="inline-flex items-center text-primary-600 mb-6 hover:underline">
            <HiArrowLeft className="mr-2" />
            Portfolyo
          </Link>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              {project.category.toUpperCase()}
            </span>
            {project.isFeatured && (
              <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                Öne Çıkan
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-gray-700 mb-6">{project.shortDescription}</p>
          
          <div className="flex flex-wrap gap-4">
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center"
              >
                Projeyi Görüntüle
                <HiExternalLink className="ml-2" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center"
              >
                <FaGithub className="mr-2" />
                GitHub
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          {/* Project Images Gallery */}
          {project.images && project.images.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Proje Görselleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative group overflow-hidden rounded-xl shadow-lg cursor-pointer"
                    onClick={() => setLightboxImage({ 
                      url: `${BASE_URL}${image.url}`, 
                      caption: image.caption || `${project.title} - Görsel ${index + 1}` 
                    })}
                  >
                    <img 
                      src={`${BASE_URL}${image.url}`}
                      alt={image.caption || `${project.title} - Görsel ${index + 1}`}
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white text-sm">{image.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Proje Hakkında</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{project.description}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {project.client && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Müşteri</h3>
                <p className="text-gray-700">{project.client}</p>
              </div>
            )}
            {project.completedDate && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tamamlanma Tarihi</h3>
                <p className="text-gray-700">
                  {new Date(project.completedDate).toLocaleDateString('tr-TR')}
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Özellikler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg">
                    <span className="text-primary-600 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Kullanılan Teknolojiler</h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-primary-600 text-white p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-4">Benzer bir proje mi istiyorsunuz?</h3>
            <p className="mb-6">
              Sizin için de özel bir çözüm geliştirebilirim. Detaylar için iletişime geçin!
            </p>
            <Link to="/contact" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 inline-block">
              İletişime Geç
            </Link>
          </div>
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
                alt={lightboxImage.caption}
                className="w-full h-full object-contain rounded-lg"
              />
              <p className="text-white text-center mt-4 text-lg font-medium">{lightboxImage.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
