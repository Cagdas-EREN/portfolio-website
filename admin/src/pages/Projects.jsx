import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { HiPlus, HiPencil, HiTrash, HiX, HiStar } from 'react-icons/hi'
import Swal from 'sweetalert2'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [projectImages, setProjectImages] = useState([])
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm()

  const categories = [
    { value: 'web', label: 'Web' },
    { value: 'mobile', label: 'Mobil' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'erp', label: 'ERP' },
    { value: 'automation', label: 'Otomasyon' },
    { value: 'other', label: 'Diğer' }
  ]

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects/admin/all')
      setProjects(response.data.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Projeler yüklenirken hata oluştu',
        confirmButtonColor: '#3b82f6'
      })
    } finally {
      setLoading(false)
    }
  }

  const openModal = (project = null) => {
    setEditingProject(project)
    if (project) {
      setValue('title', project.title)
      setValue('slug', project.slug)
      setValue('shortDescription', project.shortDescription)
      setValue('description', project.description)
      setValue('category', project.category)
      setValue('thumbnail', project.thumbnail)
      setValue('client', project.client || '')
      setValue('completedDate', project.completedDate ? project.completedDate.split('T')[0] : '')
      setValue('projectUrl', project.projectUrl || '')
      setValue('githubUrl', project.githubUrl || '')
      setValue('features', project.features?.join('\n') || '')
      setValue('technologies', project.technologies?.join('\n') || '')
      setValue('isFeatured', project.isFeatured)
      setValue('isActive', project.isActive)
      setValue('order', project.order || 0)
      setProjectImages(project.images || [])
    } else {
      reset()
      setProjectImages([])
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
    setProjectImages([])
    reset()
  }

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploadingThumbnail(true)
    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setValue('thumbnail', response.data.filePath)
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Thumbnail başarıyla yüklendi!',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      })
    } catch (error) {
      console.error('Upload error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Resim yüklenirken hata oluştu',
        confirmButtonColor: '#3b82f6'
      })
    } finally {
      setUploadingThumbnail(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploadingImages(true)
    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      const newImage = {
        url: response.data.filePath,
        caption: ''
      }
      setProjectImages([...projectImages, newImage])
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Resim başarıyla eklendi!',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      })
    } catch (error) {
      console.error('Upload error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Resim yüklenirken hata oluştu',
        confirmButtonColor: '#3b82f6'
      })
    } finally {
      setUploadingImages(false)
    }
  }

  const updateImageCaption = (index, caption) => {
    const updated = [...projectImages]
    updated[index].caption = caption
    setProjectImages(updated)
  }

  const removeImage = (index) => {
    setProjectImages(projectImages.filter((_, i) => i !== index))
  }

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        features: data.features ? data.features.split('\n').filter(f => f.trim()) : [],
        technologies: data.technologies ? data.technologies.split('\n').filter(t => t.trim()) : [],
        completedDate: data.completedDate || null,
        images: projectImages
      }

      console.log('Formatted Data:', formattedData)

      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, formattedData)
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Proje başarıyla güncellendi!',
          confirmButtonColor: '#3b82f6',
          timer: 2000
        })
      } else {
        await api.post('/projects', formattedData)
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Proje başarıyla eklendi!',
          confirmButtonColor: '#3b82f6',
          timer: 2000
        })
      }

      closeModal()
      fetchProjects()
    } catch (error) {
      console.error('Error saving project:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Proje kaydedilirken hata oluştu: ' + (error.response?.data?.message || error.message),
        confirmButtonColor: '#3b82f6'
      })
    }
  }

  const deleteProject = async (id) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: 'Bu projeyi silmek istediğinizden emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'İptal'
    })

    if (!result.isConfirmed) return

    try {
      await api.delete(`/projects/${id}`)
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Proje başarıyla silindi!',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      })
      fetchProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Proje silinirken hata oluştu',
        confirmButtonColor: '#3b82f6'
      })
    }
  }

  const getCategoryLabel = (category) => {
    return categories.find(c => c.value === category)?.label || category
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projeler</h1>
          <p className="text-gray-600 mt-2">Portfolyo projelerinizi yönetin</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center">
          <HiPlus className="mr-2" />
          Yeni Proje Ekle
        </button>
      </div>

      {loading ? (
        <div className="card text-center py-12">Yükleniyor...</div>
      ) : (
        <div className="card">
          {projects.length === 0 ? (
            <p className="text-gray-600 text-center py-12">Henüz proje eklenmemiş</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project._id} className="table-row">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {project.isFeatured && (
                            <HiStar className="text-yellow-500 mr-2" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{project.title}</div>
                            <div className="text-sm text-gray-500">{project.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {getCategoryLabel(project.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {project.client || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          project.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {project.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{project.order}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openModal(project)}
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                          <HiPencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteProject(project._id)}
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
                {editingProject ? 'Proje Düzenle' : 'Yeni Proje Ekle'}
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
                    placeholder="ornek-proje"
                  />
                  {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    {...register('category', { required: 'Kategori gerekli' })}
                    className="input-field"
                  >
                    <option value="">Seçiniz...</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
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

                {/* Müşteri */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Müşteri
                  </label>
                  <input
                    type="text"
                    {...register('client')}
                    className="input-field"
                    placeholder="Şirket Adı"
                  />
                </div>

                {/* Tamamlanma Tarihi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamamlanma Tarihi
                  </label>
                  <input
                    type="date"
                    {...register('completedDate')}
                    className="input-field"
                  />
                </div>

                {/* Proje URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proje URL
                  </label>
                  <input
                    type="url"
                    {...register('projectUrl')}
                    className="input-field"
                    placeholder="https://example.com"
                  />
                </div>

                {/* GitHub URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    {...register('githubUrl')}
                    className="input-field"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kapak Resmi (Thumbnail)
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    {...register('thumbnail')}
                    className="input-field"
                    placeholder="/uploads/project.jpg"
                    readOnly
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      disabled={uploadingThumbnail}
                    />
                    {uploadingThumbnail && <span className="text-sm text-gray-500">Yükleniyor...</span>}
                  </div>
                  {watch('thumbnail') && (
                    <div className="mt-2">
                      <img 
                        src={`${BASE_URL}${watch('thumbnail')}`}
                        alt="Thumbnail önizleme"
                        className="w-full h-40 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Proje Resimleri */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proje Görselleri
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={uploadingImages}
                  />
                  {uploadingImages && <span className="text-sm text-gray-500">Yükleniyor...</span>}
                  
                  {/* Yüklenen Resimler */}
                  {projectImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {projectImages.map((img, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <img 
                            src={`${BASE_URL}${img.url}`} 
                            alt={`Proje görseli ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                          <input
                            type="text"
                            value={img.caption}
                            onChange={(e) => updateImageCaption(index, e.target.value)}
                            placeholder="Resim açıklaması (opsiyonel)"
                            className="input-field text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Kaldır
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                  placeholder="Responsive Tasarım&#10;Güvenli Ödeme Sistemi&#10;Admin Paneli"
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

              {/* Checkboxes */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isFeatured')}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Öne Çıkan Proje
                  </label>
                </div>

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
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 border-t pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  İptal
                </button>
                <button type="submit" className="btn-primary">
                  {editingProject ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
