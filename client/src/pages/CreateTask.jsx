import React from 'react'
import TaskForm from '../components/task/TaskForm'
import TaskService from '../services/TaskService'

export default function CreateTask() {
  async function handleSubmit(data) {
    await TaskService.createTask(data)
    // Ideally navigate after creation
  }

  return (
    <main>
      <h2>Create Task</h2>
      <TaskForm onSubmit={handleSubmit} />
    </main>
  )
}
