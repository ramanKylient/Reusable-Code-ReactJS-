import axios from "axios";

const axiosHandler = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});
console.log("baseURL", process.env.REACT_APP_BASE_URL);

// Request interceptor
axiosHandler.interceptors.request.use(
  async (config) => {
    try {
      if (!config.url.includes("/auth/admin/sign-in")) {
        const token = localStorage.getItem("token");
        if (token !== undefined && token !== null) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosHandler.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    try {
      if (!error.config.url.includes("/auth/sign-in")) {
        if (error.response) {
          const { status } = error.response;
          if (status === 403) {
            localStorage.removeItem("token");

            window.location.href = "/login";
          }
        }
      }
      return Promise.reject(error);
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export default axiosHandler;
