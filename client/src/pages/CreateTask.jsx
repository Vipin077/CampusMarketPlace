import DashboardLayout from "../components/layout/DashboardLayout";
import TaskForm from "../components/task/TaskForm";
import TaskService from "../services/TaskService";
import { useNavigate } from "react-router-dom";

export default function CreateTask() {
  const navigate = useNavigate();

  async function handleSubmit(task, attachment) {
    try {
      await TaskService.createTask(task, attachment);

      alert("Task created successfully!");

      navigate("/my-tasks");
    } catch (error) {
      console.error(error);
      alert("Failed to create task.");
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-8">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              Create New Task
            </h1>

            <p className="text-blue-100 mt-2">
              Post your task and let fellow students help you.
            </p>
          </div>

          <div className="p-8">
            <TaskForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}