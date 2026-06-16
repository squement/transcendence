import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { 
	origin: 'http://localhost:5173'
},
	path: '/socket.io',
})
export class EventsGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: any) {
    console.log('CLIENT CONNECTED', client.id);
  }
  afterInit() {
    // Broadcast a message every 2 seconds
    setInterval(() => {
      this.server.emit('message', `Hello from server! ${new Date().toISOString()}`);
    }, 2000);
  }
}