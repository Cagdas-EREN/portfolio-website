import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { HiClock, HiCalendar, HiEye, HiArrowRight } from 'react-icons/hi'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'

export default function Blog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs')
      const publishedBlogs = response.data.data
      setBlogs(publishedBlogs)
      
      // Extract unique categories
      const uniqueCategories = ['all', ...new Set(publishedBlogs.map(blog => blog.category))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBlogs = selectedCategory === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory)

  return (
    <div>
      <section className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-purple-900 py-24 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="container-custom text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Yazılım geliştirme, teknoloji ve daha fazlası hakkında yazılar
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gradient-to-b from-white to-gray-50 border-b border-gray-100">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:shadow-md border border-gray-200 hover:border-primary-300'
                }`}
              >
                {category === 'all' ? 'Tümü' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom">
          {loading ? (
            <div className="text-center text-gray-600">Yükleniyor...</div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center text-gray-600">
              {selectedCategory === 'all' 
                ? 'Henüz blog yazısı yok.'
                : `${selectedCategory} kategorisinde yazı bulunamadı.`}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <article key={blog._id} className="group">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col hover:-translate-y-2 border border-gray-100">
                    {blog.featuredImage ? (
                      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary-400 to-purple-600">
                        <img 
                          src={`${BASE_URL}${blog.featuredImage}`} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="h-52 bg-gradient-to-br from-primary-400 via-purple-500 to-pink-600"></div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-full text-xs font-bold">
                          {blog.category}
                        </span>
                        {blog.tags?.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-2.5 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 group-hover:from-primary-600 group-hover:to-purple-600 transition-all">
                        {blog.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-1 leading-relaxed">
                        {blog.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <HiCalendar className="h-4 w-4 text-primary-500" />
                            {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <HiClock className="h-4 w-4 text-purple-500" />
                            {blog.readTime} dk
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <HiEye className="h-4 w-4 text-pink-500" />
                          {blog.views || 0}
                        </span>
                      </div>
                      
                      <Link 
                        to={`/blog/${blog.slug}`}
                        className="relative overflow-hidden inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group/btn"
                      >
                        <span className="relative z-10 flex items-center">
                          Devamını Oku
                          <HiArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
