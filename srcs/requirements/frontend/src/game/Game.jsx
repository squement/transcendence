import { useRef, useEffect, useState } from 'react'
import '../App.css'
import Message from '../Message.jsx'
import { PADDLE_HEIGHT, CANVAS_HEIGHT, CANVAS_WIDTH, BALL_SPEED } from './game_config.js'
import { update } from "./game_update"
import { render } from "./game_render.js"
import { useAuth } from '../AuthContext';
import { useUpData } from './game_socket.js';

function Game() {
	const canvasRef = useRef(null);
	const leftPaddle = useRef({ y: (CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2) });
	const rightPaddle = useRef({ y: (CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2) });
	const ball = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, vx: (Math.random() > 0.5 ? 3 : -3) , vy: (Math.floor(Math.random() * 5) - 2 ), speed: BALL_SPEED });
	const keysFE = useRef({});
	const keysBE = useRef({ w: false, s: false, up: false, down: false });
	const [debugLY, setDebugLY] = useState(0);
	const [debugRY, setDebugRY] = useState(0);
	const [debugBY, setDebugBY] = useState(0);
	const [debugBX, setDebugBX] = useState(0);
	const [debugBVY, setDebugBVY] = useState(0);
	const [debugBVX, setDebugBVX] = useState(0);
	const [debugSpeed, setDebugSpeed] = useState(0);
	const gameState = useRef({ gameOver: false });
	const score = useRef({ leftPlayer: 0, rightPlayer: 0 });
	const { user } = useAuth();

	useEffect(() => {
		const handleKeyDown = (e) => {
			keysFE.current[e.key] = true;
			if (e.key === "w" || e.key === "W") keysBE.current.w = true;
			if (e.key === "s" || e.key === "S") keysBE.current.s = true;
			if (e.key === "ArrowUp") keysBE.current.up = true;
			if (e.key === "ArrowDown") keysBE.current.down = true;
		};

		const handleKeyUp = (e) => {
			keysFE.current[e.key] = false;
			if (e.key === "w" || e.key === "W") keysBE.current.w = false;
			if (e.key === "s" || e.key === "S") keysBE.current.s = false;
			if (e.key === "ArrowUp") keysBE.current.up = false;
			if (e.key === "ArrowDown") keysBE.current.down = false;
		};

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
			if (gameState.current.gameOver) {
				requestAnimationFrame(gameLoop);
				return; 
			}
			update(ball.current, leftPaddle.current, rightPaddle.current, gameState.current, score.current, keysBE.current);
			render(ctx, ball, leftPaddle, rightPaddle, score, user.username);

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
		<canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
		</>
	)
}

export default Game
