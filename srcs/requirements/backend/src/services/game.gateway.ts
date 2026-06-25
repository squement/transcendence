import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RoomService } from '../room/room.service'
import { update } from '../game/game_update';
import { Ball, Paddle, Score, Keys, GameState } from '../game/game_types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE_HEIGHT, BALL_SPEED, FRAMERATE, SCORE_TO_WIN } from '../game/game_config';

@WebSocketGateway({ 
    cors: { origin: 'http://localhost:5173' },
    path: '/socket.io',
})
export class GameGateway {
    @WebSocketServer()
    server!: Server;

    private ball: Ball = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, vx: 3, vy: 2, speed: BALL_SPEED };
    private leftPaddle: Paddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
    private rightPaddle: Paddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
    private score: Score = { leftPlayer: 0, rightPlayer: 0 };
    private keys: Keys = { w: false, s: false, up: false, down: false };
    private gameState: GameState = { gameOver: false, paused: false };
	private gameMode: string = "";
    private lastTime: number = Date.now();
    private gameInterval: any = null; // ← nouveau
	private resetPending: boolean = false;
	private endGame: boolean = false;

    constructor(public roomService: RoomService) {
        console.log('GameGateway created');
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

    @SubscribeMessage('inputs')
    handleInputs(@MessageBody() data: { keys: Keys }) {
        this.keys = data.keys;
    }

	@SubscribeMessage('pause')
	handlePause() {
		this.gameState.paused = !this.gameState.paused;
	}

	@SubscribeMessage('endGame')
	handleEndGame() {
		this.endGame = true;
	}

    @SubscribeMessage('startGame') // ← nouveau
    handleStartGame(
		@ConnectedSocket() socket: any,
		@MessageBody() data: { mode: string }) {
        if (this.gameInterval) return; // déjà lancé

		this.gameMode = data.mode;
		this.ball = { 
			x: CANVAS_WIDTH / 2, 
			y: CANVAS_HEIGHT / 2, 
			vx: Math.random() > 0.5 ? 3 : -3,
			vy: (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1),
			speed: BALL_SPEED 
		};
		this.leftPaddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
		this.rightPaddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
		this.score = { leftPlayer: 0, rightPlayer: 0 };
		this.keys = { w: false, s: false, up: false, down: false };
		this.gameState = { gameOver: false, paused: false };
		this.resetPending = false;
		this.endGame = false;
		this.lastTime = Date.now();

        this.gameInterval = setInterval(() => {
			//if (!socket.data.roomId) return ;
			const now = Date.now();
			const deltaTime = (now - this.lastTime) / 1000;
			this.lastTime = now;

			if (!this.gameState.gameOver && !this.gameState.paused) {
				update(this.ball, this.leftPaddle, this.rightPaddle, this.gameState, this.score, this.keys, deltaTime, this.gameMode);
			}
			else if (this.gameState.gameOver && !this.gameState.paused) {
				if (!this.resetPending) {
					this.resetPending = true;
					setTimeout(() => {
						this.ball = { 
							x: CANVAS_WIDTH / 2, 
							y: CANVAS_HEIGHT / 2, 
							vx: Math.random() > 0.5 ? 3 : -3,
							vy: (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1),
							speed: BALL_SPEED 
						};
						this.leftPaddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
						this.rightPaddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
						this.gameState.gameOver = false;
						this.resetPending = false;
					}, 2000);
				}
			}
					
			// vérification après update, pas dans un else
			if ((this.score.leftPlayer >= SCORE_TO_WIN || this.score.rightPlayer >= SCORE_TO_WIN) || (this.endGame && this.gameMode != "online")) {
				this.server.to(socket.data.roomId).emit('gameOver', { score: this.score });
				clearInterval(this.gameInterval);
				this.gameInterval = null;
				return;
			}

			this.server.to(socket.data.roomId).emit('gameState', {
				ball: this.ball,
				leftPaddle: this.leftPaddle,
				rightPaddle: this.rightPaddle,
				score: this.score,
				gameState: this.gameState
			});
		}, 1000 / FRAMERATE);
	/*

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
				});*/
    }
}