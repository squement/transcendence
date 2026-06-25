import { User } from '../user/user.model'
import { UserService } from '../user/user.service'

export class Group {
	public player_max: number = -1;
	public readonly id: any | null = null;
	private player_list = new Set<string>();
	constructor(
		max: number | null
	) {
		if (max !== null)
			this.player_max = max;
		this.id = crypto.randomUUID();
	}

	getPlayers(): string[] {
		return [...this.player_list];
	}
	toJSON() {
		return {
			id: this.id,
			player_amount: this.player_list.size,
			player_max: this.player_max,
			players: this.getPlayers()
		};
	}
	setMax(max: number) {
		this.player_max = max;
	}
	addPlayers(id_list: string[]) {
		const leftovers: string[] = [];
		for (const id of id_list) {
			if (this.player_max >= 0 && this.player_list.size >= this.player_max) {
				leftovers.push(id);
				continue;
			}
			this.player_list.add(id);
		}
		return leftovers;
	}
	rmPlayers(id_list: string[]) {
		id_list.forEach(id => this.player_list.delete(id));
		return this.getPlayers();
	}
	hasGuest(): boolean {
        return this.player_list.size > 1;
    }
}