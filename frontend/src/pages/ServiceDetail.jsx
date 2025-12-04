import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { servicesAPI } from '../services/api'
import { HiArrowLeft, HiCheck } from 'react-icons/hi'

export default function ServiceDetail() {
  const { slug } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await servicesAPI.getBySlug(slug)
        setService(response.data.data)
      } catch (error) {
        console.error('Error fetching service:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [slug])

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="container-custom">Yükleniyor...</div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="py-20 text-center">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-4">Hizmet bulunamadı</h2>
          <Link to="/services" className="text-primary-600 hover:underline">
            Hizmetler sayfasına dön
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
          <Link to="/services" className="inline-flex items-center text-primary-600 mb-6 hover:underline">
            <HiArrowLeft className="mr-2" />
            Tüm Hizmetler
          </Link>
          <div className="text-6xl mb-4">{service.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {service.title}
          </h1>
          <p className="text-xl text-gray-700">{service.shortDescription}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-gray-700">{service.description}</p>
          </div>

          {/* Features */}
          {service.features && service.features.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Özellikler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <HiCheck className="text-primary-600 text-xl mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {service.technologies && service.technologies.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Kullanılan Teknolojiler</h2>
              <div className="flex flex-wrap gap-3">
                {service.technologies.map((tech, index) => (
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

          {/* Pricing */}
          {service.pricing && service.pricing.startingPrice > 0 && (
            <div className="bg-gray-50 p-8 rounded-xl mb-12">
              <h2 className="text-2xl font-bold mb-4">Fiyatlandırma</h2>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {service.pricing.startingPrice.toLocaleString('tr-TR')} {service.pricing.currency}
              </div>
              <p className="text-gray-600">başlayan fiyatlarla</p>
            </div>
          )}

          {/* CTA */}
          <div className="bg-primary-600 text-white p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-4">Bu hizmeti almak ister misiniz?</h3>
            <p className="mb-6">
              Detaylı bilgi almak ve teklif talep etmek için iletişime geçin.
            </p>
            <Link to="/contact" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 inline-block">
              Teklif Alın
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
