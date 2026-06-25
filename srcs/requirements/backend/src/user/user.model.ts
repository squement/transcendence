// user.model.ts — plain class, no @Injectable()
export class User {
  constructor(
	//public id: number,
	public readonly id: any,
	public username: string,
	public update: number
) {}
}