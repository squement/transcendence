import type { Response } from 'express';
import { Controller, Req, Res, Get, Post, Body, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { GroupService } from './group.service';
import { Group } from './group.model';
import { User } from '../user/user.model';
import fs from 'fs';
import path from 'path';

@Controller('group')
export class GroupController {
	constructor(public groupService: GroupService) {}

	getMe(@Req() req: Request) {
		return req['user'];
	}

	@Get('new')
	@UseGuards(AuthGuard)
	createGroup(@Req() req: Request) : Group | undefined {
		const user = this.getMe(req);
		if (!user) throw new NotFoundException(`Can't find requesting user`);
		console.log(user);
		return this.groupService.new(user.id, null);
	}
	/*@Get(['/rm/:id', '/remove/:id'])
	RemoveOne(@Param('id') id: string): string {*/
	@Get('join/:id')
	@UseGuards(AuthGuard)
	joinGroup(@Req() req: Request, @Param('id') id: string) : Group | undefined {
		const user = this.getMe(req);
		if (!user) throw new NotFoundException(`Can't find requesting user`);
		return this.groupService.join(id, user.id);
	}
	@Get(['/', '/find/all', '/find'])
	findAll() {
	const groups = this.groupService.findAll();
	if (!groups) throw new NotFoundException(`Groups couldn't be found`);
	return groups;
	}
	@Get(['/find/:id', '/:id'])
	findOne(@Param('id') id: string): Group | undefined {
		return this.groupService.findOne(id);
	}

	// POST
	/*@Post('/add')
	createGroup(@Body() user: User): Group | null {
	if (!user) throw new NotFoundException(`Need a user host to create a group`);
	return this.groupService.add(user);
	}
	@Post('/join')
	joinGroup(@Body() user: User): Group | null {
	if (!user) throw new NotFoundException(`Need a user host to create a group`);
	return this.groupService.join(user);
	}*/
}