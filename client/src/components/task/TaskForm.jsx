import React from 'react'

export default function TaskForm({ onSubmit }) {
  return (
    <div className="task-form">
      <h1>Task Form</h1>
      <button onClick={onSubmit}>Submit</button>
    </div>
  )
}
