import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import TaskService from "../services/TaskService";
import AuthService from "../services/AuthService";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [proofLoading, setProofLoading] = useState(false);

  const currentUser = AuthService.getUser();

  useEffect(() => {
    loadTask();
  }, [id]);

  async function loadTask() {
    try {
      const data = await TaskService.getTask(id);
      setTask(data);
    } catch (err) {
      console.error("Failed to load task:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadProof() {
    try {
      setProofLoading(true);

      await TaskService.downloadProof(task.id);
    } catch (error) {
      console.error("Failed to download proof:", error);

      alert(
        error.response?.data?.message ||
          "Failed to download proof."
      );
    } finally {
      setProofLoading(false);
    }
  }

  async function handleApprove() {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this work?"
    );

    if (!confirmApprove) return;

    try {
      setActionLoading(true);

      const updatedTask = await TaskService.approveTask(task.id);

      setTask(updatedTask);

      alert("Work approved successfully!");
    } catch (error) {
      console.error("Failed to approve work:", error);

      alert(
        error.response?.data?.message ||
          "Failed to approve submitted work."
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this work?"
    );

    if (!confirmReject) return;

    try {
      setActionLoading(true);

      const updatedTask = await TaskService.rejectTask(task.id);

      setTask(updatedTask);

      alert(
        "Work rejected. The task has been sent back to the worker."
      );
    } catch (error) {
      console.error("Failed to reject work:", error);

      alert(
        error.response?.data?.message ||
          "Failed to reject submitted work."
      );
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout>
        <div className="p-6 text-red-600">
          Task not found.
        </div>
      </DashboardLayout>
    );
  }

  const isOwner =
    currentUser &&
    currentUser.email === task.createdBy;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:underline"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl shadow-lg border p-8">

          {/* HEADER */}
          <div className="flex justify-between items-start gap-6">
            <div>
              <h1 className="text-3xl font-bold">
                {task.title}
              </h1>

              <p className="text-gray-500 mt-2">
                Posted by{" "}
                <strong>{task.createdBy}</strong>
              </p>
            </div>

            <div className="text-2xl font-bold text-green-600">
              ₹{task.budget}
            </div>
          </div>

          <hr className="my-6" />

          {/* TASK INFORMATION */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold text-gray-700">
                Category
              </p>

              <p>{task.category}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-700">
                Location
              </p>

              <p>{task.location}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-700">
                Status
              </p>

              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                  task.status === "COMPLETED"
                    ? "bg-green-100 text-green-700"
                    : task.status === "SUBMITTED"
                    ? "bg-purple-100 text-purple-700"
                    : task.status === "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {task.status}
              </span>
            </div>

            {task.assignedTo && (
              <div>
                <p className="font-semibold text-gray-700">
                  Assigned To
                </p>

                <p>{task.assignedTo}</p>
              </div>
            )}
          </div>

          <hr className="my-6" />

          {/* DESCRIPTION */}
          <h2 className="text-xl font-semibold mb-3">
            Description
          </h2>

          <p className="text-gray-700 whitespace-pre-wrap">
            {task.description}
          </p>

          <hr className="my-6" />

          {/* ORIGINAL ATTACHMENT */}
          <h2 className="text-xl font-semibold mb-3">
            Attachment
          </h2>

          {task.attachmentUrl ? (
            <button
              onClick={() =>
                TaskService.downloadAttachment(task.id)
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              📎 Download Attachment
            </button>
          ) : (
            <p className="text-gray-500">
              No attachment uploaded.
            </p>
          )}

          {/* SUBMITTED WORK */}
          {(task.status === "SUBMITTED" ||
            task.status === "COMPLETED") && (
            <>
              <hr className="my-8" />

              <div className="bg-slate-50 border rounded-xl p-6">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <h2 className="text-2xl font-bold">
                    Submitted Work
                  </h2>

                  {task.status === "SUBMITTED" && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Waiting for Review
                    </span>
                  )}

                  {task.status === "COMPLETED" && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Approved
                    </span>
                  )}
                </div>

                <div className="space-y-5">

                  {/* SUBMITTED BY */}
                  <div>
                    <p className="font-semibold text-gray-700">
                      Submitted By
                    </p>

                    <p className="mt-1">
                      {task.assignedTo || "Unknown"}
                    </p>
                  </div>

                  {/* COMPLETION MESSAGE */}
                  <div>
                    <p className="font-semibold text-gray-700">
                      Completion Message
                    </p>

                    <div className="mt-2 bg-white border rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                      {task.completionMessage ||
                        "No completion message provided."}
                    </div>
                  </div>

                  {/* SUBMITTED TIME */}
                  {task.submittedAt && (
                    <div>
                      <p className="font-semibold text-gray-700">
                        Submitted At
                      </p>

                      <p className="mt-1 text-gray-600">
                        {new Date(
                          task.submittedAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* PROOF */}
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">
                      Proof
                    </p>

                    {task.proofUrl ? (
                      <button
                        onClick={handleDownloadProof}
                        disabled={proofLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-5 py-2 rounded-lg transition"
                      >
                        {proofLoading
                          ? "Downloading..."
                          : "📄 Download Proof"}
                      </button>
                    ) : (
                      <p className="text-gray-500">
                        No proof uploaded.
                      </p>
                    )}
                  </div>

                  {/* OWNER REVIEW BUTTONS */}
                  {isOwner &&
                    task.status === "SUBMITTED" && (
                      <div className="flex gap-4 pt-5 border-t">
                        <button
                          onClick={handleReject}
                          disabled={actionLoading}
                          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-3 rounded-lg font-semibold transition"
                        >
                          {actionLoading
                            ? "Processing..."
                            : "Reject Work"}
                        </button>

                        <button
                          onClick={handleApprove}
                          disabled={actionLoading}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-3 rounded-lg font-semibold transition"
                        >
                          {actionLoading
                            ? "Processing..."
                            : "Approve Work"}
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}