import { Controller, Get, Post, Body, Param, UseGuards, Req } from "@nestjs/common";
import { dbUserService } from "./dbUser.service";
import { AuthGuard } from "src/auth/auth.guard";

@Controller('dbUser')
export class dbUserController {
	constructor(private readonly dbUserService: dbUserService) {}

	// users
	@Get('user/:username')
	getUser(@Param('username') username: string) {
		return this.dbUserService.getUser(username);
	}

	@Get('myUser')
	@UseGuards(AuthGuard)
	async getMyUser(@Req() req: Request) {
		return this.dbUserService.getMyUser(Number(req['user'].id));
	}


	// friends :)
	@Get('myUser/friends')
	@UseGuards(AuthGuard)
	async getFriends(@Req() req: Request) {
		return this.dbUserService.getFriends(Number(req['user'].id));
	}

	@Post('friend/new')
	@UseGuards(AuthGuard)
	async sendFriendship(@Req() req: Request, @Body('username') username: string) {
		const receiver = await this.dbUserService.findByUsername(username);
		if (!receiver) return null;
		return this.dbUserService.sendFriendship(Number(req['user'].id), receiver.id);
	}

	@Post('friend/accept')
	@UseGuards(AuthGuard)
	async acceptFriendship(@Req() req: Request, @Body('username') username: string) {
		const accepted = await this.dbUserService.findByUsername(username);
		if (!accepted) return null;
		return this.dbUserService.acceptFriendship(accepted.id, Number(req['user'].id));
	}

	@Post('friend/deny')
	@UseGuards(AuthGuard)
	async denyFriendship(@Req() req: Request, @Body('username') username: string) {
		const denied = await this.dbUserService.findByUsername(username);
		if (!denied) return null;
		return this.dbUserService.denyFriendship(denied.id, Number(req['user'].id));
	}

	@Post('friend/delete')
	@UseGuards(AuthGuard)
	async deleteFriendship(@Req() req: Request, @Body('username') username: string) {
		const deleted = await this.dbUserService.findByUsername(username);
		if (!deleted) return null;
		return this.dbUserService.deleteFriendship(Number(req['user'].id), deleted.id);
	}
}
