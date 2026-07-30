import React from 'react'

export default function RegisterForm({ onSubmit }) {
  return (
    <div className="register-form">
      <h1>Register Form</h1>
      <button onClick={onSubmit}>Submit</button>
    </div>
  )
}
