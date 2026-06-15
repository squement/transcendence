import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';

@Controller('user')
export class UserController {
	constructor(public userService: UserService) {}
	
	// GET
	@Get(['/', '/find', '/find/all'])
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