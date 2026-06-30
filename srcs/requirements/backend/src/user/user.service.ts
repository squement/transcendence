import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { dbUserService } from 'src/dbUser/dbUser.service';
import { User } from './user.model'
import { eventBus } from "../app.events";

// users.service.ts — @Injectable() service that holds/manages users
@Injectable()
export class UserService {
  private users = new Map<number, User>; // "map"
	constructor(@Inject(forwardRef(() => dbUserService)) private readonly dbUserService: dbUserService) {}

  async add(username: string): Promise<User | null> {
    const dbUser = await this.dbUserService.findByUsername(username);
    if (!dbUser) return null;
    const friends = await this.dbUserService.getFriendsSet(dbUser.id);
    const user = new User(dbUser.id, username, friends);
    this.users.set(user.id, user);
    return user;
  }

  async addById(id: number): Promise<User | null> {
    if (this.users.has(id))
      return this.users.get(id)!;
    const dbUser = await this.dbUserService.findById(id);
    if (!dbUser) return null;
    const friends = await this.dbUserService.getFriendsSet(id);
    const user = new User(id, dbUser.username, friends);
    this.users.set(id, user);
    return user;
  }

  remove(id: any): boolean {
    const del = this.users.delete(Number(id));
    del ? eventBus.emit("user deleted", id) : eventBus.emit("user not fount", id);
    return del; // false if id didn't exist
  }

  updateMany(updated: User[]): User[] {
	  return updated.map(user => this.updateOne(user));
  }

  updateOne(updated: User): User {
    if (!this.users.has(updated.id))
      throw new NotFoundException(`User ${updated.id} not found`);
    this.users.set(updated.id, updated);
	  return updated;
  }

  findAll(): Map<number, User> {
    return this.users;
  }

  findOne(id: any): User | undefined {
    return this.users.get(Number(id));
  }
}
