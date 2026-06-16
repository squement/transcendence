import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EventsGateway } from './services/events.gateway';

@Module({
  imports: [EventsGateway, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
