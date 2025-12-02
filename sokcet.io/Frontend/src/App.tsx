import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import './index.css';

interface Message {
  id: string;
  text: string;
  sender: string;
  type: 'sent' | 'received' | 'system';
  timestamp: number;
}

function App() {
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [roomInput, setRoomInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    // Chat Socket
    const newChatSocket = io('http://localhost:3000/chat');

    newChatSocket.on('connect', () => {
      setIsConnected(true);
      addSystemMessage('Connected to chat server');
      // Auto-join default room
      newChatSocket.emit('join-room', { room: currentRoom });
    });

    newChatSocket.on('disconnect', () => {
      setIsConnected(false);
      addSystemMessage('Disconnected from chat server');
    });

    newChatSocket.on('connected', (msg: string) => {
      addSystemMessage(msg);
    });

    newChatSocket.on('reply', (payload: { id: string, message: { message: string }, room: string }) => {
      const isMyMessage = payload.id === newChatSocket.id;
      addMessage(payload.message.message, isMyMessage ? 'sent' : 'received', payload.id);
    });

    newChatSocket.on('joined', (msg: string) => {
      addSystemMessage(msg);
    });

    newChatSocket.on('left', (msg: string) => {
      addSystemMessage(msg);
    });

    setChatSocket(newChatSocket);

    // Notification Socket
    const notificationSocket = io('http://localhost:3000/notification');

    notificationSocket.on('notification', (payload: { message: string, room?: string }) => {
      setNotification(payload.message);
    });

    return () => {
      newChatSocket.close();
      notificationSocket.close();
    };
  }, []);

  const addMessage = (text: string, type: 'sent' | 'received', sender: string) => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      text,
      sender,
      type,
      timestamp: Date.now()
    }]);
  };

  const addSystemMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      text,
      sender: 'System',
      type: 'system',
      timestamp: Date.now()
    }]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && chatSocket) {
      chatSocket.emit('message', { room: currentRoom, message: inputValue });
      setInputValue('');
    }
  };

  const handleJoinRoom = () => {
    if (roomInput.trim() && chatSocket) {
      // Leave current room
      chatSocket.emit('leave-room', { room: currentRoom });

      // Join new room
      const newRoom = roomInput.trim();
      chatSocket.emit('join-room', { room: newRoom });
      setCurrentRoom(newRoom);
      setRoomInput('');
      setMessages([]); // Clear messages when switching rooms
    }
  };

  return (
    <div className="chat-container">
      {notification && (
        <div className="notification-toast">
          {notification}
        </div>
      )}
      <header className="chat-header">
        <h1>NestJS Chat</h1>
        <div className="room-info">
          <span className="room-label">Room: <strong>{currentRoom}</strong></span>
        </div>
        <div className="status-indicator">
          <div className={`status-dot ${isConnected ? 'connected' : ''}`} />
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </header>

      <div className="room-selector">
        <input
          type="text"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          placeholder="Enter room name..."
          disabled={!isConnected}
        />
        <button onClick={handleJoinRoom} disabled={!isConnected || !roomInput.trim()}>
          Join Room
        </button>
      </div>

      <div className="messages-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.type}`}>
            {msg.type !== 'system' && (
              <div className="profile-circle" title={msg.sender}>
                {msg.sender.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="message-content">
              {msg.type !== 'system' && <span className="sender-name">{msg.sender}</span>}
              <div className={`message ${msg.type}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        <button type="submit" disabled={!isConnected || !inputValue.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
