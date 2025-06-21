import React, { useState } from 'react';

export default function Login({ onSubmit }) {
  // Local state for the username input
  const [username, setUsername] = useState('');
  // Local state for validation error messages
  const [error, setError]       = useState('');

  // Regex to allow only letters, numbers, underscores and hyphens
  const VALID_NAME_RE = /^[A-Za-z0-9_-]+$/;

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();                       // Prevent page reload

    const trimmed = username.trim();          // Remove leading/trailing spaces
    if (!trimmed) {                           // Empty check
      setError('Username is required');
      return;
    }
    // Disallow the literal "null" and any invalid characters
    if (trimmed.toLowerCase() === 'null' || !VALID_NAME_RE.test(trimmed)) {
      setError('Please enter a valid username');
      return;
    }

    setError('');                             // Clear any previous error
    onSubmit(trimmed);                        // Pass valid username up to parent
  };

  // Handle input changes
  const handleChange = (e) => {
    setUsername(e.target.value);              // Update the username state
    if (error) setError('');                  // Clear error as user types
  };

  return (
    // Full‑screen centered container with a subtle gradient background
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #eef2f7, #dbe9f4)',
      }}
    >
      {/* The form “card” */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '2rem 2.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Heading */}
        <h2 style={{ margin: 0, textAlign: 'center', color: '#333' }}>
          Join the Chat
        </h2>

        {/* Username input */}
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={handleChange}
          style={{
            padding: '10px 14px',
            fontSize: '1rem',
            borderRadius: '6px',
            // Red border if there's a validation error
            border: error ? '1px solid #e74c3c' : '1px solid #ccc',
            outline: 'none',
          }}
        />

        {/* Error message */}
        {error && (
          <div style={{ color: '#e74c3c', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          style={{
            padding: '10px 16px',
            fontSize: '1rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#4a90e2',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background 0.3s',
          }}
          // Hover effect for better UX
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#357ABD')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4a90e2')}
        >
          Join Chat
        </button>
      </form>
    </div>
  );
}
