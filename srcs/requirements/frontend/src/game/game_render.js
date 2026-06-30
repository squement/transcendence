import { PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_SPACING, CANVAS_HEIGHT, CANVAS_WIDTH, SCORE_HEIGHT, BALL_SIZE, BALL_IDK } from './game_config.js'

export function render(ctx, ball, leftPaddle, rightPaddle, score, gameMode, isPaused, gameStarted) {
	const color = (isPaused || !gameStarted) ? "grey" : "white";
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	ctx.fillStyle = color;
	ctx.fillRect(PADDLE_SPACING, leftPaddle.current.y, PADDLE_WIDTH, PADDLE_HEIGHT);

	if (gameMode == "solo_training") { ctx.fillStyle = color; ctx.fillRect(CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING), 0, PADDLE_WIDTH, CANVAS_HEIGHT); }
	else { ctx.fillStyle = color; ctx.fillRect(CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING), rightPaddle.current.y, PADDLE_WIDTH, PADDLE_HEIGHT); }
	
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(ball.current.x, ball.current.y, BALL_SIZE, BALL_IDK, Math.PI * 2);
	ctx.fill();

	ctx.font = "30px Comic Sans MS";
	ctx.fillStyle = "white";
	ctx.fillText(score.current.leftPlayer, (CANVAS_WIDTH / 4), SCORE_HEIGHT);
	ctx.fillText(score.current.rightPlayer, (CANVAS_WIDTH / 2 * 1.5), SCORE_HEIGHT);
	// ctx.fillText(username, CANVAS_WIDTH / 2, ((CANVAS_HEIGHT / 2) * 1.25));

	if (isPaused) {

		if (gameStarted)
		{
			const angle = Math.atan2(ball.current.vy, ball.current.vx);
			const arrowLength = 30;

			// point de départ — centre de la balle
			const startX = ball.current.x;
			const startY = ball.current.y;

			// point d'arrivée — dans la direction de la balle
			const endX = startX + Math.cos(angle) * arrowLength;
			const endY = startY + Math.sin(angle) * arrowLength;

			// ligne de la flèche
			ctx.beginPath();
			ctx.moveTo(startX, startY);
			ctx.lineTo(endX, endY);
			ctx.strokeStyle = "grey";
			ctx.lineWidth = 2;
			ctx.stroke();

			// pointe de la flèche
			ctx.beginPath();
			ctx.moveTo(endX, endY);
			ctx.lineTo(endX - Math.cos(angle - 0.5) * 10, endY - Math.sin(angle - 0.5) * 10);
			ctx.lineTo(endX - Math.cos(angle + 0.5) * 10, endY - Math.sin(angle + 0.5) * 10);
			ctx.closePath();
			ctx.fillStyle = "grey";
			ctx.fill();
		}
	}
	if (isPaused || !gameStarted)
	{
		ctx.fillStyle = "white";
		ctx.fillRect(CANVAS_WIDTH / 2 - (20 + PADDLE_WIDTH), CANVAS_HEIGHT / 2 - (PADDLE_HEIGHT / 2), PADDLE_WIDTH, PADDLE_HEIGHT);
		ctx.fillRect(CANVAS_WIDTH / 2 + 20, CANVAS_HEIGHT / 2 - (PADDLE_HEIGHT / 2), PADDLE_WIDTH, PADDLE_HEIGHT);
	}
}