import api from "../utils/axiosConfig";

const UserService = {

  async getUser(id) {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  async getUserByEmail(email) {
    const res = await api.get(`/users/email/${email}`);
    return res.data;
  }

};

export default UserService;