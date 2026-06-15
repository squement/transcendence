import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';

@Controller('user')
export class UserController {
	constructor(public userService: UserService) {}
	
	// GET
	@Get()
	getHello(): string {
		return 'hi, from user';
	}
	@Get('/add/:name')
	add(@Param('name') name: string): User {
		return this.userService.add(name);
	}
	@Get(['/find', '/find/all'])
	findAll(): User[] {
	const user = this.userService.findAll();
	if (!user) throw new NotFoundException(`Users couldn't be found`);
	return user;
	}
	@Get('/find/:id')
	findOne(@Param('id') id: string): User {
	const user = this.userService.findOne(Number(id));
	if (!user) throw new NotFoundException(`User ${id} not found`);
	return user;
	}
	@Get('/remove/:id')
	RemoveOne(@Param('id') id: string): boolean {
	const found = this.userService.remove(Number(id));
	if (!found) throw new NotFoundException(`User ${id} couldn't be removed`);
	return found;
	}

	// POST
	@Post('/update')
	updateMany(@Body() users: User[]): User[] {
	return this.userService.updateMany(users);
	}
	@Post('/update/one')
	updateOne(@Body() user: User): User {
	return this.userService.updateOne(user);
	}
}