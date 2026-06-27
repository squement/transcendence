import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtSecretRequestType, JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { dbUserService } from 'src/dbUser/dbUser.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private dbUser: dbUserService
	) {}

	async login(identifier: string, password: string, res: Response) {
		const user = await this.dbUser.findByUsername(identifier)
					?? await this.dbUser.findByEmail(identifier);
		if (!user)
			throw new UnauthorizedException("No account linked to these credentials!");

		const valid = await bcrypt.compare(password, user.password);
		if (!valid)
			throw new UnauthorizedException("Invalid password!");

		const token = this.jwtService.sign({ id: user.id.toString() });
		res.cookie('token', token, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return { message: "Logged in !!!!", id: user.id };
	}

	logout(res: Response) {
		res.clearCookie('token');
		return { message: 'Logged out baby!!!!' };
	}

	async register(username: string, email: string, password: string, res: Response) {
		await this.dbUser.create(username, email, password);
		return this.login(username, password, res);
	}
}
