// Pour GameGateway
import { Injectable } from '@nestjs/common';
/*import { Server } from 'socket.io';*/
// creation / gestion  joueurs
// RoomService gere joueurs avec GroupService
//import { GroupService } from '../group/group.service';
//import { User } from '../user/user.model';
import { eventBus } from "../app.events";
import { Room } from './room.model';/*
// GameService : garde res partie en DB a la fin
import { GameService } from '../game/game.service';
import { Keys } from '../game/game_types';
import { update } from '../game/game_update';
import { FRAMERATE, SCORE_TO_WIN } from '../game/game_config';*/

// Dit a NestJS que ce service peut être injecte dans d'autres classes.
@Injectable()
export class RoomService {
	private rooms = new Map<string, Room>();
	/*constructor(public groupService: GroupService) {
	}*/
	constructor() {
		eventBus.on("userDeleted", (userId: string) => {
			for (const [roomId] of this.rooms) {
				this.leave(roomId, userId);
			}
		});
	}

	new(userId: string) {
		const room = new Room(userId);
		this.rooms.set(room.id, room);
		return this.rooms.get(room.id);
	}
	rm(roomId: string) {
		this.rooms.delete(roomId);
	}
	join(id: string, guest: string | undefined) : Room | undefined {
		if (guest === undefined) return undefined;
		this.rooms.get(id)?.addPlayers([ guest ]);
		return this.rooms.get(id);
	}
	leave(id: string, guest: string | undefined) : Room | undefined {
		if (guest === undefined) return undefined;
		this.rooms.get(id)?.rmPlayers([ guest ]);
		return this.rooms.get(id);
	}
	findOne(roomId: string) {
		return this.rooms.get(roomId);
	}
	findAny() {
		//room testing only
		const room = this.rooms.values().next().value;
		return room?.id
	}
	findAll() {
		return [...this.rooms.values()].map(r => ({
		id: r.id,
		players: r.getPlayers()
	}));
	}
}
/*
    // Cle = roomId (string UUID), Valeur = instance de Room.
    private rooms = new Map<string, Room>();
    constructor(private groupService: GroupService, private gameService: GameService) {}

    create(user: User): Room | null {
        const group = this.groupService.add(user);
        if (!group) return null;

        const room = new Room(group); // recupere ID du Group + initialise etat du jeu
        room.player1Id = user?.id ? parseInt(user.id) : null;
        this.rooms.set(room.id, room);

        return room;
    }

    // user : le joueur qui rejoint room donc le guest
    join(roomId: string, user: User): Room | null {
        const room = this.rooms.get(roomId);
        if (!room) return null;
        if (room.isFull()) return null;
        this.groupService.join(user); // GroupService ajouter guest dans le Group
        room.player2Id = user?.id ? parseInt(user.id) : null;
        room.status = 'playing';

        return room;
    }

    find(roomId: string): Room | undefined {
        return this.rooms.get(roomId);
    }

    findWaiting(): Room[] {
        return Array.from(this.rooms.values()).filter(r => r.status === 'waiting');
    }

    handleInputs(roomId: string, keys: Keys): void {
        const room = this.rooms.get(roomId);
        if (!room || room.status !== 'playing') return;
        room.keys = keys;
    }

    startGame(server: Server, roomId: string): void {
        const room = this.rooms.get(roomId);

        if (!room || room.status !== 'playing') return;

        // setInterval lance une fonction répétée toutes les (1000 / FRAMERATE) ms.
        // Avec FRAMERATE = 60, ça fait un tick toutes les ~16.7ms.
        room.intervalId = setInterval(() => {

            // On calcule le temps écoulé depuis le dernier tick (secondes)
            // Date.now() retourne timestamp actuel (ms).
            const now = Date.now();
            const deltaTime = (now - room.lastTime) / 1000;
            room.lastTime = now;

            // (gameOver est true pendant la pause de 2s entre les points).
            if (!room.gameState.gameOver) {
                update(
                    room.ball,
                    room.leftPaddle,
                    room.rightPaddle,
                    room.gameState,
                    room.score,
                    room.keys,
                    deltaTime,
                    room.mode
                );
            } else {
                // 2s pause between points before ball resets
                if (!room.resetPending) {
                    room.resetPending = true;
                    setTimeout(() => { room.resetBall(); }, 2000);
                }
            }

            // Checked every frame (after update), not inside else
            if (room.score.leftPlayer >= SCORE_TO_WIN || room.score.rightPlayer >= SCORE_TO_WIN) {
                server.to(roomId).emit('gameOver', { score: room.score });
                this.endGame(roomId);
                return;
            }

            server.to(roomId).emit('gameState', {
                ball: room.ball,
                leftPaddle: room.leftPaddle,
                rightPaddle: room.rightPaddle,
                score: room.score,
                gameState: room.gameState,
            });

        }, 1000 / FRAMERATE);
    }

    // --- Terminer une partie ---
    // Si score = win ou si deco
    endGame(roomId: string): void {
        const room = this.rooms.get(roomId);
        if (!room) return;

        // Stop boulce : clearInterval annule le setInterval
        if (room.intervalId !== null) {
            clearInterval(room.intervalId);
            room.intervalId = null;
        }

        room.status = 'finished';

        // Sauvegarde partie en DB
        this.gameService.save(
            room.score.leftPlayer,
            room.score.rightPlayer,
            room.player1Id,
            room.player2Id,
        ).catch(err => console.error('GameService.save failed:', err));
    }

    // --- Delete une room ---
    remove(roomId: string): void {
        this.endGame(roomId);
        this.rooms.delete(roomId);
    }
}*/