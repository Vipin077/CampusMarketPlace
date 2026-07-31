import api from "../utils/axiosConfig";

const NotificationService = {

  // =====================================================
  // GET ALL NOTIFICATIONS OF LOGGED-IN USER
  // =====================================================

  async getMyNotifications() {
    const response = await api.get(
      "/notifications"
    );

    return response.data;
  },

  // =====================================================
  // GET UNREAD NOTIFICATION COUNT
  // =====================================================

  async getUnreadCount() {
    const response = await api.get(
      "/notifications/unread-count"
    );

    // Backend response:
    // {
    //   "count": 3
    // }

    return response.data.count;
  },

  // =====================================================
  // MARK ONE NOTIFICATION AS READ
  // =====================================================

  async markAsRead(notificationId) {
    const response = await api.put(
      `/notifications/${notificationId}/read`
    );

    return response.data;
  },

  // =====================================================
  // MARK ALL NOTIFICATIONS AS READ
  // =====================================================

  async markAllAsRead() {
    const response = await api.put(
      "/notifications/read-all"
    );

    return response.data;
  },
};

export default NotificationService;