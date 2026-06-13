import { PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_SPACING, CANVAS_HEIGHT, CANVAS_WIDTH, SCORE_HEIGHT, BALL_SIZE, BALL_IDK } from './config.js'

export function render(ctx, ball, leftPaddle, rightPaddle, score) {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	ctx.fillStyle = "white";
	ctx.fillRect(PADDLE_SPACING, leftPaddle.current.y, PADDLE_WIDTH, PADDLE_HEIGHT);
	ctx.fillRect(CANVAS_WIDTH - (PADDLE_WIDTH + PADDLE_SPACING), rightPaddle.current.y, PADDLE_WIDTH, PADDLE_HEIGHT);
	
	ctx.beginPath();
	ctx.arc(ball.current.x, ball.current.y, BALL_SIZE, BALL_IDK, Math.PI * 2);
	ctx.fill();

	ctx.font = "30px Comic Sans MS";
	ctx.fillStyle = "white";
	ctx.fillText(score.current.leftPlayer, (CANVAS_WIDTH / 4), SCORE_HEIGHT);
	ctx.fillText(score.current.rightPlayer, (CANVAS_WIDTH / 2 * 1.5), SCORE_HEIGHT);
}