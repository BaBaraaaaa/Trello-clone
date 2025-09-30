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
export default axiosClient;
