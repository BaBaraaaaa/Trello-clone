import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL || "/api";

const axiosClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Ensure headers object exists
      config.headers = config.headers || {};
      // Attach Authorization header
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          // Request new access token
          const { data } = await axios.post(
            `${BASE_API_URL}/auth/refresh`,
            { refreshToken }
          );
          const newToken = data.accessToken;
          // Save new token
          localStorage.setItem("accessToken", newToken);
          // Update default header
          axiosClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          // Retry original request
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
  } catch {
          // Refresh failed—clear state and redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userData");
          window.location.href = "/auth/login";
        }
      } else {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);
export default axiosClient;
