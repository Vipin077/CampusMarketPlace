import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TaskForm from '../components/task/TaskForm'
import TaskService from '../services/TaskService'

export default function EditTask() {
  const { id } = useParams()
  const [task, setTask] = useState(null)

  useEffect(() => {
    TaskService.getTask(id).then(setTask)
  }, [id])

  async function handleSubmit(data) {
    await TaskService.updateTask(id, data)
  }

  return (
    <main>
      <h2>Edit Task</h2>
      {task ? <TaskForm initial={task} onSubmit={handleSubmit} /> : <p>Loading…</p>}
    </main>
  )
}
