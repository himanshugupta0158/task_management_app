import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/api/" });

const skipAuthPaths = [
  "/users/auth/login/",
  "/users/auth/register/",
  "/users/auth/logout/",
  "/users/auth/refresh/",
];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  const needsAuth = !skipAuthPaths.some((path) => config.url.endsWith(path));
  if (token && needsAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    // Only clear if we actually had a token to begin with
    const hadToken = localStorage.getItem("access");

    if ((status === 401 || status === 403) && hadToken) {
      console.warn("Access token expired. Logging out.");
      localStorage.clear();
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default api;
