import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import ChatWindow from './components/ChatWindow';
import './App.css';

export default function App() {
  // ─── State ───────────────────────────────────────────────────────────
  // Holds the current logged‐in username (empty = not logged in)
  const [username, setUsername] = useState('');
  // Holds the WebSocket instance once connected
  const [ws, setWs]             = useState(null);
  // Tracks connection status for UI or debugging
  const [status, setStatus]     = useState('DISCONNECTED');

  // ─── Load stored username on mount ────────────────────────────────────
  // If the user has a saved name in localStorage, auto‑login
  useEffect(() => {
    const stored = localStorage.getItem('chat_username');
    if (stored) {
      setUsername(stored);
    }
  }, []);

  // ─── Establish WebSocket whenever username is set ─────────────────────
  useEffect(() => {
    // Don’t connect until we have a username
    if (!username) return;

    // Create WebSocket to our backend
    const socket = new WebSocket('wss://chatapp-backend-dqz7.onrender.com');
    setStatus('CONNECTING');

    // On open, update status and send a “join” message
    socket.onopen = () => {
      setStatus('CONNECTED');
      socket.send(JSON.stringify({
        type: 'join',
        payload: username
      }));
    };

    // Cleanly handle close & error events
    socket.onclose = () => setStatus('DISCONNECTED');
    socket.onerror = () => setStatus('ERROR');

    // Save socket into state so child components can use it
    setWs(socket);

    // (Optional cleanup if App unmounts)
    return () => socket.close();
  }, [username]);

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <div className="App">
      {/* If no username, show the login form */}
      {!username ? (
        <Login
          onSubmit={(name) => {
            // Save username in localStorage & state
            localStorage.setItem('chat_username', name);
            setUsername(name);
          }}
        />
      ) : (
        // Once logged in, show the chat window
        <ChatWindow
          ws={ws}
          username={username}
          onLogout={() => {
            // Handle logout: clear storage, close socket, reset state
            localStorage.removeItem('chat_username');
            ws?.close();
            setUsername('');
          }}
        />
      )}
    </div>
  );
}
