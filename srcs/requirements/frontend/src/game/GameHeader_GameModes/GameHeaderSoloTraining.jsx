import "../../styles/GamePage.css"
import wall from "../../assets/wall2.jpg"

function GameHeaderSoloTraining () {

	return (
		<div className="game-header-p2">
			<span className='p-name p2-name'>wall.</span>
			<div className="avatar avatar-p2">
				<img src={wall} alt="wall " />
			</div>
		</div>
	)
}

export default GameHeaderSoloTraining;