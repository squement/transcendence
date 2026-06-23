import { PADDLE_SPEED, PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_SPACING, MAX_BALL_SPEED, CANVAS_HEIGHT, CANVAS_WIDTH, BALL_ACCELERATION, SCORE_TO_WIN, BALL_SHIFTING, BALL_SPEED, GAME_MOD } from './game_config.js'

export function update(ball, leftPaddle, rightPaddle, gameOver, score, setShowGif, keys) {

	if (ball.current.x <= 0 || ball.current.x >= CANVAS_WIDTH) {
		gameOver.current = true;
		setShowGif(true);
		if (ball.current.x <= 0) {score.current.rightPlayer += 1;}
		if (ball.current.x >= CANVAS_WIDTH) {score.current.leftPlayer += 1;}
		if (score.current.leftPlayer == SCORE_TO_WIN || score.current.rightPlayer == SCORE_TO_WIN)
			return ;

		setTimeout(() => {
			setShowGif(false);
			ball.current.speed = BALL_SPEED;
			ball.current.x = CANVAS_WIDTH / 2;
			ball.current.y = CANVAS_HEIGHT / 2;
			ball.current.vx = (Math.random() > 0.5 ? 3 : -3) * ball.current.speed;
			ball.current.vy = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1) * ball.current.speed;
			leftPaddle.current.y = (CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
			rightPaddle.current.y = (CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
			gameOver.current = false;
		}, 2000);
	}

	if ((keys.current["w"] || keys.current["W"]) && (leftPaddle.current.y - PADDLE_SPEED) > 0 - PADDLE_SPEED) {leftPaddle.current.y -= PADDLE_SPEED; if ((ball.current.x <= (PADDLE_WIDTH + PADDLE_SPACING) && ball.current.x > 0) && (ball.current.y > leftPaddle.current.y && ball.current.y < (leftPaddle.current.y + PADDLE_HEIGHT))) ball.current.vy -= BALL_SHIFTING;}
	if ((keys.current["s"] || keys.current["S"]) && (leftPaddle.current.y + PADDLE_SPEED) < (CANVAS_HEIGHT - PADDLE_HEIGHT) + PADDLE_SPEED) {leftPaddle.current.y += PADDLE_SPEED; if ((ball.current.x <= (PADDLE_WIDTH + PADDLE_SPACING) && ball.current.x > 0) && (ball.current.y > leftPaddle.current.y && ball.current.y < (leftPaddle.current.y + PADDLE_HEIGHT))) ball.current.vy += BALL_SHIFTING;}
	if (GAME_MOD == "solo" && ball.current.x >= (CANVAS_WIDTH / 2) && ball.current.vx > 0)
	{
		if ((ball.current.y >= (rightPaddle.current.y + PADDLE_HEIGHT / 2)) && (rightPaddle.current.y + PADDLE_SPEED) < (CANVAS_HEIGHT - PADDLE_HEIGHT) + PADDLE_SPEED) {rightPaddle.current.y += PADDLE_SPEED;}
		if ((ball.current.y <= (rightPaddle.current.y + PADDLE_HEIGHT / 2)) && (rightPaddle.current.y - PADDLE_SPEED) > 0 - PADDLE_SPEED) {rightPaddle.current.y -= PADDLE_SPEED;}
	}
	else if (GAME_MOD == "local")
	{
		if (keys.current["ArrowUp"] && (rightPaddle.current.y - PADDLE_SPEED) > 0 - PADDLE_SPEED) {rightPaddle.current.y -= PADDLE_SPEED; if ((ball.current.x >= (CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING)) && ball.current.x < CANVAS_WIDTH) && (ball.current.y > rightPaddle.current.y && ball.current.y < (rightPaddle.current.y + PADDLE_HEIGHT))) ball.current.vy -= BALL_SHIFTING;}
		if (keys.current["ArrowDown"] && (rightPaddle.current.y + PADDLE_SPEED) < (CANVAS_HEIGHT - PADDLE_HEIGHT) + PADDLE_SPEED) {rightPaddle.current.y += PADDLE_SPEED; if ((ball.current.x >= (CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING)) && ball.current.x < CANVAS_WIDTH) && (ball.current.y > rightPaddle.current.y && ball.current.y < (rightPaddle.current.y + PADDLE_HEIGHT))) ball.current.vy += BALL_SHIFTING;}
	}
	else if (GAME_MOD == "online")
	{
		// cool stuff coming soon hehe
	}

	//Annoying ass collisions test left
	if ((leftPaddle.current.y > 0) && ball.current.vy > 0 && (ball.current.x <= (PADDLE_WIDTH + PADDLE_SPACING) && ball.current.x > PADDLE_SPACING) && ((ball.current.y > leftPaddle.current.y) && (ball.current.y < (leftPaddle.current.y + Math.abs(ball.current.vy))))) {ball.current.y = leftPaddle.current.y; ball.current.vy = -ball.current.vy;}
	if ((leftPaddle.current.y + PADDLE_HEIGHT < CANVAS_HEIGHT) && ball.current.vy < 0 && (ball.current.x <= (PADDLE_WIDTH + PADDLE_SPACING) && ball.current.x > PADDLE_SPACING) && ((ball.current.y < (leftPaddle.current.y + PADDLE_HEIGHT)) && (ball.current.y > (leftPaddle.current.y + PADDLE_HEIGHT - 10)))) {ball.current.y = (leftPaddle.current.y + PADDLE_HEIGHT); ball.current.vy = -ball.current.vy;}
	// Annoying ass collisions test right
	if ((rightPaddle.current.y > 0) && ball.current.vy > 0 && (ball.current.x >= (CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING)) && ball.current.x < (CANVAS_WIDTH - PADDLE_SPACING)) && ((ball.current.y > rightPaddle.current.y) && (ball.current.y < (rightPaddle.current.y + Math.abs(ball.current.vy))))) {ball.current.y = rightPaddle.current.y; ball.current.vy = -ball.current.vy;}
	if ((rightPaddle.current.y + PADDLE_HEIGHT < CANVAS_HEIGHT) && ball.current.vy < 0 && (ball.current.x >= (CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING)) && ball.current.x < (CANVAS_WIDTH - PADDLE_SPACING)) && ((ball.current.y < (rightPaddle.current.y + PADDLE_HEIGHT)) && (ball.current.y > (rightPaddle.current.y + PADDLE_HEIGHT - 10)))) {ball.current.y = (rightPaddle.current.y + PADDLE_HEIGHT); ball.current.vy = -ball.current.vy;}

	if ((ball.current.x <= (PADDLE_WIDTH + PADDLE_SPACING) && ball.current.x >= (PADDLE_WIDTH + PADDLE_SPACING) - (Math.abs(ball.current.vx) * ball.current.speed)) && (ball.current.y > leftPaddle.current.y && ball.current.y < (leftPaddle.current.y + PADDLE_HEIGHT))) {ball.current.x = (PADDLE_WIDTH + PADDLE_SPACING); ball.current.vx = -ball.current.vx; if (ball.current.speed < MAX_BALL_SPEED) {ball.current.speed += BALL_ACCELERATION;} ball.current.vy += (Math.random() > 0.5 ? Math.random() / 3 : -(Math.random() / 3));}
	if ((ball.current.x >= (CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING)) && ball.current.x <= (CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING)) +  (Math.abs(ball.current.vx) * ball.current.speed)) && (ball.current.y > rightPaddle.current.y && ball.current.y < (rightPaddle.current.y + PADDLE_HEIGHT))) {ball.current.x = (CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING)); ball.current.vx = -ball.current.vx; if (ball.current.speed < MAX_BALL_SPEED) {ball.current.speed += BALL_ACCELERATION;} ball.current.vy += (Math.random() > 0.5 ? Math.random() / 3 : -(Math.random() / 3));}
	if (ball.current.y <= 0) {ball.current.y = 0; ball.current.vy = -ball.current.vy;}
	if (ball.current.y >= CANVAS_HEIGHT) {ball.current.y = CANVAS_HEIGHT; ball.current.vy = -ball.current.vy;}


	ball.current.y += ball.current.vy * ball.current.speed;
	ball.current.x += ball.current.vx * ball.current.speed;
}