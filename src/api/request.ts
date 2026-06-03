import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import { useAuthStore } from '@/stores/auth'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 10000,
})

// === 请求拦截器：自动附加 JWT ===
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const auth = useAuthStore()
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// === 响应拦截器：统一错误处理 ===
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    const status = error.response?.status
    const auth = useAuthStore()

    switch (status) {
      case 400:
        console.error('请求参数错误')
        break
      case 401:
        auth.logout()
        location.hash = '/admin/login'
        break
      case 403:
        console.error('无权限访问')
        break
      case 404:
        console.error('资源不存在')
        break
      case 500:
        console.error('服务器错误')
        break
      default:
        console.error('网络异常', error.message)
    }
    return Promise.reject(error)
  }
)

export default service
