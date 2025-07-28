import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

// 认证API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData)
}

// 图片API
export const imageAPI = {
  getImages: (params) => api.get('/images', { params }),
  getImage: (id) => api.get(`/images/${id}`),
  createImage: (formData) => api.post('/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateImage: (id, data) => api.patch(`/images/${id}`, data),
  deleteImage: (id) => api.delete(`/images/${id}`),
  incrementViews: (id) => api.post(`/images/${id}/views`),
  incrementLikes: (id) => api.post(`/images/${id}/likes`),
  getStats: () => api.get('/images/stats')
}

// 分类API
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.patch(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`)
}

// 轮播图API
export const bannerAPI = {
  getBanners: () => api.get('/banners'),
  getBannersForAdmin: () => api.get('/banners/admin'),
  getBanner: (id) => api.get(`/banners/${id}`),
  createBanner: (data) => api.post('/banners', data),
  updateBanner: (id, data) => api.patch(`/banners/${id}`, data),
  deleteBanner: (id) => api.delete(`/banners/${id}`),
  updateSortOrder: (id, sortOrder) => api.patch(`/banners/${id}/sort`, { sortOrder }),
  toggleActive: (id) => api.patch(`/banners/${id}/toggle`)
}

export default api