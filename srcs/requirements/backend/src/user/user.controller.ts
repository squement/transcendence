import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';

@Controller('user')
export class UserController {
	constructor(public userService: UserService) {}
	
	@Get()
	getHello(): string {
		return 'hi, from user';
	}
	@Get('/add/:name')
	add(@Param('name') name: string): User {
		return this.userService.add(name);
	}
	@Get('/my_config')
	getConfigTest(): object {
	return {
		id: 'test',
		idn: 0,
		theme: 'dark',
		language: 'fr',
	};
	}
	@Get('/find/all')
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
}