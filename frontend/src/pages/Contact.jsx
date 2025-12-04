import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import api, { contactAPI } from '../services/api'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

export default function Contact() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
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

  const onSubmit = async (data) => {
    setLoading(true)
    setSuccess(false)
    setError('')

    try {
      await contactAPI.submit(data)
      setSuccess(true)
      reset()
    } catch (err) {
      setError('Mesaj gönderilemedi. Lütfen tekrar deneyin.')
      console.error('Contact form error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-purple-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                İletişim
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Projeniz hakkında konuşalım! Sorularınız için bana ulaşın.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                İletişim Bilgileri
              </h2>
              <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                Herhangi bir sorunuz veya proje fikriniz varsa, benimle iletişime geçmekten çekinmeyin.
                Size en kısa sürede geri dönüş yapacağım!
              </p>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="group flex items-start p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="bg-gradient-to-r from-primary-500 to-purple-500 p-4 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                    <FaEnvelope className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-lg">E-posta</h3>
                    <a 
                      href={`mailto:${content?.contact?.email || 'info@cagdas.com'}`} 
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {content?.contact?.email || 'info@cagdas.com'}
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="group flex items-start p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                    <FaPhone className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-lg">Telefon</h3>
                    <a 
                      href={`tel:${content?.contact?.phone || '+905555555555'}`} 
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {content?.contact?.phone || '+90 555 555 55 55'}
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="group flex items-start p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                    <FaMapMarkerAlt className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-lg">Konum</h3>
                    <p className="text-gray-600">{content?.contact?.address || 'İstanbul, Türkiye'}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
              
              <div className="relative bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Mesaj Gönderin
                </h2>

              {success && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                  Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Ad soyad gerekli' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'E-posta gerekli',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Geçersiz e-posta adresi'
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şirket
                  </label>
                  <input
                    type="text"
                    {...register('company')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İlgilendiğiniz Hizmet
                  </label>
                  <select
                    {...register('service')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Seçiniz...</option>
                    <option value="web">Web Sitesi</option>
                    <option value="erp">Mini ERP</option>
                    <option value="sms">Toplu SMS</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konu *
                  </label>
                  <input
                    type="text"
                    {...register('subject', { required: 'Konu gerekli' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mesaj *
                  </label>
                  <textarea
                    {...register('message', { required: 'Mesaj gerekli' })}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 group"
                >
                  <span className="relative z-10">
                    {loading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
