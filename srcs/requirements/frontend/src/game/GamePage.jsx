import { useState } from 'react'
import Game from './Game'
import Message from '../Message'
import '../styles/GamePage.css'
import GameBleachers from './GameBleachers'
import GameChat from './GameChat'
import GameHeader from './GameHeader'

function GamePage({ gameMode, onGameOver, settings }) {
	const [score, setScore] = useState({ leftPlayer: 0, rightPlayer: 0 });

	return (
		<div className="game-page">
			<GameHeader score={score} gameMode={gameMode} />
			<div className="game-canvas-wrapper">
				<Game gameMode={gameMode} onGameOver={onGameOver} onScoreUpdate={setScore} settings={settings} />
			</div>
			<GameBleachers />
			<GameChat />
		</div>
	);
}

export default GamePage