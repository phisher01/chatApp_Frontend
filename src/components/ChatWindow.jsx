// ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import Logo from '../assets/img.png'; // App logo image
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import './ChatWindow.css';

export default function ChatWindow({ ws, username, onLogout }) {
  // State to store all chat messages
  const [messages, setMessages] = useState([]);

  // State to track input value
  const [input, setInput] = useState('');

  // Ref to auto-scroll to the bottom when new messages appear
  const endRef = useRef(null);

  // Listen for WebSocket messages (history or real-time chat)
  useEffect(() => {
    if (!ws) return;

    // Handle incoming WebSocket messages
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'history') setMessages(msg.payload); // On initial connection
      if (msg.type === 'message') setMessages(prev => [...prev, msg.payload]); // New message
    };

    return () => { ws.onmessage = null }; // Cleanup listener
  }, [ws]);

  // Scroll to the newest message every time `messages` change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message over WebSocket
  const sendMessage = () => {
    if (!input.trim() || !ws) return;
    ws.send(JSON.stringify({ type: 'message', payload: input.trim() }));
    setInput('');
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* ==== Top Navigation Bar with Logo and Logout ==== */}
      <Paper
        elevation={4}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 4,
          py: 0.6,
          background: 'linear-gradient(90deg,rgb(0, 238, 255) 0%,rgb(4, 129, 212) 100%)',
          color: 'common.white',
          borderRadius: 0,
        }}
      >
        {/* Logo on the left */}
        <img src={Logo} alt="ChatStack Logo" style={{ height: 30, padding: 0, margin: 0 }} />

        {/* Username and logout on the right */}
        <div className='right'>
          <Typography variant="subtitle1" sx={{ fontWeight: 200, color: "white", fontSize: "large" }}>
            <strong>{username}</strong>
          </Typography>
          <IconButton onClick={onLogout} size="small" sx={{ color: 'common.white' }}>
            <LogoutIcon fontSize="medium" />
          </IconButton>
        </div>
      </Paper>

      <Box display="flex" flex={1} overflow="hidden">
        {/* ==== Sidebar: List of unique participants ==== */}
        <Paper
          elevation={0}
          sx={{
            width: 200,
            p: 2,
            bgcolor: 'background.default',
            borderRight: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" color="primary" gutterBottom>
            Chat Room
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Participants:
          </Typography>

          {/* Extract unique usernames from messages */}
          <ul style={{ paddingLeft: 0, listStyle: 'none', marginTop: 8 }}>
            {[...new Set(messages.map((m) => m.username))].map((name) => (
              <li
                key={name}
                style={{
                  fontSize: '0.9rem',
                  padding: '6px 12px',
                  marginBottom: 6,
                  backgroundColor: '#f3f4f6',
                  borderRadius: 6,
                  color: '#333',
                  transition: 'background-color 0.3s',
                  cursor: 'default',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e0e7ff')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
              >
                {name}
              </li>
            ))}
          </ul>
        </Paper>

        {/* ==== Main Chat Window ==== */}
        <Box flex={1} display="flex" flexDirection="column">
          <Box
            className="messages"
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: 'grey.50',
            }}
          >
            {/* Render each chat message */}
            {messages.map((m) => {
              const isOwn = m.username === username;
              return (
                <Box
                  key={m._id}
                  sx={{
                    maxWidth: '60%',
                    mb: 1,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: isOwn ? '#e6f4ea' : '#e3f2fd',
                    ml: isOwn ? 'auto' : 2,
                    mr: isOwn ? 2 : 'auto',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)', // floating message effect
                    transition: 'box-shadow 0.3s ease',
                  }}
                >
                  {/* Message text */}
                  <Typography
                    variant="body2"
                    sx={{ wordBreak: 'break-word', mb: 0.2, mt: 0.2 }}
                  >
                    {m.text}
                  </Typography>

                  {/* Footer with username and timestamp */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1,
                      fontSize: '0.7rem',
                      color: 'text.secondary',
                    }}
                  >
                    <Typography component="span" variant="caption">
                      @{m.username}
                    </Typography>
                    <Typography component="span" variant="caption">
                      {new Date(m.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
              );
            })}

            {/* Reference point to scroll into view on new message */}
            <div ref={endRef} />
          </Box>

          <Divider />

          {/* ==== Message Input Area ==== */}
          <Box
            className="input-area"
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1,
              bgcolor: 'background.paper',
            }}
          >
            {/* Optional room name */}
            <Typography
              variant="body2"
              sx={{ mr: 2, whiteSpace: 'nowrap', color: 'text.secondary' }}
            >
              💬 Room: General
            </Typography>

            {/* Message input field */}
            <input
              type="text"
              placeholder="Type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              style={{
                flex: '1 1 200px',
                marginRight: '0.5rem',
                padding: '6px 10px',
                fontSize: '0.9rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                outline: 'none',
                height: '30px',
              }}
            />

            {/* Send button */}
            <Button
              variant="contained"
              color="primary"
              onClick={sendMessage}
              disabled={!input.trim()}
              sx={{ borderRadius: '20px', whiteSpace: 'nowrap' }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
