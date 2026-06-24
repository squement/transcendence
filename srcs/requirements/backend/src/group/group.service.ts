import { Injectable } from "@nestjs/common";
import { Group } from './group.model';
import { eventBus } from "../app.events";

@Injectable()
export class GroupService {
	private groups = new Map<string, Group>();
	constructor() {
		eventBus.on("userDeleted", (userId: string) => {
			for (const [groupId] of this.groups) {
				this.leave(groupId, userId);
			}
		});
	}

	new(host: string | undefined, max: number | null) : Group | undefined {
		if (host === undefined) return undefined;
		const group = new Group(max);
		console.log("before", this.groups.size);
		group.addPlayers([ host ]);
		this.groups.set(group.id, group);
		console.log("after", this.groups.size);
		return this.groups.get(group.id);
	}
	rm(id: string) {
		this.groups.delete(id);
	}
	join(id: string, guest: string | undefined) : Group | undefined {
		if (guest === undefined) return undefined;
		this.groups.get(id)?.addPlayers([ guest ]);
		return this.groups.get(id);
	}
	leave(id: string, guest: string | undefined) : Group | undefined {
		if (guest === undefined) return undefined;
		this.groups.get(id)?.rmPlayers([ guest ]);
		return this.groups.get(id);
	}
	findOne(id: string) {
		return this.groups.get(id);
	}
	findAll() {
		return [...this.groups.values()].map(g => ({
		id: g.id,
		player_max: g.player_max,
		players: g.getPlayers()
	}));
	}
}