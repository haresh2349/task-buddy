import axios from "axios"
import type { InternalAxiosRequestConfig } from "axios";
import { getToken } from "../common-managers/common-manager";
console.log(import.meta.env.VITE_API_BASE_URL,"import.meta.env.VITE_API_BASE_URL")
export const axiosInstance = axios.create({
    baseURL:'http://localhost:8080/api/v1',
    timeout:30000,
    headers: {
        "Content-Type": "application/json",
    }
})

// Request Interceptor: Add tokens or modify request config
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = getToken();
      const isAuthRequire = config.headers['x-auth-require'] === false ? false : true ;
      if (isAuthRequire && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 401) {
        console.error("Unauthorized! Redirecting to login...");
      }
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;