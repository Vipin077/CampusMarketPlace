import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import TaskService from "../services/TaskService";

export default function ExploreTasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await TaskService.exploreTasks({
        page: 0,
        size: 10,
      });

      if (data && Array.isArray(data.content)) {
        setTasks(data.content);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (taskId) => {
    try {
      await TaskService.acceptTask(taskId);

      alert("Task accepted successfully!");

      fetchTasks();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Failed to accept task."
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Explore Tasks</h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          <div className="grid gap-5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl shadow-md border p-5 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{task.title}</h2>

                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {task.description}
                    </p>
                  </div>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    ₹{task.budget}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>📂 {task.category}</span>
                  <span>📍 {task.location}</span>
                  <span>📌 {task.status}</span>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Posted by <strong>{task.createdBy}</strong>
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/task/${task.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      View Details
                    </button>

                    {task.status === "OPEN" ? (
                      <button
                        onClick={() => handleAccept(task.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        Accept
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                      >
                        Accepted
                      </button>
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