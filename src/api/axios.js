import axios from "axios";
import { _DecryptService } from "../services/cryptoService";
import { API_BASE_URL } from "./config";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the decrypted token from sessionStorage on every request
api.interceptors.request.use(
  (config) => {
    // Axios serializes FormData as JSON when application/json is preset.
    // Leave Content-Type empty so the browser adds multipart/form-data + boundary.
    if (config.data instanceof FormData) {
      if (typeof config.headers?.setContentType === "function") {
        config.headers.setContentType(undefined);
      } else if (config.headers) {
        delete config.headers["Content-Type"];
      }
    }

    const encryptedToken = sessionStorage.getItem("pos_token");

    if (encryptedToken) {
      const rawToken = _DecryptService(encryptedToken);
      if (rawToken) {
        config.headers.Authorization = `Bearer ${rawToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally — clear session and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("pos_token");
      sessionStorage.removeItem("pos_role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
