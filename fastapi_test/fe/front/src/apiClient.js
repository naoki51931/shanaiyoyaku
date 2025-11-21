// fe/front/src/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  withCredentials: true, // Cookie も使うなら（不要なら消してOK）
});

// リクエストごとに Authorization を自動付与
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

