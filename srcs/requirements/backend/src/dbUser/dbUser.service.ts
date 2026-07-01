import { Injectable, Inject, forwardRef } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "src/user/user.model";
import { UserService } from "src/user/user.service";

@Injectable()
export class dbUserService {
	constructor(private prisma: PrismaService,
		@Inject(forwardRef(() => UserService)) private userService: UserService) {}

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

	async update(id: number, data: { username?: string, email?: string, password?: string, avatarPath?: string }) {
		if (data.password)
			data.password = await bcrypt.hash(data.password, 10);
		const update = await this.prisma.user.update({ 
			where: { id }, 
			data
		})
		if (update && this.userService.findOne(id))
			this.userService.updateOne(new User(id, update.username, await this.getFriendsSet(id)));
		return update;
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
	async getFriends(myId: number) { // get friends for the public
		return this.prisma.user.findUnique({
			where: { id: myId },
			select: { // go through the user's friendships, and return the getUser() objects,
				username: true,
				sentFriendships: {
					where: { status: 'accepted' },
					select: {
						receiver: { select: { username: true, gamesPlayed: true, gamesWon: true } }
				}},
				receivedFriendships: {
					where: { status: 'accepted' },
					select: {
						sender: { select: { username: true, gamesPlayed: true, gamesWon: true } }
			}}}
		});
	}

	async getFriendsId(myId: number) { // get friends private (contains friends' Id)
		return this.prisma.user.findUnique({
			where: { id: myId },
			select: { // go through the user's friendships, and return the getUser() objects,
				username: true,
				sentFriendships: {
					where: { status: 'accepted' },
					select: {
						receiver: { select: { id: true, username: true, gamesPlayed: true, gamesWon: true } }
				}},
				receivedFriendships: {
					where: { status: 'accepted' },
					select: {
						sender: { select: { id:true, username: true, gamesPlayed: true, gamesWon: true } }
			}}}
		});
	}

	async getFriendsSet(id: number) { // returns set of friends' ids
		const userFriends = await this.getFriendsId(id);
		return new Set([
		  ...userFriends?.sentFriendships.map(f => f.receiver.id) ?? [],
		  ...userFriends?.receivedFriendships.map(f => f.sender.id) ?? []
		]);
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
				status: 'pending'
			},
			data: { status: 'denied' }
		});
	}

	async acceptFriendship(senderId: number, receiverId: number) {
		const friend = await this.isFriendship(senderId, receiverId);
		if (!friend) return null;
		const acceptance = await this.prisma.friendship.update({
			where: {
				senderId_receiverId: { senderId, receiverId },
				status: { in: ['pending', 'denied'] }
			},
			data: { status: 'accepted' }
		});
		if (acceptance) {
			this.userService.findOne(receiverId)?.friends.add(senderId);
			this.userService.findOne(senderId)?.friends.add(receiverId);
		}
		return acceptance;
	}

	async deleteFriendship(senderId: number, receiverId: number) {
		const friend = await this.isFriendship(senderId, receiverId)
					?? await this.isFriendship(receiverId, senderId);
		if (!friend) return null;
		senderId = friend.senderId;
		receiverId = friend.receiverId;
		const deletion = await this.prisma.friendship.delete({
			where: { senderId_receiverId: { senderId, receiverId } }
		});
		if (deletion) {
			this.userService.findOne(receiverId)?.friends.delete(senderId);
			this.userService.findOne(senderId)?.friends.delete(receiverId);
		}
	}

	async sendFriendship(senderId: number, receiverId: number) {
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
