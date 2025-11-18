// src/pages/Chat.js
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const Chat = ({ token, userId }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [room, setRoom] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    // Connect socket with JWT
    const s = io('http://localhost:5000', {
      auth: { token }
    });

    s.on('connect', () => {
      console.log('Connected:', s.id);
    });

    s.on('message:receive', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    s.on('typing', ({ user }) => {
      if (user !== userId) {
        setTypingUsers((prev) => [...new Set([...prev, user])]);
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u !== user));
        }, 2000);
      }
    });

    s.on('message:error', (err) => {
      console.error('Message error:', err.message);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [token, userId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit('message:send', {
      text,
      to: '', // leave empty for room, or add userId for direct
      room: room || null
    });

    setText('');
  };

  const handleTyping = () => {
    socket.emit('typing', {
      to: '', // direct userId or leave null
      room: room || null
    });
  };

  const joinRoom = () => {
    if (room.trim()) {
      socket.emit('room:join', room);
    }
  };

  const leaveRoom = () => {
    if (room.trim()) {
      socket.emit('room:leave', room);
      setRoom('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat</h2>

      <div>
        <input
          placeholder="Room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
        <button onClick={leaveRoom}>Leave Room</button>
      </div>

      <div style={{ border: '1px solid gray', height: 300, overflowY: 'scroll', marginTop: 10 }}>
        {messages.map((msg) => (
          <div key={msg._id}>
            <b>{msg.from.username}: </b> {msg.text}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {typingUsers.length > 0 && (
        <div style={{ fontStyle: 'italic' }}>
          {typingUsers.join(', ')} typing...
        </div>
      )}

      <input
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyUp={handleTyping}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;

