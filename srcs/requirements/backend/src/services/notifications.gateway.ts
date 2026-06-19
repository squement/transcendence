import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';

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
 	 handleNotification() {
		console.log('Received notification from front');
	 }
}