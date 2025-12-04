import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { servicesAPI } from '../services/api'
import { HiArrowRight } from 'react-icons/hi'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getAll()
        setServices(response.data.data)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

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
              Hizmetlerim
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            İşletmeniz için profesyonel yazılım çözümleri sunuyorum
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container-custom">
          {loading ? (
            <div className="text-center text-gray-600">Yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="h-full flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2">
                    <div className="p-8">
                      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                      <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{service.title}</h3>
                      <p className="text-gray-600 mb-6 flex-grow">
                        {service.shortDescription}
                      </p>
                      
                      {/* Features */}
                      {service.features && service.features.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-bold mb-3 text-gray-900">Özellikler:</h4>
                          <ul className="text-sm text-gray-600 space-y-2">
                            {service.features.slice(0, 4).map((feature, i) => (
                              <li key={i} className="flex items-center">
                                <span className="w-5 h-5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs mr-2">✓</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Pricing */}
                      {service.pricing && service.pricing.startingPrice > 0 && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border border-primary-100">
                          <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                            {service.pricing.startingPrice.toLocaleString('tr-TR')} {service.pricing.currency}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">başlayan fiyatlarla</div>
                        </div>
                      )}

                      <Link
                        to={`/services/${service.slug}`}
                        className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center group w-full"
                      >
                        <span className="relative z-10 flex items-center">
                          Detayları Gör
                          <HiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        
        <div className="container-custom text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
          >
            Özel bir projeniz mi var?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg"
          >
            Yukarıdaki hizmetler dışında özel yazılım ihtiyaçlarınız için de iletişime geçebilirsiniz.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/contact"
              className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 inline-flex items-center group"
            >
              <span className="relative z-10 flex items-center">
                Teklif Alın
                <HiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
