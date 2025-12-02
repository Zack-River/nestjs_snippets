import { Controller, Post, Body } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  @Post()
  sendNotification(@Body() body: { message: string }) {
    console.log('NotificationController: Received request', body);
    this.notificationGateway.sendToAll(body.message);
  }
}
