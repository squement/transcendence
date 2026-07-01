import { Controller, Get, Post, Body, Param, UseGuards, Req, UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { dbUserService } from "./dbUser.service";
import { AuthGuard } from "src/auth/auth.guard";
import { unlink } from "fs/promises";
import { join } from "path";
import { User } from "src/user/user.model";
import { error } from "console";

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


	@Post('myUser/avatar')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('avatar', {
		storage: diskStorage({
			destination: './uploads',
			filename: (req, file, cb) => {
				const uniqueName = `${req['user'].id}-${Date.now()}${extname(file.originalname)}`;
				cb(null, uniqueName);
			}
		}),
		limits: { fileSize: 5 * 1024 * 1024 },
		fileFilter: (req, file, cb) => {
			if (!file.mimetype.match("^image/(jpeg|png|gif|webp)$"))
				return cb(new Error('only image files are allowed'), false);
			cb(null, true);
		}
	}))
	async uploadAvatar(@UploadedFile() file: any, @Req() req) {
		if (!file) return { error: 'invalid file' };
		const userId = Number(req['user'].id);
		const user = await this.dbUserService.getMyUser(userId);
		if (user?.avatarPath) {
			try { await unlink(join('/app', user.avatarPath)); }
			catch (_) {}
		}
		return this.dbUserService.update(userId, { avatarPath: `/uploads/${file.filename}` });
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
