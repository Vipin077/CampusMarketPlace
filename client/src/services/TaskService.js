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

  async getAcceptedTasks() {
    const res = await api.get("/tasks/accepted");
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

  async createTask(task, attachment) {
    const formData = new FormData();

    formData.append(
      "task",
      new Blob([JSON.stringify(task)], {
        type: "application/json",
      })
    );

    if (attachment) {
      formData.append("attachment", attachment);
    }

    const res = await api.post("/tasks", formData);

    return res.data;
  },

  // Download original task attachment
  async downloadAttachment(taskId) {
    const response = await api.get(
      `/tasks/${taskId}/attachment`,
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(response.data);

    const link = document.createElement("a");
    link.href = url;

    const disposition =
      response.headers["content-disposition"];

    let fileName = "attachment";

    if (disposition) {
      const match = disposition.match(/filename="(.+)"/);

      if (match) {
        fileName = match[1];
      }
    }

    link.setAttribute("download", fileName);

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  },

  // Download submitted work proof
  async downloadProof(taskId) {
    const response = await api.get(
      `/tasks/${taskId}/proof`,
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(response.data);

    const link = document.createElement("a");
    link.href = url;

    const disposition =
      response.headers["content-disposition"];

    let fileName = "proof";

    if (disposition) {
      const match = disposition.match(/filename="(.+)"/);

      if (match) {
        fileName = match[1];
      }
    }

    link.setAttribute("download", fileName);

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  },

  async updateTask(id, task, attachment) {
    const formData = new FormData();

    formData.append(
      "task",
      new Blob([JSON.stringify(task)], {
        type: "application/json",
      })
    );

    if (attachment) {
      formData.append("attachment", attachment);
    }

    const res = await api.put(
      `/tasks/${id}`,
      formData
    );

    return res.data;
  },

  async acceptTask(id) {
    const res = await api.post(
      `/tasks/${id}/accept`
    );

    return res.data;
  },

  async submitWork(id, completionMessage, proof) {
    const formData = new FormData();

    formData.append(
      "completionMessage",
      completionMessage
    );

    if (proof) {
      formData.append("proof", proof);
    }

    const res = await api.post(
      `/tasks/${id}/submit-work`,
      formData
    );

    return res.data;
  },

  // Approve submitted work
  async approveTask(id) {
    const res = await api.post(
      `/tasks/${id}/approve`
    );

    return res.data;
  },

  // Reject submitted work
  async rejectTask(id) {
    const res = await api.post(
      `/tasks/${id}/reject`
    );

    return res.data;
  },

  async deleteTask(id) {
    const res = await api.delete(
      `/tasks/${id}`
    );

    return res.data;
  },
};

export default TaskService;