import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import TaskCard from "../components/task/TaskCard";
import TaskService from "../services/TaskService";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const data = await TaskService.getMyTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(taskId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await TaskService.deleteTask(taskId);

      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      alert("Task deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete task.");
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          My Tasks
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">
            You haven't created any tasks yet.
          </p>
        ) : (
          <div className="grid gap-5">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                showActions={true}
                showProfile={false}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}