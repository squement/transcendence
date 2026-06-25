import type { Response } from 'express';
import { Controller, Req, Res, Get, Post, Body, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RoomService } from './room.service';
import { GroupService } from '../group/group.service';

@Controller('room')
export class RoomController {
	constructor(public roomService: RoomService, public groupService: GroupService) {}

	getMe(@Req() req: Request) {
		return req['user'];
	}

	@Get('new')
	@UseGuards(AuthGuard)
	createRoom(@Req() req: Request) {
		const user = this.getMe(req);
		if (!user) throw new NotFoundException(`Can't find requesting user`);
		console.log(user);
		//const groupId = this.groupService.new(user.id, null)?.id;
		return this.roomService.new(user.id);
	}
	@Get('join/:id')
	@UseGuards(AuthGuard)
	joinRoom(@Req() req: Request, @Param('id') id: string) {
		const user = this.getMe(req);
		if (!user) throw new NotFoundException(`Can't find requesting user`);
		return this.roomService.join(id, user.id);
	}
	@Get('leave/:id')
	@UseGuards(AuthGuard)
	leaveRoom(@Req() req: Request, @Param('id') id: string) {
		const user = this.getMe(req);
		if (!user) throw new NotFoundException(`Can't find requesting user`);
		return this.roomService.leave(id, user.id);
	}
	@Get(['find/all', 'find', '/'])
	findAll() {
		return this.roomService.findAll();
	}
	@Get(['/find/:id', '/:id'])
	findOne(@Param('id') id: string) {
		return this.roomService.findOne(id);
	}
}