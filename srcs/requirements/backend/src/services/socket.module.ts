import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { EventsGateway } from './events.gateway';
import { UserModule } from '../user/user.module';

@Module({
	imports: [UserModule
	],
	providers: [
		EventsGateway,
		NotificationsGateway
	],
})
export class SocketModule {}