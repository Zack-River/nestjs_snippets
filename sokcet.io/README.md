# NestJS WebSocket Snippets

A collection of NestJS WebSocket implementations demonstrating real-time communication patterns with Socket.IO.

## 📁 Project Structure

```
sokcet.io/
├── Backend/          # Main chat application backend
├── Frontend/         # Main chat application frontend
└── examples/         # Example projects
    ├── style-nest-boutique/
    ├── intent-3d-startup/
    └── sales-dashboard/
```

---

## 🚀 Main Application: Room-Based Chat System

**Location**: `Backend/` and `Frontend/`

A full-featured real-time chat application with room support and notifications.

### Features
- ✅ **Room-based messaging** - Users can join/leave chat rooms
- ✅ **Real-time notifications** - Toast notifications for new messages
- ✅ **WebSocket namespaces** - Separate `/chat` and `/notification` namespaces
- ✅ **REST API integration** - Trigger notifications via POST endpoint
- ✅ **Modern UI** - React frontend with dark theme and profile circles

### Quick Start

**Backend**:
```bash
cd Backend
pnpm install
pnpm run start:dev
```

**Frontend**:
```bash
cd Frontend
npm install
npm run dev
```

Access the app at `http://localhost:5173`

### Architecture

**Backend** (NestJS + Socket.IO):
- `ChatGateway` - Handles room-based messaging on `/chat` namespace
- `NotificationGateway` - Manages notifications on `/notification` namespace
- `NotificationController` - REST API for triggering notifications

**Frontend** (React + Vite):
- Room selection UI
- Real-time message display with sender identification
- Notification toast system
- Profile circles with sender initials

### Documentation
📖 **[Backend Documentation](./Backend/BACKEND_DOCUMENTATION.md)** - Comprehensive guide covering:
- Architecture overview
- Module structure
- WebSocket gateways
- Room-based messaging mechanics
- Event flow diagrams
- API endpoints
- Best practices

---

## 📚 Example Projects

### 1. StyleNest Boutique
**Location**: `examples/style-nest-boutique/`

E-commerce themed full-stack application scaffold.

**Stack**:
- Backend: NestJS
- Frontend: React + Vite + TypeScript

**Status**: Scaffolded structure ready for development

---

### 2. Intent 3D - Startup
**Location**: `examples/intent-3d-startup/`

3D/Startup themed full-stack application scaffold.

**Stack**:
- Backend: NestJS
- Frontend: React + Vite + TypeScript

**Status**: Scaffolded structure ready for development

---

### 3. Sales Dashboard
**Location**: `examples/sales-dashboard/`

Data visualization dashboard for sales analytics.

**Purpose**: Monitor KPIs, sales rep effectiveness, inventory performance, and return rates.

**Stack**:
- Backend: NestJS
- Frontend: React + Vite + TypeScript

**Status**: Scaffolded structure ready for development

---

## 🔧 Technology Stack

### Backend
- **Framework**: NestJS 11.x
- **WebSocket**: Socket.IO 4.x
- **Runtime**: Node.js 22.x
- **Package Manager**: pnpm

### Frontend
- **Framework**: React 18.x
- **Build Tool**: Vite 7.x
- **Language**: TypeScript
- **WebSocket Client**: socket.io-client

---

## 📝 Key Concepts Demonstrated

### 1. WebSocket Namespaces
Separate logical channels for different purposes:
- `/chat` - Chat messaging
- `/notification` - System notifications

### 2. Room-Based Messaging
Socket.IO rooms for message isolation:
```typescript
// Join a room
client.join('room-name');

// Send to room
this.server.to('room-name').emit('event', data);
```

### 3. Cross-Module Communication
`ChatGateway` injects `NotificationGateway` to send notifications on new messages.

### 4. REST + WebSocket Integration
Trigger WebSocket events via HTTP POST:
```bash
curl -X POST http://localhost:3000/notification \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

---

## 🎯 Use Cases

This project demonstrates patterns for:
- Real-time chat applications
- Collaborative tools
- Live notifications
- Room-based communication
- Multi-namespace WebSocket apps
- Hybrid REST/WebSocket APIs

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
kill -9 $(lsof -t -i:3000)
```

### CORS Issues
Ensure `app.enableCors()` is called in `Backend/src/main.ts`

### Clients Not Receiving Messages
- Verify correct namespace connection
- Check if client is in the correct room
- Validate payload structure

---

## 📄 License

This is a snippet collection for learning and reference purposes.

---

## 🤝 Contributing

These are code snippets and examples. Feel free to use them as templates for your own projects.

---

**Last Updated**: December 2, 2025
