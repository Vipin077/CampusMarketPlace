import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import TaskService from "../services/TaskService";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTask();
  }, [id]);

  async function loadTask() {
    try {
      const data = await TaskService.getTask(id);
      setTask(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

          <div className="flex justify-between items-start">

            <div>
              <h1 className="text-3xl font-bold">
                {task.title}
              </h1>

              <p className="text-gray-500 mt-2">
                Posted by <strong>{task.createdBy}</strong>
              </p>
            </div>

            <div className="text-2xl font-bold text-green-600">
              ₹{task.budget}
            </div>

          </div>

          <hr className="my-6" />

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

              <p>{task.status}</p>
            </div>

          </div>

          <hr className="my-6" />

          <h2 className="text-xl font-semibold mb-3">
            Description
          </h2>

          <p className="text-gray-700 whitespace-pre-wrap">
            {task.description}
          </p>

          <hr className="my-6" />

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

        </div>
      </div>
    </DashboardLayout>
  );
}