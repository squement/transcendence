import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';

// notifications.gateway.ts
@WebSocketGateway({ cors: { 
	origin: 'http://localhost:5173'
},
	path: '/socket.io',
})
export class NotificationsGateway {
	constructor() {
  console.log('NotificationsGateway created');
}
  	@SubscribeMessage('message')
 	handleMessage(
	@MessageBody() data: any,
	@ConnectedSocket() client: any,
	) {
	console.log('Received in \'notifications gateway\' from', client.id, ':', data.payload.text);
	}
}