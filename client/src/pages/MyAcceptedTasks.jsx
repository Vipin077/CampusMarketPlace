import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import TaskService from "../services/TaskService";
import UserService from "../services/UserService";
import {
  ArrowRight,
  CircleDollarSign,
  MapPin,
} from "lucide-react";

export default function MyAcceptedTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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

  async function handleViewProfile(email) {
    try {
      const user = await UserService.getUserByEmail(email);
      navigate(`/profile/${user.id}`);
    } catch (error) {
      console.error(error);
      alert("Unable to load user profile.");
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
          <div className="space-y-5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl shadow-md p-6 border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">
                      {task.title}
                    </h2>

                    <p className="text-gray-600 mt-2">
                      {task.description}
                    </p>

                    <div className="flex gap-6 mt-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CircleDollarSign size={18} />
                        ₹{task.budget}
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin size={18} />
                        {task.location}
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() =>
                        handleViewProfile(task.createdBy)
                      }
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/submit-work/${task.id}`)
                      }
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
                    >
                      Submit Work
                      <ArrowRight size={18} />
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