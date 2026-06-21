import type { Response } from 'express';
import { Controller, Res, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { GroupService } from './group.service';
import { Group } from './group.model';
import { User } from '../user/user.model';
import fs from 'fs';
import path from 'path';

@Controller('group')
export class GroupController {
	constructor(public groupService: GroupService) {}
	
	// GET
	/*@Get(['/rm/:id', '/remove/:id'])
	RemoveOne(@Param('id') id: string): string {
	const found = this.userService.remove(id);
	if (!found) throw new NotFoundException(`User ${id} couldn't be removed`);
	return 'User ' + id + ' was removed';
	}*/
	@Get(['/', '/find/all', '/find'])
	findAll(): Group {
	const group = this.groupService.findAll();
	if (!group) throw new NotFoundException(`Groups couldn't be found`);
	return group;
	}
	/*@Get([':id', '/find/:id'])
	findOne(@Param('id') id: string): User {
	const user = this.userService.findOne(id);
	if (!user) throw new NotFoundException(`User ${id} not found`);
	return user;
	}*/

	// POST
	@Post('/add')
	createGroup(@Body() user: User): Group | null {
	if (!user) throw new NotFoundException(`Need a user host to create a group`);
	return this.groupService.add(user);
	}
	@Post('/join')
	joinGroup(@Body() user: User): Group | null {
	if (!user) throw new NotFoundException(`Need a user host to create a group`);
	return this.groupService.join(user);
	}
}