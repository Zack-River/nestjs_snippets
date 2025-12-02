import { Logger, Inject } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationGateway } from '../notification/notification.gateway';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  private logger: Logger = new Logger('ChatGateway');

  constructor(private notificationGateway: NotificationGateway) {}

  afterInit(server: Server) {
    this.logger.log('ChatGateway initialized...');
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string; message: string }) {
    this.logger.log('Message received:', { id: client.id, payload });
    
    // Emit to specific room
    this.server.to(payload.room).emit('reply', {
      id: client.id,
      message: { message: payload.message },
      room: payload.room
    });

    // Send notification to users in the room
    this.notificationGateway.sendToRoom(payload.room, `New message in ${payload.room}`);
  }

  @SubscribeMessage('join-room')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string }) {
    client.join(payload.room);
    this.logger.log(`Client ${client.id} joined room: ${payload.room}`);
    
    // Notify the client
    client.emit('joined', `You joined room: ${payload.room}`);
    
    // Notify others in the room
    client.to(payload.room).emit('joined', `User ${client.id} joined room: ${payload.room}`);
  }

  @SubscribeMessage('leave-room')
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string }) {
    client.leave(payload.room);
    this.logger.log(`Client ${client.id} left room: ${payload.room}`);
    
    // Notify the client
    client.emit('left', `You left room: ${payload.room}`);
    
    // Notify others in the room
    client.to(payload.room).emit('left', `User ${client.id} left room: ${payload.room}`);
  }

  handleConnection(client: Socket) {
    this.logger.log('Client connected:', client.id);
    client.emit('connected', `Connected with ID: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected:', client.id);
  }
}
