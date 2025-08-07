import axios from "axios";

const api = axios.create({
  baseURL: "https://api.platinco.ir/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("platintoken");
    config.headers["Content-Type"] = "application/json";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      config.headers["Authorization"] = "";
      const isAuthRequest = config.url?.includes("/signin");
      if (isAuthRequest) {
        window.location.reload();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear all auth related data
      localStorage.removeItem("platintoken");
      localStorage.removeItem("workstatus");
      localStorage.removeItem("workTimer");
      localStorage.removeItem("lastWorkDuration");
      localStorage.removeItem("timeIntervals");
      
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
