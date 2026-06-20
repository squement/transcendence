import { useRef, useEffect } from 'react'
import { io } from 'socket.io-client'
import { PADDLE_HEIGHT, CANVAS_HEIGHT, CANVAS_WIDTH, BALL_SPEED, FRAMERATE } from './game_config.js'
import { render } from "./game_render.js"
import { useAuth } from '../AuthContext';

function Game() {
    const canvasRef = useRef(null);
    const leftPaddle = useRef({ y: (CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2) });
    const rightPaddle = useRef({ y: (CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2) });
    const ball = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, vx: 3, vy: 2, speed: BALL_SPEED });
    const keysBE = useRef({ w: false, s: false, up: false, down: false });
    const score = useRef({ leftPlayer: 0, rightPlayer: 0 });
    const { user } = useAuth();

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

    // connexion socket + boucle de rendu
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const socket = io('/', { path: '/backend/socket.io' });

        socket.on('connect', () => {
            console.log('connecté au backend', socket.id);
        });

        // envoyer les inputs au backend 60fps
        const inputInterval = setInterval(() => {
            socket.emit('inputs', { keys: keysBE.current });
        }, 1000 / FRAMERATE);

        // recevoir l'état du jeu et dessiner
        socket.on('gameState', (state) => {
            ball.current = state.ball;
            leftPaddle.current = state.leftPaddle;
            rightPaddle.current = state.rightPaddle;
            score.current = state.score;
            render(ctx, ball, leftPaddle, rightPaddle, score, user.username);
        });

        return () => {
            clearInterval(inputInterval);
            socket.disconnect();
        };
    }, []);

    return (
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    );
}

export default Game;