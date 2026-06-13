import { useRef, useEffect, useState } from 'react'
import './App.css'
import Message from './Message'
import { PADDLE_HEIGHT, CANVAS_HEIGHT, CANVAS_WIDTH, BALL_SPEED } from './config.js'
import { update } from "./game_update.js"
import { render } from "./game_render.js"

function Game() {
	const canvasRef = useRef(null);
	const leftPaddle = useRef({ y: (CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2) });
	const rightPaddle = useRef({ y: (CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2) });
	const ball = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, vx: (Math.random() > 0.5 ? 3 : -3) , vy: (Math.floor(Math.random() * 5) - 2 ), speed: BALL_SPEED });
	const keys = useRef({});
	const [debugLY, setDebugLY] = useState(0);
	const [debugRY, setDebugRY] = useState(0);
	const [debugBY, setDebugBY] = useState(0);
	const [debugBX, setDebugBX] = useState(0);
	const [debugBVY, setDebugBVY] = useState(0);
	const [debugBVX, setDebugBVX] = useState(0);
	const [debugSpeed, setDebugSpeed] = useState(0);
	const [showGif, setShowGif] = useState(false);
	const [rand, setRand] = useState(Math.random());
	const gameOver = useRef(false);
	const score = useRef({ leftPlayer: 0, rightPlayer: 0 });

	useEffect(() => {
		const handleKeyDown = (e) => { keys.current[e.key] = true; };
		const handleKeyUp = (e) => { keys.current[e.key] = false; };

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		}
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		function gameLoop() {
			if (gameOver.current) {
				requestAnimationFrame(gameLoop);
				return; 
			}
			update(ball, leftPaddle, rightPaddle, gameOver, score, setShowGif, keys);
			render(ctx, ball, leftPaddle, rightPaddle, score);

			setDebugLY(leftPaddle.current.y);
			setDebugRY(rightPaddle.current.y);
			setDebugBY(ball.current.y);
			setDebugBY(ball.current.y);
			setDebugBX(ball.current.x);
			setDebugBVY(ball.current.vy);
			setDebugBVX(ball.current.vx);
			setDebugSpeed(ball.current.speed);

			requestAnimationFrame(gameLoop);
		}

		requestAnimationFrame(gameLoop);
	}, [])

	return  (
		<>
		{/* <p>y: Left = {debugLY} Right = {debugRY} BallY = {debugBY} BallX = {debugBX} BallVY = {debugBVY} BallVX = {debugBVX}</p> */}
		{/* <p>Speed = {debugSpeed} Rand : {rand}</p> */}
		<canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
		{/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>
			<div style={{ position: "relative", width: "{CANVAS_WIDTH}px", height: "{CANVAS_HEIGHT}px" }}>
				<canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ display: "block" }}/>
				{showGif && (
					<img
						src="/sumire-yoshizawa-sumire.gif"
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: 800,
							height: CANVAS_HEIGHT,
							display: "block"
						}}
					/>
				)}
			</div>
		</div> */}

		</>
	)
}

export default Game
