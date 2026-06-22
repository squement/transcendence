import { User } from '../user/user.model'

export class Group {
	private guest: User | null = null;
	public id: any | null = null;
	constructor(
		private host: User
	) {
		this.id = crypto.randomUUID();
	}

	setHost(user: User) : Group {
		this.host = user;
		return this;
	}
	setGuest(user: User) : Group {
		this.guest = user;
		return this;
	}
}