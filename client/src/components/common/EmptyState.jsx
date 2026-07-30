import React from 'react'

export default function EmptyState({ title, message }) {
  return (
    <div className="empty-state">
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  )
}
