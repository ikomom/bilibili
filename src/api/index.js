import axios from 'axios'
import { ElMessage } from 'element-plus'

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
    // 处理401未授权错误
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/admin/login'
      return Promise.reject(error)
    }

    // 统一错误处理
    if (error.response?.data?.message) {
      const message = error.response.data.message
      if (Array.isArray(message)) {
        ElMessage.error(message.join(', '))
      } else {
        ElMessage.error(message)
      }
    } else if (error.message) {
      // 网络错误或其他错误
      if (error.message.includes('timeout')) {
        ElMessage.error('请求超时，请重试')
      } else if (error.message.includes('Network Error')) {
        ElMessage.error('网络连接失败，请检查网络')
      } else {
        ElMessage.error('操作失败，请重试')
      }
    } else {
      ElMessage.error('操作失败，请重试')
    }

    return Promise.reject(error)
  }
)

// 认证API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getUsers: (params) => api.get('/auth/users', { params }),
  getUser: (id) => api.get(`/auth/users/${id}`),
  updateUser: (id, userData) => api.put(`/auth/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
  toggleUserStatus: (id) => api.put(`/auth/users/${id}/toggle-status`)
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
  incrementViews: (id) => api.post(`/images/${id}/view`),
  incrementLikes: (id) => api.post(`/images/${id}/like`),
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