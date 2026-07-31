import api from "../utils/axiosConfig";

const TaskService = {

  // =========================================================
  // GET ALL TASKS
  // =========================================================

  async getAll() {
    const res = await api.get("/tasks");
    return res.data;
  },

  // =========================================================
  // GET MY CREATED TASKS
  // =========================================================

  async getMyTasks() {
    const res = await api.get("/tasks/my");
    return res.data;
  },

  // =========================================================
  // GET ACCEPTED TASKS
  // =========================================================

  async getAcceptedTasks() {
    const res = await api.get("/tasks/accepted");
    return res.data;
  },

  // =========================================================
  // EXPLORE TASKS
  // =========================================================

  async exploreTasks(params) {
    const res = await api.get("/tasks/explore", {
      params,
    });

    return res.data;
  },

  // =========================================================
  // GET TASK BY ID
  // =========================================================

  async getTask(id) {
    const res = await api.get(`/tasks/${id}`);

    return res.data;
  },

  // =========================================================
  // CREATE TASK
  // =========================================================

  async createTask(task, attachment) {
    const formData = new FormData();

    formData.append(
      "task",
      new Blob([JSON.stringify(task)], {
        type: "application/json",
      })
    );

    if (attachment) {
      formData.append(
        "attachment",
        attachment
      );
    }

    const res = await api.post(
      "/tasks",
      formData
    );

    return res.data;
  },

  // =========================================================
  // DOWNLOAD ORIGINAL TASK ATTACHMENT
  // =========================================================

  async downloadAttachment(taskId) {
    const response = await api.get(
      `/tasks/${taskId}/attachment`,
      {
        responseType: "blob",
      }
    );

    const url =
      window.URL.createObjectURL(
        response.data
      );

    const link =
      document.createElement("a");

    link.href = url;

    const disposition =
      response.headers["content-disposition"];

    let fileName = "attachment";

    if (disposition) {
      const match =
        disposition.match(
          /filename="(.+)"/
        );

      if (match) {
        fileName = match[1];
      }
    }

    link.setAttribute(
      "download",
      fileName
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  },

  // =========================================================
  // DOWNLOAD SUBMITTED WORK PROOF
  // =========================================================

  async downloadProof(taskId) {
    const response = await api.get(
      `/tasks/${taskId}/proof`,
      {
        responseType: "blob",
      }
    );

    const url =
      window.URL.createObjectURL(
        response.data
      );

    const link =
      document.createElement("a");

    link.href = url;

    const disposition =
      response.headers["content-disposition"];

    let fileName = "proof";

    if (disposition) {
      const match =
        disposition.match(
          /filename="(.+)"/
        );

      if (match) {
        fileName = match[1];
      }
    }

    link.setAttribute(
      "download",
      fileName
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  },

  // =========================================================
  // UPDATE TASK
  // =========================================================

  async updateTask(
    id,
    task,
    attachment
  ) {

    const formData =
      new FormData();

    formData.append(
      "task",
      new Blob(
        [JSON.stringify(task)],
        {
          type: "application/json",
        }
      )
    );

    if (attachment) {
      formData.append(
        "attachment",
        attachment
      );
    }

    const res = await api.put(
      `/tasks/${id}`,
      formData
    );

    return res.data;
  },

  // =========================================================
  // ACCEPT TASK
  // =========================================================

  async acceptTask(id) {
    const res = await api.post(
      `/tasks/${id}/accept`
    );

    return res.data;
  },

  // =========================================================
  // SUBMIT WORK
  // =========================================================

  async submitWork(
    id,
    completionMessage,
    proof
  ) {

    const formData =
      new FormData();

    formData.append(
      "completionMessage",
      completionMessage
    );

    if (proof) {
      formData.append(
        "proof",
        proof
      );
    }

    const res = await api.post(
      `/tasks/${id}/submit-work`,
      formData
    );

    return res.data;
  },

  // =========================================================
  // APPROVE SUBMITTED WORK
  // =========================================================

  async approveTask(id) {
    const res = await api.post(
      `/tasks/${id}/approve`
    );

    return res.data;
  },

  // =========================================================
  // REJECT SUBMITTED WORK
  // =========================================================

  async rejectTask(id) {
    const res = await api.post(
      `/tasks/${id}/reject`
    );

    return res.data;
  },

  // =========================================================
  // RATE WORKER
  // =========================================================

  async rateTask(
    id,
    rating,
    review = ""
  ) {

    const res = await api.post(
      `/tasks/${id}/rate`,
      {
        rating,
        review,
      }
    );

    return res.data;
  },

  // =========================================================
  // DELETE TASK
  // =========================================================

  async deleteTask(id) {
    const res = await api.delete(
      `/tasks/${id}`
    );

    return res.data;
  },
};

export default TaskService;