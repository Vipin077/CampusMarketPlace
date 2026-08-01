import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import TaskService from "../services/TaskService";
import UserService from "../services/UserService";

export default function PendingRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      setLoading(true);

      const data = await TaskService.getPendingRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Failed to load pending requests.");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    const confirmed = window.confirm("Approve this request?");

    if (!confirmed) return;

    try {
      setProcessingId(id);
      await TaskService.approveRequest(id);
      alert("Request approved successfully.");
      await fetchRequests();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Approval failed.");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(id) {
    const confirmed = window.confirm("Reject this request?");

    if (!confirmed) return;

    try {
      setProcessingId(id);
      await TaskService.rejectRequest(id);
      alert("Request rejected.");
      await fetchRequests();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Rejection failed.");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleViewProfile(email) {
    try {
      const user = await UserService.getUserByEmail(email);
      navigate(`/profile/${user.id}`);
    } catch (error) {
      console.error(error);
      alert("Unable to open profile.");
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Pending Requests</h1>
            <p className="text-gray-500 mt-2">
              Approve or reject students requesting your tasks.
            </p>
          </div>

          <button
            onClick={fetchRequests}
            className="border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl border p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold">No Pending Requests</h2>
            <p className="text-gray-500 mt-2">
              Nobody has requested your tasks yet.
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👤</span>
                      <span className="font-semibold">
                        {request.requesterId || "Unknown requester"}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="font-semibold mb-2">📝 Message</p>
                      <div className="bg-gray-50 border rounded-lg p-4 whitespace-pre-wrap">
                        {request.message || "No message provided."}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📌 Task ID: {request.taskId}</span>
                      <span>
                        🕒 {request.requestedAt ? new Date(request.requestedAt).toLocaleString() : "-"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full font-medium ${
                          request.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : request.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[220px]">
                    <button
                      disabled={processingId === request.id}
                      onClick={() => handleViewProfile(request.requesterId)}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-2 rounded-lg transition"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => navigate(`/task/${request.taskId}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                    >
                      View Task
                    </button>

                    <button
                      disabled={processingId === request.id}
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-2 rounded-lg transition"
                    >
                      {processingId === request.id ? "Approving..." : "Approve"}
                    </button>

                    <button
                      disabled={processingId === request.id}
                      onClick={() => handleReject(request.id)}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-2 rounded-lg transition"
                    >
                      {processingId === request.id ? "Rejecting..." : "Reject"}
                    </button>
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
