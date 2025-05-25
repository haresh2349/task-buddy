import axiosInstance from "./axios-instance";

interface ApiResponse<T> {
  data: T;
  status: number;
}
const api = {
  get: async <T>(url: string, params = {}): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.get<T>(url, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async <T>(
    url: string,
    data = {},
    config?: any
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.post<T>(url, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async <T>(
    url: string,
    data = {},
    config?: any
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.put<T>(url, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async <T>(url: string, data = {}): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.delete<T>(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request (if needed)
  patch: async <T>(url: string, data = {}): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.patch<T>(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
