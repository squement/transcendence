import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
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

    constructor(public roomService: RoomService) {
        console.log('GameGateway created');
    }

	@SubscribeMessage("getRoom")
	getRoom() {
		this.server.emit('list', {
			type: 'rooms',
			payload: {
				array: this.roomService.findAll()
			}
		});
	}

	@SubscribeMessage("createRoom")
	createRoom(
		@ConnectedSocket() socket: any,
		@MessageBody() data: {
			userId: string
		}
	) {
		console.log(data.userId, ' attempts to create room');
		if (!data.userId) return ;
		const roomId = this.roomService.new(data.userId)?.id;
		socket.data.roomId = roomId;
		socket.join(roomId);
		this.server.to(socket.data.roomId).emit('message', {
			type: 'notification',
			payload: {
				title: 'test',
				text: `1/2: ${socket.data.roomId}`,
				roomId: roomId
			}
		});
	}

	@SubscribeMessage("joinRoom")
	joinRoom(
		@ConnectedSocket() socket: any,
		@MessageBody() data: {
			userId: string
			roomId: string,
		}
	) {
		const roomId = data.roomId;
		//if (!roomId) roomId = this.roomService.findAny();
		console.log(data.userId, ' attempts to join ', roomId);
		if (!roomId) return ;
		const room = this.roomService.join(roomId, data.userId);
		if (room === undefined) return ;
		const max = room.getMaxPlayers();
		socket.data.roomId = roomId;
		socket.join(roomId);
		this.server.to(socket.data.roomId).emit('message', {
			type: 'notification',
			payload: {
				title: 'test',
				text: `${room.getPlayers().length}/${(max < 0) ? '?' : max}: ${socket.data.roomId}`,
				roomId: roomId
			}
		});
	}
	@SubscribeMessage("leaveRoom")
	leaveRoom(
		@ConnectedSocket() socket: any,
		@MessageBody() data: {
			userId: string
		}
	) {
		console.log(data.userId, ' attempts to leave ', socket.data.roomId);
		if (!socket.data.roomId) return ;
		const roomId = socket.data.roomId;
		const room = this.roomService.findOne(roomId);
		if (room) {
			this.server.to(socket.data.roomId).emit('message', {
				type: 'notification',
				payload: {
					title: 'test',
					text: `${room.getPlayers.length - 1}/${room.getMaxPlayers}: ${socket.data.roomId}`,
					roomId: roomId
				}
			});
		}
		socket.leave(roomId);
		socket.data.roomId = null;
		console.log(data.userId, ' left socket room ', socket.data.roomId);
		if (!data.userId) return ;
		this.roomService.leave(roomId, data.userId);
		console.log(data.userId, ' left room ', socket.data.roomId);
	}

    @SubscribeMessage('inputs')
    handleInputs(
		@MessageBody() data: { 
			id: string,
			keys: Keys },
		@ConnectedSocket() socket: any) {
		if (!socket.data.roomId) return ;
		const room = this.roomService.findOne(socket.data.roomId);
		if (room === undefined) return ;
		/*if (room.gameMode === 'local') {
			console.log('local settings detected');
			// local means both ws and ud come from the same user and control the right player
			room.keys = data.keys;
			return ;
		}*/
		console.log('non local settings detected');
		const players = room.getPlayers();
		if (players[0] === data.id) {
			room.keys.w = data.keys.w || data.keys.up;
			room.keys.s = data.keys.s || data.keys.down;
		}
		if (players[1] === data.id) {
			room.keys.up = data.keys.w || data.keys.up;
			room.keys.down = data.keys.s || data.keys.down;
		}
    }

	@SubscribeMessage('pause')
	handlePause(
		@ConnectedSocket() socket: any) {
		if (!socket.data.roomId) return ;
		const room = this.roomService.findOne(socket.data.roomId);
		if (room === undefined) return ;
		room.gameState.paused = !room.gameState.paused;
	}

	@SubscribeMessage('endGame')
	handleEndGame(
		@ConnectedSocket() socket: any) {
		if (!socket.data.roomId) return ;
		const room = this.roomService.findOne(socket.data.roomId);
		if (room === undefined) return ;
		room.endGame = true;
	}

    @SubscribeMessage('startGame')
    handleStartGame(
		@ConnectedSocket() socket: any,
		@MessageBody() data: { mode: string }) {
		if (!socket.data.roomId) return ;
		/*this.server.to(socket.data.roomId).emit('message', {
			type: 'notification',
			payload: {
				title: 'test',
				text: `You definitely belong to this room: ${socket.data.roomId}`
			}
		});*/
		const room = this.roomService.findOne(socket.data.roomId);
		if (room === undefined) return ;
        if (room.gameInterval) return; // déjà lancé

		room.gameMode = data.mode;
		room.ball = { 
			x: CANVAS_WIDTH / 2, 
			y: CANVAS_HEIGHT / 2, 
			vx: Math.random() > 0.5 ? 3 : -3,
			vy: (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1),
			speed: BALL_SPEED 
		};
		room.leftPaddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
		room.rightPaddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
		room.score = { leftPlayer: 0, rightPlayer: 0 };
		room.keys = { w: false, s: false, up: false, down: false };
		room.gameState = { gameOver: false, paused: false };
		room.resetPending = false;
		room.endGame = false;
		room.lastTime = Date.now();

        room.gameInterval = setInterval(() => {
			//if (!socket.data.roomId) return ;
			const now = Date.now();
			const deltaTime = (now - room.lastTime) / 1000;
			room.lastTime = now;

			if (!room.gameState.gameOver && !room.gameState.paused) {
				update(room.ball, room.leftPaddle, room.rightPaddle, room.gameState, room.score, room.keys, deltaTime, room.gameMode);
			}
			else if (room.gameState.gameOver && !room.gameState.paused) {
				if (!room.resetPending) {
					room.resetPending = true;
					setTimeout(() => {
						room.ball = { 
							x: CANVAS_WIDTH / 2, 
							y: CANVAS_HEIGHT / 2, 
							vx: Math.random() > 0.5 ? 3 : -3,
							vy: (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1),
							speed: BALL_SPEED 
						};
						room.leftPaddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
						room.rightPaddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
						room.gameState.gameOver = false;
						room.resetPending = false;
					}, 2000);
				}
			}
					
			// vérification après update, pas dans un else
			if ((room.score.leftPlayer >= SCORE_TO_WIN || room.score.rightPlayer >= SCORE_TO_WIN) || (room.endGame && room.gameMode != "online")) {
				this.server.to(socket.data.roomId).emit('gameOver', { score: room.score });
				clearInterval(room.gameInterval);
				room.gameInterval = null;
				return;
			}

			this.server.to(socket.data.roomId).emit('gameState', {
				ball: room.ball,
				leftPaddle: room.leftPaddle,
				rightPaddle: room.rightPaddle,
				score: room.score,
				gameState: room.gameState
			});
		}, 1000 / FRAMERATE);
    }
}