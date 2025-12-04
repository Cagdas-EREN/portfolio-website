import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Services API
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getBySlug: (slug) => api.get(`/services/${slug}`),
};

// Projects API
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getBySlug: (slug) => api.get(`/projects/${slug}`),
};

// Blog API
export const blogAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
};

// Contact API
export const contactAPI = {
  submit: (data) => api.post('/contacts', data),
};

// Content API
export const contentAPI = {
  getAll: (section) => api.get('/content', { params: { section } }),
  getByKey: (key) => api.get(`/content/${key}`),
};

export default api;
