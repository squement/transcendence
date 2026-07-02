import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: { 
	origin: 'http://localhost:5173'
},
	path: '/socket.io',
})

export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server!: Server;
	constructor(private userService: UserService, private jwtService: JwtService) {}
	private socketUsers = new Map<string, number>();

	private getUserId(client: Socket): number | null {
	const cookieHeader = client.handshake.headers.cookie ?? '';
		const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
		if (!match) return null;
		try {
			const payload = this.jwtService.verify<{ id: string }>(match[1]);
			const id = Number(payload.id);
			return isNaN(id) ? null : id;
		}
		catch {
			return null;
		}
	}

  	handleConnection(client: Socket) {
		console.log('CLIENT CONNECTED', client.id);
		const userId = this.getUserId(client);
		if (userId !== null) {
			this.socketUsers.set(client.id, userId);
			this.userService.addById(userId);

			this.server.emit('message', {
				type: 'notification',
				payload: {
					title: `New User connected: ${client.id}`,
					text: `${client.id}`
				}
			});
		}
	}

	handleDisconnect(client: any) {
		console.log('CLIENT DISCONNECTED', client.id);
		const userId = this.getUserId(client);
		this.socketUsers.delete(client.id);
		if (userId !== undefined) {
			const stillOnline = [...this.socketUsers.values()].some(id => id === userId);
			if (!stillOnline)
				this.userService.remove(userId);
		}
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
					array: [...this.userService.findAll().values()]
					//array: this.users
				}
			});
		}, 2000);
	}
}