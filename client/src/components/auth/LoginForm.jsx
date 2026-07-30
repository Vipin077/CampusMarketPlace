import React from 'react'

export default function LoginForm({ onSubmit }) {
  return (
    <div className="login-form">
      <h1>Login Form</h1>
      <button onClick={onSubmit}>Submit</button>
    </div>
  )
}
