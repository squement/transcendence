import { Injectable } from '@nestjs/common';
import { JwtSecretRequestType, JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

	login(username: string, res: Response) {
		const payload = { username };
		const token = this.jwtService.sign(payload);

		res.cookie('token', token, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return { message: "Logged in !!!!", username };
	}

	logout(res: Response) {
		res.clearCookie('token');
		return { message: 'Logged out baby!!!!' };
	}
}
