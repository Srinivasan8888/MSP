import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const id = localStorage.getItem("id");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (id) {
      config.headers['x-user-id'] = id;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
let retryCount = 0; // Global retry counter to prevent infinite retries

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && retryCount < 3) {
      originalRequest._retry = true;
      retryCount++;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.error("Refresh token is missing.");
          localStorage.clear();
          window.location.href = import.meta.env.VITE_LOGIN_URL || "login";
          return Promise.reject(error);
        }

        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_AUTH}/auth/refresh-token`,
          { refreshToken },
          { timeout: 5000 } // 5-second timeout
        );

        localStorage.setItem("accessToken", data.newAccessToken);
        localStorage.setItem("refreshToken", data.newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.newAccessToken}`;
        retryCount = 0; // Reset retry counter after successful refresh
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.clear();
        window.location.href = import.meta.env.VITE_LOGIN_URL || "login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;