import { Module } from '@nestjs/common';
import { RoomController } from './room.controller'
import { RoomService } from './room.service';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [GroupModule],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [
	RoomService,
  ],
})
export class RoomModule {}