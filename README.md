# NestJS Snippets Collection

A comprehensive collection of NestJS code snippets demonstrating real-time communication patterns using WebSockets and Socket.IO.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Snippets Index](#snippets-index)
  - [Backend Snippets](#backend-snippets)
  - [Frontend Snippets](#frontend-snippets)
- [Getting Started](#getting-started)
- [Technologies Used](#technologies-used)

---

## Overview

This repository contains production-ready code snippets for building real-time applications with NestJS. The snippets demonstrate WebSocket communication, room-based chat functionality, and notification systems using Socket.IO.

---

## Project Structure

```
nestjs_snippets/
└── sokcet.io/
    ├── Backend/          # NestJS backend implementation
    │   └── src/
    │       ├── chat/     # Chat module with WebSocket gateway
    │       └── notification/  # Notification module with gateway and REST API
    └── Frontend/         # React + TypeScript frontend
        └── src/
```

---

## Snippets Index

### Backend Snippets

#### 1. **Chat Gateway** - [chat.gateway.ts](file:///home/zack/projects/nestjs_snippets/sokcet.io/Backend/src/chat/chat.gateway.ts)

**Purpose:** Implements a WebSocket gateway for real-time chat functionality with room-based messaging.

**When to Use:**
- Building real-time chat applications
- Implementing room-based messaging systems
- Creating collaborative workspaces with separate channels

**How to Use:**
```typescript
// In your module
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ChatModule],
})
export class AppModule {}
```

**Key Features:**
- Room join/leave functionality
- Real-time message broadcasting to specific rooms
- Connection lifecycle management (connect, disconnect)
- Integration with notification system
- Automatic client ID assignment

**Events:**
- `message` - Send a message to a room
- `join-room` - Join a specific chat room
- `leave-room` - Leave a chat room
- `reply` - Receive messages from the room
- `joined` - Notification when joining a room
- `left` - Notification when leaving a room

---

#### 2. **Notification Gateway** - [notification.gateway.ts](file:///home/zack/projects/nestjs_snippets/sokcet.io/Backend/src/notification/notification.gateway.ts)

**Purpose:** Provides a WebSocket gateway for broadcasting notifications to all clients or specific rooms.

**When to Use:**
- Sending real-time notifications to users
- Broadcasting system-wide alerts
- Room-specific notifications
- Integrating with other gateways for cross-feature notifications

**How to Use:**
```typescript
// Inject into other services/gateways
constructor(private notificationGateway: NotificationGateway) {}

// Send to all clients
this.notificationGateway.sendToAll('System maintenance in 5 minutes');

// Send to specific room
this.notificationGateway.sendToRoom('room-1', 'New message in room-1');
```

**Key Features:**
- Broadcast to all connected clients
- Send notifications to specific rooms
- Separate namespace (`/notification`) for clean separation of concerns
- Lightweight and reusable across modules

---

#### 3. **Notification Controller** - [notification.controller.ts](file:///home/zack/projects/nestjs_snippets/sokcet.io/Backend/src/notification/notification.controller.ts)

**Purpose:** REST API endpoint for triggering notifications via HTTP POST requests.

**When to Use:**
- Triggering notifications from external services
- Integrating with webhooks
- Sending notifications from non-WebSocket clients
- Testing notification functionality

**How to Use:**
```bash
# Send a notification via HTTP POST
curl -X POST http://localhost:3000/notification \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from REST API"}'
```

**Key Features:**
- Simple REST endpoint for notifications
- Bridges HTTP and WebSocket communication
- Useful for server-to-client push notifications

---

#### 4. **Chat Module** - [chat.module.ts](file:///home/zack/projects/nestjs_snippets/sokcet.io/Backend/src/chat/chat.module.ts)

**Purpose:** Module configuration for the chat feature with dependency injection.

**When to Use:**
- Setting up the chat feature in your NestJS application
- Understanding module dependencies and exports

**Key Features:**
- Imports `NotificationModule` for cross-feature communication
- Exports `ChatGateway` for use in other modules
- Clean module organization

---

#### 5. **Notification Module** - [notification.module.ts](file:///home/zack/projects/nestjs_snippets/sokcet.io/Backend/src/notification/notification.module.ts)

**Purpose:** Module configuration for the notification feature.

**When to Use:**
- Setting up notification functionality
- Making notification gateway available to other modules

**Key Features:**
- Provides both REST controller and WebSocket gateway
- Exports gateway for dependency injection
- Modular and reusable design

---

#### 6. **Main Application** - [main.ts](file:///home/zack/projects/nestjs_snippets/sokcet.io/Backend/src/main.ts)

**Purpose:** Application bootstrap and configuration.

**When to Use:**
- Starting a new NestJS project
- Configuring CORS for WebSocket connections

**Key Features:**
- CORS enabled for cross-origin WebSocket connections
- Simple and clean bootstrap pattern

---

#### 7. **App Module** - [app.module.ts](file:///home/zack/projects/nestjs_snippets/sokcet.io/Backend/src/app.module.ts)

**Purpose:** Root module that imports all feature modules.

**When to Use:**
- Understanding how to structure a multi-module NestJS application
- Setting up the application module hierarchy

**Key Features:**
- Imports `ChatModule` and `NotificationModule`
- Clean separation of concerns

---

### Frontend Snippets

#### 8. **React Chat Application** - [App.tsx](file:///home/zack/projects/nestjs_snippets/sokcet.io/Frontend/src/App.tsx)

**Purpose:** Complete React frontend implementation for real-time chat with room support and notifications.

**When to Use:**
- Building a real-time chat UI
- Implementing Socket.IO client in React
- Creating room-based chat interfaces
- Displaying real-time notifications

**How to Use:**
```typescript
// Install dependencies
npm install socket.io-client

// Import and use
import { io } from 'socket.io-client';

// Connect to namespaces
const chatSocket = io('http://localhost:3000/chat');
const notificationSocket = io('http://localhost:3000/notification');
```

**Key Features:**
- Dual socket connections (chat + notifications)
- Room join/leave functionality with UI
- Real-time message display with sender identification
- Toast notifications for system events
- Auto-scroll to latest messages
- Connection status indicator
- Message type differentiation (sent/received/system)
- Clean and responsive UI

**State Management:**
- Manages chat socket connection
- Tracks connection status
- Maintains message history
- Handles current room state
- Auto-dismissing notifications

**Events Handled:**
- `connect` / `disconnect` - Connection lifecycle
- `connected` - Server confirmation
- `reply` - Incoming messages
- `joined` / `left` - Room events
- `notification` - Real-time notifications

---

## Getting Started

### Backend Setup

```bash
cd sokcet.io/Backend

# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod
```

### Frontend Setup

```bash
cd sokcet.io/Frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Testing the Application

1. **Start the backend:**
   ```bash
   cd sokcet.io/Backend
   npm run start:dev
   ```

2. **Start the frontend:**
   ```bash
   cd sokcet.io/Frontend
   npm run dev
   ```

3. **Test chat functionality:**
   - Open multiple browser windows at `http://localhost:5173`
   - Join the same room in different windows
   - Send messages and observe real-time updates

4. **Test notifications via REST API:**
   ```bash
   curl -X POST http://localhost:3000/notification \
     -H "Content-Type: application/json" \
     -d '{"message": "Test notification"}'
   ```

---

## Technologies Used

### Backend
- **NestJS** - Progressive Node.js framework
- **Socket.IO** - Real-time bidirectional event-based communication
- **TypeScript** - Type-safe JavaScript
- **@nestjs/websockets** - WebSocket support for NestJS
- **@nestjs/platform-socket.io** - Socket.IO adapter for NestJS

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Socket.IO Client** - WebSocket client library
- **Vite** - Fast build tool and dev server

---

## Common Use Cases

### 1. **Real-Time Chat Application**
Use the chat gateway and frontend snippets to build a complete chat application with room support.

### 2. **Notification System**
Use the notification gateway and controller to implement a system-wide notification mechanism that can be triggered via WebSocket or REST API.

### 3. **Collaborative Workspaces**
Leverage room-based messaging to create separate channels for different teams or projects.

### 4. **Live Updates**
Adapt the notification system to push live updates for dashboards, monitoring systems, or real-time data feeds.

### 5. **Multi-Namespace Architecture**
Learn how to structure multiple WebSocket namespaces (`/chat`, `/notification`) for clean separation of concerns.

---

## Architecture Highlights

### WebSocket Namespaces
- `/chat` - Dedicated namespace for chat messages
- `/notification` - Separate namespace for notifications

### Module Organization
- **ChatModule** - Self-contained chat feature
- **NotificationModule** - Reusable notification system
- Clean dependency injection between modules

### Event-Driven Communication
- Client emits events to server
- Server broadcasts to rooms or all clients
- Separate notification channel for system events

---

## Best Practices Demonstrated

1. **Separation of Concerns** - Chat and notifications in separate modules
2. **Namespace Isolation** - Different namespaces for different features
3. **Type Safety** - Full TypeScript implementation
4. **Lifecycle Management** - Proper connection/disconnection handling
5. **Room-Based Messaging** - Scalable architecture for multi-room chat
6. **Cross-Module Communication** - Chat gateway uses notification gateway
7. **Dual Transport** - WebSocket for real-time + REST for external triggers

---

## License

MIT

---

## Contributing

Feel free to use these snippets in your projects. If you have improvements or additional snippets to share, contributions are welcome!
