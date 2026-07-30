import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TaskService from '../services/TaskService'

export default function TaskDetails() {
  const { id } = useParams()
  const [task, setTask] = useState(null)

  useEffect(() => {
    TaskService.getTask(id).then(setTask)
  }, [id])

  if (!task) return <p>Loading…</p>

  return (
    <main>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
    </main>
  )
}
