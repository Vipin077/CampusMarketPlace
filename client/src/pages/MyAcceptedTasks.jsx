import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import TaskCard from "../components/task/TaskCard";
import TaskService from "../services/TaskService";

export default function MyAcceptedTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const data = await TaskService.getAcceptedTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching accepted tasks:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          My Accepted Tasks
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">
            You haven't accepted any tasks yet.
          </p>
        ) : (
          <div className="grid gap-5">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                showActions={false}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}