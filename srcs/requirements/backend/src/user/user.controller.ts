import type { Response } from 'express';
import { Controller, Res, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';
import fs from 'fs';
import path from 'path';

@Controller('user')
export class UserController {
	constructor(public userService: UserService) {}
	
	// GET
	@Get('/img')
	getAvatarDefault(@Res() res: Response) {
	const filePath = path.resolve(process.cwd(), './tools/testing.png');
	console.log(filePath);
	if (!fs.existsSync(filePath)) {
		res.status(404).json({ message: 'Image not found' });
		return;
	}
	res.setHeader('Content-Type', 'image/png');
	res.sendFile(filePath);
	}
	@Get('/add/:name')
	async add(@Param('name') name: string): Promise<User | null> {
		return this.userService.add(name);
	}
	@Get(['/rm/:id', '/remove/:id'])
	RemoveOne(@Param('id') id: string): string {
	const found = this.userService.remove(id);
	if (!found) throw new NotFoundException(`User ${id} couldn't be removed`);
	return 'User ' + id + ' was removed';
	}
	@Get(['/', '/find/all', '/find'])
	findAll() {
		const users = this.userService.findAll();
		if (!users) throw new NotFoundException(`Users couldn't be found`);
		return [...users.values()];
	}
	@Get([':id', '/find/:id'])
	findOne(@Param('id') id: string): User {
	const user = this.userService.findOne(id);
	if (!user) throw new NotFoundException(`User ${id} not found`);
	return user;
	}

	// POST
	@Post()
	updateOne(@Body() user: User): User {
	if (!user) throw new NotFoundException(`User tried updating with an empty body`);
	return this.userService.updateOne(user);
	}
	@Post('/arr')
	updateMany(@Body() users: User[]): User[] {
	if (!users) throw new NotFoundException(`User tried updating with an empty body`);
	return this.userService.updateMany(users);
	}
}