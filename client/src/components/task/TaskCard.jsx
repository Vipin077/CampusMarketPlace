import React from 'react'

export default function TaskCard({ task }) {
  return (
    <div className="task-card">
      <h3>{task?.title || 'Task title'}</h3>
    </div>
  )
}
