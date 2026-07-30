import api from "../utils/axiosConfig";

const AuthService = {
  async login(credentials) {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  },

  async register(userData) {
    const res = await api.post("/auth/register", userData);
    return res.data;
  },

  saveAuth(data) {
    localStorage.setItem("token", data.token);
  },

  logout() {
    localStorage.removeItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};

export default AuthService;