# Backend Documentation - NestJS WebSocket Chat System

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Module Structure](#module-structure)
3. [WebSocket Gateways](#websocket-gateways)
4. [Room-Based Messaging](#room-based-messaging)
5. [Notification System](#notification-system)
6. [API Endpoints](#api-endpoints)
7. [Event Flow](#event-flow)

---

## Architecture Overview

The backend is built using **NestJS** with **Socket.IO** for real-time WebSocket communication. The system supports:
- Room-based chat messaging
- Real-time notifications
- Multiple concurrent connections
- CORS-enabled for cross-origin requests

### Technology Stack
- **Framework**: NestJS 11.x
- **WebSocket Library**: Socket.IO 4.x
- **Runtime**: Node.js 22.x
- **Package Manager**: pnpm

---

## Module Structure

### AppModule
**Location**: `src/app.module.ts`

The root module that imports and configures all feature modules.

```typescript
@Module({
  imports: [ChatModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**Key Features**:
- Imports `ChatModule` for chat functionality
- Imports `NotificationModule` for notifications
- Enables CORS in `main.ts` for frontend access

---

### ChatModule
**Location**: `src/chat/chat.module.ts`

Handles all chat-related functionality including room management.

```typescript
@Module({
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
```

**Dependencies**:
- Imports `NotificationModule` to access `NotificationGateway`
- Exports `ChatGateway` for potential use in other modules

---

### NotificationModule
**Location**: `src/notification/notification.module.ts`

Manages notification broadcasting to all clients or specific rooms.

```typescript
@Module({
  controllers: [NotificationController],
  providers: [NotificationGateway],
  exports: [NotificationGateway],
})
export class NotificationModule {}
```

**Key Features**:
- Exports `NotificationGateway` for injection into other modules
- Provides REST API endpoint for triggering notifications

---

## WebSocket Gateways

### ChatGateway
**Location**: `src/chat/chat.gateway.ts`  
**Namespace**: `/chat`  
**Port**: Attached to main HTTP server (default: 3000)

#### Configuration
```typescript
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
```

#### Lifecycle Hooks

**`afterInit(server: Server)`**
- Called when the gateway is initialized
- Logs initialization message

**`handleConnection(client: Socket)`**
- Called when a client connects to `/chat` namespace
- Emits `connected` event to the client with their socket ID

**`handleDisconnect(client: Socket)`**
- Called when a client disconnects
- Logs disconnection

#### Event Handlers

##### 1. `message` Event
**Purpose**: Send a message to a specific room

**Client Payload**:
```typescript
{
  room: string;      // Room name
  message: string;   // Message content
}
```

**Server Response**:
```typescript
// Emitted to all clients in the room
{
  id: string;              // Sender's socket ID
  message: { message: string };
  room: string;
}
```

**Implementation**:
```typescript
@SubscribeMessage('message')
handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string; message: string }) {
  // Emit to specific room
  this.server.to(payload.room).emit('reply', {
    id: client.id,
    message: { message: payload.message },
    room: payload.room
  });
  
  // Send notification to room
  this.notificationGateway.sendToRoom(payload.room, `New message in ${payload.room}`);
}
```

##### 2. `join-room` Event
**Purpose**: Join a chat room

**Client Payload**:
```typescript
{
  room: string;  // Room name to join
}
```

**Server Response**:
- Emits `joined` to the client
- Emits `joined` to other users in the room

**Implementation**:
```typescript
@SubscribeMessage('join-room')
handleJoin(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string }) {
  client.join(payload.room);
  client.emit('joined', `You joined room: ${payload.room}`);
  client.to(payload.room).emit('joined', `User ${client.id} joined room: ${payload.room}`);
}
```

##### 3. `leave-room` Event
**Purpose**: Leave a chat room

**Client Payload**:
```typescript
{
  room: string;  // Room name to leave
}
```

**Server Response**:
- Emits `left` to the client
- Emits `left` to other users in the room

---

### NotificationGateway
**Location**: `src/notification/notification.gateway.ts`  
**Namespace**: `/notification`  
**Port**: Attached to main HTTP server (default: 3000)

#### Configuration
```typescript
@WebSocketGateway({
  namespace: '/notification',
})
```

#### Methods

##### `sendToAll(message: string)`
**Purpose**: Broadcast notification to all connected clients

**Usage**:
```typescript
this.notificationGateway.sendToAll('System maintenance in 5 minutes');
```

**Emitted Event**:
```typescript
{
  type: 'notification',
  message: string
}
```

##### `sendToRoom(room: string, message: string)`
**Purpose**: Send notification to all clients in a specific room

**Usage**:
```typescript
this.notificationGateway.sendToRoom('general', 'New message in general');
```

**Emitted Event**:
```typescript
{
  type: 'notification',
  message: string,
  room: string
}
```

#### Lifecycle Hooks

**`handleConnection(client: Socket)`**
- Logs when a client connects to `/notification` namespace
- Clients automatically receive notifications once connected

---

## Room-Based Messaging

### How Rooms Work

Socket.IO rooms are server-side constructs that allow broadcasting to subsets of connected clients.

#### Key Concepts

1. **Joining a Room**:
   ```typescript
   client.join('room-name');
   ```

2. **Leaving a Room**:
   ```typescript
   client.leave('room-name');
   ```

3. **Emitting to a Room**:
   ```typescript
   this.server.to('room-name').emit('event', data);
   ```

4. **Emitting to Others in Room** (excluding sender):
   ```typescript
   client.to('room-name').emit('event', data);
   ```

### Room Isolation

- Messages sent to a room are **only** received by clients in that room
- A client can be in multiple rooms simultaneously
- Rooms are created automatically when a client joins
- Rooms are destroyed when the last client leaves

---

## Notification System

### Integration with Chat

The `ChatGateway` injects `NotificationGateway` to send notifications when messages are sent:

```typescript
constructor(private notificationGateway: NotificationGateway) {}

handleMessage(...) {
  // Send message to room
  this.server.to(payload.room).emit('reply', ...);
  
  // Notify users in the room
  this.notificationGateway.sendToRoom(payload.room, `New message in ${payload.room}`);
}
```

### REST API Trigger

Notifications can also be triggered via HTTP POST request.

---

## API Endpoints

### POST /notification
**Purpose**: Trigger a notification to all connected clients

**Request Body**:
```json
{
  "message": "Your notification message"
}
```

**Controller Implementation**:
```typescript
@Post()
sendNotification(@Body() body: { message: string }) {
  this.notificationGateway.sendToAll(body.message);
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/notification \
  -H "Content-Type: application/json" \
  -d '{"message": "Server maintenance in 10 minutes"}'
```

---

## Event Flow

### Message Flow Diagram

```
Client A (Room: general)
    |
    | emit('message', { room: 'general', message: 'Hello' })
    v
ChatGateway
    |
    |-- server.to('general').emit('reply', { id, message, room })
    |       |
    |       v
    |   All clients in 'general' room receive message
    |
    |-- notificationGateway.sendToRoom('general', 'New message')
            |
            v
        NotificationGateway
            |
            v
        server.to('general').emit('notification', { message, room })
            |
            v
        All clients in 'general' room receive notification
```

### Connection Flow

```
1. Client connects to http://localhost:3000/chat
   ↓
2. ChatGateway.handleConnection() called
   ↓
3. Client receives 'connected' event with socket ID
   ↓
4. Client emits 'join-room' with { room: 'general' }
   ↓
5. ChatGateway.handleJoin() adds client to room
   ↓
6. Client receives 'joined' confirmation
   ↓
7. Other clients in room receive 'joined' notification
```

---

## Configuration

### Main Application
**Location**: `src/main.ts`

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();  // Enable CORS for frontend
  await app.listen(process.env.PORT ?? 3000);
}
```

### Environment Variables

- `PORT`: HTTP server port (default: 3000)

---

## Best Practices

### 1. Error Handling
Always validate payloads in event handlers:
```typescript
@SubscribeMessage('message')
handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string; message: string }) {
  if (!payload.room || !payload.message) {
    client.emit('error', 'Invalid payload');
    return;
  }
  // Process message
}
```

### 2. Room Naming
Use consistent room naming conventions:
- Lowercase: `general`, `support`, `dev-team`
- Avoid special characters
- Use hyphens for multi-word rooms

### 3. Logging
Use NestJS Logger for consistent logging:
```typescript
private logger: Logger = new Logger('ChatGateway');
this.logger.log('Client connected:', client.id);
```

### 4. Dependency Injection
Inject gateways properly for cross-module communication:
```typescript
constructor(private notificationGateway: NotificationGateway) {}
```

---

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure `app.enableCors()` is called in `main.ts`
- Check gateway CORS configuration: `cors: { origin: '*' }`

**2. Clients Not Receiving Messages**
- Verify client is in the correct room
- Check namespace connection (`/chat` vs `/notification`)
- Ensure payload structure matches expected format

**3. Port Already in Use**
- Kill existing process: `kill -9 $(lsof -t -i:3000)`
- Change port in `main.ts`

---

## Summary

This backend provides a robust, scalable WebSocket chat system with:
- ✅ Room-based messaging isolation
- ✅ Real-time notifications
- ✅ REST API integration
- ✅ Proper dependency injection
- ✅ Clean separation of concerns

The modular architecture allows easy extension for features like:
- Private messaging
- User authentication
- Message persistence
- Typing indicators
- Read receipts
