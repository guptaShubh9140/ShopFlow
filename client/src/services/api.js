import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      "shopflow_token"
    );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid JWT
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {

      localStorage.removeItem(
        "shopflow_token"
      );

      localStorage.removeItem(
        "shopflow_user"
      );

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;