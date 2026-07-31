import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import TaskService from "../services/TaskService";
import UserService from "../services/UserService";

export default function ExploreTasks() {
  const navigate = useNavigate();

  // Read query parameters from URL
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Run again whenever search changes
  useEffect(() => {
    fetchTasks();
  }, [search]);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const data = await TaskService.exploreTasks({
        search: search,
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

  // =====================================================
  // ACCEPT TASK
  // =====================================================

  const handleAccept = async (taskId) => {
    try {
      await TaskService.acceptTask(taskId);

      alert("Task accepted successfully!");

      fetchTasks();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to accept task."
      );
    }
  };

  // =====================================================
  // VIEW USER PROFILE
  // =====================================================

  const handleViewProfile = async (email) => {
    try {
      const user =
        await UserService.getUserByEmail(email);

      navigate(`/profile/${user.id}`);
    } catch (error) {
      console.error(error);

      alert("Unable to load user profile.");
    }
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const handleClearSearch = () => {
    navigate("/explore");
  };

  return (
    <DashboardLayout>
      <div className="p-6">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-6">

          <div>
            <h1 className="text-3xl font-bold">
              Explore Tasks
            </h1>

            {search && (
              <p className="text-gray-500 mt-2">
                Showing results for{" "}
                <span className="font-semibold text-gray-700">
                  "{search}"
                </span>
              </p>
            )}
          </div>

          {/* CLEAR SEARCH */}

          {search && (
            <button
              onClick={handleClearSearch}
              className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
            >
              Clear Search
            </button>
          )}

        </div>

        {/* LOADING */}

        {loading ? (
          <p className="text-gray-500">
            Loading...
          </p>
        ) : tasks.length === 0 ? (

          /* NO RESULTS */

          <div className="bg-white border rounded-xl p-8 text-center">

            <h2 className="text-xl font-semibold text-gray-700">
              No tasks found
            </h2>

            {search && (
              <p className="text-gray-500 mt-2">
                No tasks matched "{search}".
              </p>
            )}

            {search && (
              <button
                onClick={handleClearSearch}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >
                View All Tasks
              </button>
            )}

          </div>

        ) : (

          /* TASK LIST */

          <div className="grid gap-5">

            {tasks.map((task) => (

              <div
                key={task.id}
                className="bg-white rounded-xl shadow-md border p-5 hover:shadow-lg transition"
              >

                {/* TASK HEADER */}

                <div className="flex justify-between items-start">

                  <div>

                    <h2 className="text-xl font-semibold">
                      {task.title}
                    </h2>

                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {task.description}
                    </p>

                  </div>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    ₹{task.budget}
                  </span>

                </div>

                {/* TASK DETAILS */}

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">

                  <span>
                    📂 {task.category}
                  </span>

                  <span>
                    📍 {task.location}
                  </span>

                  <span>
                    📌 {task.status}
                  </span>

                </div>

                {/* BOTTOM SECTION */}

                <div className="mt-4 flex justify-between items-center">

                  {/* POSTED BY */}

                  <span className="text-sm text-gray-500">
                    Posted by{" "}
                    <strong>
                      {task.createdBy}
                    </strong>
                  </span>

                  {/* ACTION BUTTONS */}

                  <div className="flex gap-3 flex-wrap">

                    {/* VIEW DETAILS */}

                    <button
                      onClick={() =>
                        navigate(
                          `/task/${task.id}`
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      View Details
                    </button>

                    {/* VIEW PROFILE */}

                    <button
                      onClick={() =>
                        handleViewProfile(
                          task.createdBy
                        )
                      }
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      View Profile
                    </button>

                    {/* ACCEPT */}

                    {task.status === "OPEN" ? (

                      <button
                        onClick={() =>
                          handleAccept(task.id)
                        }
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