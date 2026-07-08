import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Attach JWT on every request, if present
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export const chatApi = {
  sendMessage: (message) => api.post("/chat/message", { message }),
  getHistory: () => api.get("/chat/history"),
  getEmotion: () => api.get("/chat/emotion"),
};

export const planApi = {
  getRiskProfile: () => api.get("/plan/risk-profile"),
  generatePlan: () => api.post("/plan/generate"),
  getPlan: () => api.get("/plan"),
};

export default api;