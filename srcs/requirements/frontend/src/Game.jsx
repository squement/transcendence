import { useRef, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Message from './Message'

function Game() {
	const canvasRef = useRef(null);
	const leftPaddle = useRef({ y: 250 });
	const rightPaddle = useRef({ y: 250 });
	const Ball = useRef({ x: 400, y: 300, vx: Math.random() > 0.5 ? 3 : -3, vy: Math.floor(Math.random() * 5) - 2  });
	const keys = useRef({});
	const [debugLY, setDebugLY] = useState(0);
	const [debugRY, setDebugRY] = useState(0);
	const [debugBY, setDebugBY] = useState(0);
	const [debugBX, setDebugBX] = useState(0);
	const [debugBVY, setDebugBVY] = useState(0);
	const [debugBVX, setDebugBVX] = useState(0);

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
		const PADDLESPEED = 4;
		const BALLSPEED = 4;
		const PADDLE_HEIGHT = 100;

		function gameLoop() {
			if (keys.current["w"] && (leftPaddle.current.y - PADDLESPEED) > 0) leftPaddle.current.y -= PADDLESPEED;
			if (keys.current["s"] && (leftPaddle.current.y + PADDLESPEED) < 500) leftPaddle.current.y += PADDLESPEED;
			if (keys.current["ArrowUp"] && (rightPaddle.current.y - PADDLESPEED) > 0) rightPaddle.current.y -= PADDLESPEED;
			if (keys.current["ArrowDown"] && (rightPaddle.current.y + PADDLESPEED) < 500) rightPaddle.current.y += PADDLESPEED;

			if ((Ball.current.x <= 35 && Ball.current.x > 0) && (Ball.current.y > leftPaddle.current.y && Ball.current.y < (leftPaddle.current.y + PADDLE_HEIGHT))) {Ball.current.x = 35; Ball.current.vx = -Ball.current.vx;}
			if ((Ball.current.x >= 765 && Ball.current.x < 800) && (Ball.current.y > rightPaddle.current.y && Ball.current.y < (rightPaddle.current.y + PADDLE_HEIGHT))) {Ball.current.x = 765; Ball.current.vx = -Ball.current.vx;}
			if (Ball.current.y <= 0) {Ball.current.y = 0; Ball.current.vy = -Ball.current.vy;}
			if (Ball.current.y >= 600) {Ball.current.y = 600; Ball.current.vy = -Ball.current.vy;}

			//Annoying ass collisions test left
			if ((Ball.current.x <= 35 && Ball.current.x > 15) && ((Ball.current.y > leftPaddle.current.y) && (Ball.current.y < (leftPaddle.current.y + Math.abs(Ball.current.vy))))) {Ball.current.y = leftPaddle.current.y; Ball.current.vy = -Ball.current.vy;}
			if ((Ball.current.x <= 35 && Ball.current.x > 15) && ((Ball.current.y < (leftPaddle.current.y + PADDLE_HEIGHT)) && (Ball.current.y > (leftPaddle.current.y + PADDLE_HEIGHT - (Math.abs(Ball.current.vy)))))) {Ball.current.y = (leftPaddle.current.y + PADDLE_HEIGHT); Ball.current.vy = -Ball.current.vy;}
			//Annoying ass collisions test right
			if ((Ball.current.x >= 765 && Ball.current.x < 785) && ((Ball.current.y > rightPaddle.current.y) && (Ball.current.y < (rightPaddle.current.y + Math.abs(Ball.current.vy))))) {Ball.current.y = rightPaddle.current.y; Ball.current.vy = -Ball.current.vy;}
			if ((Ball.current.x >= 765 && Ball.current.x < 785) && ((Ball.current.y < (rightPaddle.current.y + PADDLE_HEIGHT)) && (Ball.current.y > (rightPaddle.current.y + PADDLE_HEIGHT - (Math.abs(Ball.current.vy)))))) {Ball.current.y = (rightPaddle.current.y + PADDLE_HEIGHT); Ball.current.vy = -Ball.current.vy;}

			Ball.current.y += Ball.current.vy;
			Ball.current.x += Ball.current.vx;

			setDebugLY(leftPaddle.current.y);
			setDebugRY(rightPaddle.current.y);
			setDebugBY(Ball.current.y);
			setDebugBY(Ball.current.y);
			setDebugBX(Ball.current.x);
			setDebugBVY(Ball.current.vy);
			setDebugBVX(Ball.current.vx);

			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, 800, 600);

			ctx.fillStyle = "white";
			ctx.fillRect(20, leftPaddle.current.y, 15, PADDLE_HEIGHT);
			ctx.fillRect(765, rightPaddle.current.y, 15, PADDLE_HEIGHT);
			
			ctx.beginPath();
			ctx.arc(Ball.current.x, Ball.current.y, 10, 0, Math.PI * 2);
			ctx.fill();


			requestAnimationFrame(gameLoop);
		}

		requestAnimationFrame(gameLoop);
	}, [])

	return  (
		<>
		<p>y: Left = {debugLY} Right = {debugRY} BallY = {debugBY} BallX = {debugBX} BallVY = {debugBVY} BallVX = {debugBVX}</p>
		<canvas ref={canvasRef} width={800} height={600} />

		</>
	)
}

export default Game
