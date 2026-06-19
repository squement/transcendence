import { Injectable } from "@nestjs/common";

@Injectable()
export class Box {
	public id:		number = 0;
	public host:	number = 0;
	public nP:		number = -1;	// number of players
	public lP:		number[] = [];// list of players

	max(max: number) {
		this.nP = max;
	}
	add(add_players: number[]) {
		const max = this.nP >= 0 ? this.nP - this.lP.length : add_players.length;
		if (this.nP >= 0 && this.lP.length >= this.nP) return add_players;
		const players = add_players.slice(0, max);
  		const waiters = add_players.slice(max);
		this.lP = this.lP.concat(players);
		return waiters;
	}
}

@Injectable()
export class Room {
	private players!:	Box;
	private waiters!:	Box;
	// private spectator!:	Box;
	constructor(
	max_players: number,
	add_players: number[]
) {
	this.players.max(max_players);
	this.waiters.add(
		this.players.add(add_players)
	);
}

	add(add_players: number[]) {
		this.waiters.add(
			this.players.add(add_players)
		);
	}
}

@Injectable()
export default class RoomService {
	private rooms: Room[] = [];

	add(max: number, users: number[]): Room {
		const room = new Room(max, users);
		this.rooms.push(room);
		return room;
	}
}