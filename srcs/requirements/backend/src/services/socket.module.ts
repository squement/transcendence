import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { EventsGateway } from './events.gateway';
import { GameGateway } from './game.gateway';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { dbUserModule } from '../dbUser/dbUser.module';

@Module({
	imports: [
		UserModule,
		RoomModule,
		dbUserModule
	],
	providers: [
		EventsGateway,
		GameGateway,
		NotificationsGateway
	],
})
export class SocketModule {}