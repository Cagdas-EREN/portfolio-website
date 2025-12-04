import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { HiPlus, HiPencil, HiTrash, HiX, HiEye } from 'react-icons/hi'
import Swal from 'sweetalert2'

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs/admin/all')
      setBlogs(response.data.data)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Blog yazıları yüklenirken hata oluştu',
        confirmButtonColor: '#3b82f6'
      })
    } finally {
      setLoading(false)
    }
  }

  const openModal = (blog = null) => {
    setEditingBlog(blog)
    if (blog) {
      setValue('title', blog.title)
      setValue('slug', blog.slug)
      setValue('excerpt', blog.excerpt)
      setValue('content', blog.content)
      setValue('category', blog.category)
      setValue('tags', blog.tags?.join(', ') || '')
      setValue('featuredImage', blog.featuredImage || '')
      setValue('readTime', blog.readTime || 5)
      setValue('isPublished', blog.isPublished)
    } else {
      reset()
      setValue('readTime', 5)
      setValue('isPublished', false)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingBlog(null)
    reset()
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploadingImage(true)
    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setValue('featuredImage', response.data.filePath)
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Resim başarıyla yüklendi!',
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
      setUploadingImage(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        readTime: parseInt(data.readTime) || 5
      }

      if (editingBlog) {
        await api.put(`/blogs/${editingBlog._id}`, formattedData)
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Blog yazısı başarıyla güncellendi!',
          confirmButtonColor: '#3b82f6',
          timer: 2000
        })
      } else {
        await api.post('/blogs', formattedData)
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Blog yazısı başarıyla eklendi!',
          confirmButtonColor: '#3b82f6',
          timer: 2000
        })
      }

      closeModal()
      fetchBlogs()
    } catch (error) {
      console.error('Error saving blog:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Blog yazısı kaydedilirken hata oluştu: ' + (error.response?.data?.message || error.message),
        confirmButtonColor: '#3b82f6'
      })
    }
  }

  const deleteBlog = async (id) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: 'Bu blog yazısını silmek istediğinizden emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'İptal'
    })

    if (!result.isConfirmed) return

    try {
      await api.delete(`/blogs/${id}`)
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Blog yazısı başarıyla silindi!',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      })
      fetchBlogs()
    } catch (error) {
      console.error('Error deleting blog:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Blog yazısı silinirken hata oluştu',
        confirmButtonColor: '#3b82f6'
      })
    }
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Yazıları</h1>
          <p className="text-gray-600 mt-2">Blog yazılarınızı yönetin</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center">
          <HiPlus className="mr-2" />
          Yeni Yazı Ekle
        </button>
      </div>

      {loading ? (
        <div className="card text-center py-12">Yükleniyor...</div>
      ) : (
        <div className="card">
          {blogs.length === 0 ? (
            <p className="text-gray-600 text-center py-12">Henüz blog yazısı eklenmemiş</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Görüntülenme</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="table-row">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{blog.title}</div>
                        <div className="text-sm text-gray-500">{blog.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <HiEye className="mr-1" />
                          {blog.views || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          blog.isPublished 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {blog.isPublished ? 'Yayında' : 'Taslak'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openModal(blog)}
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                          <HiPencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteBlog(blog._id)}
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
                {editingBlog ? 'Blog Yazısı Düzenle' : 'Yeni Blog Yazısı Ekle'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <HiX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Başlık */}
                <div className="md:col-span-2">
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
                    placeholder="ornek-blog-yazisi"
                  />
                  {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <input
                    type="text"
                    {...register('category', { required: 'Kategori gerekli' })}
                    className="input-field"
                    placeholder="Teknoloji, Yazılım, vb."
                  />
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>

                {/* Etiketler */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiketler (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    {...register('tags')}
                    className="input-field"
                    placeholder="react, javascript, web"
                  />
                </div>

                {/* Okuma Süresi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Okuma Süresi (dakika)
                  </label>
                  <input
                    type="number"
                    {...register('readTime')}
                    className="input-field"
                    defaultValue={5}
                    min={1}
                  />
                </div>
              </div>

              {/* Öne Çıkan Görsel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öne Çıkan Görsel
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    {...register('featuredImage')}
                    className="input-field"
                    placeholder="/uploads/blog-image.jpg"
                    readOnly
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      disabled={uploadingImage}
                    />
                    {uploadingImage && <span className="text-sm text-gray-500">Yükleniyor...</span>}
                  </div>
                </div>
              </div>

              {/* Özet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Özet *
                </label>
                <textarea
                  {...register('excerpt', { required: 'Özet gerekli', maxLength: 300 })}
                  rows="3"
                  className="input-field"
                  maxLength={300}
                  placeholder="Blog yazısının kısa özeti (max 300 karakter)"
                ></textarea>
                {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>}
              </div>

              {/* İçerik */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İçerik *
                </label>
                <textarea
                  {...register('content', { required: 'İçerik gerekli' })}
                  rows="12"
                  className="input-field font-mono text-sm"
                  placeholder="Blog yazısının tam içeriği..."
                ></textarea>
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Markdown formatı desteklenir
                </p>
              </div>

              {/* Yayında mı? */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isPublished')}
                  className="h-4 w-4 text-primary-600 rounded"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Yayınla (İşaretlenmezse taslak olarak kaydedilir)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 border-t pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  İptal
                </button>
                <button type="submit" className="btn-primary">
                  {editingBlog ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
