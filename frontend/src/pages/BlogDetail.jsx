import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { HiClock, HiCalendar, HiEye, HiArrowLeft, HiTag } from 'react-icons/hi'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'

export default function BlogDetail() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedBlogs, setRelatedBlogs] = useState([])

  useEffect(() => {
    fetchBlog()
  }, [slug])

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/slug/${slug}`)
      setBlog(response.data.data)
      
      // Fetch related blogs
      if (response.data.data.category) {
        const relatedResponse = await api.get('/blogs')
        const related = relatedResponse.data.data
          .filter(b => b.category === response.data.data.category && b._id !== response.data.data._id)
          .slice(0, 3)
        setRelatedBlogs(related)
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-xl">Yükleniyor...</div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog yazısı bulunamadı</h2>
          <Link to="/blog" className="text-primary-600 hover:text-primary-700">
            Blog sayfasına dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <section className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-purple-900 py-20 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container-custom max-w-4xl relative z-10">
          <Link to="/blog" className="inline-flex items-center text-primary-300 hover:text-white mb-6 font-medium transition-colors">
            <HiArrowLeft className="mr-2" />
            Bloga Dön
          </Link>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg">
              {blog.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <HiCalendar className="h-5 w-5 text-primary-400" />
              <span>{new Date(blog.createdAt).toLocaleDateString('tr-TR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiClock className="h-5 w-5 text-purple-400" />
              <span>{blog.readTime} dakika okuma</span>
            </div>
            <div className="flex items-center gap-2">
              <HiEye className="h-5 w-5 text-pink-400" />
              <span>{blog.views || 0} görüntülenme</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {blog.featuredImage && (
        <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="container-custom max-w-4xl">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={`${BASE_URL}${blog.featuredImage}`} 
                alt={blog.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <div className="text-xl text-gray-700 mb-8 font-medium leading-relaxed">
              {blog.excerpt}
            </div>
            
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {blog.content}
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center gap-3 flex-wrap">
                <HiTag className="h-5 w-5 text-gray-500" />
                {blog.tags.map((tag, index) => (
                  <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom max-w-6xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">İlgili Yazılar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link 
                  key={relatedBlog._id}
                  to={`/blog/${relatedBlog.slug}`}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow"
                >
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                    {relatedBlog.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 hover:text-primary-600 transition-colors">
                    {relatedBlog.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {relatedBlog.excerpt}
                  </p>
                  <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <HiClock className="h-3 w-3" />
                      {relatedBlog.readTime} dk
                    </span>
                    <span className="flex items-center gap-1">
                      <HiEye className="h-3 w-3" />
                      {relatedBlog.views || 0}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
