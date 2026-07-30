import api from "../utils/axiosConfig";

const TaskService = {
  async getAll() {
    const res = await api.get("/tasks");
    return res.data;
  },

  async getMyTasks() {
    const res = await api.get("/tasks/my");
    return res.data;
  },

  async exploreTasks(params) {
    const res = await api.get("/tasks/explore", {
      params,
    });
    return res.data;
  },

  async getTask(id) {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },

  async createTask(data) {
    const res = await api.post("/tasks", data);
    return res.data;
  },

  async updateTask(id, data) {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },

  async deleteTask(id) {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },
};

export default TaskService;