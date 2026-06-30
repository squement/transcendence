import '../styles/GamePage.css'
import freddyGif from '../assets/blue-freddy-3601182423.gif'
import freddyGoat from '../assets/freddy.png'

function GameBleachers() {
	const spectators = 12;
	const MAX_VISIBLE = 6;

	return (
		<div className="game-bleachers">
			{Array.from({ length: Math.min(spectators, MAX_VISIBLE) }).map((_, i) => (
				<div key={i} className="seat">
					{i % 2 == 0 ? (
						<img src={freddyGif} alt="spectator " />
					) : (
						<img src={freddyGoat} alt="spectator " />
					)}
				</div>
			))}
			{spectators > MAX_VISIBLE && (
				<div className="seat seat-more">+{spectators - MAX_VISIBLE}</div>
			)}
		</div>
	)
}

export default GameBleachers;