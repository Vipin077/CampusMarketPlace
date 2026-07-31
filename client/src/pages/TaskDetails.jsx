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

  // Rating states
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);

  const currentUser = AuthService.getUser();

  // =========================================================
  // LOAD TASK
  // =========================================================

  useEffect(() => {
    loadTask();
  }, [id]);

  async function loadTask() {
    try {
      setLoading(true);

      const data = await TaskService.getTask(id);

      setTask(data);
    } catch (err) {
      console.error(
        "Failed to load task:",
        err
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // DOWNLOAD PROOF
  // =========================================================

  async function handleDownloadProof() {
    try {
      setProofLoading(true);

      await TaskService.downloadProof(
        task.id
      );
    } catch (error) {
      console.error(
        "Failed to download proof:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to download proof."
      );
    } finally {
      setProofLoading(false);
    }
  }

  // =========================================================
  // APPROVE WORK
  // =========================================================

  async function handleApprove() {
    const confirmApprove =
      window.confirm(
        "Are you sure you want to approve this work?"
      );

    if (!confirmApprove) {
      return;
    }

    try {
      setActionLoading(true);

      const updatedTask =
        await TaskService.approveTask(
          task.id
        );

      setTask(updatedTask);

      alert(
        "Work approved successfully! You can now rate the worker."
      );
    } catch (error) {
      console.error(
        "Failed to approve work:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to approve submitted work."
      );
    } finally {
      setActionLoading(false);
    }
  }

  // =========================================================
  // REJECT WORK
  // =========================================================

  async function handleReject() {
    const confirmReject =
      window.confirm(
        "Are you sure you want to reject this work?"
      );

    if (!confirmReject) {
      return;
    }

    try {
      setActionLoading(true);

      const updatedTask =
        await TaskService.rejectTask(
          task.id
        );

      setTask(updatedTask);

      alert(
        "Work rejected. The task has been sent back to the worker."
      );
    } catch (error) {
      console.error(
        "Failed to reject work:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to reject submitted work."
      );
    } finally {
      setActionLoading(false);
    }
  }

  // =========================================================
  // SUBMIT RATING
  // =========================================================

  async function handleSubmitRating() {

    if (rating < 1 || rating > 5) {
      alert(
        "Please select a rating between 1 and 5 stars."
      );

      return;
    }

    try {
      setRatingLoading(true);

      const updatedTask =
        await TaskService.rateTask(
          task.id,
          rating,
          review.trim()
        );

      setTask(updatedTask);

      setRating(0);
      setHoverRating(0);
      setReview("");

      alert(
        "Rating submitted successfully!"
      );
    } catch (error) {
      console.error(
        "Failed to submit rating:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to submit rating."
      );
    } finally {
      setRatingLoading(false);
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // TASK NOT FOUND
  // =========================================================

  if (!task) {
    return (
      <DashboardLayout>
        <div className="p-6 text-red-600">
          Task not found.
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // CHECK OWNER
  // =========================================================

  const isOwner =
    currentUser &&
    currentUser.email ===
      task.createdBy;

  // =========================================================
  // UI
  // =========================================================

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">

        {/* BACK */}

        <button
          onClick={() =>
            navigate(-1)
          }
          className="mb-6 text-blue-600 hover:underline"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl shadow-lg border p-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex justify-between items-start gap-6">

            <div>
              <h1 className="text-3xl font-bold">
                {task.title}
              </h1>

              <p className="text-gray-500 mt-2">
                Posted by{" "}
                <strong>
                  {task.createdBy}
                </strong>
              </p>
            </div>

            <div className="text-2xl font-bold text-green-600">
              ₹{task.budget}
            </div>

          </div>

          <hr className="my-6" />

          {/* =================================================
              TASK INFORMATION
          ================================================= */}

          <div className="grid md:grid-cols-2 gap-6">

            {/* CATEGORY */}

            <div>
              <p className="font-semibold text-gray-700">
                Category
              </p>

              <p>
                {task.category}
              </p>
            </div>

            {/* LOCATION */}

            <div>
              <p className="font-semibold text-gray-700">
                Location
              </p>

              <p>
                {task.location}
              </p>
            </div>

            {/* STATUS */}

            <div>
              <p className="font-semibold text-gray-700">
                Status
              </p>

              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                  task.status ===
                  "COMPLETED"
                    ? "bg-green-100 text-green-700"
                    : task.status ===
                      "SUBMITTED"
                    ? "bg-purple-100 text-purple-700"
                    : task.status ===
                      "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {task.status}
              </span>
            </div>

            {/* ASSIGNED USER */}

            {task.assignedTo && (
              <div>
                <p className="font-semibold text-gray-700">
                  Assigned To
                </p>

                <p>
                  {task.assignedTo}
                </p>
              </div>
            )}

          </div>

          <hr className="my-6" />

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <h2 className="text-xl font-semibold mb-3">
            Description
          </h2>

          <p className="text-gray-700 whitespace-pre-wrap">
            {task.description}
          </p>

          <hr className="my-6" />

          {/* =================================================
              ORIGINAL ATTACHMENT
          ================================================= */}

          <h2 className="text-xl font-semibold mb-3">
            Attachment
          </h2>

          {task.attachmentUrl ? (

            <button
              onClick={() =>
                TaskService.downloadAttachment(
                  task.id
                )
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

          {/* =================================================
              SUBMITTED WORK
          ================================================= */}

          {(task.status ===
            "SUBMITTED" ||
            task.status ===
              "COMPLETED") && (

            <>
              <hr className="my-8" />

              <div className="bg-slate-50 border rounded-xl p-6">

                {/* HEADER */}

                <div className="flex items-center justify-between gap-4 mb-5">

                  <h2 className="text-2xl font-bold">
                    Submitted Work
                  </h2>

                  {task.status ===
                    "SUBMITTED" && (

                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Waiting for Review
                    </span>

                  )}

                  {task.status ===
                    "COMPLETED" && (

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
                      {task.assignedTo ||
                        "Unknown"}
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
                        onClick={
                          handleDownloadProof
                        }
                        disabled={
                          proofLoading
                        }
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

                  {/* =================================================
                      OWNER APPROVE / REJECT
                  ================================================= */}

                  {isOwner &&
                    task.status ===
                      "SUBMITTED" && (

                    <div className="flex gap-4 pt-5 border-t">

                      <button
                        onClick={
                          handleReject
                        }
                        disabled={
                          actionLoading
                        }
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-3 rounded-lg font-semibold transition"
                      >
                        {actionLoading
                          ? "Processing..."
                          : "Reject Work"}
                      </button>

                      <button
                        onClick={
                          handleApprove
                        }
                        disabled={
                          actionLoading
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-3 rounded-lg font-semibold transition"
                      >
                        {actionLoading
                          ? "Processing..."
                          : "Approve Work"}
                      </button>

                    </div>

                  )}

                  {/* =================================================
                      RATE WORKER
                  ================================================= */}

                  {isOwner &&
                    task.status ===
                      "COMPLETED" &&
                    task.rating == null && (

                    <div className="pt-6 border-t">

                      <div className="bg-white border rounded-xl p-6">

                        <h3 className="text-xl font-bold text-gray-800">
                          Rate Worker
                        </h3>

                        <p className="text-gray-500 mt-1">
                          How was your experience
                          working with{" "}
                          <span className="font-medium">
                            {task.assignedTo}
                          </span>
                          ?
                        </p>

                        {/* STARS */}

                        <div
                          className="flex gap-2 mt-5"
                          onMouseLeave={() =>
                            setHoverRating(
                              0
                            )
                          }
                        >

                          {[1, 2, 3, 4, 5].map(
                            (star) => (

                              <button
                                key={star}
                                type="button"
                                onClick={() =>
                                  setRating(
                                    star
                                  )
                                }
                                onMouseEnter={() =>
                                  setHoverRating(
                                    star
                                  )
                                }
                                className={`text-4xl transition-transform hover:scale-110 ${
                                  star <=
                                  (hoverRating ||
                                    rating)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </button>

                            )
                          )}

                        </div>

                        {/* SELECTED RATING */}

                        {rating > 0 && (

                          <p className="mt-2 text-sm font-medium text-gray-600">
                            {rating} out of 5
                            stars
                          </p>

                        )}

                        {/* REVIEW */}

                        <div className="mt-5">

                          <label className="block font-semibold text-gray-700 mb-2">
                            Review
                            <span className="font-normal text-gray-400">
                              {" "}
                              (optional)
                            </span>
                          </label>

                          <textarea
                            value={review}
                            onChange={(e) =>
                              setReview(
                                e.target.value
                              )
                            }
                            rows={4}
                            maxLength={500}
                            placeholder="Write a short review about the worker..."
                            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />

                          <p className="text-xs text-gray-400 text-right mt-1">
                            {review.length}/500
                          </p>

                        </div>

                        {/* SUBMIT */}

                        <button
                          type="button"
                          onClick={
                            handleSubmitRating
                          }
                          disabled={
                            ratingLoading ||
                            rating === 0
                          }
                          className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                          {ratingLoading
                            ? "Submitting..."
                            : "Submit Rating"}
                        </button>

                      </div>

                    </div>

                  )}

                  {/* =================================================
                      ALREADY RATED
                  ================================================= */}

                  {task.status ===
                    "COMPLETED" &&
                    task.rating != null && (

                    <div className="pt-6 border-t">

                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">

                        <div className="flex items-center justify-between gap-4">

                          <h3 className="text-xl font-bold text-gray-800">
                            Worker Rating
                          </h3>

                          <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                            Rated
                          </span>

                        </div>

                        {/* RATING STARS */}

                        <div className="flex gap-1 mt-4">

                          {[1, 2, 3, 4, 5].map(
                            (star) => (

                              <span
                                key={star}
                                className={`text-3xl ${
                                  star <=
                                  task.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>

                            )
                          )}

                        </div>

                        <p className="mt-2 font-semibold text-gray-700">
                          {task.rating} / 5
                        </p>

                        {/* REVIEW */}

                        {task.review && (

                          <div className="mt-4">

                            <p className="font-semibold text-gray-700">
                              Review
                            </p>

                            <p className="mt-2 bg-white border rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                              {task.review}
                            </p>

                          </div>

                        )}

                        {/* RATING TIME */}

                        {task.ratedAt && (

                          <p className="text-sm text-gray-500 mt-4">
                            Rated on{" "}
                            {new Date(
                              task.ratedAt
                            ).toLocaleString()}
                          </p>

                        )}

                      </div>

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