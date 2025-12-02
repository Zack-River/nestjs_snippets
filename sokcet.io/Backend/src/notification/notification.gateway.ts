import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { OnGatewayConnection } from '@nestjs/websockets';

@WebSocketGateway({
  namespace: '/notification',
})
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('NotificationGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Notification Client connected: ${client.id}`);
  }

  sendToAll(message: string) {
    this.logger.log(`Sending notification to all: ${message}`);
    this.server.emit('notification', {
      type: 'notification',
      message,
    });
  }

  sendToRoom(room: string, message: string) {
    this.logger.log(`Sending notification to room ${room}: ${message}`);
    this.server.to(room).emit('notification', {
      type: 'notification',
      message,
      room,
    });
  }
}
