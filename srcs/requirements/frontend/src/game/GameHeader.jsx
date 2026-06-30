import '../styles/GamePage.css'
import { useRef, useState } from 'react'
import freddyGif from '../assets/blue-freddy-3601182423.gif'
import freddyGoat from '../assets/freddy.png'
import GameHeaderSoloTraining from "./GameHeader_GameModes/GameHeaderSoloTraining"
import GameHeaderSoloBot from "./GameHeader_GameModes/GameHeaderSoloBot"
import GameHeaderLocal from "./GameHeader_GameModes/GameHeaderLocal"

function GameHeader({ score, gameMode }) {
	const p1 = useRef({ name: "SALAMI" }); // to update later so its the actual players names/scores
	const p2 = useRef({ name: "AAAAA" }); // to update later so its the actual players names/scores

	return (
		<div className="game-header">
			<div className="game-header-p1">
				<div className="avatar avatar-p1">
					<img src={freddyGoat} alt="player 1 " />
				</div>
				<span className='p-name p1-name'>{p1.current.name}</span>
			</div>
			<div className="game-header-score">
				{/* <span>{p1.current.score}</span>
				<span>:</span>
				<span>{p2.current.score}</span> */}
				<div className="score-row">
					<span className='score-text'>{score.leftPlayer}</span>
					<span className='score-text'>:</span>
					<span className='score-text'>{score.rightPlayer}</span>
				</div>
				<span className='vs-text'>VS</span>
			</div>
			{gameMode == "solo_training" ? (
				<GameHeaderSoloTraining />
			) : (
				<div>
				{gameMode == "solo_bot" ? (
					<GameHeaderSoloBot />
				) : (
					<div>
						{gameMode == "local" ? (
							<GameHeaderLocal />
						) : (
							<div className="game-header-p2">
								<span className='p-name p2-name'>{p2.current.name}</span>
								<div className="avatar avatar-p2">
									<img src={freddyGif} alt="player 2 " />
								</div>
							</div>
						)}
					</div>
				)}
				</div>
			)}
		</div>
	)
}

export default GameHeader;