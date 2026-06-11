import { useRef, useEffect, useState } from 'react'
import './App.css'
import Message from './Message'

function Game() {
	const canvasRef = useRef(null);
	const leftPaddle = useRef({ y: 250 });
	const rightPaddle = useRef({ y: 250 });
	const MAXBALLSPEED = 2;
	const ball = useRef({ x: 400, y: 300, vx: (Math.random() > 0.5 ? 3 : -3) , vy: (Math.floor(Math.random() * 5) - 2 ), speed: 1 });
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
		const PADDLESPEED = 4;
		const PADDLE_HEIGHT = 100;


		function gameLoop() {
			if (gameOver.current) {
				requestAnimationFrame(gameLoop);
				return; // ← INDISPENSABLE pour stopper les collisions pendant le gif
			}
			if (keys.current["w"] && (leftPaddle.current.y - PADDLESPEED) > 0) {leftPaddle.current.y -= PADDLESPEED; if ((ball.current.x <= 35 && ball.current.x > 0) && (ball.current.y > leftPaddle.current.y && ball.current.y < (leftPaddle.current.y + PADDLE_HEIGHT))) ball.current.vy -= 0.5;}
			if (keys.current["s"] && (leftPaddle.current.y + PADDLESPEED) < 500) {leftPaddle.current.y += PADDLESPEED; if ((ball.current.x <= 35 && ball.current.x > 0) && (ball.current.y > leftPaddle.current.y && ball.current.y < (leftPaddle.current.y + PADDLE_HEIGHT))) ball.current.vy += 0.5;}
			if (keys.current["ArrowUp"] && (rightPaddle.current.y - PADDLESPEED) > 0) {rightPaddle.current.y -= PADDLESPEED; if ((ball.current.x >= 765 && ball.current.x < 800) && (ball.current.y > rightPaddle.current.y && ball.current.y < (rightPaddle.current.y + PADDLE_HEIGHT))) ball.current.vy -= 0.5;}
			if (keys.current["ArrowDown"] && (rightPaddle.current.y + PADDLESPEED) < 500) {rightPaddle.current.y += PADDLESPEED; if ((ball.current.x >= 765 && ball.current.x < 800) && (ball.current.y > rightPaddle.current.y && ball.current.y < (rightPaddle.current.y + PADDLE_HEIGHT))) ball.current.vy += 0.5;}
			
			//Annoying ass collisions test left
			if (ball.current.vy > 0 && (ball.current.x <= 35 && ball.current.x > 15) && ((ball.current.y > leftPaddle.current.y) && (ball.current.y < (leftPaddle.current.y + Math.abs(ball.current.vy))))) {ball.current.y = leftPaddle.current.y; ball.current.vy = -ball.current.vy;}
			if (ball.current.vy < 0 && (ball.current.x <= 35 && ball.current.x > 15) && ((ball.current.y < (leftPaddle.current.y + PADDLE_HEIGHT)) && (ball.current.y > (leftPaddle.current.y + PADDLE_HEIGHT + 10)))) {ball.current.y = (leftPaddle.current.y + PADDLE_HEIGHT); ball.current.vy = -ball.current.vy;}
			// Annoying ass collisions test right
			if (ball.current.vy > 0 && (ball.current.x >= 765 && ball.current.x < 785) && ((ball.current.y > rightPaddle.current.y) && (ball.current.y < (rightPaddle.current.y + Math.abs(ball.current.vy))))) {ball.current.y = rightPaddle.current.y; ball.current.vy = -ball.current.vy;}
			if (ball.current.vy < 0 && (ball.current.x >= 765 && ball.current.x < 785) && ((ball.current.y < (rightPaddle.current.y + PADDLE_HEIGHT)) && (ball.current.y > (rightPaddle.current.y + PADDLE_HEIGHT + 10)))) {ball.current.y = (rightPaddle.current.y + PADDLE_HEIGHT); ball.current.vy = -ball.current.vy;}

			if ((ball.current.x <= 35 && ball.current.x >= 35 - (Math.abs(ball.current.vx) * ball.current.speed)) && (ball.current.y > leftPaddle.current.y && ball.current.y < (leftPaddle.current.y + PADDLE_HEIGHT))) {ball.current.x = 35; ball.current.vx = -ball.current.vx; if (ball.current.speed < MAXBALLSPEED) {ball.current.speed += 0.05;} ball.current.vy += (Math.random() > 0.5 ? Math.random() / 3 : -(Math.random() / 3)); ball.current.vx}
			if ((ball.current.x >= 765 && ball.current.x >= 765 +  (Math.abs(ball.current.vx) * ball.current.speed)) && (ball.current.y > rightPaddle.current.y && ball.current.y < (rightPaddle.current.y + PADDLE_HEIGHT))) {ball.current.x = 765; ball.current.vx = -ball.current.vx; if (ball.current.speed < MAXBALLSPEED) {ball.current.speed += 0.05;} ball.current.vy += (Math.random() > 0.5 ? Math.random() / 3 : -(Math.random() / 3)); ball.current.vx}
			if (ball.current.y <= 0) {ball.current.y = 0; ball.current.vy = -ball.current.vy;}
			if (ball.current.y >= 600) {ball.current.y = 600; ball.current.vy = -ball.current.vy;}


			ball.current.y += ball.current.vy * ball.current.speed;
			ball.current.x += ball.current.vx * ball.current.speed;

			setDebugLY(leftPaddle.current.y);
			setDebugRY(rightPaddle.current.y);
			setDebugBY(ball.current.y);
			setDebugBY(ball.current.y);
			setDebugBX(ball.current.x);
			setDebugBVY(ball.current.vy);
			setDebugBVX(ball.current.vx);
			setDebugSpeed(ball.current.speed);

			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, 800, 600);

			ctx.fillStyle = "white";
			ctx.fillRect(20, leftPaddle.current.y, 15, PADDLE_HEIGHT);
			ctx.fillRect(765, rightPaddle.current.y, 15, PADDLE_HEIGHT);
			
			ctx.beginPath();
			ctx.arc(ball.current.x, ball.current.y, 10, 0, Math.PI * 2);
			ctx.fill();

			ctx.font = "30px Comic Sans MS";
			ctx.fillStyle = "white";
			ctx.fillText(score.current.leftPlayer, 200, 50);
			ctx.fillText(score.current.rightPlayer, 600, 50);

			if (ball.current.x <= 0 || ball.current.x >= 800) {
				gameOver.current = true;
				setShowGif(true);
				if (ball.current.x <= 0) {score.current.rightPlayer += 1;}
				if (ball.current.x >= 800) {score.current.leftPlayer += 1;}
				if (score.current.leftPlayer == 10 || score.current.rightPlayer == 10)
					return (<canvas ref={canvasRef} width={800} height={600} />);

				setTimeout(() => {
					setShowGif(false);
					ball.current.speed = 1;
					ball.current.x = 400;
					ball.current.y = 300;
					ball.current.vx = (Math.random() > 0.5 ? 3 : -3) * ball.current.speed;
					ball.current.vy = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1) * ball.current.speed;
					leftPaddle.current.y = 250;
					rightPaddle.current.y = 250;
					gameOver.current = false;
				}, 2000);
				
			}


			requestAnimationFrame(gameLoop);
		}

		requestAnimationFrame(gameLoop);
	}, [])

	return  (
		<>
		{/* <p>y: Left = {debugLY} Right = {debugRY} BallY = {debugBY} BallX = {debugBX} BallVY = {debugBVY} BallVX = {debugBVX}</p> */}
		<p>Speed = {debugSpeed} Rand : {rand}</p>
		{/* <canvas ref={canvasRef} width={800} height={600} /> */}
		<div style={{ position: "relative", width: "800px", height: "600px" }}>
            <canvas ref={canvasRef} width={800} height={600} style={{ display: "block" }}/>
            {showGif && (
                <img
                    src="/sumire-yoshizawa-sumire.gif"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 800,
                        height: 600,
						display: "block"
                    }}
                />
            )}
        </div>

		</>
	)
}

export default Game
