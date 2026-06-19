import { PADDLE_SPEED, PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_SPACING, MAX_BALL_SPEED, CANVAS_HEIGHT, CANVAS_WIDTH, BALL_ACCELERATION, SCORE_TO_WIN, BALL_SHIFTING, BALL_SPEED } from './game_config'

interface Ball {
	x: number;
	y: number;
	vx: number;
	vy: number;
	speed: number;
}

interface Paddle {
	y: number;
}

interface Score {
	leftPlayer: number;
	rightPlayer: number;
}

interface Keys {
	w: boolean;
	s: boolean;
	up: boolean;
	down: boolean;
}

interface GameState {
	gameOver: boolean;
}

export function update(ball: Ball, leftPaddle: Paddle, rightPaddle: Paddle, gameState: GameState, score: Score, keys: Keys) {

	if (ball.x <= 0 || ball.x >= CANVAS_WIDTH) {
		gameState.gameOver = true;
		if (ball.x <= 0) {score.rightPlayer += 1;}
		if (ball.x >= CANVAS_WIDTH) {score.leftPlayer += 1;}
		if (score.leftPlayer == SCORE_TO_WIN || score.rightPlayer == SCORE_TO_WIN)
			return ;

		setTimeout(() => {
			ball.speed = BALL_SPEED;
			ball.x = CANVAS_WIDTH / 2;
			ball.y = CANVAS_HEIGHT / 2;
			ball.vx = (Math.random() > 0.5 ? 3 : -3) * ball.speed;
			ball.vy = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1) * ball.speed;
			leftPaddle.y = (CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
			rightPaddle.y = (CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
			gameState.gameOver = false;
		}, 2000);
	}

	if ((keys.w) && (leftPaddle.y - PADDLE_SPEED) > 0 - PADDLE_SPEED) {leftPaddle.y -= PADDLE_SPEED; if ((ball.x <= (PADDLE_WIDTH + PADDLE_SPACING) && ball.x > 0) && (ball.y > leftPaddle.y && ball.y < (leftPaddle.y + PADDLE_HEIGHT))) ball.vy -= BALL_SHIFTING;}
	if ((keys.s) && (leftPaddle.y + PADDLE_SPEED) < (CANVAS_HEIGHT - PADDLE_HEIGHT) + PADDLE_SPEED) {leftPaddle.y += PADDLE_SPEED; if ((ball.x <= (PADDLE_WIDTH + PADDLE_SPACING) && ball.x > 0) && (ball.y > leftPaddle.y && ball.y < (leftPaddle.y + PADDLE_HEIGHT))) ball.vy += BALL_SHIFTING;}
	if (keys.up && (rightPaddle.y - PADDLE_SPEED) > 0 - PADDLE_SPEED) {rightPaddle.y -= PADDLE_SPEED; if ((ball.x >= (CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING)) && ball.x < CANVAS_WIDTH) && (ball.y > rightPaddle.y && ball.y < (rightPaddle.y + PADDLE_HEIGHT))) ball.vy -= BALL_SHIFTING;}
	if (keys.down && (rightPaddle.y + PADDLE_SPEED) < (CANVAS_HEIGHT - PADDLE_HEIGHT) + PADDLE_SPEED) {rightPaddle.y += PADDLE_SPEED; if ((ball.x >= (CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING)) && ball.x < CANVAS_WIDTH) && (ball.y > rightPaddle.y && ball.y < (rightPaddle.y + PADDLE_HEIGHT))) ball.vy += BALL_SHIFTING;}
	
	//Annoying ass collisions test left
	if (ball.vy > 0 && (ball.x <= (PADDLE_WIDTH + PADDLE_SPACING) && ball.x > PADDLE_SPACING) && ((ball.y > leftPaddle.y) && (ball.y < (leftPaddle.y + Math.abs(ball.vy))))) {ball.y = leftPaddle.y; ball.vy = -ball.vy;}
	if (ball.vy < 0 && (ball.x <= (PADDLE_WIDTH + PADDLE_SPACING) && ball.x > PADDLE_SPACING) && ((ball.y < (leftPaddle.y + PADDLE_HEIGHT)) && (ball.y > (leftPaddle.y + PADDLE_HEIGHT - 10)))) {ball.y = (leftPaddle.y + PADDLE_HEIGHT); ball.vy = -ball.vy;}
	// Annoying ass collisions test right
	if (ball.vy > 0 && (ball.x >= (CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING)) && ball.x < (CANVAS_WIDTH - PADDLE_SPACING)) && ((ball.y > rightPaddle.y) && (ball.y < (rightPaddle.y + Math.abs(ball.vy))))) {ball.y = rightPaddle.y; ball.vy = -ball.vy;}
	if (ball.vy < 0 && (ball.x >= (CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING)) && ball.x < (CANVAS_WIDTH - PADDLE_SPACING)) && ((ball.y < (rightPaddle.y + PADDLE_HEIGHT)) && (ball.y > (rightPaddle.y + PADDLE_HEIGHT - 10)))) {ball.y = (rightPaddle.y + PADDLE_HEIGHT); ball.vy = -ball.vy;}

	if ((ball.x <= (PADDLE_WIDTH + PADDLE_SPACING) && ball.x >= (PADDLE_WIDTH + PADDLE_SPACING) - (Math.abs(ball.vx) * ball.speed)) && (ball.y > leftPaddle.y && ball.y < (leftPaddle.y + PADDLE_HEIGHT))) {ball.x = (PADDLE_WIDTH + PADDLE_SPACING); ball.vx = -ball.vx; if (ball.speed < MAX_BALL_SPEED) {ball.speed += BALL_ACCELERATION;} ball.vy += (Math.random() > 0.5 ? Math.random() / 3 : -(Math.random() / 3));}
	if ((ball.x >= (CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING)) && ball.x <= (CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING)) +  (Math.abs(ball.vx) * ball.speed)) && (ball.y > rightPaddle.y && ball.y < (rightPaddle.y + PADDLE_HEIGHT))) {ball.x = (CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING)); ball.vx = -ball.vx; if (ball.speed < MAX_BALL_SPEED) {ball.speed += BALL_ACCELERATION;} ball.vy += (Math.random() > 0.5 ? Math.random() / 3 : -(Math.random() / 3));}
	if (ball.y <= 0) {ball.y = 0; ball.vy = -ball.vy;}
	if (ball.y >= CANVAS_HEIGHT) {ball.y = CANVAS_HEIGHT; ball.vy = -ball.vy;}


	ball.y += ball.vy * ball.speed;
	ball.x += ball.vx * ball.speed;
	return;
}