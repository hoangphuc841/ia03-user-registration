import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function refreshAuthToken(refreshToken: string) {
  const rs = await axios.post(`${API_URL}/auth/refresh`, {
    refreshToken,
  });
  
  const { access_token, refresh_token } = rs.data;

  // Manually dispatch storage event to update AuthContext in all tabs
  localStorage.setItem('token', access_token);
  localStorage.setItem('refreshToken', refresh_token);
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: 'token',
      newValue: access_token,
    })
  );
  
  return access_token;
}

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add the access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && originalRequest.url === '/auth/login') {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // --- Use the new function ---
        const newAccessToken = await refreshAuthToken(refreshToken);
        
        // Update the header and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;