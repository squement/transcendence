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
	/*@Get([':id/avatar', '/find/:id/avatar'])
	getAvatar(@Param('id') id: string, @Res() res: Response) {
	const filePath = '/tools/testing.png';
	//const filePath = path.join(__dirname, '../../uploads', `${id}.png`);
	if (!fs.existsSync(filePath)) throw new NotFoundException('Image not found');
	res.setHeader('Content-Type', 'image/png');
	res.sendFile(filePath);
	}*/
	@Get('/add/:name')
	add(@Param('name') name: string): User {
		return this.userService.add(name);
	}
	@Get(['/rm/:id', '/remove/:id'])
	RemoveOne(@Param('id') id: string): string {
	const found = this.userService.remove(Number(id));
	if (!found) throw new NotFoundException(`User ${id} couldn't be removed`);
	return 'User ' + id + ' was removed';
	}
	@Get(['/', '/find/all', '/find'])
	findAll(): User[] {
	const user = this.userService.findAll();
	if (!user) throw new NotFoundException(`Users couldn't be found`);
	return user;
	}
	@Get([':id', '/find/:id'])
	findOne(@Param('id') id: string): User {
	const user = this.userService.findOne(Number(id));
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