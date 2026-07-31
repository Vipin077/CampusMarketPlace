import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthService from "../../services/AuthService";
import NotificationService from "../../services/NotificationService";

export default function Navbar() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [search, setSearch] = useState("");

  const [unreadCount, setUnreadCount] = useState(0);

  // =========================================================
  // LOGGED-IN USER
  // =========================================================

  const user = AuthService.getUser();

  const fullName = user?.fullName || "User";
  const role = user?.role || "Student";

  const initial = fullName.charAt(0).toUpperCase();

  // =========================================================
  // LOAD UNREAD NOTIFICATION COUNT
  // =========================================================

  useEffect(() => {
    loadUnreadCount();
  }, []);

  async function loadUnreadCount() {
    try {
      const count =
        await NotificationService.getUnreadCount();

      setUnreadCount(count || 0);
    } catch (error) {
      console.error(
        "Failed to load unread notification count:",
        error
      );

      setUnreadCount(0);
    }
  }

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = () => {
    const searchValue = search.trim();

    if (!searchValue) {
      navigate("/explore");
      return;
    }

    navigate(
      `/explore?search=${encodeURIComponent(
        searchValue
      )}`
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      handleSearch();
    }
  };

  // =========================================================
  // PROFILE
  // =========================================================

  const handleProfileClick = () => {
    if (user?.id) {
      navigate(`/profile/${user.id}`);
    } else {
      navigate("/profile");
    }
  };

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="relative w-96">

        <button
          type="button"
          onClick={handleSearch}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition"
          title="Search"
        >
          <Search size={18} />
        </button>

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Search tasks..."
          className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

      </div>

      {/* =====================================================
          RIGHT SECTION
      ===================================================== */}

      <div className="flex items-center gap-6">

        {/* =====================================================
            NOTIFICATIONS
        ===================================================== */}

        <button
          type="button"
          onClick={handleNotificationClick}
          className="relative p-2 rounded-lg hover:bg-slate-100 transition"
          title="Notifications"
        >

          <Bell
            size={24}
            className="text-slate-600 hover:text-blue-600 transition"
          />

          {/* REAL UNREAD COUNT */}

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">

              {unreadCount > 99
                ? "99+"
                : unreadCount}

            </span>
          )}

        </button>

        {/* =====================================================
            USER PROFILE
        ===================================================== */}

        <button
          type="button"
          onClick={handleProfileClick}
          className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-100 transition text-left"
          title="View Profile"
        >

          {/* AVATAR */}

          <div className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            {initial}
          </div>

          {/* USER INFO */}

          <div>

            <h3 className="font-semibold text-slate-800">
              {fullName}
            </h3>

            <p className="text-sm text-slate-500 capitalize">
              {role.toLowerCase()}
            </p>

          </div>

        </button>

      </div>

    </header>
  );
}