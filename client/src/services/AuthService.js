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

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};

export default AuthService;