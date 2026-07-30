import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import TaskForm from "../components/task/TaskForm";
import TaskService from "../services/TaskService";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);

  useEffect(() => {
    loadTask();
  }, [id]);

  async function loadTask() {
    try {
      const data = await TaskService.getTask(id);
      setTask(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load task.");
    }
  }

  async function handleSubmit(taskData, attachment) {
    try {
      await TaskService.updateTask(id, taskData, attachment);

      alert("Task updated successfully.");

      navigate("/my-tasks");
    } catch (error) {
      console.error(error);
      alert("Failed to update task.");
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          Edit Task
        </h1>

        {task ? (
          <TaskForm
            initial={task}
            onSubmit={handleSubmit}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </DashboardLayout>
  );
}