// user.model.ts — plain class, no @Injectable()
export class User {
  constructor(
	//public id: number,
	public id: any,
	public username: string,
	public update: number
) {}
}