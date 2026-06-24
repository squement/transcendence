import { useRef, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { PADDLE_HEIGHT, CANVAS_HEIGHT, CANVAS_WIDTH, BALL_SPEED, FRAMERATE } from './game_config.js'
import { render } from "./game_render.js"
import { useAuth } from '../AuthContext.jsx';
import Message from '../Message.jsx';

// roomId : guest joining an existing online room (from URL ?roomId=xxx)
// mode   : game mode passed from GamePage (auto-starts without showing buttons)
function Game({ roomId: roomIdProp, mode: modeProp } = {}) {
	const canvasRef = useRef(null);
	const leftPaddle = useRef({ y: (CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2) });
	const rightPaddle = useRef({ y: (CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2) });
	const ball = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, vx: 3, vy: 2, speed: BALL_SPEED });
	const keysBE = useRef({ w: false, s: false, up: false, down: false });
	const score = useRef({ leftPlayer: 0, rightPlayer: 0 });
	const { user } = useAuth();
	const socket = useRef(null);
	const roomIdRef = useRef(roomIdProp || null);

	const [gameMode, setGameMode] = useState(modeProp || sessionStorage.getItem('gameMode') || null);
	const [gameStarted, setGameStarted] = useState(sessionStorage.getItem('gameStarted') === 'true');
	const [inviteUrl, setInviteUrl] = useState(null);

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

	// Persistent socket connection
	useEffect(() => {
		socket.current = io('/', { path: '/backend/socket.io' });

		socket.current.on('connect', () => {
			console.log('connected to backend', socket.current.id);
			// Auto-start if props provided (from GamePage or URL)
			if (roomIdProp) {
				socket.current.emit('joinRoom', { roomId: roomIdProp, user });
			} else if (modeProp) {
				if (modeProp === 'online') {
					socket.current.emit('createRoom', { user, mode: 'online' });
				} else {
					socket.current.emit('startGame', { mode: modeProp, user });
				}
			}
		});

		// roomCreated: backend confirms room was created, gives us the roomId
		socket.current.on('roomCreated', ({ roomId }) => {
			roomIdRef.current = roomId;
			// Only show invite link for online mode
			if (gameMode === 'online') {
				setInviteUrl(`${window.location.origin}/game?roomId=${roomId}`);
			}
		});

		socket.current.on('gameStart', () => {
			sessionStorage.setItem('gameStarted', 'true');
			setGameStarted(true);
		});

		return () => {
			socket.current.disconnect();
		};
	}, []);

	// Game loop: starts only when gameStarted becomes true
	useEffect(() => {
		if (!gameStarted) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		const inputInterval = setInterval(() => {
			socket.current.emit('inputs', { roomId: roomIdRef.current, keys: keysBE.current });
		}, 1000 / FRAMERATE);

		socket.current.on('gameState', (state) => {
			ball.current = state.ball;
			leftPaddle.current = state.leftPaddle;
			rightPaddle.current = state.rightPaddle;
			score.current = state.score;
			render(ctx, ball, leftPaddle, rightPaddle, score, gameMode);
		});

		socket.current.on('gameOver', () => {
			sessionStorage.removeItem('gameStarted');
			sessionStorage.removeItem('gameMode');
			setGameMode(null);
			setGameStarted(false);
			roomIdRef.current = null;
			setInviteUrl(null);
		});

		return () => {
			clearInterval(inputInterval);
			socket.current.off('gameState');
			socket.current.off('gameOver');
		};
	}, [gameStarted]);

	const handleStart = (mode) => {
		sessionStorage.setItem('gameMode', mode);
		setGameMode(mode);

		if (mode === 'online') {
			socket.current.emit('createRoom', { user, mode: 'online' });
			// gameStart arrives when 2nd player joins
		} else {
			socket.current.emit('startGame', { mode, user });
			// gameStart arrives immediately from backend
		}
	};

	// Waiting screen for online mode (before 2nd player joins)
	if (gameMode === 'online' && !gameStarted) {
		return (
			<div>
				<h3>En attente du 2ème joueur...</h3>
				{inviteUrl ? (
					<div>
						<p>Lien d'invitation :</p>
						<code style={{ userSelect: 'all' }}>{inviteUrl}</code>
						<button onClick={() => navigator.clipboard.writeText(inviteUrl)} style={{ marginLeft: '8px' }}>
							Copier
						</button>
					</div>
				) : (
					<p>Création de la room...</p>
				)}
			</div>
		);
	}

	return (
	<>
		{!gameStarted && !modeProp && !roomIdProp ? (
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
