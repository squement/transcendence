import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { NotificationsGateway } from './notifications.gateway';
import { EventsGateway } from './events.gateway';
import { UserModule } from '../user/user.module';

@Module({
	imports: [UserModule
	],
	providers: [
		EventsGateway,
		ChatGateway,
		NotificationsGateway
	],
})
export class SocketModule {}