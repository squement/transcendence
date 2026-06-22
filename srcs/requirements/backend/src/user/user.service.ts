import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.model'

// users.service.ts — @Injectable() service that holds/manages users
@Injectable()
export class UserService {
  private users: User[] = [];// "vector"

  add(username: string): User {
    const user = new User(crypto.randomUUID(), username, 0);
    this.users.push(user);
    return user;
  }
  remove(id: any): boolean {
	const before = this.users.length;
	this.users = this.users.filter(u => u.id !== id);
	return this.users.length < before;// false if id didn't exist
  }
  updateMany(updated: User[]): User[] {
	return updated.map(user => this.updateOne(user));
  }
  updateOne(updated: User): User {
	const index = this.users.findIndex(u => u.id === updated.id);
	if (index === -1) throw new NotFoundException(`User ${updated.id} not found`);
	if (this.users[index].username != updated.username) throw new NotFoundException(`User ${updated.id} doesn't match`);
	this.users[index] = updated;
	return this.users[index];
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: any): User | undefined {
    return this.users.find(u => u.id === id);
  }
}