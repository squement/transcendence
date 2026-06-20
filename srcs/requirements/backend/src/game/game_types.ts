export interface Ball {
	x: number;
	y: number;
	vx: number;
	vy: number;
	speed: number;
}

export interface Paddle {
	y: number;
}

export interface Score {
	leftPlayer: number;
	rightPlayer: number;
}

export interface Keys {
	w: boolean;
	s: boolean;
	up: boolean;
	down: boolean;
}

export interface GameState {
	gameOver: boolean;
}
