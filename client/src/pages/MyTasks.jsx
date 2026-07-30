import React, { useEffect, useState } from 'react'
import TaskService from '../services/TaskService'
import TaskCard from "../components/task/TaskCard";

export default function MyTasks() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    TaskService.getMyTasks().then(setTasks)
  }, [])

  return (
    <main>
      <h2>My Tasks</h2>
      <div className="task-list">
        {tasks.length === 0 ? <p>No tasks yet</p> : tasks.map(t => <TaskCard key={t.id} task={t} />)}
      </div>
    </main>
  )
}
