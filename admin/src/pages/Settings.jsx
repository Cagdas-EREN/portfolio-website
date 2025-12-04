import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { HiSave, HiLockClosed, HiUser, HiGlobe, HiMail } from 'react-icons/hi'
import Swal from 'sweetalert2'

export default function Settings() {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState(null)
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, setValue: setProfileValue } = useForm()
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm()
  const { register: registerContent, handleSubmit: handleContentSubmit, formState: { errors: contentErrors }, setValue: setContentValue } = useForm()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await api.get('/content')
      if (response.data.data.length > 0) {
        const contentData = response.data.data[0]
        setContent(contentData)
        
        // Set content form values
        setContentValue('hero.title', contentData.hero?.title)
        setContentValue('hero.subtitle', contentData.hero?.subtitle)
        setContentValue('hero.description', contentData.hero?.description)
        setContentValue('about.title', contentData.about?.title)
        setContentValue('about.description', contentData.about?.description)
        setContentValue('about.yearsOfExperience', contentData.about?.yearsOfExperience)
        setContentValue('skills', contentData.skills?.join(', '))
        setContentValue('contact.email', contentData.contact?.email)
        setContentValue('contact.phone', contentData.contact?.phone)
        setContentValue('contact.address', contentData.contact?.address)
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    }
  }

  const onProfileSubmit = async (data) => {
    setLoading(true)
    try {
      // Profile update would go here - currently we don't have user update endpoint
      Swal.fire({
        icon: 'info',
        title: 'Bilgi',
        text: 'Profil güncelleme özelliği yakında eklenecek',
        confirmButtonColor: '#3b82f6'
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Profil güncellenirken hata oluştu: ' + error.message,
        confirmButtonColor: '#3b82f6'
      })
    } finally {
      setLoading(false)
    }
  }

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Yeni şifreler eşleşmiyor!',
        confirmButtonColor: '#3b82f6'
      })
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      })
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Şifre başarıyla değiştirildi!',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      })
      resetPassword()
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Şifre değiştirilirken hata oluştu: ' + (error.response?.data?.message || error.message),
        confirmButtonColor: '#3b82f6'
      })
    } finally {
      setLoading(false)
    }
  }

  const onContentSubmit = async (data) => {
    setLoading(true)
    try {
      const formattedData = {
        hero: {
          title: data.hero.title,
          subtitle: data.hero.subtitle,
          description: data.hero.description
        },
        about: {
          title: data.about.title,
          description: data.about.description,
          yearsOfExperience: parseInt(data.about.yearsOfExperience) || 0
        },
        skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [],
        contact: {
          email: data.contact.email,
          phone: data.contact.phone,
          address: data.contact.address
        }
      }

      if (content) {
        await api.put(`/content/${content._id}`, formattedData)
      } else {
        await api.post('/content', formattedData)
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Site içeriği başarıyla güncellendi!',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      })
      fetchContent()
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'İçerik güncellenirken hata oluştu: ' + (error.response?.data?.message || error.message),
        confirmButtonColor: '#3b82f6'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
        <p className="text-gray-600 mt-2">Site ayarlarını düzenleyin</p>
      </div>

      <div className="space-y-6">
        {/* Password Change */}
        <div className="card">
          <div className="flex items-center mb-6">
            <HiLockClosed className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-bold">Şifre Değiştir</h2>
          </div>
          
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mevcut Şifre *
                </label>
                <input
                  type="password"
                  {...registerPassword('currentPassword', { required: 'Mevcut şifre gerekli' })}
                  className="input-field"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Şifre *
                </label>
                <input
                  type="password"
                  {...registerPassword('newPassword', { 
                    required: 'Yeni şifre gerekli',
                    minLength: { value: 6, message: 'Şifre en az 6 karakter olmalı' }
                  })}
                  className="input-field"
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Şifre (Tekrar) *
                </label>
                <input
                  type="password"
                  {...registerPassword('confirmPassword', { required: 'Şifre tekrarı gerekli' })}
                  className="input-field"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary flex items-center">
                <HiSave className="mr-2" />
                Şifreyi Değiştir
              </button>
            </div>
          </form>
        </div>

        {/* Site Content */}
        <div className="card">
          <div className="flex items-center mb-6">
            <HiGlobe className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-bold">Site İçeriği</h2>
          </div>
          
          <form onSubmit={handleContentSubmit(onContentSubmit)} className="space-y-6">
            {/* Hero Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Ana Sayfa Hero</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                  <input
                    type="text"
                    {...registerContent('hero.title')}
                    className="input-field"
                    placeholder="Merhaba, Ben Çağdaş"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
                  <input
                    type="text"
                    {...registerContent('hero.subtitle')}
                    className="input-field"
                    placeholder="Yazılım Geliştirici"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    {...registerContent('hero.description')}
                    rows="3"
                    className="input-field"
                    placeholder="Modern web uygulamaları geliştiriyorum..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Hakkımda</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                  <input
                    type="text"
                    {...registerContent('about.title')}
                    className="input-field"
                    placeholder="Ben Kimim?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    {...registerContent('about.description')}
                    rows="4"
                    className="input-field"
                    placeholder="Kendimi tanıtan kısa bir metin..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deneyim Yılı</label>
                  <input
                    type="number"
                    {...registerContent('about.yearsOfExperience')}
                    className="input-field"
                    placeholder="3"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Yetenekler</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yetenekler (virgülle ayırın)
                </label>
                <textarea
                  {...registerContent('skills')}
                  rows="3"
                  className="input-field"
                  placeholder="JavaScript, React, Node.js, MongoDB, Python..."
                ></textarea>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">İletişim Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    {...registerContent('contact.email')}
                    className="input-field"
                    placeholder="info@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    {...registerContent('contact.phone')}
                    className="input-field"
                    placeholder="+90 555 123 4567"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                  <textarea
                    {...registerContent('contact.address')}
                    rows="2"
                    className="input-field"
                    placeholder="İstanbul, Türkiye"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button type="submit" disabled={loading} className="btn-primary flex items-center">
                <HiSave className="mr-2" />
                İçeriği Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
