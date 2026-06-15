import { Injectable } from '@nestjs/common';
import { User } from './user.model'

// users.service.ts — @Injectable() service that holds/manages users
@Injectable()
export class UserService {
  private users: User[] = [];// "vector"

  add(username: string): User {
    const user = new User(this.users.length, username);
    this.users.push(user);
    return user;
  }
  remove(id: number): boolean {
	const before = this.users.length;
	this.users = this.users.filter(u => u.id !== id);
	return this.users.length < before;  // false if id didn't exist
	}

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }
}