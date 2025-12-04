import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api, { servicesAPI, projectsAPI } from '../services/api'
import { HiArrowRight, HiCode, HiLightningBolt, HiStar } from 'react-icons/hi'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'

export default function Home() {
  const [services, setServices] = useState([])
  const [projects, setProjects] = useState([])
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, projectsRes, contentRes] = await Promise.all([
          servicesAPI.getAll(),
          projectsAPI.getAll({ featured: true }),
          api.get('/content')
        ])
        setServices(servicesRes.data.data.slice(0, 3))
        setProjects(projectsRes.data.data.slice(0, 3))
        if (contentRes.data.data.length > 0) {
          setContent(contentRes.data.data[0])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Code-style greeting */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-primary-500/30 rounded-lg px-6 py-3 font-mono text-sm">
                <span className="text-primary-400">const</span>{' '}
                <span className="text-white">developer</span>{' '}
                <span className="text-primary-400">=</span>{' '}
                <span className="text-green-400">"Çağdaş Eren"</span>
                <span className="text-primary-400">;</span>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400">
                {content?.hero?.title || 'Merhaba, Ben Çağdaş'}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl text-gray-300 mb-4 font-light"
            >
              {content?.hero?.subtitle || 'Full Stack Yazılım Geliştirici'}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {content?.hero?.description || 'Modern web uygulamaları ve işletme yazılımları geliştiriyorum. İşinizi dijitale taşıyalım!'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                to="/portfolio" 
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/50 hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <HiCode className="mr-2 h-5 w-5" />
                  Projelerime Göz At
                  <HiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              <Link 
                to="/contact" 
                className="group px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center justify-center">
                  <HiLightningBolt className="mr-2 h-5 w-5 text-yellow-400" />
                  İletişime Geç
                </span>
              </Link>
            </motion.div>

            {/* Tech Stack Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-16 flex flex-wrap justify-center gap-3"
            >
              {(content?.skills || ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Python']).slice(0, 5).map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-primary-500/30 rounded-full text-sm text-gray-300 hover:border-primary-500 hover:text-primary-400 transition-all cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <div className="w-1 h-3 bg-white/50 rounded-full mx-auto"></div>
          </div>
        </motion.div>
      </section>

     

      {/* Services Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-title"
            >
              Hizmetlerim
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-subtitle mx-auto"
            >
              Size sunduğum profesyonel yazılım geliştirme hizmetleri
            </motion.p>
          </div>

          {loading ? (
            <div className="text-center">Yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <Link to={`/services/${service.slug}`} className="block h-full">
                    <div className="relative h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-8">
                      {/* Gradient Background on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Icon with Gradient Background */}
                      <div className="relative inline-flex mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-purple-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <div className="relative text-5xl bg-gradient-to-br from-primary-500 to-purple-600 p-4 rounded-2xl">
                          {service.icon}
                        </div>
                      </div>

                      <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-purple-600 transition-all">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">{service.shortDescription}</p>
                        <div className="flex items-center text-primary-600 font-semibold group-hover:text-purple-600 transition-colors">
                          Detayları Gör
                          <HiArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>

                      {/* Decorative Corner Elements */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-400/10 to-purple-600/10 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-300"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-400/10 to-purple-600/10 rounded-tr-full transform -translate-x-8 translate-y-8 group-hover:-translate-x-6 group-hover:translate-y-6 transition-transform duration-300"></div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link to="/services" className="btn-primary inline-flex items-center group">
              Tüm Hizmetleri Gör
              <HiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-title"
            >
              Öne Çıkan Projeler
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-subtitle mx-auto"
            >
              Başarıyla tamamladığım projelerden bazıları
            </motion.p>
          </div>

          {loading ? (
            <div className="text-center">Yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group"
                >
                  <Link to={`/portfolio/${project.slug}`} className="block h-full">
                    <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                      <div className="relative h-48 bg-gradient-to-br from-primary-400 via-purple-500 to-pink-600 flex items-center justify-center overflow-hidden">
                        {project.thumbnail ? (
                          <img 
                            src={`${BASE_URL}${project.thumbnail}`}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <HiCode className="text-white text-6xl group-hover:scale-110 transition-transform duration-300" />
                        )}
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Featured Badge */}
                        {project.isFeatured && (
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                            <HiStar className="inline mr-1" />
                            Öne Çıkan
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-purple-600 transition-all">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{project.shortDescription}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <span key={i} className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-medium group-hover:from-primary-100 group-hover:to-purple-100 group-hover:text-primary-700 transition-all">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-primary-600 font-semibold group-hover:text-purple-600 transition-colors">
                          Detayları Gör
                          <HiArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link to="/portfolio" className="btn-primary inline-flex items-center group">
              Tüm Projeleri Gör
              <HiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Projeniz için hazır mısınız?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Birlikte harika şeyler yaratabilir, işinizi dijitale taşıyabiliriz!
          </p>
          <Link to="/contact" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 inline-flex items-center">
            Hemen İletişime Geçin
            <HiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
