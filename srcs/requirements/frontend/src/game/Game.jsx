import { useRef, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { PADDLE_HEIGHT, CANVAS_HEIGHT, CANVAS_WIDTH, BALL_SPEED, FRAMERATE } from './game_config.js'
import { render } from "./game_render.js"
import { useAuth } from '../AuthContext.jsx';
import Message from '../Message.jsx';

function Game() {
	const canvasRef = useRef(null);
	const leftPaddle = useRef({ y: (CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2) });
	const rightPaddle = useRef({ y: (CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2) });
	const ball = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, vx: 3, vy: 2, speed: BALL_SPEED });
	const keysBE = useRef({ w: false, s: false, up: false, down: false });
	const score = useRef({ leftPlayer: 0, rightPlayer: 0 });
	const { user } = useAuth();
	// const [gameStarted, setGameStarted] = useState(false);
	const socket = useRef(null);
	const [gameMode, setGameMode] = useState(sessionStorage.getItem('gameMode') || null);
	const [gameStarted, setGameStarted] = useState(sessionStorage.getItem('gameStarted') === 'true');

	// écoute du clavier
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "w" || e.key === "W") keysBE.current.w = true;
			if (e.key === "s" || e.key === "S") keysBE.current.s = true;
			if (e.key === "ArrowUp") keysBE.current.up = true;
			if (e.key === "ArrowDown") keysBE.current.down = true;
		};
		const handleKeyUp = (e) => {
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
		socket.current = io('/', { path: '/backend/socket.io' });

		socket.current.on('connect', () => {
			console.log('connecté au backend', socket.current.id);
		});

		return () => {
			socket.current.disconnect();
		};
	}, []);

	// connexion socket + boucle de rendu
	useEffect(() => {
		if (!gameStarted) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		socket.current.emit("startGame", { mode: gameMode });

		// envoyer les inputs au backend 60fps
		const inputInterval = setInterval(() => {
			socket.current.emit('inputs', { keys: keysBE.current });
		}, 1000 / FRAMERATE);

		// recevoir l'état du jeu et dessiner
		socket.current.on('gameState', (state) => {
			ball.current = state.ball;
			leftPaddle.current = state.leftPaddle;
			rightPaddle.current = state.rightPaddle;
			score.current = state.score;
			render(ctx, ball, leftPaddle, rightPaddle, score, gameMode);
		});

		socket.current.on('gameOver', (data) => {
			sessionStorage.removeItem('gameStarted');
			sessionStorage.removeItem('gameMode');

			setGameMode(null);
			setGameStarted(false); // on revient à l'écran du bouton
			score.current = data.score;
			score.current.leftPlayer = 0; // on garde le score final
			score.current.rightPlayer = 0; // on garde le score final
		});

		return () => {
			clearInterval(inputInterval);
			socket.current.off('gameState'); // juste supprimer les listeners
			socket.current.off('gameOver');  // sans déconnecter le socket
		};
	}, [gameStarted]);

	const handleStart = (mode) => {

		sessionStorage.setItem('gameStarted', 'true');
		sessionStorage.setItem('gameMode', mode);
		setGameMode(mode)
		setGameStarted(true);
	};

	return (
	<>
		{!gameStarted ? (
			<div>
				<table>
					<tr><button onClick={() => handleStart("solo_bot")}>PPPB Mode</button></tr>
					<tr><button onClick={() => handleStart("solo_training")}>Training Mode</button></tr>
					<tr><button onClick={() => handleStart("local")}>Local Mode</button></tr>
					<tr><button onClick={() => handleStart("online")}>Online Mode</button></tr>
				</table>
			</div>
		) : (
			<canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
		)}
	</>
	);
}

export default Game;