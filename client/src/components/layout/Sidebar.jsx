import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  PlusSquare,
  ClipboardList,
  Search,
  MessageCircle,
  Bell,
  User,
  LogOut,
  Clock3,
  Inbox,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import AuthService from "../../services/AuthService";
import MessageService from "../../services/MessageService";

const menu = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Create Task",
    path: "/create-task",
    icon: PlusSquare,
  },
  {
    name: "My Tasks",
    path: "/my-tasks",
    icon: ClipboardList,
  },
  {
    name: "Explore",
    path: "/explore",
    icon: Search,
  },

  // ============================
  // NEW
  // ============================

  {
    name: "Pending Requests",
    path: "/pending-requests",
    icon: Clock3,
  },
  {
    name: "My Requests",
    path: "/my-requests",
    icon: Inbox,
  },

  {
    name: "Messages",
    path: "/messages",
    icon: MessageCircle,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
];

export default function Sidebar() {

  const navigate = useNavigate();

  const [unreadMessages, setUnreadMessages] =
    useState(0);

  // =========================================================
  // CURRENT USER
  // =========================================================

  const user = AuthService.getUser();

  // =========================================================
  // LOAD UNREAD MESSAGE COUNT
  // =========================================================

  async function loadUnreadMessages() {

    try {

      const count =
        await MessageService.getUnreadCount();

      setUnreadMessages(
        Number(count) || 0
      );

    } catch (error) {

      console.error(
        "Failed to load unread message count:",
        error
      );

    }

  }

  // =========================================================
  // INITIAL LOAD + MESSAGE EVENTS
  // =========================================================

  useEffect(() => {

    loadUnreadMessages();

    const handleMessagesRead = () => {
      loadUnreadMessages();
    };

    const handleMessagesUpdated = () => {
      loadUnreadMessages();
    };

    window.addEventListener(
      "messages-read",
      handleMessagesRead
    );

    window.addEventListener(
      "messages-updated",
      handleMessagesUpdated
    );

    return () => {

      window.removeEventListener(
        "messages-read",
        handleMessagesRead
      );

      window.removeEventListener(
        "messages-updated",
        handleMessagesUpdated
      );

    };

  }, []);

  // =========================================================
  // PROFILE
  // =========================================================

  const handleProfileClick = () => {

    if (user?.id) {

      navigate(`/profile/${user.id}`);

    } else {

      console.error(
        "User ID not found"
      );

      alert(
        "Unable to open profile. Please login again."
      );

    }

  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    AuthService.logout();

    navigate("/login", {
      replace: true,
    });

  };

  // =========================================================
  // UI
  // =========================================================

  return (

    <aside className="w-64 h-screen sticky top-0 shrink-0 bg-slate-900 text-white flex flex-col">

      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="h-20 shrink-0 flex items-center justify-center border-b border-slate-700">

        <h1 className="text-2xl font-bold tracking-wide">
          Campus
          <span className="text-blue-400">
            Market
          </span>
        </h1>

      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">

        {menu.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >

              <Icon size={20} />

              <span>
                {item.name}
              </span>

              {item.name === "Messages" &&
                unreadMessages > 0 && (

                <span className="ml-auto min-w-6 h-6 px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">

                  {unreadMessages > 99
                    ? "99+"
                    : unreadMessages}

                </span>

              )}

            </NavLink>

          );

        })}

        {/* =====================================================
            PROFILE
        ===================================================== */}

        <button
          type="button"
          onClick={handleProfileClick}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 transition-all duration-200"
        >

          <User size={20} />

          <span>
            Profile
          </span>

        </button>

      </nav>

      {/* =====================================================
          LOGOUT
      ===================================================== */}

      <div className="shrink-0 border-t border-slate-700 p-4 bg-slate-900">

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white transition"
        >

          <LogOut size={20} />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>

  );

}