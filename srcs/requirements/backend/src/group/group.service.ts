import { Injectable } from "@nestjs/common";
import { Group } from './group.model';
import { User } from '../user/user.model'

@Injectable()
export class GroupService {
	public testGroupe: Group | null = null

	add(user: User) : Group | null {
		const groupe = new Group(user);
		this.testGroupe = groupe;
		return this.testGroupe;
	}
	join(user: User) : Group | null {
		if (!this.testGroupe) return null;
		this.testGroupe.setGuest(user);
		return this.testGroupe;
	}
	findAll() : Group | null {
		return this.testGroupe;
	}
}