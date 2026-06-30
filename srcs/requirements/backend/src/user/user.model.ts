// user.model.ts — plain class, no @Injectable()
export class User {
  	constructor(
		//public id: number,
		public readonly id: any,
		public username: string,
		public friends: Set<number>,
		public roomId?: number
	) {}

	toJSON() {
		return {
			id: this.id,
			username: this.username,
			friends: [...this.friends],
		};
	}
}
