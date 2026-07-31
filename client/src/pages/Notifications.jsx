import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import NotificationService from "../services/NotificationService";

export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);

      const data =
        await NotificationService.getMyNotifications();

      setNotifications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // CLICK NOTIFICATION
  // =====================================================

  async function handleNotificationClick(notification) {
    try {
      // Mark as read only if unread
      if (!notification.read) {
        await NotificationService.markAsRead(
          notification.id
        );

        setNotifications((previous) =>
          previous.map((item) =>
            item.id === notification.id
              ? { ...item, read: true }
              : item
          )
        );
      }

      // Open related task
      if (notification.taskId) {
        navigate(`/task/${notification.taskId}`);
      }
    } catch (error) {
      console.error(
        "Failed to open notification:",
        error
      );

      alert("Unable to open notification.");
    }
  }

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  async function handleMarkAllAsRead() {
    try {
      setMarkingAll(true);

      await NotificationService.markAllAsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error(
        "Failed to mark notifications as read:",
        error
      );

      alert(
        "Unable to mark notifications as read."
      );
    } finally {
      setMarkingAll(false);
    }
  }

  // =====================================================
  // FORMAT DATE
  // =====================================================

  function formatDate(date) {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString();
  }

  // =====================================================
  // NOTIFICATION ICON
  // =====================================================

  function getNotificationIcon(type) {
    switch (type) {
      case "ACCEPTED":
        return "🤝";

      case "SUBMITTED":
        return "📤";

      case "APPROVED":
        return "✅";

      case "REJECTED":
        return "❌";

      default:
        return "🔔";
    }
  }

  const hasUnreadNotifications =
    notifications.some(
      (notification) => !notification.read
    );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">

          <div>
            <div className="flex items-center gap-3">

              <Bell
                size={30}
                className="text-blue-600"
              />

              <h1 className="text-3xl font-bold">
                Notifications
              </h1>

            </div>

            <p className="text-gray-500 mt-2">
              Stay updated with your tasks and work.
            </p>
          </div>

          {/* MARK ALL READ */}

          {hasUnreadNotifications && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition"
            >
              <CheckCheck size={18} />

              {markingAll
                ? "Marking..."
                : "Mark all as read"}
            </button>
          )}

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
            Loading notifications...
          </div>

        ) : notifications.length === 0 ? (

          /* EMPTY STATE */

          <div className="bg-white border rounded-2xl p-12 text-center">

            <Bell
              size={50}
              className="mx-auto text-gray-300"
            />

            <h2 className="text-xl font-semibold mt-4">
              No notifications yet
            </h2>

            <p className="text-gray-500 mt-2">
              Your task updates will appear here.
            </p>

          </div>

        ) : (

          /* NOTIFICATION LIST */

          <div className="space-y-3">

            {notifications.map((notification) => (

              <button
                key={notification.id}
                onClick={() =>
                  handleNotificationClick(
                    notification
                  )
                }
                className={`w-full text-left border rounded-xl p-5 transition hover:shadow-md ${
                  notification.read
                    ? "bg-white border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >

                <div className="flex items-start gap-4">

                  {/* ICON */}

                  <div className="h-12 w-12 rounded-full bg-white border flex items-center justify-center text-xl shrink-0">
                    {getNotificationIcon(
                      notification.type
                    )}
                  </div>

                  {/* CONTENT */}

                  <div className="flex-1">

                    <div className="flex items-start justify-between gap-4">

                      <h2
                        className={`text-lg ${
                          notification.read
                            ? "font-medium"
                            : "font-bold"
                        }`}
                      >
                        {notification.title}
                      </h2>

                      {/* UNREAD DOT */}

                      {!notification.read && (
                        <span className="h-3 w-3 bg-blue-600 rounded-full shrink-0 mt-2" />
                      )}

                    </div>

                    <p className="text-gray-600 mt-1">
                      {notification.message}
                    </p>

                    <p className="text-sm text-gray-400 mt-3">
                      {formatDate(
                        notification.createdAt
                      )}
                    </p>

                  </div>

                </div>

              </button>

            ))}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}