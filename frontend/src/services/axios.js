// frontend/src/services/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // or your Docker exposed backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default axiosInstance;
