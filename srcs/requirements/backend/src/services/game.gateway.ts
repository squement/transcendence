import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RoomService } from '../room/room.service'
import { update } from '../game/game_update';
import { Ball, Paddle, Score, Keys, GameState } from '../game/game_types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE_HEIGHT, BALL_SPEED, FRAMERATE } from '../game/game_config';

@WebSocketGateway({ 
    cors: { origin: 'http://localhost:5173' },
    path: '/socket.io',
})
export class GameGateway {
    @WebSocketServer()
    server!: Server;

    // état du jeu — stocké dans le Gateway
    private ball: Ball = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, vx: 3, vy: 2, speed: BALL_SPEED };
    private leftPaddle: Paddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
    private rightPaddle: Paddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
    private score: Score = { leftPlayer: 0, rightPlayer: 0 };
    private keys: Keys = { w: false, s: false, up: false, down: false };
    private gameState: GameState = { gameOver: false };
	private lastTime: number = Date.now();
	//public roomId: string | undefined = undefined;

    constructor(public roomService: RoomService) {
        console.log('GameGateway created');
    }

    // recevoir les inputs du frontend
    @SubscribeMessage('inputs')
    handleInputs(@MessageBody() data: { keys: Keys }) {
        this.keys = data.keys;
    }

	@SubscribeMessage("joinRoom")
	joinRoom(
		@ConnectedSocket() socket: any,
		//@MessageBody() roomId: string,
	) {
		const roomId = this.roomService.findAny();
		console.log('attempts to join ', roomId);
		socket.data.roomId = roomId;
		socket.join(roomId);
		//YAYY
	}
	@SubscribeMessage("leaveRoom")
	leaveRoom(
		@ConnectedSocket() socket: any,
		//@MessageBody() roomId: string,
	) {
		//const roomId = this.roomService.findAny();
		if (socket.data.roomId)
			socket.leave(socket.data.roomId);
	}

    // boucle de jeu
    afterInit() {
        setInterval(() => {
			//const roomId = this.roomService.findAny();
			//console.log('game update: ');
			for (const room of this.roomService.findAll()) {
			//if (socket.data.roomId) {
				//console.log('success - ', room.id);
				const now = Date.now();
				const deltaTime = (now - this.lastTime) / 1000; // en secondes
				this.lastTime = now;

				this.server.to(room.id).emit('message', {
					type: 'notification',
					payload: {
						title: 'test',
						text: `You definitely belong to this room: ${room.id}`
					}
				});

				if (!this.gameState.gameOver) {
					update(this.ball, this.leftPaddle, this.rightPaddle, this.gameState, this.score, this.keys, deltaTime);
				}
				this.server.to(room.id).emit('gameState', {
					ball: this.ball,
					leftPaddle: this.leftPaddle,
					rightPaddle: this.rightPaddle,
					score: this.score,
					gameState: this.gameState
				});
			}
		}, 1000 / FRAMERATE);
    }
}