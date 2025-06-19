import axios from "axios";
// Create an instance of Axios
const api = axios.create({
  baseURL: "http://localhost:8000", // backend URL
  withCredentials: false, // Don't send cookies since we're using localStorage
});

// Add a request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
