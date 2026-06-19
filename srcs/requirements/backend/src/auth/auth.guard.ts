import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>();

		const token = request.cookies?.token;
		if (!token)
			throw new UnauthorizedException('No cookie!!! too bad Santa ;p');

		try {
			const payload = this.jwtService.verify(token);
			request['user'] = payload;
		}
		catch {
			throw new UnauthorizedException('Invalid/Expired token');
		}
		return true;
	}
}