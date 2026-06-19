import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';

// game.gateway.ts
@WebSocketGateway({ cors: { 
	origin: 'http://localhost:5173'
},
	path: '/socket.io',
})
export class GameGateway {
	@WebSocketServer()
	server!: Server;
	constructor() {
  console.log('GameGateway created');
}
	@SubscribeMessage('inputs')
	handleMessage(
	@MessageBody() data: any,
	@ConnectedSocket() client: any,
	) {
	console.log('Received in \'Gamegateway\' from', client.id, ':', data.payload.text);
	}
	afterInit() {
		setInterval(() => {
			console.log('emit inputs request from backend');
			this.server.emit('inputs', {
				payload: {
					text: `Awaiting inputs`
			}});
		}, 2000);
	}
}