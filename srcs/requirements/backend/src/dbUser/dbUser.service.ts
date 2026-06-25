import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class dbUserService {
	constructor(private prisma: PrismaService) {}

	async findById(id: number) {
		return this.prisma.user.findUnique({ where: { id } })
	}

	async findByUsername(username: string) {
		return this.prisma.user.findUnique({ where: { username } })
	}

	async findByEmail(email: string) {
		return this.prisma.user.findUnique({ where: { email } })
	}

	async create(username: string, email: string, password: string) {
		const hash = await bcrypt.hash(password, 10);
		return this.prisma.user.create({ data: { username, email, password: hash } })
	}

	async update(id: number, data: { username?: string, email?: string, password?: string }) {
		if (data.password)
			data.password = await bcrypt.hash(data.password, 10);
		return this.prisma.user.update({ 
			where: { id }, 
			data 
		})
	}
}
