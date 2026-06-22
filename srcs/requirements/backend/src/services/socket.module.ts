import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { EventsGateway } from './events.gateway';
import { GameGateway } from './game.gateway';
import { UserModule } from '../user/user.module';

@Module({
	imports: [UserModule
	],
	providers: [
		EventsGateway,
		GameGateway,
		NotificationsGateway
	],
})
export class SocketModule {}