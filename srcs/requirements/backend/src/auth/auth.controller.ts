import { Controller, Post, Get, Body, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import type { Response } from 'express';
import { PassThrough } from 'stream';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	login(
		@Body('identifier') username: string,
		@Body('password') password: string,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.login(username, password, res);
	}

	@Post('logout')
	@UseGuards(AuthGuard)
	logout(@Res({ passthrough: true}) res: Response) {
		return this.authService.logout(res);
	}

	@Post('register')
	register(
		@Body('username') username: string,
		@Body('email') email: string,
		@Body('password') password: string,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.register(username, email, password, res);
	}

	@Get('me')
	@UseGuards(AuthGuard)
	getMe(@Req() req: Request) {
		return req['user'];
	}
}
