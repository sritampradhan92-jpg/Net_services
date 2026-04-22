import axios from "axios";

const isLocalHost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const defaultBaseURL = isLocalHost
  ? "http://localhost:5000"
  : "https://netcom-backend.onrender.com";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("netcom_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally (token expired)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("netcom_token");
      if (window.location.pathname.startsWith("/admin/dashboard")) {
        window.location.href = "/admin";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
