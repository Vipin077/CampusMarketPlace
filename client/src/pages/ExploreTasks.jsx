import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import TaskService from "../services/TaskService";

export default function ExploreTasks() {
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

      console.log("Explore API Response:", data);

      // Make sure tasks is always an array
      if (data && Array.isArray(data.content)) {
        setTasks(data.content);
      } else {
        console.warn("Unexpected response:", data);
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
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
                className="bg-white rounded-xl shadow-md border p-5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {task.title}
                    </h2>

                    <p className="text-gray-600 mt-2">
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
                  <span className="text-sm">
                    Posted by <strong>{task.createdBy}</strong>
                  </span>

                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}