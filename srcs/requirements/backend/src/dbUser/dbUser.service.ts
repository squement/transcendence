import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { receiveMessageOnPort } from "node:worker_threads";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class dbUserService {
	constructor(private prisma: PrismaService) {}

	// search user
	async findById(id: number) {
		return this.prisma.user.findUnique({ where: { id } })
	}

	async findByUsername(username: string) {
		return this.prisma.user.findUnique({ where: { username } })
	}

	async findByEmail(email: string) {
		return this.prisma.user.findUnique({ where: { email } })
	}

	async getUser(username: string) {
		const user = await this.findByUsername(username);
		if (!user)
			return null;
		const { id, createdAt, updatedAt, email, password, ...rest } = user;
		return rest;
	}

	async getMyUser(myId: number) {
		const user = await this.findById(myId);
		if (!user)
			return null;
		const { id, updatedAt, email, password, ...rest } = user;
		return rest;
	}

	// create or modify user
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

	async playedGame(id: number) {
		return this.prisma.user.update({
			where: { id },
			data: {	gamesPlayed: { increment: 1 } }
		})
	}

	async wonGame(id: number) {
		return this.prisma.user.update({
			where: { id },
			data: {	gamesWon: { increment: 1 } }
		})
	}


	// friendship <3
	async getFriends(id: number) {
		return this.prisma.user.findUnique({
			where: { id },
			include: {
				sentFriendships: { where: { status: 'accepted' } },
				receivedFriendships: { where: { status: 'accepted' } }
			}
		})
	}

	async isFriendship(senderId: number, receiverId: number) { // check if this friendship exists
		return this.prisma.friendship.findUnique({
			where: { senderId_receiverId: { senderId, receiverId } }
		});
	}

	async denyFriendship(senderId: number, receiverId: number) {
		const friend = await this.isFriendship(senderId, receiverId);
		if (!friend) return null;
		return this.prisma.friendship.update({
			where: { 
				senderId_receiverId: { senderId, receiverId },
				status: { in: ['pending', 'denied'] }
			},
			data: { status: 'denied' }
		});
	}

	async acceptFriendship(senderId: number, receiverId: number) {
		const friend = await this.isFriendship(senderId, receiverId);
		if (!friend) return null;
		return this.prisma.friendship.update({
			where: { 
				senderId_receiverId: { senderId, receiverId },
				status: { in: ['pending', 'denied'] }
			},
			data: { status: 'accepted' }
		});
	}

	async deleteFriendship(senderId: number, receiverId: number) {
		const friend = await this.isFriendship(senderId, receiverId)
					?? await this.isFriendship(receiverId, senderId);
		if (!friend) return null;
		senderId = friend.senderId;
		receiverId = friend.receiverId;
		return this.prisma.friendship.delete({
			where: { senderId_receiverId: { senderId, receiverId } }
		});
	}

	async sendFriendship(senderId: number, receiverId: number) {
		const friend = this.isFriendship(senderId, receiverId);
		if (!friend) return null;

		if (senderId == receiverId)
			return (console.log('this guy thinks hes funny smh'), null);

		const usend = await this.findById(senderId);
		const ureceive = await this.findById(receiverId);
		if (!usend || !ureceive)
			return null;

		if (await this.isFriendship(senderId, receiverId))
			return null;

		if (await this.isFriendship(receiverId, senderId)) // if sender has received request from receiver before, accept request
			return this.acceptFriendship(receiverId, senderId);

		console.log('LETS GET THEM FRIENDS WOWIE');
		return this.prisma.friendship.create({
			data: {
				senderId: usend.id,
				receiverId: ureceive.id
			}
		});
	}
}
