import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserService } from '../user/user.service';

@WebSocketGateway({ cors: { 
	origin: 'http://localhost:5173'
},
	path: '/socket.io',
})
export class EventsGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  constructor(private userService: UserService) {}
  private users: string[] = [];

  	handleConnection(client: any) {
		console.log('CLIENT CONNECTED', client.id);
		this.users.push(client.id);
		this.server.emit('message', {
			type: 'notification',
			payload: {
				title: `New User connected: ${client.id}`,
				text: `${client.id}`
		}});
	}
	handleDisconnect(client: any) {
		console.log('CLIENT DISCONNECTED', client.id);
		this.users = this.users.filter(u => u !== client.id);
		this.server.emit('message', {
			type: 'notification',
			payload: {
				title: `User disconnected: ${client.id}`,
				text: `${client.id}`
		}});
	}
	afterInit() {
		// Broadcast a message every 2 seconds
		setInterval(() => {
			this.server.emit('message', {
				type: 'health_check',
				payload: {
					title: 'Hello',
					text: `Hello from server! ${new Date().toISOString()}`
			}});
			this.server.emit('list', {
				type: 'online',
				payload: {
					array: this.userService.findAll()
					//array: this.users
				}
			});
		}, 2000);
	}
}