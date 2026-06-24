import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '../room/room.service';
import { User } from '../user/user.model';
import { Keys } from '../game/game_types';
import { RoomMode } from '../room/room.model';

@WebSocketGateway({
    cors: { origin: 'http://localhost:5173' },
    path: '/socket.io',
})
export class GameGateway implements OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    private socketRooms = new Map<string, string>();

    constructor(private roomService: RoomService) {}

    // Used by solo/local modes: maps directly to createRoom with immediate start
    @SubscribeMessage('startGame')
    handleStartGame(
        @MessageBody() data: { mode: string, user?: User },
        @ConnectedSocket() client: Socket
    ) {
        this.handleCreateRoom({ user: data.user ?? null, mode: data.mode as RoomMode }, client);
    }

    @SubscribeMessage('createRoom')
    handleCreateRoom(
        @MessageBody() data: { user: User | null, mode: RoomMode },
        @ConnectedSocket() client: Socket
    ) {
        const room = this.roomService.create(data.user);
        if (!room) return;

        room.mode = data.mode ?? 'local';
        client.join(room.id);
        this.socketRooms.set(client.id, room.id);
        client.emit('roomCreated', { roomId: room.id });

        if (room.mode !== 'online') {
            room.status = 'playing';
            this.roomService.startGame(this.server, room.id);
            client.emit('gameStart', { roomId: room.id });
        }
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @MessageBody() data: { roomId: string, user: User },
        @ConnectedSocket() client: Socket
    ) {
        const room = this.roomService.join(data.roomId, data.user);
        if (!room) return;

        client.join(room.id);
        this.socketRooms.set(client.id, room.id);
        this.server.to(room.id).emit('gameStart', { roomId: room.id });
        this.roomService.startGame(this.server, room.id);
    }

    @SubscribeMessage('inputs')
    handleInputs(@MessageBody() data: { roomId: string, keys: Keys }) {
        this.roomService.handleInputs(data.roomId, data.keys);
    }

    handleDisconnect(client: Socket) {
        const roomId = this.socketRooms.get(client.id);
        if (roomId) {
            this.roomService.endGame(roomId);
            this.socketRooms.delete(client.id);
        }
    }
}
