import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [ChatModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
