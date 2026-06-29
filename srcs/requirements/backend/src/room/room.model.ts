import { Group } from '../group/group.model';
import { Ball, Paddle, Score, Keys, GameState } from '../game/game_types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE_HEIGHT, BALL_SPEED } from '../game/game_config';
/*
// Group : gere joueurs (host + guest)
// La Room NE gere PAS les joueurs directement !!!!!!!
import { Group } from '../group/group.model';

export type RoomStatus = 'waiting' | 'playing' | 'finished';
export type RoomMode = 'local' | 'online' | 'solo_bot' | 'solo_training';
*/

export class Room {
	/*public ball: Ball = {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        vx: 3,
        vy: 2,
        speed: BALL_SPEED,
    };
	public leftPaddle: Paddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
    public rightPaddle: Paddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
    public score: Score = { leftPlayer: 0, rightPlayer: 0 };
    public keys: Keys = { w: false, s: false, up: false, down: false };
    public gameState: GameState = { gameOver: false };
    public resetPending: boolean = false;
    //public player1Id: number | null = null;
    //public player2Id: number | null = null;*/

	public ball: Ball = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, vx: 3, vy: 2, speed: BALL_SPEED };
    public leftPaddle: Paddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
    public rightPaddle: Paddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
    public score: Score = { leftPlayer: 0, rightPlayer: 0 };
    public keys: Keys = { w: false, s: false, up: false, down: false };
    public gameState: GameState = { gameOver: false, paused: false };
	public gameMode: string = "";
    public lastTime: number = Date.now();
    public gameInterval: any = null; // ← nouveau
	public resetPending: boolean = false;
	public endGame: boolean = false;

	private players: Group = new Group(2);
	private spectators: Group = new Group(null);
	public readonly id = this.players.id;

	constructor(
		//public groupService: GroupService,
		host: string
	) {
		this.players.addPlayers([ host ]);
	}

	getMaxPlayers() : number {
		return this.players.player_max;
	}
	getPlayers() {
		return this.players.getPlayers();
	}
	getSpectators() {
		return this.spectators.getPlayers();
	}
	addPlayers(players: string[]) {
		this.spectators.addPlayers(
			this.players.addPlayers(players)
		);
	}
	rmPlayers(players: string[]) {
		// slider system for now, later should keep non-leaving user with it's paddle (obv)
		this.players.rmPlayers(players);
		this.players.addPlayers(
			this.spectators.rmPlayers(players)
		);
		this.spectators.rmPlayers(
			this.players.getPlayers()
		);
	}
}
/*export class Room {
}*/
    /*// même valeur que group.id :
    // si qqun cherche le groupe par son ID, il trouve aussi la room.
    public readonly id: string;
    public status: RoomStatus = 'waiting';

    // Ref à setInterval qui fait toruner la boucle jeu
    // -> pouvoir arrêter avec clearInterval quand partie terminee
    public intervalId: ReturnType<typeof setInterval> | null = null;

    // Timestamp du dernier tick de la boucle de jeu (ms)
    // calculer deltaTime dans room.service.ts : cb de temps s'est ecoule depuis dernier update
    // deltaTime : fera en sorte que jeu tourne à la meme vitesse quelle que soit la frequence du serveur
    public lastTime: number = Date.now();

    // Envoyes au frontend à chaque tick avec le beau gosse de socket.io 
    public ball: Ball = {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        vx: 3,
        vy: 2,
        speed: BALL_SPEED,
    };

    public leftPaddle: Paddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
    public rightPaddle: Paddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
    public score: Score = { leftPlayer: 0, rightPlayer: 0 };
    public keys: Keys = { w: false, s: false, up: false, down: false };
    public gameState: GameState = { gameOver: false };
    public resetPending: boolean = false;
    public player1Id: number | null = null;
    public player2Id: number | null = null;

    // 'local' démarre immédiatement
    // 'group' attend le 2ème joueur.
    public mode: RoomMode = 'local';

    constructor(public group: Group) {
        this.id = group.id;
    }

    isFull(): boolean {
        return this.group.hasGuest();
    }

    // Full reset (new game)
    reset(): void {
        this.ball = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, vx: 3, vy: 2, speed: BALL_SPEED };
        this.leftPaddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
        this.rightPaddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
        this.score = { leftPlayer: 0, rightPlayer: 0 };
        this.keys = { w: false, s: false, up: false, down: false };
        this.gameState = { gameOver: false };
        this.resetPending = false;
        this.lastTime = Date.now();
    }

    // Between-point reset: resets ball/paddles but keeps score
    resetBall(): void {
        this.ball = {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            vx: (Math.random() > 0.5 ? 3 : -3),
            vy: (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1),
            speed: BALL_SPEED,
        };
        this.leftPaddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
        this.rightPaddle = { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
        this.gameState = { gameOver: false };
        this.resetPending = false;
    }
}*/