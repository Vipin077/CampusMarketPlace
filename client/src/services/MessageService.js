import api from "../utils/axiosConfig";

const MessageService = {

  // =========================================================
  // SEND MESSAGE USING REST
  // WebSocket will normally be used for real-time messaging
  // =========================================================

  async sendMessage(receiverEmail, content, taskId = null) {
    const response = await api.post("/messages", {
      receiverEmail,
      content,
      taskId,
    });

    return response.data;
  },

  // =========================================================
  // GET CONVERSATION WITH A USER
  // =========================================================

  async getConversation(email) {
    const response = await api.get(
      "/messages/conversation",
      {
        params: {
          email,
        },
      }
    );

    return response.data;
  },

  // =========================================================
  // GET ALL CONVERSATIONS
  // =========================================================

  async getConversations() {
    const response = await api.get(
      "/messages/conversations"
    );

    return response.data;
  },

  // =========================================================
  // MARK CONVERSATION AS READ
  // =========================================================

  async markAsRead(senderEmail) {
    await api.put("/messages/read", null, {
      params: {
        senderEmail,
      },
    });
  },

  // =========================================================
  // GET TOTAL UNREAD COUNT
  // =========================================================

  async getUnreadCount() {
    const response = await api.get(
      "/messages/unread-count"
    );

    return response.data.count;
  },
};

export default MessageService;