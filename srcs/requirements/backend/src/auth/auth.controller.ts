import { Controller, Post, Get, Body, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	login(
		@Body('id') id: string,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.login(id, res);
	}

	@Post('logout')
	@UseGuards(AuthGuard)
	logout(@Res({ passthrough: true}) res: Response) {
		return this.authService.logout(res);
	}

	@Get('me')
	@UseGuards(AuthGuard)
	getMe(@Req() req: Request) {
		return req['user'];
	}
}
