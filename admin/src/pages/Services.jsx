import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi'
import Swal from 'sweetalert2'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await api.get('/services/admin/all')
      setServices(response.data.data)
    } catch (error) {
      console.error('Error fetching services:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Hizmetler yüklenirken hata oluştu',
        confirmButtonColor: '#3b82f6'
      })
    } finally {
      setLoading(false)
    }
  }

  const openModal = (service = null) => {
    setEditingService(service)
    if (service) {
      setValue('title', service.title)
      setValue('slug', service.slug)
      setValue('shortDescription', service.shortDescription)
      setValue('description', service.description)
      setValue('icon', service.icon)
      setValue('features', service.features?.join('\n') || '')
      setValue('technologies', service.technologies?.join('\n') || '')
      setValue('startingPrice', service.pricing?.startingPrice || 0)
      setValue('pricingType', service.pricing?.pricingType || 'custom')
      setValue('currency', service.pricing?.currency || 'TRY')
      setValue('isActive', service.isActive)
      setValue('order', service.order || 0)
    } else {
      reset()
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingService(null)
    reset()
  }

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        features: data.features ? data.features.split('\n').filter(f => f.trim()) : [],
        technologies: data.technologies ? data.technologies.split('\n').filter(t => t.trim()) : [],
        pricing: {
          startingPrice: parseInt(data.startingPrice) || 0,
          pricingType: data.pricingType,
          currency: data.currency
        }
      }

      if (editingService) {
        await api.put(`/services/${editingService._id}`, formattedData)
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Hizmet başarıyla güncellendi!',
          confirmButtonColor: '#3b82f6',
          timer: 2000
        })
      } else {
        await api.post('/services', formattedData)
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Hizmet başarıyla eklendi!',
          confirmButtonColor: '#3b82f6',
          timer: 2000
        })
      }

      closeModal()
      fetchServices()
    } catch (error) {
      console.error('Error saving service:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.response?.data?.message || error.message || 'Hizmet kaydedilirken hata oluştu',
        confirmButtonColor: '#3b82f6'
      })
    }
  }

  const deleteService = async (id) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: 'Bu hizmeti silmek istediğinizden emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'İptal'
    })

    if (!result.isConfirmed) return

    try {
      await api.delete(`/services/${id}`)
      Swal.fire({
        icon: 'success',
        title: 'Silindi!',
        text: 'Hizmet başarıyla silindi!',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      })
      fetchServices()
    } catch (error) {
      console.error('Error deleting service:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Hizmet silinirken hata oluştu',
        confirmButtonColor: '#3b82f6'
      })
    }
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hizmetler</h1>
          <p className="text-gray-600 mt-2">Hizmetlerinizi yönetin</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center">
          <HiPlus className="mr-2" />
          Yeni Hizmet Ekle
        </button>
      </div>

      {loading ? (
        <div className="card text-center py-12">Yükleniyor...</div>
      ) : (
        <div className="card">
          {services.length === 0 ? (
            <p className="text-gray-600 text-center py-12">Henüz hizmet eklenmemiş</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiyat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service._id} className="table-row">
                      <td className="px-6 py-4 text-2xl">{service.icon}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{service.title}</div>
                        <div className="text-sm text-gray-500">{service.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {service.shortDescription}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {service.pricing?.startingPrice > 0 ? (
                          <span className="font-medium">
                            {service.pricing.startingPrice.toLocaleString()} {service.pricing.currency}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          service.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {service.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{service.order}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openModal(service)}
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                          <HiPencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteService(service._id)}
                          className="text-red-600 hover:text-red-800 inline-flex items-center"
                        >
                          <HiTrash className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingService ? 'Hizmet Düzenle' : 'Yeni Hizmet Ekle'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <HiX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Başlık */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Başlık gerekli' })}
                    className="input-field"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    {...register('slug', { required: 'Slug gerekli' })}
                    className="input-field"
                    placeholder="ornek-hizmet"
                  />
                  {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    {...register('icon')}
                    className="input-field"
                    placeholder="🌐"
                  />
                </div>

                {/* Sıra */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sıra
                  </label>
                  <input
                    type="number"
                    {...register('order')}
                    className="input-field"
                    defaultValue={0}
                  />
                </div>
              </div>

              {/* Kısa Açıklama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kısa Açıklama *
                </label>
                <input
                  type="text"
                  {...register('shortDescription', { required: 'Kısa açıklama gerekli' })}
                  className="input-field"
                  maxLength={200}
                />
                {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message}</p>}
              </div>

              {/* Detaylı Açıklama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detaylı Açıklama *
                </label>
                <textarea
                  {...register('description', { required: 'Açıklama gerekli' })}
                  rows="4"
                  className="input-field"
                ></textarea>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              {/* Özellikler */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Özellikler (Her satıra bir özellik)
                </label>
                <textarea
                  {...register('features')}
                  rows="4"
                  className="input-field"
                  placeholder="Responsive Tasarım&#10;SEO Optimizasyonu&#10;Admin Panel"
                ></textarea>
              </div>

              {/* Teknolojiler */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teknolojiler (Her satıra bir teknoloji)
                </label>
                <textarea
                  {...register('technologies')}
                  rows="3"
                  className="input-field"
                  placeholder="React&#10;Node.js&#10;MongoDB"
                ></textarea>
              </div>

              {/* Fiyatlandırma */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Fiyatlandırma</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlangıç Fiyatı
                    </label>
                    <input
                      type="number"
                      {...register('startingPrice')}
                      className="input-field"
                      defaultValue={0}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fiyat Tipi
                    </label>
                    <select {...register('pricingType')} className="input-field">
                      <option value="custom">Özel</option>
                      <option value="fixed">Sabit</option>
                      <option value="hourly">Saatlik</option>
                      <option value="project">Proje Bazlı</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Para Birimi
                    </label>
                    <select {...register('currency')} className="input-field">
                      <option value="TRY">TRY</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Durum */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  defaultChecked={true}
                  className="h-4 w-4 text-primary-600 rounded"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Aktif
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 border-t pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  İptal
                </button>
                <button type="submit" className="btn-primary">
                  {editingService ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
