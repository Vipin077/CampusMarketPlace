import { useNavigate } from "react-router-dom";

export default function TaskCard({
  task,
  showActions = false,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border shadow-md p-5 hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">
            {task.title}
          </h2>

          <p className="text-gray-600 mt-2 line-clamp-2">
            {task.description}
          </p>
        </div>

        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
          ₹{task.budget}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <span>📂 {task.category}</span>
        <span>📍 {task.location}</span>
        <span>📌 {task.status}</span>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => navigate(`/task/${task.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          View
        </button>

        {showActions && (
          <>
            <button
              onClick={() => navigate(`/edit-task/${task.id}`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(task.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}