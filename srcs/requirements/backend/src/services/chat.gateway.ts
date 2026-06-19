import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';

// chat.gateway.ts
@WebSocketGateway({ cors: { 
	origin: 'http://localhost:5173'
},
	path: '/socket.io',
})
export class ChatGateway {
  @SubscribeMessage('chat')
  handleChat() {}
}