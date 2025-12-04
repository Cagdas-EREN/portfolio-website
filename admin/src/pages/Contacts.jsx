import { useState, useEffect } from 'react'
import api from '../services/api'
import { HiMail, HiPhone, HiBriefcase, HiX, HiEye, HiTrash, HiCheckCircle, HiArchive } from 'react-icons/hi'
import Swal from 'sweetalert2'

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedContact, setSelectedContact] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [filter])

  const fetchContacts = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await api.get('/contacts', { params })
      setContacts(response.data.data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const viewContact = async (contact) => {
    setSelectedContact(contact)
    setIsModalOpen(true)
    
    // Mark as read if it's new
    if (contact.status === 'new') {
      await updateStatus(contact._id, 'read')
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/contacts/${id}`, { status })
      fetchContacts()
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact({ ...selectedContact, status })
      }
    } catch (error) {
      console.error('Error updating status:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Durum güncellenirken hata oluştu',
        confirmButtonColor: '#3b82f6'
      })
    }
  }

  const deleteContact = async (id) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: 'Bu mesajı silmek istediğinizden emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'İptal'
    })

    if (!result.isConfirmed) return

    try {
      await api.delete(`/contacts/${id}`)
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Mesaj başarıyla silindi!',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      })
      setIsModalOpen(false)
      setSelectedContact(null)
      fetchContacts()
    } catch (error) {
      console.error('Error deleting contact:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Mesaj silinirken hata oluştu',
        confirmButtonColor: '#3b82f6'
      })
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      new: 'bg-blue-100 text-blue-700',
      read: 'bg-gray-100 text-gray-700',
      replied: 'bg-green-100 text-green-700',
      archived: 'bg-yellow-100 text-yellow-700'
    }
    const labels = {
      new: 'Yeni',
      read: 'Okundu',
      replied: 'Yanıtlandı',
      archived: 'Arşivlendi'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mesajlar</h1>
        <p className="text-gray-600 mt-2">Gelen mesajları görüntüleyin ve yönetin</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {['all', 'new', 'read', 'replied', 'archived'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {f === 'all' ? 'Tümü' : f === 'new' ? 'Yeni' : f === 'read' ? 'Okundu' : f === 'replied' ? 'Yanıtlandı' : 'Arşiv'}
          </button>
        ))}
      </div>

      {/* Contacts List */}
      <div className="card">
        {loading ? (
          <div className="text-center py-12">Yükleniyor...</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12 text-gray-600">Mesaj bulunamadı</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İsim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İletişim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Konu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact._id} className="table-row">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {contact.status === 'new' && (
                          <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{contact.name}</div>
                          {contact.company && (
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <HiBriefcase className="h-4 w-4 mr-1" />
                              {contact.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center text-gray-900">
                        <HiMail className="h-4 w-4 mr-2" />
                        {contact.email}
                      </div>
                      {contact.phone && (
                        <div className="flex items-center text-gray-500 mt-1">
                          <HiPhone className="h-4 w-4 mr-2" />
                          {contact.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{contact.subject}</div>
                      <div className="text-xs text-gray-500 line-clamp-1 mt-1">{contact.message}</div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(contact.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => viewContact(contact)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        <HiEye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mesaj Detayı</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <HiX className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  {getStatusBadge(selectedContact.status)}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(selectedContact.createdAt).toLocaleString('tr-TR')}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İsim</label>
                  <div className="text-gray-900">{selectedContact.name}</div>
                </div>
                
                {selectedContact.company && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Şirket</label>
                    <div className="text-gray-900 flex items-center">
                      <HiBriefcase className="h-4 w-4 mr-2 text-gray-500" />
                      {selectedContact.company}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <div className="text-gray-900 flex items-center">
                    <HiMail className="h-4 w-4 mr-2 text-gray-500" />
                    <a href={`mailto:${selectedContact.email}`} className="text-primary-600 hover:underline">
                      {selectedContact.email}
                    </a>
                  </div>
                </div>

                {selectedContact.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <div className="text-gray-900 flex items-center">
                      <HiPhone className="h-4 w-4 mr-2 text-gray-500" />
                      <a href={`tel:${selectedContact.phone}`} className="text-primary-600 hover:underline">
                        {selectedContact.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                <div className="text-gray-900 font-medium">{selectedContact.subject}</div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj</label>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-900 whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <button
                  onClick={() => updateStatus(selectedContact._id, 'replied')}
                  disabled={selectedContact.status === 'replied'}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <HiCheckCircle className="h-5 w-5 mr-2" />
                  Yanıtlandı Olarak İşaretle
                </button>

                <button
                  onClick={() => updateStatus(selectedContact._id, 'archived')}
                  disabled={selectedContact.status === 'archived'}
                  className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <HiArchive className="h-5 w-5 mr-2" />
                  Arşivle
                </button>

                <button
                  onClick={() => deleteContact(selectedContact._id)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-auto"
                >
                  <HiTrash className="h-5 w-5 mr-2" />
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
