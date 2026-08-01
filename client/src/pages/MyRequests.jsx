import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import TaskService from "../services/TaskService";
import UserService from "../services/UserService";

export default function MyRequests() {

  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =====================================================
  // LOAD REQUESTS
  // =====================================================

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {

    try {

      setLoading(true);

      const data =
        await TaskService.getMyRequests();

      setRequests(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to load requests."
      );

    } finally {

      setLoading(false);

    }

  }

  // =====================================================
  // REFRESH
  // =====================================================

  async function handleRefresh() {

    try {

      setRefreshing(true);

      await loadRequests();

    } finally {

      setRefreshing(false);

    }

  }

  // =====================================================
  // VIEW OWNER PROFILE
  // =====================================================

  async function handleViewProfile(email) {

    try {

      const user =
        await UserService.getUserByEmail(email);

      navigate(`/profile/${user.id}`);

    } catch (error) {

      console.error(error);

      alert(
        "Unable to open profile."
      );

    }

  }

  // =====================================================
  // STATUS BADGE
  // =====================================================

  function badge(status) {

    switch (status) {

      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";

    }

  }

  return ( <DashboardLayout>

  <div className="max-w-6xl mx-auto p-6">

    {/* =====================================================
        HEADER
    ===================================================== */}

    <div className="flex items-center justify-between mb-8">

      <div>

        <h1 className="text-3xl font-bold">
          My Requests
        </h1>

        <p className="text-gray-500 mt-2">
          Track all task requests you've sent.
        </p>

      </div>

      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className="border px-4 py-2 rounded-lg hover:bg-gray-100 disabled:bg-gray-100 transition"
      >
        {refreshing
          ? "Refreshing..."
          : "Refresh"}
      </button>

    </div>

    {/* =====================================================
        LOADING
    ===================================================== */}

    {loading ? (

      <div className="text-center py-20">

        <p className="text-gray-500">
          Loading requests...
        </p>

      </div>

    ) : requests.length === 0 ? (

      <div className="bg-white rounded-xl border p-10 text-center shadow-sm">

        <h2 className="text-2xl font-semibold">
          No Requests Yet
        </h2>

        <p className="text-gray-500 mt-2">
          You haven't requested any tasks yet.
        </p>

      </div>

    ) : (

      <div className="space-y-6">

        {requests.map((request) => (

          <div
            key={request.id}
            className="bg-white rounded-xl border shadow hover:shadow-lg transition p-6"
          >

            <div className="flex flex-col lg:flex-row justify-between gap-6">

              {/* LEFT */}

              <div className="flex-1">

                <div className="flex items-center gap-2">

                  <span className="text-lg">
                    📌
                  </span>

                  <span className="font-semibold">
                    Task ID: {request.taskId}
                  </span>

                </div>

                <div className="mt-4">

                  <p className="font-semibold mb-2">
                    📝 Message
                  </p>

                  <div className="bg-gray-50 border rounded-lg p-4 whitespace-pre-wrap">

                    {request.message ||
                      "No message provided."}

                  </div>

                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">

                  <span>

                    🕒{" "}
                    {request.requestedAt
                      ? new Date(
                          request.requestedAt
                        ).toLocaleString()
                      : "-"}

                  </span>

                  <span
                    className={`px-3 py-1 rounded-full font-medium ${badge(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>

                </div>

              </div>

              {/* RIGHT */}

              <div className="flex flex-col gap-3 min-w-[220px]">
                <button
                  onClick={() => navigate(`/task/${request.taskId}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                  View Task
                </button>

                {request.ownerId && (
                  <button
                    onClick={() => handleViewProfile(request.ownerId)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
                  >
                    View Owner
                  </button>
                )}

                {request.status === "APPROVED" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-green-700 text-sm font-medium">
                      🎉 Your request has been approved.
                    </p>
                  </div>
                )}

                {request.status === "PENDING" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                    <p className="text-yellow-700 text-sm font-medium">
                      ⏳ Waiting for the owner to respond.
                    </p>
                  </div>
                )}

                {request.status === "REJECTED" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    <p className="text-red-700 text-sm font-medium">
                      ❌ This request was rejected.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>

</DashboardLayout>

  );

}
// check            